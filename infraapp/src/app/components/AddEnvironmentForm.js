import React, { useState } from "react";

function AddEnvironmentForm() {
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/addEnvironment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        alert("Environment added");
        const data = await response.json();
        console.log("Environment added:", data);
        setName(""); // Reset the name field
      } else {
        console.error("Failed to add environment");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "grey",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#333",
          color: "white",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: "10px", fontSize: "larger" }}>
          <label htmlFor="environment-name">Environment Name:</label>
          <input
            id="environment-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              boxSizing: "border-box",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "larger",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Environment
        </button>
      </form>
    </div>
  );
}

export default AddEnvironmentForm;
