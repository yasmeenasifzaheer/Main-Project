import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    genre: { type: String }, // Action, Comedy etc

    categories: [String], 
    // ["Action", "Thriller"] (better for multi-category)

    industry: { type: String }, 
    // Tollywood, Kollywood, Bollywood, Hollywood

    description: String,
    poster: String,

    trailer: String, // video URL (mp4 or YouTube embed)

    cast: [
  {
    name: String,
    role: String,
    image: String
  }
],

director: {
  name: String,
  image: String
},

musicDirector: {
  name: String,
  image: String
},

cinematographer: {
  name: String,
  image: String
},

editor: {
  name: String,
  image: String
},

productionDesigner: {
  name: String,
  image: String
},

year: Number,

    rating: {
      type: Number,
      default: 0,
    },

   userReviews: {
  average: Number,
  total: Number,
  ratingBreakdown: [Number],

  comments: [
    {
      user: String,
      text: String,
      likes: {
        type: Number,
        default: 0
      },
      dislikes: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
},

    numReviews: {
      type: Number,
      default: 0,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    likes: { type: Number, default: 0 },
dislikes: { type: Number, default: 0 },

  
favorites: {
  type: Number,
  default: 0
},

watchlist: {
  type: Number,
  default: 0
},
     inTheater: {
  type: Boolean,
  default: false,
},
upcoming: { type: Boolean, default: false },
love: { type: Boolean, default: false },
action: { type: Boolean, default: false },
horror: { type: Boolean, default: false },
disney: { type: Boolean, default: false },
  },
  { timestamps: true } // 🔥 adds createdAt automatically
);

export default mongoose.model("Movie", movieSchema);
