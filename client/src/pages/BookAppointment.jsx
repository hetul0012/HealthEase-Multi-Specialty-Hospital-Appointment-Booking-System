import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function fmtDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function BookAppointment() {
  const { doctorId } = useParams(); // matches App.jsx /book/:doctorId
  const nav = useNavigate();

  const [doctor, setDoctor] = useState(null);

  // calendar state
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("Follow-up Visit");
  const [notes, setNotes] = useState("");

  // patient form
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load doctor
  useEffect(() => {
    api
      .get(`/doctors/${doctorId}`) //  NO /api here
      .then((res) => setDoctor(res.data))
      .catch(() => setDoctor(null));
  }, [doctorId]);

  // calendar days
  const calDays = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const days = [];
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(y, m, d));
    return days;
  }, [month]);

  const monthLabel = useMemo(() => {
    return month.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [month]);

  const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const reasons = ["General Checkup", "Follow-up Visit", "Consultation", "Lab Tests", "Other"];

  const canConfirm =
    selectedDate &&
    selectedTime &&
    reason &&
    patientName.trim() &&
    patientEmail.trim() &&
    patientPhone.trim();

  const onConfirm = async () => {
    setMessage("");
    if (!canConfirm) {
      setMessage("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);

      //  This matches backend expectation (recommended)
      await api.post("/appointments", {
        doctorId,
        patientName,
        patientEmail,
        patientPhone,
        date: selectedDate,
        time: selectedTime,
        reason,
        notes,
      });

      setMessage(" Appointment confirmed!");
      setTimeout(() => nav("/appointments"), 700);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        (e?.response?.status === 401 ? "Please login again." : "Failed to book. Please try again.");
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: "26px 18px" }}>
        <h1 className="page-title">Book Your Appointment</h1>
        <p className="page-subtitle">Select your preferred date, time, and reason for visit</p>

        <div className="book-layout">
          {/* LEFT */}
          <div className="card book-card">
            {/* Date */}
            <div className="section-block">
              <p className="section-label"> Select Date</p>

              <div className="calendar">
                <div className="cal-head">
                  <button
                    className="cal-nav"
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                    type="button"
                  >
                    ‹
                  </button>

                  <div>{monthLabel}</div>

                  <button
                    className="cal-nav"
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    type="button"
                  >
                    ›
                  </button>
                </div>

                <div className="cal-grid" style={{ fontWeight: 900 }}>
                  {weekLabels.map((w) => (
                    <div key={w} style={{ textAlign: "center" }}>
                      {w}
                    </div>
                  ))}
                </div>

                <div className="cal-grid" style={{ marginTop: 8 }}>
                  {calDays.map((d, idx) => {
                    if (!d) return <div key={idx} />;
                    const value = fmtDate(d);
                    const active = value === selectedDate;

                    return (
                      <div
                        key={value}
                        className={`cal-day ${active ? "active" : ""}`}
                        onClick={() => setSelectedDate(value)}
                      >
                        {d.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="section-block">
              <p className="section-label"> Select Time Slot</p>

              <div className="time-grid">
                {times.map((t) => (
                  <button
                    key={t}
                    className={`time-btn ${selectedTime === t ? "active" : ""}`}
                    onClick={() => setSelectedTime(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="section-block">
              <p className="section-label"> Reason for Visit</p>

              <div className="reason-list">
                {reasons.map((r) => (
                  <div
                    key={r}
                    className="reason-item"
                    onClick={() => setReason(r)}
                    style={{
                      borderColor: reason === r ? "#2563eb" : "var(--line)",
                      background: reason === r ? "#eef5ff" : "#fff",
                    }}
                  >
                    <input type="radio" checked={reason === r} readOnly />
                    <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 13 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient */}
            <div className="section-block">
              <p className="section-label">👤 Patient Details</p>

              <div className="filter-grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
                <div className="field">
                  <label>Full Name</label>
                  <input className="input" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                </div>

                <div className="field">
                  <label>Phone</label>
                  <input className="input" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} />
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Email</label>
                  <input className="input" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="section-block">
              <p className="section-label">Additional Notes (Optional)</p>
              <textarea
                className="textarea"
                placeholder="Any specific concerns or information you'd like to share..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {message && (
              <div className="card" style={{ padding: 12, marginTop: 14, background: "#f8fafc" }}>
                {message}
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: "100%", height: 44, marginTop: 14 }}
              onClick={onConfirm}
              disabled={!canConfirm || saving}
              type="button"
            >
              {saving ? "Confirming..." : "Confirm Appointment"}
            </button>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="card summary-card">
            <p className="section-title">Appointment Summary</p>

            <div className="summary-row">
              <div>
                <b>Date</b>
                <div style={{ color: "#64748b" }}>{selectedDate || "Not selected"}</div>
              </div>
            </div>

            <div className="summary-row">
              <div>
                <b>Time</b>
                <div style={{ color: "#64748b" }}>{selectedTime || "Not selected"}</div>
              </div>
            </div>

            <div className="summary-row">
              <div>
                <b>Reason</b>
                <div style={{ color: "#64748b" }}>{reason || "Not selected"}</div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="summary-row">
              <span>🩺</span>
              <div>
                <b>Doctor</b>
                <div style={{ color: "#64748b" }}>{doctor?.name || "Loading..."}</div>
              </div>
            </div>

            <div className="small-note">You’ll receive a confirmation email after booking.</div>
          </div>
        </div>
      </div>
    </div>
  );
}