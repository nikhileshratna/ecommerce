const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/Payments");
const router = require("./routes/index");

const app = express();

const allowedOrigins = [
  "https://ecommerce-nikhilesh-ratnas-projects.vercel.app",
  "https://ecommerce-nu-two-18.vercel.app",
  "https://ecommerce-erenpbtxi-nikhilesh-ratnas-projects.vercel.app",
  "https://ecommerce-git-main-nikhilesh-ratnas-projects.vercel.app",
  "https://ecommerce-nu-two-18.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://sidham.vercel.app/",
  "https://sidham-git-main-harsh-sainis-projects-0883263d.vercel.app/",
  "https://sidham-lt4aserah-harsh-sainis-projects-0883263d.vercel.app/",
  "https://sidham-harsh-sainis-projects-0883263d.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);
app.use("/api/payment", paymentRoutes);
var adminRoute = require('./routes/adminRoute');

app.use('/api', adminRoute);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to DB");
    console.log("Server is running on port " + PORT);
  });
  app.get("/", (req, res) => {
    return res.json({
      success: true,
      message: "Your server is up and running....",
    });
  });
});
