import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "../styles/custom.module.css";

export function AuthModal({
  show,
  initialMode = "login",
  onClose,
  onLoginSuccess,
}) {
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "devotee",
    hotelName: "",
    contactPhone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSignup(initialMode === "signup");
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "devotee",
      hotelName: "",
      contactPhone: "",
    });
  }, [initialMode, show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await axios.post(endpoint, formData);

      if (res.data.pendingApproval) {
        toast.success(
          res.data.message ||
            "Registration Submitted! Pending Admin Verification.",
          { duration: 6000 },
        );
        setIsSignup(false); // Switch to Sign In view
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "devotee",
          hotelName: "",
          contactPhone: "",
        });
        return;
      }

      if (res.data.token) {
        localStorage.setItem("mahakal_token", res.data.token);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.token}`;
      }
      toast.success(
        res.data.message ||
          (isSignup
            ? "Account registered successfully!"
            : "Welcome back! Logged in successfully."),
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "devotee",
        hotelName: "",
        contactPhone: "",
      });
      onLoginSuccess(res.data.user);
      onClose();
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Authentication failed. Please check your details.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block tab-index-1"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1070 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-black border border-warning border-opacity-50 text-white rounded-4 p-3 shadow-2xl">
          <div className="modal-header border-bottom border-secondary border-opacity-25 pb-3">
            <h5
              className={`modal-title text-warning fw-bold ${styles.playfairFont}`}
            >
              {isSignup ? "Create Portal Account" : "Devotee & Partner Sign In"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-3">
              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Single Horizontal Line Role Selector with Lucide SVG Icons */}
              {isSignup && (
                <div className="mb-3">
                  <label className="form-label text-secondary small d-block mb-1.5 fw-semibold">
                    Select Account Type:
                  </label>
                  <div className="d-flex gap-2 flex-nowrap bg-dark p-1 rounded-pill border border-secondary border-opacity-40">
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill flex-fill py-2 px-3 d-inline-flex align-items-center justify-content-center font-semibold text-nowrap transition-all ${
                        formData.role === "devotee"
                          ? "btn-warning text-dark fw-bold shadow-sm"
                          : "text-light border-0 opacity-75 hover-opacity-100"
                      }`}
                      style={{ fontSize: "0.82rem" }}
                      onClick={() =>
                        setFormData({ ...formData, role: "devotee" })
                      }
                    >
                      <User size={15} className="me-1.5" /> Devotee Account
                    </button>

                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill flex-fill py-2 px-3 d-inline-flex align-items-center justify-content-center font-semibold text-nowrap transition-all ${
                        formData.role === "hotel"
                          ? "btn-warning text-dark fw-bold shadow-sm"
                          : "text-light border-0 opacity-75 hover-opacity-100"
                      }`}
                      style={{ fontSize: "0.82rem" }}
                      onClick={() =>
                        setFormData({ ...formData, role: "hotel" })
                      }
                    >
                      <Building size={15} className="me-1.5" /> Hotel Partner
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name */}
              {isSignup && (
                <div className="mb-3">
                  <label className="form-label text-secondary small">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary border-opacity-50 text-warning">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary border-opacity-50"
                      placeholder="e.g. Ramesh Sharma"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Hotel Specific Inputs */}
              {isSignup && formData.role === "hotel" && (
                <>
                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Hotel / Dharamshala Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary border-opacity-50 text-warning">
                        <Building size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary border-opacity-50"
                        placeholder="e.g. Shri Mahakal Bhawan Dharamshala"
                        required
                        value={formData.hotelName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hotelName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Contact Mobile Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary border-opacity-50 text-warning">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        className="form-control bg-dark text-white border-secondary border-opacity-50"
                        placeholder="+91 9876543210"
                        required
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="mb-3">
                <label className="form-label text-secondary small">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-warning">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary border-opacity-50"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label text-secondary small">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-warning">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    className="form-control bg-dark text-white border-secondary border-opacity-50"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-100 btn btn-warning text-dark fw-bold rounded-pill py-2.5 shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                  border: "none",
                }}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isSignup
                    ? formData.role === "hotel"
                      ? "Submit Hotel Partner Request"
                      : "Register Devotee Account"
                    : "Sign In"}
              </button>
            </div>
          </form>

          <div className="modal-footer border-top border-secondary border-opacity-25 pt-3 justify-content-center">
            <button
              type="button"
              className="btn btn-link text-warning text-decoration-none small"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  role: "devotee",
                  hotelName: "",
                  contactPhone: "",
                });
              }}
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Need an account? Register here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
