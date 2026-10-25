import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/projects";

const initialProjects = [
  {
    name: "AI Assistant",
    category: "Artificial Intelligence",
    icon: "🤖",
    description:
      "An AI-powered assistant designed to help users automate tasks and find information.",
    tech: ["React", "Python", "AI"],
    github: "https://github.com/",
    demo: "https://github.com/",
  },
  {
    name: "Smart IoT System",
    category: "Internet of Things",
    icon: "📡",
    description:
      "Monitor sensor data and explore smart temperature monitoring using connected devices.",
    tech: ["ESP32", "DHT22", "IoT"],
    github: "https://github.com/",
    demo: "https://github.com/",
  },
  {
    name: "Developer Portfolio",
    category: "Web Development",
    icon: "💻",
    description:
      "A responsive portfolio for showcasing skills, projects, achievements, and experience.",
    tech: ["React", "CSS", "JavaScript"],
    github: "https://github.com/",
    demo: "https://github.com/",
  },
  {
    name: "VLSI Design Lab",
    category: "Electronics",
    icon: "⚡",
    description:
      "Explore digital logic design, hardware description languages, and FPGA projects.",
    tech: ["Verilog", "Digital Design", "FPGA"],
    github: "https://github.com/",
    demo: "https://github.com/",
  },
  {
    name: "Android App",
    category: "Mobile Development",
    icon: "📱",
    description:
      "A mobile application concept with a user-friendly interface and useful features.",
    tech: ["Android", "Kotlin", "Mobile UI"],
    github: "https://github.com/",
    demo: "https://github.com/",
  },
  {
    name: "Data Analytics",
    category: "Data Science",
    icon: "📊",
    description:
      "Analyze datasets and discover useful insights through data processing and visualization.",
    tech: ["Python", "Pandas", "Analytics"],
    github: "https://github.com/",
    demo: "https://github.com/",
  },
];

const categories = [
  "Web Development",
  "Artificial Intelligence",
  "Internet of Things",
  "Electronics",
  "Mobile Development",
  "Data Science",
  "Other",
];

function normalizeProject(project) {
  return {
    ...project,
    name: project.name ?? project.title ?? "Untitled Project",
    category: project.category ?? "Other",
    icon: project.icon ?? "🚀",
    description: project.description ?? "",
    tech: Array.isArray(project.tech)
      ? project.tech
      : Array.isArray(project.techStack)
        ? project.techStack
        : [],
    github: project.github ?? project.githubUrl ?? "",
    demo: project.demo ?? "",
  };
}

