import React, { useState, useEffect, useContext } from "react";
import { Timer } from "lucide-react";
const Backend_URL = import.meta.env.VITE_BACKEND_URL;
import { tableImages } from "../data";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
// const Backend_URL = import.meta.env.VITE_BACKEND_URL;


function Quiz() {
  const [selectedTable, setSelectedTable] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const { user } = useContext(AuthContext);

const navigate = useNavigate();
  useEffect(() => {
    // Fetch questions from backend
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("usertoken"); // Retrieve the token

        const response = await fetch(`${Backend_URL}/api/getquestions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        console.log("Data in quiz:", data);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    // Initialize timer
    const savedTime = localStorage.getItem("quizTimeLeft");
    if (savedTime) {
      setTimeLeft(parseInt(savedTime));
    } else {
      localStorage.setItem("quizTimeLeft", (20 * 60).toString());
      setTimeLeft(20 * 60);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          handleSubmit();
          return 0; // Stop the timer at 0
        }
        localStorage.setItem("quizTimeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  },[]);

  // const handleSubmit = () => {
  //   localStorage.removeItem("quizTimeLeft");
  //   console.log("Submitted Answers:", answers);
  //   navigate("/thankyou")
  // };
  const handleSubmit = async () => {
    try {
      // Retrieve user token
      const token = localStorage.getItem("usertoken");
  
      if (!token) {
        console.error("No user token found");
        return;
      }
  
      // Retrieve user ID (if stored in localStorage or modify as needed)
      const userId = user.teckziteid; // Example ID
  
      // Convert answers into the required format
      const formattedAnswers = Object.entries(answers).map(([question, answer], index) => ({
        question_no: index + 1,
        question,
        answer,
      }));
  
      // Prepare payload
      const payload = {
        userID: userId,
        questions: formattedAnswers,
        time: (1200 - timeLeft).toString(), // Send remaining time
      };
  
      console.log("Payload being sent:", payload);
  
      // Send data to backend
      const response = await fetch(`${Backend_URL}/api/submitquestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }
  
      const result = await response.json();
      console.log("Submission Successful:", result);
  
      // Remove timer and navigate
      localStorage.removeItem("usertoken");
      localStorage.removeItem("quizTimeLeft");
      navigate("/thankyou");
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };
  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };
  return (
    <div className="space-y-8">
      {/* Timer and Submit Button */}
      <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5 text-red-400" />
          <span className="text-xl font-mono text-red-400">
            {formatTime(timeLeft)}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Submit Quiz
        </button>
      </div>

      {/* Table Selection */}
      <div className="grid grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((tableNum) => (
          <button
            key={tableNum}
            onClick={() => setSelectedTable(tableNum)}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedTable === tableNum
                ? "bg-blue-500 text-white"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
            }`}
          >
            Table {tableNum}
          </button>
        ))}
      </div>

      {/* Table Image */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <img
          src={tableImages[selectedTable]}
          alt={`Table ${selectedTable}`}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Questions and Answer Inputs */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
          >
            <p className="text-lg mb-3">{question.question}</p>
            <textarea
              value={answers[question.question] || ""}
              onChange={(e) => handleAnswerChange(question.question, e.target.value)}
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

