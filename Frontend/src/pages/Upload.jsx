// src/pages/Upload.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../assets/upload.css";
import NotificationModal from "../Components/NotificationModal";
import { categories } from "../data/categories";

export default function Upload() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    customCategory: "",
    condition: "good",
    type: "buy",
    price: "",
    image: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info"); // success | error | info

  const uploadCategories = [...categories.filter((c) => c !== "Other"), "Other"];
  const priceEstimator = { good: "₹150–200", fair: "₹100–150", new: "₹200–250" };
  const borrowFeeEstimator = { good: "₹30", fair: "₹20", new: "₹40" };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      return;
    }

    if (name === "condition") {
      const newPrice =
        formData.type === "borrow"
          ? borrowFeeEstimator[value]
          : priceEstimator[value];
      setFormData({ ...formData, condition: value, price: newPrice });
      return;
    }

    if (name === "type") {
      const newPrice =
        value === "borrow"
          ? borrowFeeEstimator[formData.condition]
          : priceEstimator[formData.condition];
      setFormData({ ...formData, type: value, price: newPrice });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setModalMessage("⚠️ Please register or login to upload a book.");
      setModalType("info");
      setShowModal(true);
      return;
    }

    if (!formData.category) {
      setModalMessage("⚠️ Please select a category.");
      setModalType("info");
      setShowModal(true);
      return;
    }

    if (formData.category === "Other" && !formData.customCategory.trim()) {
      setModalMessage("⚠️ Please enter a custom category.");
      setModalType("info");
      setShowModal(true);
      return;
    }

    const finalCategory =
      formData.category === "Other" || !categories.includes(formData.category)
        ? formData.customCategory.trim() || "Other"
        : formData.category;

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("author", formData.author);
      payload.append("category", finalCategory);
      payload.append("condition", formData.condition);
      payload.append("type", formData.type);
      payload.append("price", formData.price);
      payload.append("owner", user.username);
      payload.append("ownerEmail", user.email);
      payload.append("ownerPhone", user.phone);
      if (formData.image) payload.append("image", formData.image);

      console.log("📤 Uploading book with data:");
      console.log("Auth header:", `Bearer ${user?.token}`);

      for (let [k, v] of payload.entries()) console.log(`${k}:`, v);

      const res = await fetch("http://localhost:8081/api/books", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`, // ✅ include JWT token
        },
        body: payload,
      });

      const data = await res.text();
      console.log("📦 Upload response:", res.status, data);

      if (!res.ok) throw new Error(data || "Failed to upload book");

      setModalMessage("✅ Book uploaded successfully!");
      setModalType("success");
      setShowModal(true);

      // Reset form
      setFormData({
        title: "",
        author: "",
        category: "",
        customCategory: "",
        condition: "good",
        type: "buy",
        price: "",
        image: null,
      });
    } catch (err) {
      console.error("❌ Upload error:", err);
      setModalMessage("❌ Failed to upload book. Please try again.");
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalType === "success") navigate("/listings");
  };

  return (
    <div className="upload-page">
      <div className="upload-hero" data-aos="fade-up">
        <h1>Upload a Book</h1>
        <p>Share your books with the community</p>
      </div>

      <div className="upload-card" data-aos="zoom-in">
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="pill-input"
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            required
            className="pill-input"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select pill-input"
            required
          >
            <option value="">Select Category</option>
            {uploadCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {formData.category === "Other" && (
            <input
              type="text"
              name="customCategory"
              placeholder="Enter custom category"
              value={formData.customCategory}
              onChange={handleChange}
              required
              className="pill-input"
            />
          )}

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="form-select pill-input"
            required
          >
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="new">Like New</option>
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select pill-input"
          >
            <option value="buy">Buy</option>
            <option value="borrow">Borrow</option>
          </select>

          <p className="price-estimate">
            {formData.type === "borrow"
              ? `Borrow Fee: ${borrowFeeEstimator[formData.condition]}`
              : `Suggested Price: ${priceEstimator[formData.condition]}`}
          </p>

          <input
            type="text"
            name="price"
            placeholder={formData.type === "borrow" ? "Borrow Fee" : "Final Price"}
            value={formData.price}
            onChange={handleChange}
            required
            readOnly={formData.type === "borrow"}
            className="pill-input"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="pill-input file-input"
          />

          <button type="submit" className="pillu-btn primary-btn">
            Upload
          </button>
        </form>
      </div>

      <NotificationModal
        show={showModal}
        onClose={handleCloseModal}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
}
