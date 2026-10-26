```javascript
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://amankumar07788:Aman%402004@cluster0.bquvg.mongodb.net/projectnova?retryWrites=true&w=majority";

let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("Successfully connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
}

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, required: true },
    demo: { type: String, default: "" },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection middleware failed:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ProjectNova backend is running with MongoDB!",
  });
});

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