import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; 

function Navbar() {
  const navigate = useNavigate();
  // Strictly check for the JWT token to determine if someone is actually logged in
  const token = localStorage.getItem("token"); 
  const role = localStorage.getItem("role"); 

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
    window.location.reload(); // Force a clean slate
  };

  return (
    <nav className="bg-white border-b border-[#E8E1D5] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex justify-between items-center">
        
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-[#B89868] to-[#8C6D3F] w-8 h-8 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
            R
          </div>
          <h1 className="text-xl font-bold text-[#162740] tracking-tight">
            RideBuddy
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5 text-sm">
            {role === "USER" && token && (
              <>
                <Link to="/rides" className="text-[#162740] font-semibold hover:text-[#9A7D46] transition-colors">Rides</Link>
                <Link to="/my-bookings" className="text-[#162740] font-semibold hover:text-[#9A7D46] transition-colors">My Bookings</Link>
              </>
            )}
            {role === "DRIVER" && token && (
              <>
                <Link to="/my-rides" className="text-[#162740] font-semibold hover:text-[#9A7D46] transition-colors">My Rides</Link>
                <Link to="/create-ride" className="text-[#162740] font-semibold hover:text-[#9A7D46] transition-colors">Create Ride</Link>
              </>
            )}
            {role === "ADMIN" && token && (
              <Link to="/admin/users" className="text-[#162740] font-semibold hover:text-[#9A7D46] transition-colors">Users</Link>
            )}
          </div>

          {/* Conditional Rendering: Show Logout if token exists, otherwise show Login */}
          {token && token !== "null" && token !== "undefined" ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#162740] hover:bg-[#111F33] text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;