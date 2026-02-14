import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const nav = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Consultation");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/appointments/book", { doctorId, date, time, type, reason });
      setMsg(" Appointment booked!");
      setTimeout(() => nav("/appointments"), 800);
    } catch (e) {
      setMsg(e.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2>Book Appointment</h2>
        {msg && <p style={{ color: msg.includes("✅") ? "green" : "red" }}>{msg}</p>}
        <form className="grid" onSubmit={submit}>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input className="input" placeholder="Time (ex: 10:30 AM)" value={time} onChange={(e) => setTime(e.target.value)} required />
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Consultation</option>
            <option>Follow-up</option>
            <option>Check-up</option>
          </select>
          <textarea className="input" placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button className="btn btn-primary">Confirm</button>
        </form>
      </div>
    </div>
  );
}
