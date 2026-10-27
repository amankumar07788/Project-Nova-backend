const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
console.error("MONGODB_URI environment variable is missing.");
}

let cached = global.mongooseConnection;

if (!cached) {
cached = global.mongooseConnection = {
conn: null,
promise: null,
};
}

async function connectToDatabase() {
if (!MONGODB_URI) {
throw new Error("MONGODB_URI is not configured in Vercel.");
}

if (cached.conn && mongoose.connection.readyState === 1) {
return cached.conn;
}

if (!cached.promise) {
cached.promise = mongoose
.connect(MONGODB_URI, {
serverSelectionTimeoutMS: 10000,
})
.then((mongooseInstance) => mongooseInstance)
.catch((error) => {
cached.promise = null;
throw error;
});
}

cached.conn = await cached.promise;
return cached.conn;
}

// Project schema
const projectSchema = new mongoose.Schema(
{
title: {
type: String,
required: true,
trim: true,
},
description: {
type: String,
required: true,
trim: true,
},
category: {
type: String,
required: true,
trim: true,
},
techStack: {
type: [String],
default: [],
},
githubUrl: {
type: String,
required: true,
trim: true,
},
demo: {
type: String,
default: "",
},
},
{
timestamps: true,
}
);

const Project =
mongoose.models.Project ||
mongoose.model("Project", projectSchema);

// Health check: verifies API and database
app.get("/api/health", async (req, res) => {
try {
await connectToDatabase();

return res.status(200).json({
  success: true,
  status: "ok",
  database: "connected",
  message: "ProjectNova backend and MongoDB are running.",
});

} catch (error) {
console.error("Health check failed:", error.message);

return res.status(503).json({
  success: false,
  status: "error",
  message: "Database connection failed.",
});

}
});

// GET: All projects
app.get("/api/projects", async (req, res) => {
try {
await connectToDatabase();

const projects = await Project.find({})
  .sort({ createdAt: -1 })
  .lean();

return res.status(200).json({
  success: true,
  count: projects.length,
  projects,
});

} catch (error) {
console.error("Fetch projects failed:", error.message);

return res.status(500).json({
  success: false,
  message: "Failed to fetch projects.",
});

}
});

// POST: Create a project
app.post("/api/projects", async (req, res) => {
try {
await connectToDatabase();

const {
  title,
  description,
  category,
  techStack,
  githubUrl,
  demo,
} = req.body || {};

if (
  typeof title !== "string" ||
  !title.trim() ||
  typeof description !== "string" ||
  !description.trim() ||
  typeof category !== "string" ||
  !category.trim() ||
  typeof githubUrl !== "string" ||
  !githubUrl.trim()
) {
  return res.status(400).json({
    success: false,
    message:
      "Title, description, category and githubUrl are required.",
  });
}

if (
  techStack !== undefined &&
  (!Array.isArray(techStack) ||
    !techStack.every((item) => typeof item === "string"))
) {
  return res.status(400).json({
    success: false,
    message: "techStack must be an array of strings.",
  });
}

const project = await Project.create({
  title: title.trim(),
  description: description.trim(),
  category: category.trim(),
  techStack: techStack || [],
  githubUrl: githubUrl.trim(),
  demo: typeof demo === "string" ? demo.trim() : "",
});

return res.status(201).json({
  success: true,
  message: "Project saved successfully.",
  project,
});

} catch (error) {
console.error("Create project failed:", error.message);

return res.status(500).json({
  success: false,
  message: "Failed to save project.",
});

}
});

// Export Express app for Vercel
module.exports = app;
