const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");

//const bookRoutes = require("./routes/books");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
//app.use("/books", bookRoutes);
app.use("/user", userRoutes);
app.use("/orders", orderRoutes);

// Get PORT with fallback
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
