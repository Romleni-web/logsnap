import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_fix(log: str, code: str) -> str:
    prompt = f"""You are a Senior Python SRE with 20 years of experience.
Fix the error in the provided code.
- Output ONLY the raw fixed Python code
- Do NOT use markdown formatting, backticks, or explanations
- Preserve all existing indentation and imports
- Replace the ENTIRE function or class where the error occurs
- If the error is in a library import, suggest the correct import syntax

Error Log: {log}
Current Code: {code}
Fixed Code:"""

    response = await model.generate_content_async(prompt)
    # The response might contain markdown if Gemini ignores instructions, so let's clean it just in case
    text = response.text.strip()
    if text.startswith("```python"):
        text = text[9:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()
