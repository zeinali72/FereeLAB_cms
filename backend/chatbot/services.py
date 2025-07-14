import requests
import os

def get_chatbot_response(message):
    """
    Sends a message to the OpenRouter API and gets a response.
    """
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        return "API key not configured."

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
            },
            json={
                "model": "google/gemini-flash-1.5",  # Or any other model
                "messages": [
                    {"role": "user", "content": message},
                ],
            },
        )

        response.raise_for_status()  # This will raise an HTTPError if the HTTP request returned an unsuccessful status code

        return response.json()["choices"][0]["message"]["content"]

    except requests.exceptions.RequestException as e:
        # Handle connection errors, timeouts, etc.
        return f"An error occurred: {e}"