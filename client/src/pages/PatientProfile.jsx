import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function PatientProfile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setErr("");
      setMsg("");

      try {
        // Try common "me" endpoints
        let res;
        try {
          res = await api.get("/auth/me");
        } catch {
          try {
            res = await api.get("/api/auth/me");
          } catch {
            res = await api.get("/users/me");
          }
        }

        const data = res?.data || {};
        if (!mounted) return;

        const profile = {
          name: data.name || data.fullName || user?.name || "",
          email: data.email || user?.email || "",
          phone: data.phone || data.mobile || user?.phone || "",
          address: data.address || user?.address || "",
        };

        setForm(profile);

        //  update AuthContext + localStorage
        updateUser({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
        });
      } catch (e) {
        if (!mounted) return;

        // fallback: use existing user from context/localStorage
        const fallback = {
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: user?.address || "",
        };
        setForm(fallback);

        setErr(e?.response?.data?.message || "Failed to load profile. Using saved login details.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const onSave = async () => {
    setSaving(true);
    setErr("");
    setMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setSaving(false);
      setErr("Please fill Name, Email, and Phone.");
      return;
    }

    try {
      let res;

      // Try common update endpoints
      try {
        res = await api.patch("/users/me", form);
      } catch {
        try {
          res = await api.patch("/auth/me", form);
        } catch {
          res = await api.patch("/api/auth/me", form);
        }
      }

      const updated = res?.data || form;

      setMsg("Profile updated successfully!");

      //  update AuthContext + localStorage (navbar will update)
      updateUser({
        name: updated.name || form.name,
        email: updated.email || form.email,
        phone: updated.phone || form.phone,
        address: updated.address || form.address,
      });
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          (e?.response?.status === 401 ? "Please login again." : "Update failed. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: "26px 18px" }}>
        <h1 className="page-title">Patient Profile</h1>
        <p className="page-subtitle">Update your basic details (name, email, phone).</p>

        <div className="card" style={{ padding: 18, maxWidth: 720 }}>
          {loading ? (
            <div style={{ color: "#64748b" }}>Loading profile...</div>
          ) : (
            <>
              <div className="filter-grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Full Name</label>
                  <input className="input" value={form.name} onChange={onChange("name")} />
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Email</label>
                  <input className="input" value={form.email} onChange={onChange("email")} />
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Phone Number</label>
                  <input className="input" value={form.phone} onChange={onChange("phone")} />
                </div>

                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label>Address (optional)</label>
                  <input className="input" value={form.address} onChange={onChange("address")} />
                </div>
              </div>

              {err && (
                <div className="card" style={{ padding: 12, marginTop: 14, background: "#fff1f2", color: "#991b1b" }}>
                  {err}
                </div>
              )}

              {msg && (
                <div className="card" style={{ padding: 12, marginTop: 14, background: "#ecfdf5", color: "#065f46" }}>
                  {msg}
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: "100%", height: 44, marginTop: 14 }}
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}