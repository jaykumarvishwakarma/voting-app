import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) => {
  const [name, setName] = useState("U");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
        headers: {
          "X-Session-Id": localStorage.getItem("sessionId") || "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setName(data.name || data.username || "U");
      }
    };

    fetchMe();
  }, []);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer text-purple-600"
        onClick={() => navigate("/")}
      >
        BallotBox
      </h1>
      {isLoggedIn && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-purple-100 text-purple-700 font-medium px-4 py-2 rounded hover:bg-purple-200 transition"
          >
            Home
          </button>
          <div className="relative">
            <div
              className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {initials}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    onLogout();
                    setDropdownOpen(false);
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
