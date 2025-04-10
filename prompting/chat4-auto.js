import OpenAI from "openai";
import "dotenv/config";
import readline from 'readline';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const system_prompt = `
You are an AI assistant expert in problem solving. For any user input:
1. Analyze the problem
2. Think through solutions
3. Show output
4. Validate
5. Present final result

**Strict Rules:**
- Use exactly this JSON format: 
{
  "step": "analyse|think|output|validate|result",
  "content": "your text here"
}
- Wait for user confirmation between steps

**Example Response:**
{"step": "analyse", "content": "Analyzing math problem..."}
`;

// Initialize messages array with system prompt
const messages = [
  { 
    role: "system", 
    content: system_prompt 
  }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('> ', async (initialQuery) => {
  messages.push({ role: 'user', content: initialQuery });

  try {
    while (true) {
      // Get AI response
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" }
      });
      
      // Parse response
      const response = JSON.parse(completion.choices[0].message.content);
      messages.push({ 
        role: "assistant", 
        content: JSON.stringify(response) 
      });

      // Handle different steps
      console.log(response.step === "output" ? `🤖: ` : `🧠: `, response.content);

      // Exit condition
      if (response.step === "result") {
        rl.close();
        break;
      }

      // Wait for user to continue
      await new Promise((resolve) => {
        rl.question('Press enter to continue...', resolve);
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
  }
});