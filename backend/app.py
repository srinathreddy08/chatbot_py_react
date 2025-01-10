from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from config import AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_DEPLOYMENT_NAME

app = Flask(__name__)
CORS(app)

# Configure Azure OpenAI
openai.api_type = "azure"
openai.api_base = AZURE_OPENAI_ENDPOINT
openai.api_version = "2023-05-15"
openai.api_key = AZURE_OPENAI_KEY

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')

        # Provide a system prompt for structured responses
        system_prompt = """
        You are a helpful assistant. Always respond using Markdown for proper formatting:
- Use headings (`###`) for sections.
- Use bold text (`**`) for emphasis.
- Use bullet (`-`) and numbered (`1., 2., 3.`) lists for steps or examples.
        """

        response = openai.ChatCompletion.create(
            engine=AZURE_DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.7
        )

        formatted_response = response.choices[0].message.content.strip()

        return jsonify({
            'message': formatted_response,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'message': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
