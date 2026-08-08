import { useState } from "react";
import api from "../services/api";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

const AiSearchBar = ({ onSearchStart, onSearchResults, onSearchError }) => {
  const [prompt, setPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const suggestions = [
    "Rides to Gurgaon under ₹300",
    "Tomorrow morning to Noida",
    "Bengaluru to Mysore this weekend"
  ];

  const executeSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    onSearchStart();
    try {
      const response = await api.post("/ai/search", { prompt: searchQuery });
      onSearchResults(response.data);
    } catch (error) {
      console.error("AI Search Error: ", error);
      onSearchError();
      alert("AI Search Failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(prompt);
  };

  const handleSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
    executeSearch(suggestion);
  };

  return (
    <div className="w-full mb-6">
      <div className="bg-gradient-to-r from-[#162740] via-[#1e3659] to-[#162740] p-1 rounded-2xl shadow-lg relative overflow-hidden group mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9A7D46] to-transparent opacity-20 animate-pulse"></div>
        <form 
          onSubmit={handleSearch} 
          className="relative bg-white rounded-xl p-1.5 flex items-center"
        >
          <Sparkles size={24} className="text-[#9A7D46] ml-3 mr-2 shrink-0" />
          <input
            autoFocus
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI: 'Find a ride to Noida under ₹300'"
            className="flex-1 w-full bg-transparent border-none text-[15px] sm:text-lg text-[#162740] placeholder:text-gray-400 focus:outline-none focus:ring-0 py-3 px-2"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isSearching}
            className="bg-[#162740] hover:bg-[#111F33] disabled:bg-gray-300 text-white rounded-lg font-bold px-6 py-3 transition-all flex items-center gap-2 shrink-0"
          >
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <><span className="hidden sm:inline">Search</span> <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2">
        <span className="text-xs font-bold text-[#9A7D46] uppercase tracking-wider flex items-center gap-1">
          💡 Try Asking AI:
        </span>
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-xs bg-white border border-[#9A7D46]/40 text-[#162740] hover:bg-[#F4ECDD] hover:border-[#9A7D46] px-4 py-1.5 rounded-full transition-colors font-semibold shadow-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AiSearchBar;