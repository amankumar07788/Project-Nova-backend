const express = require("express");
const cors = require("cors");
const { connectDB, getDB } = require("./db.cjs");

const {
  initializeApp,
  getApps,
  cert,
} = require("firebase-admin/app");

const { getAuth } = require("firebase-admin/auth");

const app = express();
const PORT = process.env.PORT || 10000;

// ---------------- Firebase Admin Initialization ----------------

try {
  if (getApps().length === 0) {
    const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountJSON) {
      console.error(
        "FIREBASE_SERVICE_ACCOUNT is missing. Protected routes are unavailable."
      );
    } else {
      let rawEnv = serviceAccountJSON.trim();

      // Remove surrounding quotes if present.
      if (
        (rawEnv.startsWith('"') && rawEnv.endsWith('"')) ||
        (rawEnv.startsWith("'") && rawEnv.endsWith("'"))
      ) {
        rawEnv = rawEnv.slice(1, -1);
      }

      // Parse Firebase service-account JSON.
      const serviceAccount = JSON.parse(rawEnv);

      // Normalize escaped newlines in the private key.
      if (serviceAccount.private_key) {
        serviceAccount.private_key =
          serviceAccount.private_key.replace(/\\n/g, "\n");
      }

      // Initialize Firebase Admin.
      initializeApp({
        credential: cert(serviceAccount),
      });

      console.log("Firebase Admin initialized successfully");
    }
  }
} catch (error) {
  console.error(
    "Firebase initialization error:",
    error.message
  );
}

// ---------------- Middleware ----------------

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

// ---------------- Firebase Authentication Middleware ----------------

async function requireFirebaseAuth(req, res, next) {
  try {
    if (getApps().length === 0) {
      return res.status(503).json({
        success: false,
        message: "Authentication service is not configured",
      });
    }

    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const decodedToken = await getAuth().verifyIdToken(match[1]);

    req.user = decodedToken;

    return next();
  } catch (error) {
    console.error(
      "Firebase token verification failed:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired login token",
    });
  }
}

// ---------------- Home Route ----------------

app.get("/", (req, res) => {
  return res.status(200).json({
    name: "ProjectNova API",
    status: "Backend is running",
    message: "Welcome to ProjectNova API",
  });
});

// ---------------- Health Check ----------------

app.get("/api/health", async (req, res) => {
  try {
    await connectDB();

    return res.status(200).json({
      success: true,
      status: "OK",
      database: "connected",
      firebaseAdmin:
        getApps().length > 0
          ? "initialized"
          : "not_configured",
      message: "ProjectNova backend is running",
    });
  } catch (error) {
    console.error(
      "Database connection error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      status: "ERROR",
      message: "Database connection failed",
    });
  }
});

// ---------------- Get Projects (Public) ----------------

app.get("/api/projects", async (req, res) => {
  try {
    await connectDB();

    const db = getDB();

    const projects = await db
      .collection("projects")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error(
      "Fetch projects error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Could not fetch projects",
    });
  }
});

// ---------------- Add Project (Login Required) ----------------

app.post(
  "/api/projects",
  requireFirebaseAuth,
  async (req, res) => {
    try {
      await connectDB();

      const {
        title,
        description,
        techStack,
        githubUrl,
        category,
      } = req.body || {};

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string" ||
        !description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required",
        });
      }

      if (
        techStack !== undefined &&
        (!Array.isArray(techStack) ||
          !techStack.every(
            (item) => typeof item === "string"
          ))
      ) {
        return res.status(400).json({
          success: false,
          message: "techStack must be an array of strings",
        });
      }

      const project = {
        title: title.trim(),
        description: description.trim(),
        techStack: techStack || [],
        githubUrl:
          typeof githubUrl === "string"
            ? githubUrl.trim()
            : "",
        category:
          typeof category === "string" && category.trim()
            ? category.trim()
            : "Other",
        userId: req.user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const db = getDB();

      const result = await db
        .collection("projects")
        .insertOne(project);

      return res.status(201).json({
        success: true,
        message: "Project saved successfully",
        projectId: result.insertedId,
      });
    } catch (error) {
      console.error(
        "Add project error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Could not save project",
      });
    }
  }
);

// ---------------- Start Server ----------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ProjectNova server running on port ${PORT}`);
});