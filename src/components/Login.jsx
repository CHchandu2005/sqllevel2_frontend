// import React, { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserCircle, Phone, Key, Database } from "lucide-react";
// import AuthContext from "../AuthContext";

// const Backend_URL = import.meta.env.VITE_BACKEND_URL;

// function Login() {
//   const { user, setUser } = useContext(AuthContext);
//   const [formData, setFormData] = useState({ userID: "", mobile: "", name: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // Redirect if user already exists
//   useEffect(() => {
//     if (user) navigate("/instructions");
//   }, [user, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
  
//     try {
//       const response = await fetch(`${Backend_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
  
//       const data = await response.json();
      
//       if (response.ok) {
//         localStorage.setItem("usertoken", data.token);
//         setUser(data.user);
//         navigate("/instructions");
//       } else {
//         setError(data.message || "Invalid credentials");
//       }
//     } catch (err) {
//       setError("Server error. Please try again later.");
//     }
//   };
  

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="flex min-h-[80vh] items-center justify-center">
//       <div className="w-full max-w-md space-y-8 bg-gray-800/50 p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
//         <div className="text-center">
//           <Database className="mx-auto h-12 w-12 text-blue-400" />
//           <h2 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
//             Welcome to SQL Quest
//           </h2>
//         </div>
//         {error && <p className="text-red-400 text-center">{error}</p>}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4 rounded-md">
//             <div className="relative">
//               <input name="userID" type="text" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="User ID" value={formData.userID} onChange={handleChange} />
//               <UserCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//             </div>
//             <div className="relative">
//               <input name="mobile" type="tel" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="Phone Number" value={formData.mobile} onChange={handleChange} />
//               <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//             </div>
//             <div className="relative">
//               <input name="name" type="text" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="Full Name" value={formData.name} onChange={handleChange} />
//               <UserCircle className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//             </div>
//             <div className="relative">
//               <input name="password" type="password" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="Password" value={formData.password} onChange={handleChange} />
//               <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//             </div>
//           </div>

//           <button type="submit" className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//             Sign in to continue
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Phone, Key, Database } from "lucide-react";
import AuthContext from "../AuthContext";

const Backend_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ userID: "", mobile: "", name: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if user already exists
  useEffect(() => {
    if (user) navigate("/instructions");
  }, [user, navigate]);

  const validateUserID = (userID) => {
    const regex = /^TZK25\d{4}$/i; // TZK25 followed by exactly 4 digits
    return regex.test(userID);
  };

  const validateMobileNumber = (mobile) => {
    const regex = /^[6-9]\d{9}$/; // Standard Indian mobile number
    return regex.test(mobile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateUserID(formData.userID)) {
      setError("User ID must be in the format TZK25XXXX (e.g., TZK250018)");
      setIsLoading(false);
      return;
    }

    if (!validateMobileNumber(formData.mobile)) {
      setError("Please enter a valid Indian mobile number");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${Backend_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userID: formData.userID.toUpperCase(), // Ensure userID is sent in uppercase
        }),
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
    } finally {
      setIsLoading(false);
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
            ! Welcome !
          </h2>
        </div>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div className="relative">
              <input name="userID" type="text" required className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pl-11 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" placeholder="TeckziteId (e.g., TZK250018)" value={formData.userID} onChange={handleChange} />
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

          <button type="submit" className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign in to continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;