import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { Navigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

export default function Admin() {
  const { user } = useAuth();

  const [branches, setBranches] = useState([]);
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    branch: "CE",
    subject: "Data Structures",
    type: "notes",
    url: "",
    file: null
  });

  useEffect(() => {
    if (user?.role !== "admin") return;

    api.get("/branches")
      .then((res) => setBranches(res.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load branches"));

    api.get("/resources")
      .then((res) => setResources(res.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load resources"));
  }, [user]);

  useEffect(() => {
    const selected = branches.find((b) => b.code === form.branch);
    if (selected?.subjects?.length) {
      setForm((old) => ({ ...old, subject: selected.subjects[0].name }));
    }
  }, [branches, form.branch]);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const selectedBranch = branches.find((b) => b.code === form.branch);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("description", form.description);
      body.append("branch", form.branch);
      body.append("subject", form.subject);
      body.append("type", form.type);
      body.append("url", form.url);
      if (form.file) body.append("file", form.file);

      const res = await api.post("/resources", body, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setResources((old) => [res.data, ...old]);
      setMessage("Resource uploaded successfully.");
      setForm((old) => ({
        ...old,
        title: "",
        description: "",
        url: "",
        file: null
      }));
      document.getElementById("resource-file").value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await api.delete(`/resources/${id}`);
      setResources((old) => old.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="admin-page">
      <section className="admin-header">
        <span className="eyebrow">ADMIN PANEL</span>
        <h1>Manage Learning Resources</h1>
        <p>Upload notes, videos, question papers and other materials.</p>
      </section>

      <section className="admin-content">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="form-error">{error}</div>}

        <form className="admin-form" onSubmit={submit}>
          <h2><Upload size={21} /> Add Resource</h2>

          <label>Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Example: Unit 1 Notes"
          />

          <label>Description</label>
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description"
          />

          <div className="two-col">
            <div>
              <label>Branch</label>
              <select
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              >
                {branches.map((branch) => (
                  <option key={branch.code} value={branch.code}>{branch.code} — {branch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                {selectedBranch?.subjects?.map((subject) => (
                  <option key={subject.name} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>

          <label>Resource Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="notes">Notes</option>
            <option value="videos">Videos</option>
            <option value="qps">Question Papers</option>
            <option value="materials">Materials</option>
          </select>

          <label>External URL (for video/link)</label>
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
          />

          <label>File — PDF/DOC/DOCX/PPT/PPTX/ZIP, max 20 MB</label>
          <input
            id="resource-file"
            type="file"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] || null })}
          />

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload Resource"}
          </button>
        </form>

        <div className="admin-list">
          <h2>Existing Resources</h2>
          {resources.map((resource) => (
            <div className="admin-resource" key={resource._id}>
              <div>
                <strong>{resource.title}</strong>
                <span>{resource.branch} • {resource.subject} • {resource.type}</span>
              </div>
              <button className="delete-btn" onClick={() => remove(resource._id)}>
                <Trash2 size={17} /> Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
