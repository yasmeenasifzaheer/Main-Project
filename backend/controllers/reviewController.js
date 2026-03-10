import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {

    const { rating, comment } = req.body;

    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const review = await Review.create({
      movie: movie._id,
      rating,
      comment,
      user: req.user._id,     // user id from token
      userName: req.user.name // user name from DB
    });

    movie.numReviews += 1;

    const reviews = await Review.find({ movie: movie._id });

    movie.rating =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await movie.save();

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      movie: req.params.movieId
    })
    .populate("user", "name")   // gets the user name from User collection
    .sort({ createdAt: -1 });   // newest reviews first

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};