"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./UpdateAnsibleGroup.css";

const UpdateAnsibleGroup = ({ params }) => {
  const id = parseInt(params.id);

  const [ansibleGroup, setAnsibleGroup] = useState(null);
  const [softwares, setSoftwares] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedSoftwares, setSelectedSoftwares] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/ansibleGroup/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setAnsibleGroup(data.ansibleGroup);
          setGroupName(data.ansibleGroup.group_name);
          setSelectedSoftwares(data.ansibleGroup.softwares.map((s) => s.id));
        })
        .catch((error) => console.error("Error fetching AnsibleGroup:", error));

      fetch("/api/Softwares")
        .then((response) => response.json())
        .then((data) => setSoftwares(data))
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Confirmation dialog
    if (
      !window.confirm("Are you sure you want to update this Ansible Group?")
    ) {
      return; // If the user clicks "Cancel", exit the function
    }

    const updatedAnsibleGroup = {
      groupName,
      selectedSoftwares,
    };

    const response = await fetch(`/api/updateAnsibleGroup/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAnsibleGroup),
    });

    if (response.ok) {
      alert("Ansible Group updated successfully"); // Display a success message
      console.log("Ansible Group updated successfully");
    } else {
      console.error("Failed to update Ansible Group");
    }
  };

  const handleSoftwareChange = (softwareId) => {
    const newSelected = selectedSoftwares.includes(softwareId)
      ? selectedSoftwares.filter((id) => id !== softwareId)
      : [...selectedSoftwares, softwareId];
    setSelectedSoftwares(newSelected);
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Ansible Group?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/ansibleGroup/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.alert("Ansible Group deleted successfully");
        } else {
          console.error("Failed to delete Ansible Group");
        }
      } catch (error) {
        console.error("Error deleting Ansible Group:", error);
      }
    }
  };

  if (!ansibleGroup)
    return <div className="update-ansible-group">Loading...</div>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
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
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="groupName" style={{ marginBottom: "5px" }}>
            Group Name:
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            style={{
              marginRight: "10px",
              color: "white",
              width: "100%",
              marginTop: "10px",
              fontSize: "1.1em",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label style={{ marginBottom: "5px" }}>Softwares:</label>
          {softwares.map((software) => (
            <div
              key={software.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <input
                type="checkbox"
                id={`software-${software.id}`}
                checked={selectedSoftwares.includes(software.id)}
                onChange={() => handleSoftwareChange(software.id)}
                style={{ marginRight: "10px" }}
              />
              <Link href={`/softwares/${software.id}`}>
                <label
                  htmlFor={`software-${software.id}`}
                  style={{ color: "white", cursor: "pointer" }}
                >
                  {software.name}
                </label>
              </Link>
            </div>
          ))}
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 15px",
            cursor: "pointer",
            width: "100%",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Update Group
        </button>
        <button
          type="button" // Important to specify type as button to prevent form submission
          onClick={handleDelete}
          style={{
            backgroundColor: "darkred",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 15px",
            cursor: "pointer",
            marginTop: "15px", // Spacing between buttons
            width: "100%",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "red")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "darkred")}
        >
          Delete Group
        </button>
      </form>
    </div>
  );
};

export default UpdateAnsibleGroup;
