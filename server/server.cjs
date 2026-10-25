console.log("ProjectNova server.js is starting...");
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const { connectDB, getDB } = require("./db.cjs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
res.json({
name: "ProjectNova API",
message: "Welcome to ProjectNova!",
status: "Backend is running"
});
});

// Health check API
app.get("/health", (req, res) => {
res.json({
status: "OK",
message: "ProjectNova server is healthy"
});
});

// GET: All projects
app.get("/api/projects", async (req, res) => {
try {
const db = getDB();

const projects = await db
  .collection("projects")
  .find({})
  .sort({ createdAt: -1 })
  .toArray();

res.json({
  success: true,
  count: projects.length,
  projects
});

} catch (error) {
console.error("Fetch projects error:", error.message);

res.status(500).json({
  success: false,
  message: "Could not fetch projects."
});

}
});

// GET: Single project by ID
app.get("/api/projects/:id", async (req, res) => {
try {
if (!ObjectId.isValid(req.params.id)) {
return res.status(400).json({
success: false,
message: "Invalid project ID."
});
}

const db = getDB();

const project = await db.collection("projects").findOne({
  _id: new ObjectId(req.params.id)
});

if (!project) {
  return res.status(404).json({
    success: false,
    message: "Project not found."
  });
}

res.json({
  success: true,
  project
});

} catch (error) {
console.error("Get project error:", error.message);

res.status(500).json({
  success: false,
  message: "Could not fetch project."
});

}
});

// POST: Add a new project
app.post("/api/projects", async (req, res) => {
try {
const { title, description, techStack, githubUrl, category } = req.body;

if (
  typeof title !== "string" ||
  !title.trim() ||
  typeof description !== "string" ||
  !description.trim()
) {
  return res.status(400).json({
    success: false,
    message: "Title and description are required."
  });
}

const project = {
  title: title.trim(),
  description: description.trim(),
  techStack: Array.isArray(techStack)
    ? techStack.filter(item => typeof item === "string")
    : [],
  githubUrl: typeof githubUrl === "string" ? githubUrl.trim() : "",
  category: typeof category === "string" ? category.trim() : "Other",
  createdAt: new Date(),
  updatedAt: new Date()
};

const db = getDB();

const result = await db.collection("projects").insertOne(project);

res.status(201).json({
  success: true,
  message: "Project saved successfully!",
  projectId: result.insertedId
});

} catch (error) {
console.error("Add project error:", error.message);

res.status(500).json({
  success: false,
  message: "Could not save project."
});

}
});

// PUT: Update a project
app.put("/api/projects/:id", async (req, res) => {
try {
if (!ObjectId.isValid(req.params.id)) {
return res.status(400).json({
success: false,
message: "Invalid project ID."
});
}

const { title, description, techStack, githubUrl, category } = req.body;
const updates = {};

if (typeof title === "string" && title.trim()) {
  updates.title = title.trim();
}

if (typeof description === "string" && description.trim()) {
  updates.description = description.trim();
}

if (Array.isArray(techStack)) {
  updates.techStack = techStack.filter(item => typeof item === "string");
}

if (typeof githubUrl === "string") {
  updates.githubUrl = githubUrl.trim();
}

if (typeof category === "string") {
  updates.category = category.trim();
}

if (Object.keys(updates).length === 0) {
  return res.status(400).json({
    success: false,
    message: "Provide at least one valid field to update."
  });
}

updates.updatedAt = new Date();

const db = getDB();

const result = await db.collection("projects").updateOne(
  { _id: new ObjectId(req.params.id) },
  { $set: updates }
);

if (result.matchedCount === 0) {
  return res.status(404).json({
    success: false,
    message: "Project not found."
  });
}

res.json({
  success: true,
  message: "Project updated successfully."
});

} catch (error) {
console.error("Update project error:", error.message);

res.status(500).json({
  success: false,
  message: "Could not update project."
});

}
});

// DELETE: Remove a project
app.delete("/api/projects/:id", async (req, res) => {
try {
if (!ObjectId.isValid(req.params.id)) {
return res.status(400).json({
success: false,
message: "Invalid project ID."
});
}

const db = getDB();

const result = await db.collection("projects").deleteOne({
  _id: new ObjectId(req.params.id)
});

if (result.deletedCount === 0) {
  return res.status(404).json({
    success: false,
    message: "Project not found."
  });
}

res.json({
  success: true,
  message: "Project deleted successfully."
});

} catch (error) {
console.error("Delete project error:", error.message);

res.status(500).json({
  success: false,
  message: "Could not delete project."
});

}
});

// Start backend after MongoDB connects
async function startServer() {
try {
await connectDB();

app.listen(PORT, () => {
  console.log(`ProjectNova backend: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Projects API: http://localhost:${PORT}/api/projects`);
});

} catch (error) {
console.error("Backend could not start. Check MongoDB.");
process.exit(1);
}
}

startServer();