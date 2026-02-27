import { useEffect, useState } from "react";
import api from "../../api/api";

const empty = { name: "", email: "", phone: "", address: "", password: "" };

export default function AdminPatients() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/admin/patients?q=${encodeURIComponent(q)}`);
      setItems(r.data || []);
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

  const onOpenEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      email: p.email || "",
      phone: p.phone || "",
      address: p.address || "",
      password: "",
    });
    setErr("");
    setOpen(true);
  };

  const onSave = async () => {
    setErr("");
    if (!form.name.trim() || !form.email.trim()) {
      setErr("Please fill name and email.");
      return;
    }

    try {
      if (editing?._id) {
        await api.put(`/admin/patients/${editing._id}`, form);
      } else {
        await api.post("/admin/patients", form);
      }
      setOpen(false);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    await api.delete(`/admin/patients/${id}`);
    load();
  };

  return (
    <div>
      <div className="ad-pageHead">
        <div>
          <div className="ad-h1">Patient Management</div>
          <div className="ad-sub">Manage patient accounts.</div>
        </div>

        <button className="ad-btnPrimary" onClick={onOpenAdd}>
          <i className="fa-solid fa-plus"></i> Add Patient
        </button>
      </div>

      <div className="ad-filters">
        <div className="ad-input">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input placeholder="Search patient name/email..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <button className="ad-btn" onClick={load}>
          <i className="fa-solid fa-filter"></i> Apply
        </button>
      </div>

      <div className="ad-panel">
        {loading ? (
          <div className="ad-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="ad-muted">No patients found.</div>
        ) : (
          <div className="ad-tableWrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="ad-tdMain">
                        <div className="ad-avatarSm">{(p.name || "P")[0].toUpperCase()}</div>
                        <div>
                          <div className="ad-tdTitle">{p.name}</div>
                          <div className="ad-tdSub">{p.address || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.email}</td>
                    <td>{p.phone || "—"}</td>
                    <td className="ad-actionsTd">
                      <button className="ad-iconBtn" onClick={() => onOpenEdit(p)} title="Edit">
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button className="ad-iconBtn danger" onClick={() => onDelete(p._id)} title="Delete">
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

      {open && (
        <div className="ad-modalBackdrop" onClick={() => setOpen(false)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modalHead">
              <div className="ad-modalTitle">{editing ? "Edit Patient" : "Add Patient"}</div>
              <button className="ad-iconBtn" onClick={() => setOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="ad-formGrid">
              <div className="ad-field">
                <label>Name *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>

              <div className="ad-field">
                <label>Email *</label>
                <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>

              <div className="ad-field">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>

              <div className="ad-field">
                <label>Address</label>
                <input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
              </div>

              <div className="ad-field" style={{ gridColumn: "1 / -1" }}>
                <label>Password {editing ? "(optional)" : "(default patient123)"}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder={editing ? "Leave blank to keep same password" : "patient123"}
                />
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