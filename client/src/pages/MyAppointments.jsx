import { useEffect, useState } from "react";
import api from "../api/api";

export default function MyAppointments() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/api/appointments/mine").then(r => setList(r.data));
  }, []);

  return (
    <div className="container">
      <h2>My Appointments</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => (
            <tr key={a._id}>
              <td>{a.doctor?.name}</td>
              <td>{a.department?.name}</td>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td><span className="badge">{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
