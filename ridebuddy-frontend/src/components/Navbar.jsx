import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // <-- YE MISSING HAI

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          RideBuddy
        </h1>

        <div className="flex items-center gap-6">

          {role === "USER" && (
            <>
              <Link
                to="/rides"
                className="hover:text-blue-200"
              >
                Rides
              </Link>
              <Link
                to="/my-bookings"
                className="hover:text-blue-200"
              >
                My Bookings
              </Link>
            </>
          )}

          {role === "DRIVER" && (
            <>
              <Link
                to="/my-rides"
                className="hover:text-blue-200"
              >
                My Rides
              </Link>

              <Link
                to="/create-ride"
                className="hover:text-blue-200"
              >
                Create Ride
              </Link>
            </>
          )}
          {role === "ADMIN" && (
            <>
              <Link
                to="/admin/users"
                className="hover:text-blue-200"
              >
                Users
              </Link>
            </>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;