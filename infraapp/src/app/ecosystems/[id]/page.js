"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";


const UpdateEcosystem = ({ params }) => {
    const id = parseInt(params.id);

  const [ecosystem, setEcosystem] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/ecosystems/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setEcosystem(data);
          setName(data.name);
        });
    }
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this ecosystem?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/ecosystems/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.alert("Ecosystem deleted successfully");
        } else {
          console.error("Failed to delete ecosystem");
        }
      } catch (error) {
        console.error("Error deleting ecosystem:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isConfirmed = window.confirm(
      "Are you sure you want to update this ecosystem?"
    );
    if (!isConfirmed) {
      return;
    }

    const updatedEcosystem = { name };

    const response = await fetch(`/api/ecosystems/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEcosystem),
    });

    if (response.ok) {
      console.log("Ecosystem updated successfully");
      window.alert("Ecosystem info updated");
    } else {
      console.error("Failed to update ecosystem");
      window.alert("Failed to update ecosystem");
    }
  };

  if (!ecosystem) return <div>Loading...</div>;

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
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
          maxWidth: "500px",
          width: "100%",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "20px", width: "100%" }}>
          <label htmlFor="name" style={{ marginBottom: "5px" }}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Update Ecosystem
        </button>

        <button
          type="button"
          onClick={handleDelete}
          style={{
            backgroundColor: "darkred",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            cursor: "pointer",
            marginTop: "15px",
            width: "100%",
          }}
        >
          Delete Ecosystem
        </button>
      </form>
    </div>
  );
};

export default UpdateEcosystem;
