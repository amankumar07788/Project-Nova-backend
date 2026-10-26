```javascript
const express = require("express");
const cors = require("cors");
const { connectDB, Project } = require("../db.cjs");

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to ensure Database Connection on every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error in Vercel function:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ProjectNova backend is running with MongoDB!",
  });
});

// GET /api/projects - Retrieve all saved projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects from database",
    });
  }
});

// POST /api/projects - Save a new project
app.post("/api/projects", async (req, res) => {
  try {
    const { title, description, category, techStack, githubUrl, demo } = req.body;

    if (!title || !description || !category || !techStack || !githubUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required project fields",
      });
    }

    const newProject = new Project({
      title,
      description,
      category,
      techStack,
      githubUrl,
      demo: demo || "",
    });

    const saved = await newProject.save();

    res.status(201).json({
      success: true,
      message: "Project saved successfully",
      projectId: saved._id,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save project to database",
    });
  }
});

module.exports = app;
```