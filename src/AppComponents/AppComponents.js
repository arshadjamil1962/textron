// require('dotenv').config();
import { Configuration, OpenAIApi } from "openai";

export const openAiConfiguration = new Configuration({
    organization: process.env.REACT_APP_ORGANIZATION_KEY,
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const openai = new OpenAIApi(openAiConfiguration);