export default function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Web Development",
    description: "",
    tech: "",
    github: "",
    demo: "",
  });

  // MongoDB se saved projects load karo.
  async function loadProjects() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Projects load nahi ho paaye.");
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.projects)) {
        throw new Error("Backend se unexpected response mila.");
      }

      const savedProjects = data.projects.map(normalizeProject);

      setProjects([
        ...savedProjects,
        ...initialProjects,
      ]);

      setApiConnected(true);
    } catch (error) {
      console.error("Load projects error:", error);
      setApiConnected(false);
      setMessage(
        "Backend connect nahi hua. MongoDB aur backend server check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = projects.filter((project) =>
    `${project.name} ${project.category} ${project.tech.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Project ko backend ke through MongoDB mein save karo.
  async function submitProject(event) {
    event.preventDefault();

    if (saving) return;

    const newProject = {
      title: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      techStack: form.tech
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      githubUrl: form.github.trim(),
    };

    if (form.demo.trim()) {
      newProject.demo = form.demo.trim();
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Project save nahi ho paaya."
        );
      }

      const savedProject = normalizeProject({
        ...newProject,
        _id: data.projectId,
        name: newProject.title,
        github: newProject.githubUrl,
        icon: "🚀",
        demo: newProject.demo ?? "",
      });

      setProjects((previous) => [
        savedProject,
        ...previous,
      ]);

      setSearch("");
      setShowForm(false);
      setSelectedProject(savedProject);
      setApiConnected(true);
      setMessage("Project successfully MongoDB mein save ho gaya! 🎉");

      setForm({
        name: "",
        category: "Web Development",
        description: "",
        tech: "",
        github: "",
        demo: "",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Save project error:", error);

      setMessage(
        `Project save nahi hua: ${error.message}. Backend aur MongoDB check karo.`
      );
    } finally {
      setSaving(false);
    }
  }

  function openSubmitForm() {
    setSelectedProject(null);
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToExplore() {
    setSelectedProject(null);
    setShowForm(false);
    setMessage("");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a
          className="logo"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            goToExplore();
          }}
        >
          Project<span>Nova</span>
        </a>

        <div className="nav-links">
          <a href="#explore" onClick={goToExplore}>
            Explore
          </a>

          <a href="#about" onClick={goToExplore}>
            About
          </a>

          <button
            className="login-btn"
            onClick={() =>
              alert(
                "Login and account creation will be added in a future step."
              )
            }
          >
            Login
          </button>
        </div>
      </nav>

      <main>
        {message && (
          <div className="notice" role="status">
            {message}

            <button
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <div className="api-status">
          <span
            className={`status-dot ${
              apiConnected ? "connected" : "disconnected"
            }`}
          />

          {loading
            ? "Connecting to ProjectNova..."
            : apiConnected
              ? "ProjectNova database connected"
              : "Database connection unavailable"}
        </div>

        {selectedProject ? (
          <section className="detail-panel">
            <button className="back-btn" onClick={goToExplore}>
              ← Back to Projects
            </button>

            <div className="detail-icon">
              {selectedProject.icon}
            </div>

            <span className="category">
              {selectedProject.category}
            </span>

            <h1>{selectedProject.name}</h1>

            <p className="detail-description">
              {selectedProject.description}
            </p>

            <h3>Technology Stack</h3>

            <div className="tech-list">
              {selectedProject.tech.length > 0 ? (
                selectedProject.tech.map((tech, index) => (
                  <span
                    className="tech-tag"
                    key={`${tech}-${index}`}
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <span>No technologies specified.</span>
              )}
            </div>

            <div className="detail-links">
              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              )}

              {selectedProject.demo && (
                <a
                  href={selectedProject.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo ↗
                </a>
              )}
            </div>
          </section>
        ) : showForm ? (
          <section className="form-section">
            <button className="back-btn" onClick={goToExplore}>
              ← Back to Projects
            </button>

            <span className="tag">SHARE YOUR WORK</span>

            <h1>Submit a Project</h1>

            <p className="form-intro">
              Showcase what you have built with the ProjectNova community.
            </p>

            <form
              className="project-form"
              onSubmit={submitProject}
            >
              <label htmlFor="project-name">
                Project Name *
              </label>

              <input
                id="project-name"
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="e.g. Smart Temperature Monitor"
                required
                maxLength={100}
              />

              <label htmlFor="project-category">
                Category *
              </label>

              <select
                id="project-category"
                name="category"
                value={form.category}
                onChange={updateForm}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="project-description">
                Description *
              </label>

              <textarea
                id="project-description"
                name="description"
                value={form.description}
                onChange={updateForm}
                placeholder="Explain what your project does..."
                required
                rows={4}
                maxLength={1000}
              />

              <label htmlFor="project-tech">
                Technology Stack * (comma-separated)
              </label>

              <input
                id="project-tech"
                name="tech"
                value={form.tech}
                onChange={updateForm}
                placeholder="React, Python, ESP32"
                required
              />

              <label htmlFor="project-github">
                GitHub URL *
              </label>

              <input
                id="project-github"
                name="github"
                type="url"
                value={form.github}
                onChange={updateForm}
                placeholder="https://github.com/username/repository"
                required
              />

              <label htmlFor="project-demo">
                Live Demo URL (optional)
              </label>

              <input
                id="project-demo"
                name="demo"
                type="url"
                value={form.demo}
                onChange={updateForm}
                placeholder="https://your-project.example"
              />

              <button
                className="submit-btn"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving Project..."
                  : "Publish Project ↗"}
              </button>
            </form>
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="tag">
                ✦ THE HOME FOR INNOVATION
              </div>

              <h1>
                Discover ideas.
                <br />
                <span>Build the future.</span>
              </h1>

              <p>
                Explore innovative projects, discover new technologies,
                and share what you build with the world.
              </p>

              <div className="search-box">
                <span>⌕</span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search projects, technologies..."
                  aria-label="Search projects"
                />

                {search && (
                  <button
                    className="clear-search"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <a className="explore-btn" href="#explore">
                Explore Projects ↗
              </a>
            </section>

            <section className="projects" id="explore">
              <div className="section-heading">
                <div>
                  <span className="tag">DISCOVER</span>
                  <h2>Explore Projects</h2>
                </div>

                <span className="count">
                  {filtered.length} projects
                </span>
              </div>

              {loading && (
                <p className="loading-message">
                  Checking saved projects...
                </p>
              )}

              <div className="project-grid">
                {filtered.map((project, index) => (
                  <article
                    className="project-card"
                    key={
                      project._id ??
                      `${project.name}-${project.category}-${index}`
                    }
                  >
                    <div className="project-icon">
                      {project.icon}
                    </div>

                    <span className="category">
                      {project.category}
                    </span>

                    <h3>{project.name}</h3>

                    <p>{project.description}</p>

                    <div className="card-tech">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <span
                          className="tech-tag"
                          key={`${tech}-${techIndex}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedProject(project);
                        setMessage("");

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      View Project ↗
                    </button>
                  </article>
                ))}

                {filtered.length === 0 && (
                  <div className="empty-state">
                    <h3>No projects found</h3>

                    <p>
                      Try another keyword or publish a new project.
                    </p>

                    <button
                      className="submit-btn"
                      onClick={openSubmitForm}
                    >
                      Submit a Project +
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="about" id="about">
              <span className="tag">
                YOUR NEXT IDEA STARTS HERE
              </span>

              <h2>Have something to build?</h2>

              <p>
                Share your project, showcase your skills, and inspire
                other creators.
              </p>

              <button onClick={openSubmitForm}>
                Submit Your Project +
              </button>
            </section>
          </>
        )}
      </main>

      <footer>
        © 2026 ProjectNova · Built for creators.
      </footer>
    </div>
  );
}