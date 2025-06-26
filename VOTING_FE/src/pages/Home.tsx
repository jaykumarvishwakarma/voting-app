import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Entity = {
  id: number;
  name: string;
  voteCount: number;
};

const Home = ({ onLogout }: { onLogout: () => void }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [votedEntityId, setVotedEntityId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchEntities = async () => {
    const sessionId = localStorage.getItem("sessionId") || "";

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/entities`, {
      headers: {
        "X-Session-Id": sessionId,
      },
    });

    if (res.status === 401) {
      onLogout();
      navigate("/login");
      return;
    }

    const data = await res.json();
    setEntities(data);
  };

  const fetchUserVote = async () => {
    const sessionId = localStorage.getItem("sessionId") || "";

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/my-vote`, {
      headers: {
        "X-Session-Id": sessionId,
      },
    });

    if (res.status === 401) {
      onLogout();
      navigate("/login");
      return;
    }

    const data = await res.json();
    setVotedEntityId(data.entityId);
  };

  const vote = async (id: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/vote/${id}`, {
      method: "POST",
      headers: {
        "X-Session-Id": localStorage.getItem("sessionId") || "",
      },
    });

    if (res.status === 401) {
      onLogout();
      navigate("/login");
      return;
    }

    const data = await res.json();

    if (res.ok) {
      alert("Vote cast successfully");
      fetchEntities();
      fetchUserVote();
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    fetchEntities();
    fetchUserVote();
  }, []);

  const totalVotes = entities.reduce((sum, e) => sum + e.voteCount, 0);

  return (
    <div className="p-4 max-w-xl mx-auto pt-24">
      <h1 className="text-2xl font-bold mb-6 text-center">Vote for Your Favorite</h1>

      {entities.map((entity) => {
        const percentage = totalVotes ? (entity.voteCount / totalVotes) * 100 : 0;
        const isVoted = votedEntityId === entity.id;

        return (
          <div key={entity.id} className="mb-4 p-4 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{entity.name}</span>
              <button
                onClick={() => vote(entity.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm rounded"
              >
                Vote
              </button>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
              className={`h-4 rounded-full ${isVoted ? "bg-green-500" : "bg-purple-500"}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {entity.voteCount} votes ({percentage.toFixed(1)}%)
            </p>

            {isVoted && (
              <p className="text-sm text-green-600 font-medium mt-1">✅ You have voted for this</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Home;
