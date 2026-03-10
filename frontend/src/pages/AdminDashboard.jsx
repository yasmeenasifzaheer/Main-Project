import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    API.get("/movies").then(res => setMovies(res.data));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Movies: {movies.length}</p>
    </div>
  );
}

export default AdminDashboard;
