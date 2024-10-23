
  
  

  'use client'
  
  import React, { useState, useEffect } from 'react';
  import { runCode, submitQuiz } from '../actions/quizActions';
  import type { QuizAnswer,Code } from '../types/quiz';
  
  const QUIZ_OPTIONS = [
    'The code has a syntax error in line 3',
    'The function is missing a return statement',
    'The loop condition is incorrect',
    'There is a scope issue with the variables'
  ] as const;
  
  export default function QuizPage() {
    const [code, setCode] = useState<Code>({code: 'Your Code', input: ''});
    const [output, setOutput] = useState<string>('');
    const [selected, setSelected] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(5 * 60); // 5 minutes in seconds
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
    useEffect(() => {
      if (timeLeft > 0 && !isTimeUp) {
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsTimeUp(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [timeLeft, isTimeUp]);
  
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    const handleRun = async (): Promise<void> => {
      try {
        setOutput('Running code...');
        const result = await runCode(code);
        setOutput(result);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    };
  
    const handleSubmit = async (): Promise<void> => {
      if (isTimeUp) {
        setOutput("Time's up! Cannot submit answer.");
        return;
      }else{
        setAnswer("The code has a syntax error in line 3");
      }
  
      try {
        setIsSubmitting(true);
        const quizAnswer: QuizAnswer = {
          code: code.code,
          explanation: answer,
          selectedOption: selected
        };
  
        const result = await submitQuiz(quizAnswer);
        setOutput(result);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-green-400 font-mono">
        <div className="max-w-4xl mx-auto">
          {/* Header with Timer */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">{'>'} Q1: Debug Challenge</h1>
              <div className="h-1 w-32 bg-green-400"></div>
            </div>
            <div className="text-4xl font-bold">
              <span className={`${timeLeft <= 60 ? 'animate-pulse text-red-500' : ''}`}>
                {'>'} {formatTime(timeLeft)}
              </span>
            </div>
          </div>
  
          {/* Main content */}
          <div className="space-y-6">
            {/* Code editor */}
            <div className="relative">
              <textarea
                value={code.code}
                onChange={(e) => {
                  setCode((prev) => ({ ...prev, code: e.target.value }));
                }}
                className="w-full h-64 bg-gray-800 text-green-400 p-4 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
                spellCheck="false"
                disabled={isTimeUp}
              />
            </div>
            
            {/* input area */}
            <div className="space-y-4">
              <div className="text-xl mb-2">{'>'} Inputs For Program:</div>
              <textarea
                value={code.input}
                onChange={(e) => {
                  setCode((prev) => ({ ...prev, input: e.target.value }));
                }}
                placeholder="Enter Any Inputs..."
                className="w-full h-32 bg-gray-800 text-green-400 p-4 rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
                spellCheck="false"
                disabled={isTimeUp}
              />
            </div>  
  
          {/* Run button */}

            <div className="flex justify-end">
              <button
                onClick={handleRun}
                disabled={isTimeUp}
                className="bg-green-400 text-gray-900 px-6 py-2 rounded hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {'>'} RUN
              </button>
            </div>
  
            {/* Output area */}
            <div className="text-xl mb-2">{'>'} Output For Program:</div>
            <div className="bg-gray-800 p-4 rounded-lg border border-green-400 h-24 overflow-auto">
              <pre className="text-green-400">{output}</pre>
            </div>
  
            
  
            {/* Radio options */}
            <div className="space-y-4 mt-8">
              <div className="text-xl mb-4">{'>'} Select the correct answer:</div>
              {QUIZ_OPTIONS.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selected === option}
                    onChange={(e) => setSelected(e.target.value)}
                    className="form-radio text-green-400 focus:ring-green-400 h-5 w-5"
                    disabled={isTimeUp}
                  />
                  <span className="text-green-400">{option}</span>
                </label>
              ))}
            </div>
  
            {/* Submit button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                disabled={isTimeUp || isSubmitting}
                className="bg-green-400 text-gray-900 px-8 py-3 rounded-lg hover:bg-green-300 transition-colors text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '> SUBMITTING...' : '> SUBMIT'}
              </button>
            </div>
  
            {/* Time's up message */}
            {isTimeUp && (
              <div className="mt-4 text-red-500 text-xl text-center animate-pulse">
                Time s up! You can no longer modify or submit answers.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }