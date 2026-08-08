import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
// Make sure to install/import these icons from lucide-react
import { User, Lock, Mail, Phone, Briefcase, Eye, ChevronDown, BrainCircuit, Users, ShieldCheck, Loader2 } from "lucide-react";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("USER");
  const [showPassword, setShowPassword] = useState(false);
  
  // NEW: Loading state handle karne ke liye
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    // Agar pehle se loading hai toh dobara click rokne ke liye
    if (isLoading) return; 

    setIsLoading(true); // Request start hone par true set karein
    
    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        phoneNumber,
        role
      });

      alert("Signup Successful");
      navigate("/");
    } catch (error) {
      alert("Signup Failed");
    } finally {
      setIsLoading(false); // Success ya fail dono case mein wapas false karein
    }
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* Left Panel - Same as Login for consistency */}
      <div className="hidden lg:flex w-1/2 bg-[#F6F3EC] flex-col relative border-r border-[#E8E1D5]">
        <div className="relative z-10 px-16 pt-10 flex flex-col gap-6">
          <h1 className="text-4xl xl:text-5xl font-bold text-[#162740] leading-[1.15] tracking-tight">
            Start Your Journey <br /> With Us Today
          </h1>
          
          <div className="flex flex-col gap-3 max-w-md mt-4">
            <FeatureCard icon={BrainCircuit} title="AI Ride Search" description="Find the fastest, most relevant routes." />
            <FeatureCard icon={Users} title="Live Seat Updates" description="Instant visibility on available seating." />
            <FeatureCard icon={ShieldCheck} title="Secure Booking" description="Your data and rides are always safe." />
          </div>
        </div>

      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        
        <div className="w-full max-w-md my-auto">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-[#B89868] to-[#8C6D3F] w-12 h-12 rounded-full flex items-center justify-center text-white font-serif font-bold text-2xl shadow-md">
                R
              </div>
              <h2 className="text-3xl font-bold text-[#162740] tracking-tight">
                RideBuddy
              </h2>
            </div>
            
            <p className="text-[#162740] font-medium text-base">
              Create your account. <span className="text-gray-500 font-normal">Join the community</span>
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <InputField icon={User} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <InputField icon={Mail} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField 
              icon={Lock} 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              showToggle 
              toggleActive={showPassword} 
              onToggle={() => setShowPassword(!showPassword)} 
            />
            <InputField icon={Phone} type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            
            {/* Styled Select Dropdown */}
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400">
                <Briefcase size={20} />
              </div>
              <select
                className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 text-[15px] focus:outline-none focus:border-[#9A7D46] focus:ring-1 focus:ring-[#9A7D46] transition-all appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">Passenger</option>
                <option value="DRIVER">Driver</option>
              </select>
              <div className="absolute right-4 text-gray-400 pointer-events-none">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Signup Button with Loading State */}
          <button
            onClick={handleSignup}
            disabled={isLoading} // Button disabled while loading
            className={`w-full bg-[#162740] text-white py-3.5 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition duration-200 shadow-lg 
              ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-[#111F33] hover:shadow-xl"}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin opacity-80" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center mt-8 text-gray-600 text-sm">
            Already have an account?
            <Link
              to="/"
              className="text-[#162740] ml-2 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper components (same as login)
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-[#FCFBF8] p-4 rounded-2xl flex items-center gap-4 border border-[#EBE3D5] shadow-sm relative overflow-hidden group">
      <div className="p-3 bg-[#F4ECDD] rounded-xl text-[#9A7D46]">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <h4 className="text-base font-bold text-[#162740]">{title}</h4>
        <p className="text-gray-600 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function InputField({ icon: Icon, type, placeholder, value, onChange, showToggle, toggleActive, onToggle }) {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-4 text-gray-400">
        <Icon size={20} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-[#9A7D46] focus:ring-1 focus:ring-[#9A7D46] transition-all"
        value={value}
        onChange={onChange}
      />
      {showToggle && (
        <button 
          onClick={onToggle}
          type="button"
          className="absolute right-4 text-gray-400 hover:text-[#9A7D46] transition-colors"
        >
          <Eye size={20} className={toggleActive ? "text-[#9A7D46]" : ""} />
        </button>
      )}
    </div>
  );
}

export default SignupPage;