import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "What is greater between 9.11 and 9.7";

const result = await model.generateContent(prompt);
console.log(result.response.text());
