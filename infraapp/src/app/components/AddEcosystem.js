"use client"
import React, { useState } from "react";
import "./AddEcosystem.css";

const AddEcosystem = () => {
  const [ecosystemName, setEcosystemName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/addEcosystem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: ecosystemName }),
      });

      if (response.ok) {
        alert("Ecosystem added successfully");
        setEcosystemName(""); // Clear the input after successful addition
      } else {
        console.error("Failed to add ecosystem");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="add-ecosystem">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ecosystemName">Ecosystem Name:</label>
          <input
            id="ecosystemName"
            type="text"
            value={ecosystemName}
            onChange={(e) => setEcosystemName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Ecosystem</button>
      </form>
    </div>
  );
};

export default AddEcosystem;
