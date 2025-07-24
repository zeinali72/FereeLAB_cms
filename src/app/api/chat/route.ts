import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToMongoose } from '@/lib/mongodb';
import { Chat } from '@/models/Chat';

export async function POST(request: NextRequest) {
  try {
    const { messages, model, stream = false } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Get session for user identification and message storage
    const session = await getServerSession(authOptions);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'FereeLAB Chat'
      },
      body: JSON.stringify({
        model: model?.id || 'openrouter/switchpoint-router',
        messages,
        stream,
        max_tokens: model?.maxTokens || 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to get response from OpenRouter', details: errorData },
        { status: response.status }
      );
    }

    if (stream) {
      // For streaming responses, we'll handle storage via a separate endpoint
      // since we can't wait for the full response here
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const customStream = new ReadableStream({
        async start(controller) {
          try {
            const reader = response.body?.getReader();
            if (!reader) {
              controller.error(new Error('No response body'));
              return;
            }

            let fullResponse = '';
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                // Store the complete conversation if user is authenticated
                if (session?.user?.id && fullResponse.trim()) {
                  try {
                    await storeConversation(session.user.id, messages, fullResponse, model);
                  } catch (error) {
                    console.error('Failed to store conversation:', error);
                  }
                }
                controller.close();
                break;
              }

              // Collect the response for storage
              const chunk = decoder.decode(value);
              fullResponse += chunk;

              // Forward the chunk as-is
              controller.enqueue(value);
            }
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        },
      });

      return new Response(customStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } else {
      // For non-streaming responses, store immediately
      const data = await response.json();
      
      if (session?.user?.id && data.choices?.[0]?.message?.content) {
        try {
          await storeConversation(session.user.id, messages, data.choices[0].message.content, model);
        } catch (error) {
          console.error('Failed to store conversation:', error);
        }
      }
      
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to store conversation in database
async function storeConversation(userId: string, messages: any[], assistantResponse: string, model: any) {
  try {
    await connectToMongoose();
    
    // Create the full conversation including the assistant's response
    const fullMessages = [
      ...messages,
      {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        model: model?.id || 'openrouter/switchpoint-router'
      }
    ];
    
    // Generate a title from the first user message
    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage?.content?.substring(0, 50) + 
                 (firstUserMessage?.content?.length > 50 ? '...' : '') || 'New Chat';
    
    // Try to find existing chat by looking for recent chats with same user message
    let existingChat = null;
    if (firstUserMessage) {
      existingChat = await Chat.findOne({
        userId,
        isActive: true,
        'messages.content': firstUserMessage.content,
        updatedAt: { $gte: new Date(Date.now() - 60000) } // Within last minute
      });
    }
    
    if (existingChat) {
      // Update existing chat
      existingChat.messages = fullMessages;
      existingChat.model = model;
      existingChat.updatedAt = new Date();
      await existingChat.save();
    } else {
      // Create new chat
      const newChat = new Chat({
        userId,
        title,
        messages: fullMessages,
        model: model ? {
          id: model.id,
          name: model.name,
          provider: model.provider?.name
        } : undefined
      });
      await newChat.save();
    }
  } catch (error) {
    console.error('Error storing conversation:', error);
    throw error;
  }
}