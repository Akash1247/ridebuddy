import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const[role, setRole] = useState("USER");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await api.post("/api/auth/signup", {
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            RideBuddy
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>
        </div>

        <input
          placeholder="Full Name"
          className="w-full border rounded-lg p-3 mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full border rounded-lg p-3 mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          className="w-full border rounded-lg p-3 mb-6"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <select
            className="w-full border rounded-lg p-3 mb-4"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
          <option value="USER">Passenger</option>
          <option value="DRIVER">Driver</option>
        </select>


        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
        >
          Create Account
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?
          <Link
            to="/"
            className="text-blue-600 ml-2 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
