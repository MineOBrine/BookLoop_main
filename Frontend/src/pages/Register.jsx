// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../context/UserContext";
import "../assets/register.css";
import NotificationModal from "../Components/NotificationModal";
import { categories } from "../data/categories";

function Register() {
  const { registerUser, loginUser, user } = useUser();
  const navigate = useNavigate();

  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    college: "",
    password: "",
    interests: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "",
  });

  const interestsList = categories.filter((cat) => cat !== "Other");

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleInterest = (interest) =>
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));

  const analyzePassword = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let message = "";
    let color = "";

    switch (score) {
      case 0:
      case 1:
        message = "Weak — try adding more characters";
        color = "#ff4d4d";
        break;
      case 2:
        message = "Fair — add numbers or symbols";
        color = "#ffa500";
        break;
      case 3:
        message = "Good — almost there";
        color = "#f1c40f";
        break;
      case 4:
        message = "Strong password ✅";
        color = "#2ecc71";
        break;
      default:
        break;
    }

    setPasswordStrength({ score, message, color });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "signup") {
        if (step === 1) {
          setStep(2);
          return;
        }
        await registerUser(formData);
        setShowModal(true);
      } else {
        await loginUser({
          email: formData.email,
          password: formData.password,
        });
        setShowModal(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="register-page">
      <section className="register-hero">
        <div className="hero-container" data-aos="fade-up">
          {/* ---------- LEFT: Text Section ---------- */}
          <div className="hero-text" data-aos="fade-right">
            <h1>{mode === "signup" ? "Join BookLoop" : "Welcome Back"}</h1>
            <p className="lead">
              {mode === "signup"
                ? "Sign up to start exchanging books with your community."
                : "Sign in to continue your journey."}
            </p>
          </div>

          {/* ---------- RIGHT: Form Section ---------- */}
          <div className="hero-form" data-aos="fade-left">
            <div className="register-card">
              {mode === "signup" ? (
                step === 1 ? (
                  <form onSubmit={handleSubmit}>
                    {error && <p className="error-text">{error}</p>}

                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData((prev) => ({ ...prev, phone: value }));
                      }}
                      pattern="\d{10}"
                      title="Phone number must be exactly 10 digits"
                      required
                    />
                    <input
                      type="text"
                      name="college"
                      placeholder="College Name"
                      value={formData.college}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => {
                        handleChange(e);
                        analyzePassword(e.target.value);
                      }}
                      required
                    />

                    {/* Password Strength Meter */}
                    <div className="password-strength">
                      <div
                        className="strength-bar"
                        style={{
                          width: `${(passwordStrength.score / 4) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      ></div>
                      <small style={{ color: passwordStrength.color }}>
                        {passwordStrength.message}
                      </small>
                    </div>

                    {/* Primary Button */}
                    <button type="submit" className="btn">
                      Next
                    </button>

                    {/* Google Button */}
                    <div className="google-btn">
                      <FcGoogle size={22} style={{ marginRight: "8px" }} />
                      Continue with Google <span className="note">(Soon)</span>
                    </div>

                    {/* Switch Mode */}
                    <p className="switch-text">
                      Already have an account?{" "}
                      <span
                        className="switch-link"
                        onClick={() => {
                          setMode("signin");
                          setStep(1);
                        }}
                      >
                        Sign In
                      </span>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="interests-title">Select Your Interests</h3>
                    {error && <p className="error-text">{error}</p>}

                    <div className="interests-grid">
                      {interestsList.map((interest) => (
                        <div
                          key={interest}
                          className={`interest-card ${
                            formData.interests.includes(interest)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="btn">
                      Finish
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <p className="error-text">{error}</p>}

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button type="submit" className="btn">
                    Sign In
                  </button>

                  <p className="switch-text">
                    Don’t have an account?{" "}
                    <span
                      className="switch-link"
                      onClick={() => {
                        setMode("signup");
                        setStep(1);
                      }}
                    >
                      Sign Up
                    </span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <NotificationModal
        show={showModal}
        onClose={handleCloseModal}
        message={
          mode === "signup"
            ? "Registration successful! Welcome aboard 🎉"
            : "Sign in Successful! 🎉"
        }
      />
    </div>
  );
}

export default Register;
