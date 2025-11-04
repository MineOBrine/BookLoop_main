// src/pages/Listings.jsx
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/listings.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { categories as baseCategories } from "../data/categories"; // ✅ import shared categories
import BookImg from "../assets/Book.png";

export default function Listings() {
  const { user } = useUser();
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const getConditionLabel = (condition = "") => {
    const labels = { good: "Good", fair: "Fair", new: "Like New" };
    return labels[condition?.toLowerCase?.()] || "Unknown";
  };

  // ✅ use imported categories with "All" added at the start
  const categories = ["All", ...baseCategories];

  const sampleBooks = [
    {
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      owner: "Alice",
      location: "Campus Library",
      type: "buy",
      price: "500",
      condition: "good",
      category: "Technology",
      imageUrl: BookImg,
    },
    {
      id: "2",
      title: "Introduction to Algorithms",
      author: "Cormen et al.",
      owner: "Bob",
      location: "Hostel Block A",
      type: "borrow",
      price: "50",
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
      price: "650",
      condition: "new",
      category: "Technology",
      imageUrl: BookImg,
    },
  ];

  const displayedBooks = books.length ? books : sampleBooks;

  const getImageSrc = (book) => {
    const raw =
      book?.imageURL ?? book?.imageUrl ?? book?.image ?? book?.image_path ?? "";
    if (!raw) return BookImg;
    const normalized = String(raw).replace(/\\/g, "/").trim();
    if (normalized.startsWith("http")) return normalized;
    if (normalized.startsWith("/")) return `http://localhost:8081${normalized}`;
    if (normalized.includes("uploads/")) return `http://localhost:8081/${normalized}`;
    return BookImg;
  };

  const handleBookClick = (book) => {
    if (!user) navigate("/register");
    else navigate(`/book/${book.id}`, { state: { book } });
  };

  // ✅ Filtering logic (category + type + price)
  const filteredBooks = displayedBooks.filter((book) => {
    const matchesCategory =
      categoryFilter === "all" ||
      book.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesType = typeFilter === "all" || book.type === typeFilter;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && parseFloat(book.price) <= 300) ||
      (priceFilter === "mid" &&
        parseFloat(book.price) > 300 &&
        parseFloat(book.price) <= 600) ||
      (priceFilter === "high" && parseFloat(book.price) > 600);

    return matchesCategory && matchesType && matchesPrice;
  });

  useEffect(() => {
  const handleScroll = () => {
    const heading = document.querySelector(".floating-heading");
    if (!heading) return;

    if (window.scrollY > 60) {
      heading.classList.add("shrink");
    } else {
      heading.classList.remove("shrink");
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const handleResetFilters = () => {
    setCategoryFilter("all");
    setTypeFilter("all");
    setPriceFilter("all");
  };

  return (
    <div className="listings-page">
      {/* Floating Heading */}
      <h1 className="floating-heading" data-aos="fade-down">
        Listings
      </h1>

      {/* Filter Bar */}
      <div className="filters" data-aos="fade-up">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="buy">Buy</option>
          <option value="borrow">Borrow</option>
        </select>

        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="low">Below ₹300</option>
          <option value="mid">₹300 - ₹600</option>
          <option value="high">Above ₹600</option>
        </select>
      </div>

      {/* Books or No Results */}
      {filteredBooks.length > 0 ? (
        <div className="book-grid">
          {filteredBooks.map((book, index) => (
            <div
              key={book.id || index}
              className="book-card"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              onClick={() => handleBookClick(book)}
            >
              <img
                src={getImageSrc(book)}
                alt={book.title || "Book"}
                className="book-image"
                onError={(e) => (e.target.src = BookImg)}
              />
              <h5>{book.title || "Untitled Book"}</h5>
              <p>
                <strong>Author:</strong> {book.author || "Unknown"}
              </p>
              <p>
                <strong>Owner:</strong> {book.owner || "Anonymous"}
              </p>
              <p>
                <strong>{book.type === "borrow" ? "Fee:" : "Price:"}</strong> ₹
                {book.price || "N/A"}
              </p>

              <div className="chips-container">
                <span className="book-category">{book.category || "Misc"}</span>
                <span className={`book-condition condition-${book.condition}`}>
                  {getConditionLabel(book.condition)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results" data-aos="fade-up">
          <h3>No results found</h3>
          <p>Try adjusting your filters or view all listings again.</p>
          <button onClick={handleResetFilters}>Reset Filters</button>
        </div>
      )}
    </div>
  );
}
