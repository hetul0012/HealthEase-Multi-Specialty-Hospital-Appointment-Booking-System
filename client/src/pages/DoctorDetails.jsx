import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function DoctorDetails() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    api.get(`/api/doctors/${id}`).then(r => setDoc(r.data));
  }, [id]);

  if (!doc) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="card" style={{ padding: 18 }}>
        <h2 style={{ marginTop: 0 }}>{doc.name}</h2>
        <p style={{ color: "var(--muted)" }}>{doc.specialization} • {doc.department?.name}</p>
        <div className="row">
          <span className="badge">{doc.availableStatus}</span>
          <span className="badge">⭐ {doc.rating}</span>
          <span className="badge">{doc.experienceYears}+ Years</span>
        </div>

        <p style={{ marginTop: 10, color: "var(--muted)" }}>
          Location: {doc.location}
        </p>
        <p><b>Next Slot:</b> {doc.nextSlot}</p>

        <a className="btn btn-primary" href={`/book/${doc._id}`}>Book Appointment</a>
      </div>
    </div>
  );
}
