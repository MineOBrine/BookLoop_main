import React from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "./context/UserContext"; // ✅ Import context hook
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import Home from "./pages/Home";
import Request from "./pages/Request";
import RequestsBoard from "./pages/RequestsBoard";
import Layout from "./Components/Layout";
import PrivateRoute from "./Components/PrivateRoute";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import BookDetails from "./pages/BookDetails";

function App() {
  const { loadingUser } = useUser(); // ✅ Access loading flag

  // 🌀 Prevent route flickering while user is restoring from localStorage
  if (loadingUser) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <div className="text-center">
          <div
            className="spinner-border text-light mb-3"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          ></div>
          <p className="fs-5">Loading BookLoop...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Shared layout for routes */}
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />

        {/* Protected Routes */}
        <Route
          path="/request"
          element={
            <PrivateRoute>
              <Request />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <RequestsBoard />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
