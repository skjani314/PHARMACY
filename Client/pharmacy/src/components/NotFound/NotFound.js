import React from "react";

const NotFoundPage = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      backgroundColor: "#f8f9fa",
      color: "#333",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: "4rem", color: "#dc3545" }}>404</h1>
      <h2 style={{ marginBottom: "20px" }}>Page Not Found</h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Sorry, the page you are looking for does not exist. 
      </p>
      <p>
        This is <strong>Pharmacy RGUKT Ongole</strong>, and it seems you've reached a non-existing route.
      </p>
      <a 
        href="/" 
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          textDecoration: "none",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "5px",
          fontWeight: "bold"
        }}
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFoundPage;
