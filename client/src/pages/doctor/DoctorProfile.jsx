import { useEffect, useState } from "react";
import api from "../../api/api";

export default function DoctorProfile() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/doctor/me")
      .then((res) => setForm(res.data))
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load profile"));
  }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    setMsg(""); setErr("");
    try {
      await api.put("/doctor/me", {
        name: form.name,
        specialization: form.specialization,
        experienceYears: form.experienceYears,
        location: form.location,
        nextSlot: form.nextSlot,
        availableStatus: form.availableStatus,
        imageUrl: form.imageUrl,
      });
      setMsg("Profile updated ");
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    }
  };

  if (!form) return <div className="ad-muted">Loading...</div>;

  return (
    <div className="ad-page">
      <div className="ad-headCard">
        <div>
          <div className="ad-headTitle">My Profile</div>
          <div className="ad-muted">Update your doctor details</div>
        </div>
      </div>

      {msg && <div className="ad-successBox">{msg}</div>}
      {err && <div className="ad-errorBox">{err}</div>}

      <div className="ad-card">
        <div className="ad-formGrid">
          <div className="ad-field">
            <label>Name</label>
            <input name="name" value={form.name || ""} onChange={onChange} />
          </div>
          <div className="ad-field">
            <label>Specialization</label>
            <input name="specialization" value={form.specialization || ""} onChange={onChange} />
          </div>
          <div className="ad-field">
            <label>Experience Years</label>
            <input name="experienceYears" value={form.experienceYears || ""} onChange={onChange} />
          </div>
          <div className="ad-field">
            <label>Location</label>
            <input name="location" value={form.location || ""} onChange={onChange} />
          </div>
          <div className="ad-field">
            <label>Next Slot</label>
            <input name="nextSlot" value={form.nextSlot || ""} onChange={onChange} />
          </div>
          <div className="ad-field">
            <label>Status</label>
            <select name="availableStatus" value={form.availableStatus || "Available Today"} onChange={onChange}>
              <option>Available Today</option>
              <option>Available Tomorrow</option>
              <option>On Leave</option>
            </select>
          </div>
          <div className="ad-field">
            <label>Image URL</label>
            <input name="imageUrl" value={form.imageUrl || ""} onChange={onChange} />
          </div>
        </div>

        <div className="ad-modalActions">
          <button className="ad-primary" onClick={save}>
            <i className="fa-regular fa-floppy-disk"></i> Save
          </button>
        </div>
      </div>
    </div>
  );
}