const express = require("express");
const bodyParser = require("body-parser");
const coockieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.routes");
const webDataRoutes = require("./routes/webdata.routes");
const transferRequestRoutes = require("./routes/transferRequest.routes")
dotenv.config();

const app = express();
const PORT = 9080;


app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(coockieParser());

// Routes
app.use("/uploads", express.static("uploads"));

app.use("/api/user", userRoutes);
app.use("/api/webdata", webDataRoutes);
app.use("/api/transferRequest", transferRequestRoutes );
// // MongoDB Connection using Mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "main", // Specify the database name
  })
  .then(() => {
    console.log("✅ Connected to MongoDB via Mongoose");
    // Sample user creation (optional for testing)
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
