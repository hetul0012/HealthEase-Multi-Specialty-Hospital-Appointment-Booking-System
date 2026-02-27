import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

const empty = {
  name: "",
  specialization: "",
  department: "",
  experienceYears: 0,
  location: "",
  availableStatus: "Available",
  nextSlot: "",
  rating: 5,
  reviews: 0,
  imageUrl: "",
};

export default function AdminDoctors() {
  const [q, setQ] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [d1, d2] = await Promise.all([
        api.get("/admin/departments"),
        api.get(`/admin/doctors?q=${encodeURIComponent(q)}&departmentId=${encodeURIComponent(departmentId)}`),
      ]);
      setDepartments(d1.data || []);
      setItems(d2.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
   
  }, []);

  const onOpenAdd = () => {
    setEditing(null);
    setForm(empty);
    setErr("");
    setOpen(true);
  };

  const onOpenEdit = (doc) => {
    setEditing(doc);
    setForm({
      name: doc.name || "",
      specialization: doc.specialization || "",
      department: doc.department?._id || doc.department || "",
      experienceYears: doc.experienceYears || 0,
      location: doc.location || "",
      availableStatus: doc.availableStatus || "Available",
      nextSlot: doc.nextSlot || "",
      rating: doc.rating || 5,
      reviews: doc.reviews || 0,
      imageUrl: doc.imageUrl || "",
    });
    setErr("");
    setOpen(true);
  };

  const onSave = async () => {
    setErr("");
    if (!form.name.trim() || !form.specialization.trim() || !form.department) {
      setErr("Please fill name, specialization, department.");
      return;
    }

    try {
      if (editing?._id) {
        await api.put(`/admin/doctors/${editing._id}`, form);
      } else {
        await api.post("/admin/doctors", form);
      }
      setOpen(false);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await api.delete(`/admin/doctors/${id}`);
    load();
  };

  const deptName = useMemo(() => {
    const m = new Map(departments.map((d) => [d._id, d.name]));
    return (id) => m.get(id) || "—";
  }, [departments]);

  return (
    <div>
      <div className="ad-pageHead">
        <div>
          <div className="ad-h1">Doctor Management</div>
          <div className="ad-sub">Add, edit, or remove doctors.</div>
        </div>

        <button className="ad-btnPrimary" onClick={onOpenAdd}>
          <i className="fa-solid fa-plus"></i> Add Doctor
        </button>
      </div>

      <div className="ad-filters">
        <div className="ad-input">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input placeholder="Search doctor..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <button className="ad-btn" onClick={load}>
          <i className="fa-solid fa-filter"></i> Apply
        </button>
      </div>

      <div className="ad-panel">
        {loading ? (
          <div className="ad-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="ad-muted">No doctors found.</div>
        ) : (
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Specialization</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d._id}>
                    <td>
                      <div className="ad-tdMain">
                        <div className="ad-avatarSm">
                          {(d.name || "D")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="ad-tdTitle">{d.name}</div>
                          <div className="ad-tdSub">{d.location || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td>{d.department?.name || deptName(d.department)}</td>
                    <td>{d.specialization}</td>
                    <td>
                      <span className={`ad-pill ${String(d.availableStatus).toLowerCase().includes("leave") ? "warn" : "ok"}`}>
                        {d.availableStatus || "Available"}
                      </span>
                    </td>
                    <td className="ad-actionsTd">
                      <button className="ad-iconBtn" onClick={() => onOpenEdit(d)} title="Edit">
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button className="ad-iconBtn danger" onClick={() => onDelete(d._id)} title="Delete">
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="ad-modalBackdrop" onClick={() => setOpen(false)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modalHead">
              <div className="ad-modalTitle">{editing ? "Edit Doctor" : "Add Doctor"}</div>
              <button className="ad-iconBtn" onClick={() => setOpen(false)} title="Close">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="ad-formGrid">
              <div className="ad-field">
                <label>Name *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="ad-field">
                <label>Specialization *</label>
                <input
                  value={form.specialization}
                  onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                />
              </div>

              <div className="ad-field">
                <label>Department *</label>
                <select value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}>
                  <option value="">Select</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ad-field">
                <label>Experience (years)</label>
                <input
                  type="number"
                  value={form.experienceYears}
                  onChange={(e) => setForm((p) => ({ ...p, experienceYears: Number(e.target.value) }))}
                />
              </div>

              <div className="ad-field">
                <label>Location</label>
                <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
              </div>

              <div className="ad-field">
                <label>Status</label>
                <select
                  value={form.availableStatus}
                  onChange={(e) => setForm((p) => ({ ...p, availableStatus: e.target.value }))}
                >
                  <option>Available</option>
                  <option>Busy</option>
                  <option>On Leave</option>
                </select>
              </div>

              <div className="ad-field">
                <label>Next Slot</label>
                <input value={form.nextSlot} onChange={(e) => setForm((p) => ({ ...p, nextSlot: e.target.value }))} />
              </div>

              <div className="ad-field">
                <label>Image URL (optional)</label>
                <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} />
              </div>
            </div>

            {err && <div className="ad-errorBox">{err}</div>}

            <div className="ad-modalFoot">
              <button className="ad-btn" onClick={() => setOpen(false)}>Cancel</button>
              <button className="ad-btnPrimary" onClick={onSave}>
                <i className="fa-solid fa-floppy-disk"></i> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}