const express = require("express");
const cors = require("cors");
const { connectDB, getDB } = require("./db.cjs");
const admin = require("firebase-admin");

// Safe Firebase Initialization
try {
  // Check if admin is imported and apps array exists
  if (admin && admin.apps && !admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      let serviceAccount;
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (e) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.trim());
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully");
    } else {
      console.warn("WARNING: FIREBASE_SERVICE_ACCOUNT environment variable is missing!");
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error.message);
}

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    name: "ProjectNova API",
    status: "Backend is running",
    message: "Welcome to ProjectNova API"
  });
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({
      success: true,
      status: "OK",
      database: "connected",
      message: "ProjectNova backend is running"
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({
      success: false,
      status: "ERROR",
      message: "Database connection failed"
    });
  }
});

// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    await connectDB();
    const db = getDB();
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error("Fetch projects error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not fetch projects"
    });
  }
});

// Add a project
app.post("/api/projects", async (req, res) => {
  try {
    await connectDB();
    const {
      title,
      description,
      techStack,
      githubUrl,
      category
    } = req.body || {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    if (
      techStack !== undefined &&
      (!Array.isArray(techStack) ||
        !techStack.every((item) => typeof item === "string"))
    ) {
      return res.status(400).json({
        success: false,
        message: "techStack must be an array of strings"
      });
    }

    const project = {
      title: title.trim(),
      description: description.trim(),
      techStack: techStack || [],
      githubUrl:
        typeof githubUrl === "string" ? githubUrl.trim() : "",
      category:
        typeof category === "string" && category.trim()
          ? category.trim()
          : "Other",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = getDB();
    const result = await db.collection("projects").insertOne(project);

    res.status(201).json({
      success: true,
      message: "Project saved successfully",
      projectId: result.insertedId
    });
  } catch (error) {
    console.error("Add project error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not save project"
    });
  }
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`ProjectNova server running on port ${PORT}`);
});