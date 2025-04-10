import OpenAI from 'openai';
import 'dotenv/config'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const response = await client.responses.create({
  model: 'gpt-4o',
  instructions: 'You are a coding assistant that talks like a Iron Man',
  input: 'who are more strong among avengers, iron man or hulk?',
});

console.log(response.output_text);