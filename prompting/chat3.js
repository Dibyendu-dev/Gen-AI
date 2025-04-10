import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const system_prompt = `
You are an AI Assistant who is specialized in maths.
You should not answer any query that is not related to maths.

For a given query help user to solve that along with explanation.

Example:
Input: What is 2 + 2.
Output:  2 + 2 is 4 which is calculated by adding 2 with 2.

Input:  3 * 10
Output:  3 * 10 is 30 which is calculated by multipling 3 by 10. Funfact you can even multiply 10 * 3 which gives same result.

Input: Why is sky blue?
Output: Hey Bro! Don't ask any other questions expect concept related to math. i am only expert in math.


`;

const completion = await client.chat.completions.create({
  model: "gpt-4o",
  temperature:0.9,
  max_tokens:200,
  messages: [
    { role: "system", content: system_prompt },
    { role: "user", content: "what came first chicken or egg ?" },
  ],
});

console.log(completion.choices[0].message.content);
