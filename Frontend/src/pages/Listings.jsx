// src/pages/Listings.jsx
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/listings.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import BookImg from "../assets/Book.png";

export default function Listings() {
  const { user } = useUser();
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchBooks();
  }, []);

  // Fetch all books from backend
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      console.log("📚 Books fetched:", data);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const getConditionLabel = (condition = "") => {
    const labels = { good: "Good", fair: "Fair", new: "Like New" };
    return labels[condition?.toLowerCase?.()] || "Unknown";
  };

  const getCategory = (book, index) => {
    if (book.category) return book.category;
    const fallback = [
      "Engineering",
      "Computer Science",
      "Mathematics",
      "Fiction",
      "Non-fiction",
      "Literature",
      "History",
      "Economics",
    ];
    return fallback[index % fallback.length];
  };

  const handleBookClick = (book) => {
    if (!user) {
      navigate("/register");
    } else {
      navigate(`/book/${book.id}`, { state: { book } });
    }
  };

  // Demo fallback books (keeps placeholder consistent using `imageUrl`)
  const sampleBooks = [
    {
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      owner: "Alice",
      location: "Campus Library",
      type: "buy",
      price: "₹500",
      condition: "good",
      category: "Computer Science",
      imageUrl: BookImg,
    },
    {
      id: "2",
      title: "Introduction to Algorithms",
      author: "Cormen et al.",
      owner: "Bob",
      location: "Hostel Block A",
      type: "borrow",
      price: "₹50/week",
      condition: "fair",
      category: "Engineering",
      imageUrl: BookImg,
    },
    {
      id: "3",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      location: "Main Library",
      type: "buy",
      price: "₹650",
      condition: "new",
      category: "Computer Science",
      imageUrl: BookImg,
    },
  ];

  const displayedBooks = books.length ? books : sampleBooks;

  // Helper — derive image src with normalization + fallbacks
  const getImageSrc = (book) => {
    // try multiple common property names (backend may send imageURL, imageUrl, image)
    const raw =
      book?.imageURL ?? book?.imageUrl ?? book?.image ?? book?.image_path ?? "";

    if (!raw) return BookImg;

    const normalized = String(raw).replace(/\\/g, "/").trim();

    // if already absolute URL, use as is
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return normalized;
    }

    // if backend returned a leading slash ("/uploads/..") or "uploads/..", make absolute to backend
    if (normalized.startsWith("/")) {
      // remove any duplicate leading slash
      const p = normalized.replace(/^\/+/, "");
      return `http://localhost:8081/${p}`;
    }

    if (normalized.startsWith("uploads/") || normalized.includes("uploads/")) {
      return `http://localhost:8081/${normalized}`;
    }

    // fallback — return placeholder
    return BookImg;
  };

  return (
    <div className="listings-page">
      <section className="listings-hero" data-aos="fade-down">
        <h1>Available Books</h1>
        <p>Browse and explore books shared by the community</p>
      </section>

      <div className="book-grid">
        {displayedBooks.map((book, index) => {
          const imageSrc = getImageSrc(book);

          return (
            <div
              key={book.id || index}
              className="book-card"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              onClick={() => handleBookClick(book)}
            >
              <img
                src={imageSrc}
                alt={book.title || "Book"}
                className="book-image"
                onError={(e) => {
                  // if image fails to load, use placeholder
                  e.target.onerror = null;
                  e.target.src = BookImg;
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
                <strong>Contact:</strong> {book.ownerEmail || "N/A"}
              </p>
              <p>
                <strong>{book.type === "borrow" ? "Borrow Fee:" : "Price:"}</strong>{" "}
                {book.price || "N/A"}
              </p>

              <div className="chips-container">
                <span className="book-category">{getCategory(book, index)}</span>
                <span className={`book-condition condition-${book.condition}`}>
                  {getConditionLabel(book.condition)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
