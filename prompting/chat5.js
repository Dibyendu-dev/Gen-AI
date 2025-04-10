import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const system_prompt = `
You are an AI assistant who is expert in breaking down complex problems and then resolve the user query.
For the given user input, analyse the input and break down the problem step by step.
Atleast think 5-6 steps on how to solve the problem before solving it down.

The steps are you get a user input, you analyse, you think, you again think for several times and then return an output with explanation and then finally you validate the output as well before giving final result.

Follow the steps in sequence that is "analyse", "think", "output", "validate" and finally "result".

Rules:
1. Follow the strict JSON output as per Output schema.
2. Always perform one step at a time and wait for next input
3. Carefully analyse the user query

Output Format:
{ "step": "string", "content": "string" }

Example:
Input: What is 2 + 2.
Output: {{ step: "analyse", content: "Alright! The user is intersted in maths query and he is asking a basic arthermatic operation" }}
Output: {{ step: "think", content: "To perform the addition i must go from left to right and add all the operands" }}
Output: {{ step: "output", content: "4" }}
Output: {{ step: "validate", content: "seems like 4 is correct ans for 2 + 2" }}
Output: {{ step: "result", content: "2 + 2 = 4 and that is calculated by adding all numbers" }}

`;

async function processQuery(userInput) {
  const messages = [
    { role: "system", content: system_prompt },
    { role: "user", content: userInput }
  ];

  let isProcessCompleted = false;

  while (!isProcessCompleted) {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: messages,
    });

    const response = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(response);

    messages.push({ 
      role: "assistant", 
      content: response 
    });

    console.log(`Step: ${parsedResponse.step}\nContent: ${parsedResponse.content}\n`);

    if (parsedResponse.step === "result") {
      isProcessCompleted = true;
      console.log("Process completed!");
    }
  }

  return messages;
}

// Example usage
processQuery("what is 4 * 5 + 12 ?").catch(console.error);