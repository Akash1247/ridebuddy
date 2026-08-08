import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, ArrowRight, Zap, Car, Users } from "lucide-react"; 

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (loginEmail = email, loginPassword = password) => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Route based on role
      if (role === "USER") {
        navigate("/rides"); // Redirect back to home/rides
      } else if (role === "DRIVER") {
        navigate("/my-rides");
      }
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Guest Login Handlers
  const loginAsGuestPassenger = () => handleLogin("ay99959@gmail.com", "12345");
  const loginAsGuestDriver = () => handleLogin("ay9979@gmail.com", "12345");

  return (
    <div className="min-h-screen w-full flex bg-[#F6F3EC] font-sans">
      
      {/* Left Panel: Recruiter Fast-Track */}
      <div className="hidden lg:flex w-1/2 bg-[#162740] flex-col justify-center items-center relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#162740] to-[#0a1220] opacity-90 z-0"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="flex items-center gap-2 text-[#9A7D46] mb-6">
            <Zap size={24} />
            <h2 className="text-xl font-bold uppercase tracking-widest">Recruiter Fast-Track</h2>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Skip the signup. <br/> Test the app instantly.
          </h1>
          <p className="text-gray-300 text-lg mb-10">
            Choose a role below to explore the dashboard with pre-populated data and full functionality.
          </p>

          <div className="space-y-4">
            <button 
              onClick={loginAsGuestPassenger}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-[#162740] p-5 rounded-2xl font-bold text-lg flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#E6F4EA] text-[#137333] p-2 rounded-xl"><Users size={24}/></div>
                <div className="text-left">
                  <p className="leading-none">Login as Passenger</p>
                  <span className="text-xs text-gray-500 font-normal">Test AI Search & Booking</span>
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-[#162740] transition-colors" />
            </button>

            <button 
              onClick={loginAsGuestDriver}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-[#162740] p-5 rounded-2xl font-bold text-lg flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#F4ECDD] text-[#9A7D46] p-2 rounded-xl"><Car size={24}/></div>
                <div className="text-left">
                  <p className="leading-none">Login as Driver</p>
                  <span className="text-xs text-gray-500 font-normal">Test Publishing & Map Routing</span>
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-[#162740] transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Standard Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-[#B89868] to-[#8C6D3F] w-14 h-14 rounded-full flex items-center justify-center text-white font-serif font-bold text-3xl shadow-md">R</div>
              <h2 className="text-4xl font-bold text-[#162740] tracking-tight">RideBuddy</h2>
            </div>
            <p className="text-[#162740] font-medium text-lg">
              Manual Login. <span className="text-gray-500 font-normal">Enter your credentials</span>
            </p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 text-sm font-medium text-center">{error}</div>}

          <div className="space-y-4 mb-6">
            <div className="relative flex items-center">
              <User size={20} className="absolute left-4 text-gray-400" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#9A7D46] focus:ring-1 focus:ring-[#9A7D46]" />
            </div>
            <div className="relative flex items-center">
              <Lock size={20} className="absolute left-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:border-[#9A7D46] focus:ring-1 focus:ring-[#9A7D46]" />
              <button onClick={() => setShowPassword(!showPassword)} type="button" className="absolute right-4 text-gray-400">
                <Eye size={20} className={showPassword ? "text-[#9A7D46]" : ""} />
              </button>
            </div>
          </div>

          <button onClick={() => handleLogin(email, password)} disabled={isLoading} className="w-full bg-[#162740] hover:bg-[#111F33] text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition duration-200 shadow-lg disabled:opacity-70">
            {isLoading ? "Logging in..." : "Login"} <ArrowRight size={20} className="opacity-80" />
          </button>

          {/* Mobile Recruiter Buttons (Shown only on small screens) */}
          <div className="lg:hidden mt-8 border-t border-gray-100 pt-8 space-y-3">
             <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recruiter Fast-Track</p>
             <button onClick={loginAsGuestPassenger} className="w-full border-2 border-[#137333] text-[#137333] py-3 rounded-xl font-bold">Guest Passenger</button>
             <button onClick={loginAsGuestDriver} className="w-full border-2 border-[#9A7D46] text-[#9A7D46] py-3 rounded-xl font-bold">Guest Driver</button>
          </div>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account? <Link to="/signup" className="text-[#162740] ml-2 font-bold hover:underline">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
