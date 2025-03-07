import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Phone, Key, Database } from "lucide-react";
import AuthContext from "../AuthContext";

const Backend_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ userID: "", mobile: "", name: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if user already exists
  useEffect(() => {
    if (user) navigate("/instructions");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch(`${Backend_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("usertoken", data.token);
        setUser(data.user);
        navigate("/instructions");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
        <div className="text-center">
          <Database className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Welcome to SQL Quest
          </h2>
        </div>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div className="relative">
              <input name="userID" type="text" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="User ID" value={formData.userID} onChange={handleChange} />
              <UserCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input name="mobile" type="tel" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="Phone Number" value={formData.mobile} onChange={handleChange} />
              <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input name="name" type="text" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="Full Name" value={formData.name} onChange={handleChange} />
              <UserCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input name="password" type="password" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="Password" value={formData.password} onChange={handleChange} />
              <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button type="submit" className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Sign in to continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
