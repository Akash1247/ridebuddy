import { useState } from "react";
import api from "../services/api";

const AiSearchBar = ({ onSearchStart, onSearchResults, onSearchError }) => {
  const [prompt, setPrompt] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onSearchStart();

    try {
      const response = await api.post("/ai/search", {
        prompt: prompt,
      });

      onSearchResults(response.data);
    } catch (error) {
      console.error("AI Search Error: ", error);
      onSearchError();
      alert("AI Search Failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span>✨</span> AI Magic Search
      </h2>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., 'Show me rides to Gurgaon tomorrow evening under 300 rupees'"
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold px-8 py-3 transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default AiSearchBar;
