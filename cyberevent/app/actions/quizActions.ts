'use server'

import { QuizAnswer,Code } from "../types/quiz";
import axios from "axios";
import qs from "qs";



  
  export async function runCode(code: Code): Promise<string> {
    try {
      const data = qs.stringify({
        'code': code.code,
        'language': 'c',
        'input': code.input
    });
    const config = {
      method: 'post',
      url: 'https://api.codex.jaagrav.in',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
  };

  const response = await axios(config);
  console.log(response.data);
  if(response.data.error === ''){
    return response.data.output;
  }
  else{
    return response.data.error;
  }

    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }
  }
  
  export async function submitQuiz(answer: QuizAnswer): Promise<string> {
    try {
      console.log(answer);
      return 'Answer submitted successfully!';
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }
  }