import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [depts, setDepts] = useState([]);

  // doctor profile form
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("Main Hospital");
  const [availableStatus, setAvailableStatus] = useState("Available Today");
  const [nextSlot, setNextSlot] = useState("2:00 PM - 3:00 PM");

  // doctor login user form
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("doctor123");

  const load = async () => {
    const [d1, d2] = await Promise.all([api.get("/api/doctors"), api.get("/api/departments")]);
    setDoctors(d1.data);
    setDepts(d2.data);
    if (!department && d2.data[0]?._id) setDepartment(d2.data[0]._id);
  };

  useEffect(() => { load(); }, []);

  const createDoctor = async (e) => {
    e.preventDefault();

    // 1) create doctor profile
    const res = await api.post("/api/doctors", {
      name,
      department,
      specialization,
      location,
      availableStatus,
      nextSlot
    });

    const doctorId = res.data._id;

    // 2) optionally create doctor login user linked to profile
    if (docEmail.trim()) {
      await api.post("/api/admin/doctor-users", {
        doctorId,
        name,
        email: docEmail,
        password: docPassword
      });
    }

    setName(""); setSpecialization(""); setDocEmail("");
    load();
  };

  const editDoctor = async (id) => {
    const newSlot = prompt("Update Next Slot (ex: 4:00 PM - 5:00 PM)");
    if (!newSlot) return;
    await api.put(`/api/doctors/${id}`, { nextSlot: newSlot });
    load();
  };

  const deleteDoctor = async (id) => {
    if (!confirm("Delete doctor profile?")) return;
    await api.delete(`/api/doctors/${id}`);
    load();
  };

  return (
    <>
      <h2>Doctor Management (CRUD)</h2>

      <form className="card grid" onSubmit={createDoctor} style={{ maxWidth: 560 }}>
        <h3 style={{ marginTop: 0 }}>Add Doctor</h3>

        <input className="input" placeholder="Doctor Name" value={name} onChange={(e) => setName(e.target.value)} required />

        <select className="input" value={department} onChange={(e) => setDepartment(e.target.value)} required>
          {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>

        <input className="input" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
        <input className="input" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className="input" value={availableStatus} onChange={(e) => setAvailableStatus(e.target.value)}>
          <option>Available Today</option>
          <option>Available Tomorrow</option>
          <option>Busy</option>
          <option>On Leave</option>
        </select>
        <input className="input" placeholder="Next Slot (ex: 2:00 PM - 3:00 PM)" value={nextSlot} onChange={(e) => setNextSlot(e.target.value)} />

        <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

        <h3 style={{ margin: 0 }}>Doctor Login (Optional)</h3>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          If you add email + password, doctor can login and manage appointments.
        </p>

        <input className="input" placeholder="Doctor Email (optional)" value={docEmail} onChange={(e) => setDocEmail(e.target.value)} />
        <input className="input" placeholder="Doctor Password" value={docPassword} onChange={(e) => setDocPassword(e.target.value)} />

        <button className="btn btn-primary">Create Doctor</button>
      </form>

      <div className="card" style={{ marginTop: 14 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Department</th><th>Specialization</th><th>Status</th><th>Next Slot</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doc => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.department?.name}</td>
                <td>{doc.specialization}</td>
                <td>{doc.availableStatus}</td>
                <td>{doc.nextSlot}</td>
                <td>
                  <button className="btn" onClick={() => editDoctor(doc._id)}>Edit</button>{" "}
                  <button className="btn" onClick={() => deleteDoctor(doc._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
