import React, { useState, useEffect, useContext } from "react";
import { Timer } from "lucide-react";
import { tableImages } from "../data";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

const Backend_URL = import.meta.env.VITE_BACKEND_URL;

function Quiz() {
  const [selectedTable, setSelectedTable] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch questions and initialize timer
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        const response = await fetch(`${Backend_URL}/api/getquestions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        console.log("Data in quiz:", data);
        setQuestions(data.questions);

        // Load saved answers from localStorage
        const savedAnswers = localStorage.getItem("quizAnswers");
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
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
      localStorage.setItem("quizTimeLeft", (20*60).toString());
      setTimeLeft(20*60);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer); // Stop the timer
          handleSubmit(answers); // Pass the latest answers to handleSubmit
          return 0;
        }
        localStorage.setItem("quizTimeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [answers]); // Re-run effect if answers change

  // Handle quiz submission
  const handleSubmit = async (latestAnswers) => {
    console.log("Handle submit function");
    try {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        console.error("No user token found");
        return;
      }

      const userId = user.teckziteid;

      console.log("Answers:", latestAnswers);

      // Convert answers into required format
      const formattedAnswers = Object.entries(latestAnswers).map(([question, answer], index) => ({
        question_no: index + 1,
        question,
        answer,
      }));

      const payload = {
        userID: userId,
        questions: formattedAnswers,
        time: (20 * 60 - timeLeft).toString(),
      };

      console.log("Payload being sent:", payload);

      const response = await fetch(`${Backend_URL}/api/submitquestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit answers");

      const result = await response.json();
      console.log("Submission Successful:", result);

      // Clear localStorage and navigate
      localStorage.removeItem("usertoken");
      localStorage.removeItem("quizTimeLeft");
      localStorage.removeItem("quizAnswers");
      navigate("/thankyou");
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle answer input changes
  const handleAnswerChange = (questionId, value) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
  };

  return (
    <div className="space-y-8">
      {/* Timer and Submit Button */}
      <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5 text-red-400" />
          <span className="text-xl font-mono text-red-400">{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={() => handleSubmit(answers)} // Pass latest answers on manual submit
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
            {tableNum == 1?"Student table":null}
            {tableNum == 2?"Team table":null}
            {tableNum == 3?"Puzzle table":null}
            {tableNum == 4? "Time table":null}
            {tableNum == 5? "Hints table":null}
          </button>
        ))}
      </div>

      {/* Image Display */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <img
          src={tableImages[selectedTable]}
          alt={`Table ${selectedTable}`}
          className="w-full object-cover rounded-lg"
        />
      </div>

      {/* Questions and Answer Inputs */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
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