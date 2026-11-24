import { useEffect, useState } from "react";
import TempleSection from "../components/TempleSection";
import { getTemples } from "../services/api";

function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTemples() {
      try {
        const data = await getTemples();

        const formattedTemples = data.map((temple) => ({
          ...temple,
          name: temple.name,
          location: temple.address || "Lonavala, Maharashtra",
          deity: temple.main_deity || "Jain Tirthankar",
          image: null,
        }));

        setTemples(formattedTemples);
      } catch (err) {
        setError("Unable to load temples. Please check whether the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchTemples();
  }, []);

  return (
    <main className="min-h-screen pt-8">
      {loading && (
        <p className="text-center py-12 text-gray-600">
          Loading temples...
        </p>
      )}

      {error && (
        <p className="text-center py-12 text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && temples.length === 0 && (
        <p className="text-center py-12 text-gray-600">
          No temples found.
        </p>
      )}

      {!loading && !error && temples.length > 0 && (
        <TempleSection temples={temples} />
      )}
    </main>
  );
}

export default Temples;