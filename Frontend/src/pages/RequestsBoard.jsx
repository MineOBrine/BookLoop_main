// src/pages/RequestsBoard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/request.css";
import { useUser } from "../context/UserContext";

export default function RequestsBoard() {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8081/api/requests");
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-page">
      <div className="container" data-aos="fade-up">
        {/* Hero Section */}
        <div className="request-hero">
          <h1>📋 Book Requests</h1>
          <p>Browse requests made by fellow readers</p>

          {/* Back Button */}
          <button
            className="pillr-btn mt-3"
            onClick={() => navigate("/request")} // ✅ Goes back to Request.jsx
            data-aos="fade-in"
          >
            ⬅️ Back to Request Page
          </button>
        </div>

        {/* Loading / Error / Empty States */}
        {loading && <p className="loading-text">Loading requests...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && requests.length === 0 && (
          <p className="empty-text">No requests yet.</p>
        )}

        {/* Requests Grid */}
        {!loading && !error && requests.length > 0 && (
          <div className="requests-grid">
            {requests.map((req) => {
              const displayName =
                user?.email && req.requesterEmail === user.email
                  ? user.username || user.name || "You"
                  : req.requesterName || "Anonymous";

              return (
                <div
                  key={req.id}
                  className="request-card pill-card"
                  data-aos="zoom-in"
                >
                  <h5>{req.title}</h5>

                  <p>
                    <strong>Author:</strong> {req.author || "Unknown"}
                  </p>

                  <p>
                    <strong>Requested by:</strong> {displayName}
                  </p>

                  <p>
                    <strong>Location:</strong> {req.location || "N/A"}
                  </p>

                  {req.notes && (
                    <p>
                      <strong>Notes:</strong> {req.notes}
                    </p>
                  )}

                  {req.requesterPhone && (
                    <p>
                      <strong>Contact:</strong> {req.requesterPhone}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
