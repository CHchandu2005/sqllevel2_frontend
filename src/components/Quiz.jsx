import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
const Backend_URL = import.meta.env.VITE_BACKEND_URL;
import { tableImages } from '../data';



function Quiz() {
  const [selectedTable, setSelectedTable] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fetch questions from backend
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('usertoken'); // Retrieve the token from localStorage
    
        const response = await fetch(`${Backend_URL}/api/getquestions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
    
        const data = await response.json();
        console.log("Data in quiz:",data);
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    

    fetchQuestions();

    // Load timer from localStorage if exists
    const savedTime = localStorage.getItem('quizTimeLeft');
    if (savedTime) {
      setTimeLeft(parseInt(savedTime));
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem('quizTimeLeft', newTime.toString());
        if (newTime <= 0) {
          handleSubmit();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
    localStorage.removeItem('quizTimeLeft');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-300 bg-clip-text text-transparent">
          Thank You for Completing the Quiz!
        </h2>
        <p className="mt-4 text-gray-400">Your responses have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5 text-red-400" />
          <span className="text-xl font-mono text-red-400">{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Submit Quiz
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((tableNum) => (
          <button
            key={tableNum}
            onClick={() => setSelectedTable(tableNum)}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedTable === tableNum
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            Table {tableNum}
          </button>
        ))}
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <img
          src={tableImages[selectedTable]}
          alt={`Table ${selectedTable}`}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <div className="space-y-6">
        {questions
        //  .filter((question) => question.tableRef === selectedTable)
          .map((question) => (
            <div
              key={question.id}
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
            >
              <p className="text-lg mb-3">{question.question}</p>
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Type your answer here..."
                rows="3"
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Quiz;
