"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const UpdateServer = ({ params }) => {
  const id = parseInt(params.id);

  const [server, setServer] = useState(null);
  const [ansibleGroups, setAnsibleGroups] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [softwareVersions, setSoftwareVersions] = useState([]);
  const [hostname, setHostname] = useState("");
  const [selectedAnsibleGroup, setSelectedAnsibleGroup] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedSoftwareVersions, setSelectedSoftwareVersions] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/servers/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setServer(data.server);
          setHostname(data.server.hostname);
          setSelectedAnsibleGroup(data.server.ansible_group_id);
          setSelectedEnvironment(data.server.environment_id);
          setSelectedSoftwareVersions(data.server.softwares.map((s) => s.id));
        });

      fetch("/api/ansibleGroup")
        .then((response) => response.json())
        .then((data) => setAnsibleGroups(data));

      fetch("/api/environments")
        .then((response) => response.json())
        .then((data) => setEnvironments(data));

      fetch("/api/SoftwareVersions")
        .then((response) => response.json())
        .then((data) => setSoftwareVersions(data));
    }
  }, [id]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this server?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/servers/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.alert("Server deleted successfully");
        } else {
          console.error("Failed to delete server");
          window.alert("Failed to delete server");
        }
      } catch (error) {
        console.error("Error deleting server:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Confirmation dialog before proceeding
    const isConfirmed = window.confirm(
      "Are you sure you want to update the server information?"
    );
    if (!isConfirmed) {
      return; // Stop the function if the user does not confirm
    }

    const updatedServer = {
      hostname,
      ansible_group_id: selectedAnsibleGroup,
      environment_id: selectedEnvironment,
      software_versions: selectedSoftwareVersions,
    };

    const response = await fetch(`/api/servers/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedServer),
    });

    if (response.ok) {
      console.log("Server updated successfully");
      window.alert("Server info updated"); // Show a pop-up window when the update is successful
    } else {
      console.error("Failed to update Server");
      window.alert("Failed to update Server"); // Optionally, show an error message
    }
  };

  const handleSoftwareVersionChange = (softwareId) => {
    const currentIndex = selectedSoftwareVersions.indexOf(softwareId);
    const newSelected = [...selectedSoftwareVersions];

    if (currentIndex === -1) {
      newSelected.push(softwareId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedSoftwareVersions(newSelected);
  };

  if (!server) return <div>Loading...</div>;

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
          <label htmlFor="hostname" style={{ marginBottom: "5px" }}>
            Hostname:
          </label>
          <input
            type="text"
            id="hostname"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            style={{
              color: "white",
              width: "100%",
              marginTop: "10px",
              fontSize: "1.1em",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", width: "100%" }}>
          {/* Ansible Group Select */}
          <label htmlFor="ansibleGroup" style={{ marginBottom: "5px" }}>
            Ansible Group:
          </label>
          <select
            value={selectedAnsibleGroup}
            onChange={(e) => setSelectedAnsibleGroup(parseInt(e.target.value))}
            style={{
              color: "white",
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
            }}
          >
            {ansibleGroups.map((group) => (
              <option
                key={group.id}
                value={group.id}
                style={{ backgroundColor: "black", color: "white" }}
              >
                {group.group_name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="environment" style={{ marginBottom: "5px" }}>
            Environment:
          </label>
          <select
            value={selectedEnvironment}
            onChange={(e) => setSelectedEnvironment(parseInt(e.target.value))}
            style={{
              color: "white",
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
            }}
          >
            {environments.map((env) => (
              <option
                key={env.id}
                value={env.id}
                style={{ backgroundColor: "black", color: "white" }}
              >
                {env.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="softwareVersions" style={{ marginBottom: "5px" }}>
            Software Versions:
          </label>
          {softwareVersions.map((software) => (
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
                checked={selectedSoftwareVersions.includes(software.id)}
                onChange={() => handleSoftwareVersionChange(software.id)}
                style={{ marginRight: "10px" }}
              />
              <label
                htmlFor={`software-${software.id}`}
                style={{ color: "white", cursor: "pointer" }}
              >
                {/* Concatenate software name and version name */}
                {software.software?.name + " " + software.name}
              </label>
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
          Update Server
        </button>
        {/* Delete Button */}
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
          Delete Server
        </button>
      </form>
    </div>
  );
};

export default UpdateServer;
