import axios from "axios";

const API = axios.create({
  baseURL: "https://main-project-1-20ny.onrender.com/api"
});

export default API;
