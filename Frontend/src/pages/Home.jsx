// src/pages/Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/home.css";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import exchangeImg from "../assets/exchange.png";
import discoverImg from "../assets/discover.png";
import requestImg from "../assets/request.png";
import uploadImg from "../assets/upload.png";
import {
  FaWallet,
  FaUsers,
  FaBolt,
  FaUpload,
  FaBook,
  FaExchangeAlt,
  FaSearch,
} from "react-icons/fa";

function Home() {
  const { user, books, setBooks } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ------------------ AOS Setup ------------------
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  // ------------------ Fetch Books ------------------
  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) return; // 🟡 Wait until user is restored

      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8081/api/books", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user, setBooks]);

  // ------------------ Personalized Books ------------------
  const personalizedBooks = useMemo(() => {
    if (!user || !Array.isArray(user.interests) || user.interests.length === 0)
      return [];

    return books.filter((book) => {
      const category = (book.category || "").toLowerCase();
      return user.interests.some((interest) =>
        category.includes(interest.toLowerCase())
      );
    });
  }, [books, user]);

  // ------------------ Book Condition Label ------------------
  const getConditionLabel = (condition) => {
    switch (condition?.toLowerCase()) {
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      case "new":
        return "Like New";
      default:
        return condition || "Unknown";
    }
  };

  // ------------------ JSX ------------------
  return (
    <div className="home-page bg-dark text-light">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container" data-aos="fade-up">
          <h1 className="display-3 fw-bold text-gradient mb-3">
            Exchange Books, Expand Knowledge
          </h1>
          <p className="lead fs-5 mb-4">
            A student-first platform to{" "}
            <strong>list, discover, and request</strong> books — academic or not —
            within your community.
          </p>

          <div className="hero-buttons">
            <a
              href="#how-it-works"
              className="btn-primary"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              See How It Works
            </a>

            <Link
              to="/listings"
              className="btn-outline"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              Explore Books
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5 bg-navy text-light">
        <div className="container">
          <h2
            className="fw-bold mb-5 text-center text-gradient"
            data-aos="fade-up"
          >
            How It Works
          </h2>

          {/* Step 1 */}
          <div
            className="horizontal-card row align-items-center mb-5"
            data-aos="fade-right"
          >
            <div className="col-md-6">
              <div className="card-content p-4">
                <FaUpload className="how-icon mb-3" />
                <h4 className="fw-semibold">Upload</h4>
                <p className="fs-4">
                  List your books by uploading details and images in a few clicks.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={uploadImg}
                alt="Upload books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="horizontal-card row align-items-center mb-5 flex-md-row-reverse"
            data-aos="fade-left"
          >
            <div className="col-md-6">
              <div className="card-content p-4">
                <FaBook className="how-icon mb-3" />
                <h4 className="fw-semibold">Discover</h4>
                <p className="fs-4">
                  Browse academic & non-academic books shared by students like you.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={discoverImg}
                alt="Discover books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="horizontal-card row align-items-center mb-5"
            data-aos="fade-right"
          >
            <div className="col-md-6">
              <div className="card-content p-4">
                <FaExchangeAlt className="how-icon mb-3" />
                <h4 className="fw-semibold">Exchange / Buy</h4>
                <p className="fs-4">
                  Borrow or buy directly from peers; affordable and simple.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={exchangeImg}
                alt="Exchange books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>

          {/* Step 4 */}
          <div
            className="horizontal-card row align-items-center flex-md-row-reverse"
            data-aos="fade-left"
          >
            <div className="col-md-6">
              <div className="card-content p-4">
                <FaSearch className="how-icon mb-3" />
                <h4 className="fw-semibold">Request</h4>
                <p className="fs-4">
                  Can’t find a book? Place a request and let the community help you.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={requestImg}
                alt="Request books"
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-5 bg-dark text-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5 text-gradient" data-aos="fade-up">
            Why BookLoop?
          </h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="zoom-in">
              <div className="feature-card p-4 h-100">
                <FaWallet className="icon mb-3" />
                <h5 className="fw-semibold">Affordable</h5>
                <p className="small">
                  Save money by buying second-hand or exchanging books directly.
                </p>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="150">
              <div className="feature-card p-4 h-100">
                <FaUsers className="icon mb-3" />
                <h5 className="fw-semibold">Community Driven</h5>
                <p className="small">
                  Built for students, by students; helping each other learn.
                </p>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="300">
              <div className="feature-card p-4 h-100">
                <FaBolt className="icon mb-3" />
                <h5 className="fw-semibold">Fast & Easy</h5>
                <p className="small">
                  Quick uploads, instant discovery, and simple connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      {user && (
        <section className="recommended-section" id="explore" data-aos="fade-up">
          <h2 className="text-gradient">Recommended for You</h2>

          {loading ? (
            <div className="text-center">Loading books...</div>
          ) : personalizedBooks.length > 0 ? (
            <div className="recommended-grid">
              {personalizedBooks.map((book, index) => {
                const getImageSrc = (book) => {
                  const raw =
                    book?.imageURL ??
                    book?.imageUrl ??
                    book?.image ??
                    book?.image_path ??
                    "";
                  if (!raw) return "/assets/Book.png";

                  const normalized = String(raw).replace(/\\/g, "/").trim();

                  if (normalized.startsWith("http")) return normalized;
                  if (normalized.startsWith("/"))
                    return `http://localhost:8081/${normalized.replace(/^\/+/, "")}`;
                  if (normalized.includes("uploads/"))
                    return `http://localhost:8081/${normalized}`;
                  return "/assets/Book.png";
                };

                const imageSrc = getImageSrc(book);

                return (
                  <div
                    key={book.id || index}
                    className="recommended-card"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                    onClick={() => navigate(`/book/${book.id}`, { state: { book } })}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={imageSrc}
                      alt={book.title || "Book"}
                      className="book-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/Book.png";
                      }}
                    />
                    <h5>{book.title || "Untitled Book"}</h5>
                    <p>
                      <strong>Author:</strong> {book.author || "Unknown"}
                    </p>
                    <p>
                      <strong>Owner:</strong> {book.owner || "Anonymous"}
                    </p>
                    <p>
                      <strong>Location:</strong> {book.location || "Not specified"}
                    </p>
                    <p className="fw-semibold">
                      {book.type === "borrow" ? "Borrow Fee:" : "Price:"}{" "}
                      {book.price || "N/A"}
                    </p>

                    <div className="chips-container">
                      <span className="book-category">{book.category}</span>
                      <span
                        className={`book-condition ${book.condition?.toLowerCase()}`}
                      >
                        {getConditionLabel(book.condition)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center">
              No recommendations yet. Add your interests in your profile!
            </p>
          )}
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-5" data-aos="fade-up">
        <div className="about-section">
          <h2>About BookLoop</h2>
          <p>
            BookLoop is your campus-friendly platform where students can list,
            request, and exchange academic and non-academic books. Our mission is
            to make books more accessible and affordable while fostering a stronger
            student community.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta" data-aos="zoom-in">
        <div className="container text-center">
          {user ? (
            <>
              <h2 className="fw-bold mb-3">You’re Already in the Loop! 🎉</h2>
              <p className="mb-4">
                Great to have you here, {user.username || "BookLooper"}! Keep
                exploring, sharing, and discovering new reads with your community.
              </p>
              <button
                className="btn btn-lg btn-primary px-5 rounded-pill shadow-sm"
                onClick={() => navigate("/listings")}
              >
                Explore More Books
              </button>
            </>
          ) : (
            <>
              <h2 className="fw-bold mb-3">Ready to Join the Loop?</h2>
              <p className="mb-4">
                Sign up today and start exchanging knowledge with your community.
              </p>
              <button
                className="btn btn-lg btn-primary px-5 rounded-pill shadow-sm"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
