// components/chat/ChatLog.js
import React from 'react';
import ChatMessage from './ChatMessage';

const messages = [
  {
    id: 1,
    sender: 'user',
    text: 'This is my first prompt',
    meta: { tokens: 4, cost: '$0.0001' },
    name: 'name'
  },
  {
    id: 2,
    sender: 'bot',
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae ex feugiat, varius nunc viverra in bibendum. Duis sit cursus pulvinar sit faucibus. Vitae vitae at tellus ultrices in. Commodo sed convallis in sit. Sed ut sed proin neque. Eget netus ipsum morbi condimentum quis amet sit. Varius et feugiat placerat in accumsan iaculis massa. Nibh neque feugiat faucibus interdum vitae varius in nibh. Non enim odio odio pellentesque risus congue a. A mauris imperdiet adipiscing cursus nunc. At arcu sem orci feugiat in massa massa. Liberum dignissim quis convallis aliquet magna nec fermentum sit. Velit turpis dui sagittis egestas duis aliquet. Duis donec urna iaculis et.",
    meta: { tokens: 152, cost: '$0.002' },
  },
];

const ChatLog = () => {
  return (
    <div className="flex-grow p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default ChatLog;
