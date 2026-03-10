import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";

dotenv.config();
connectDB();

const movies = [
  {
    title: "Sample Movie 1",
    description: "Demo description",
    industry: "Kollywood",
    genre: ["Action"],
    releaseYear: 2023,
    poster: "https://via.placeholder.com/300",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    director: {
      name: "Director Name",
      image: "https://via.placeholder.com/100"
    },
    musicDirector: {
      name: "Music Director",
      image: "https://via.placeholder.com/100"
    },
    actors: [
      { name: "Actor 1", image: "https://via.placeholder.com/80" },
      { name: "Actor 2", image: "https://via.placeholder.com/80" }
    ]
  }
];

// Duplicate automatically to create 60 movies
const generateMovies = () => {
  const allMovies = [];
  for (let i = 1; i <= 60; i++) {
    allMovies.push({
      ...movies[0],
      title: `Sample Movie ${i}`
    });
  }
  return allMovies;
};

const importData = async () => {
  try {
    await Movie.deleteMany();
    await Movie.insertMany(generateMovies());
    console.log("60 Movies Inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
