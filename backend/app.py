from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini
genai.configure(api_key="AIzaSyCzStrI7sVfZsAnDt5Ef0d8qzdcun6cig0")  # Replace with your real key

model = genai.GenerativeModel("gemini-1.5-pro")

def debug_code(code, language):
    prompt = f"""You are an expert developer. Debug the following {language} code.
Return the fixed code first (inside code block), then a short explanation.

Code:
{code}
"""
    try:
        response = model.generate_content(prompt)
        full_response = response.text.strip()

        # Try to extract code from markdown block
        if "```" in full_response:
            parts = full_response.split("```")
            fixed_code = parts[1].strip()
            explanation = "\n".join(parts[2:]).strip() or "Explanation not found."
        else:
            fixed_code = full_response
            explanation = "No clear code block or explanation provided."

        return fixed_code, explanation

    except Exception as e:
        return "", f"Error: {str(e)}"

@app.route("/debug", methods=["POST"])
def debug():
    data = request.json
    code = data.get("code")
    language = data.get("language")
    if not code or not language:
        return jsonify({"error": "Both code and language are required."}), 400

    fixed_code, explanation = debug_code(code, language)
    return jsonify({"fixed_code": fixed_code, "explanation": explanation})

if __name__ == "__main__":
    app.run(debug=True)
