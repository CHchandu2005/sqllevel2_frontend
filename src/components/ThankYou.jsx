import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";


function ThankYou() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // Set initial countdown to 10 seconds
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          logout();
          navigate("/");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-300 bg-clip-text text-transparent">
        🎉 Thank You for Completing the Quiz! 🎉
      </h2>
      <p className="mt-4 text-lg text-gray-400">Your responses have been submitted successfully.</p>
      <p className="mt-6 text-2xl font-semibold text-red-400">
        Redirecting in <span className="text-yellow-300">{countdown}</span> seconds...
      </p>
    </div>
  );
}

export default ThankYou;
