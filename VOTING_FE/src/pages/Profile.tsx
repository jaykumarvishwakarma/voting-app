import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
        headers: {
          "X-Session-Id": localStorage.getItem("sessionId") || "",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("sessionId");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  if (!user) return <div className="p-6 text-center text-gray-600">Loading profile...</div>;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
    : user.username?.[0]?.toUpperCase();

  return (
    <div className="min-h-screen pt-24 flex items-start justify-center bg-gray-50">
      <div className="p-6 w-full max-w-md bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-purple-600 text-white text-2xl rounded-full flex items-center justify-center mb-4">
            {initials || "U"}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {user.name || "Unnamed User"}
          </h2>
          <p className="text-gray-500 mb-4">@{user.username}</p>
        </div>

        <div className="space-y-3 text-gray-700 text-sm">
          <div>
            <span className="font-medium text-gray-600">Phone:</span> {user.phone || "N/A"}
          </div>
          <div>
            <span className="font-medium text-gray-600">Voted For:</span>{" "}
            {user.vote ? (
              <span className="text-purple-600 font-medium">{user.vote.name}</span>
            ) : (
              <span className="text-gray-400">Not Voted</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
