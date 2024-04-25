"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const UpdateEnvironment = ({ params }) => {
  const id = parseInt(params.id);

  const [environment, setEnvironment] = useState(null);
  const [name, setName] = useState("");
  const [servers, setServers] = useState([]);
  const [selectedServers, setSelectedServers] = useState([]);
  const [allServers, setAllServers] = useState([]);
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/environments/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setEnvironment(data);
          setName(data.name);
          if (Array.isArray(data.servers)) {
            setSelectedServers(data.servers.map((server) => server.id));
          }
          setApprovals(data.approvals || []);
        });

      // Fetch all servers
      fetch("/api/servers")
        .then((response) => response.json())
        .then((serverData) => setAllServers(serverData));

      // Fetch all environments
      fetch("/api/environments")
        .then((response) => response.json())
        .then((environmentData) => setEnvironment(environmentData));
    }
  }, [id]);

  const handleServerChange = (serverId) => {
    const currentIndex = selectedServers.indexOf(serverId);
    if (currentIndex === -1) {
      setSelectedServers([...selectedServers, serverId]);
    } else {
      setSelectedServers(selectedServers.filter((id) => id !== serverId));
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this environment?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/environments/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.alert("Environment deleted successfully");
          router.push("/environments"); // Navigate to the environments list
        } else {
          console.error("Failed to delete environment");
        }
      } catch (error) {
        console.error("Error deleting environment:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Confirmation dialog before proceeding
    const isConfirmed = window.confirm(
      "Are you sure you want to update this environment?"
    );
    if (!isConfirmed) {
      return; // Stop the function if the user does not confirm
    }

    const updatedEnvironment = {
      name,
      servers: selectedServers,
    };

    const response = await fetch(`/api/environments/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEnvironment),
    });

    if (response.ok) {
      console.log("Environment updated successfully");
      window.alert("Environment info updated"); // Show a pop-up window when the update is successful
    } else {
      console.error("Failed to update Environment");
      window.alert("Failed to update Environment"); // Optionally, show an error message
    }
  };

  if (!environment) return <div>Loading...</div>;

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
          maxWidth: "700px",
          width: "100%",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="name" style={{ marginBottom: "5px" }}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        {/* Servers Selection */}
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label style={{ marginBottom: "5px" }}>Servers:</label>
          {allServers.map((server) => (
            <div
              key={server.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedServers.includes(server.id)}
                onChange={() => handleServerChange(server.id)}
                style={{ marginRight: "10px" }}
              />
              <Link href={`/servers/${server.id}`} passHref>
                <span style={{ color: "white", cursor: "pointer" }}>
                  {server.hostname}
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label style={{ marginBottom: "5px" }}>Approvals:</label>
          <table
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              textAlign: "left",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid white", padding: "8px" }}>
                  Approver
                </th>
                <th style={{ borderBottom: "1px solid white", padding: "8px" }}>
                  Date
                </th>
                <th style={{ borderBottom: "1px solid white", padding: "8px" }}>
                  Software Version
                </th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((approval) => (
                <tr key={approval.id}>
                  <td style={{ padding: "8px" }}>{approval.approver}</td>
                  <td style={{ padding: "8px" }}>
                    {new Date(approval.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {approval.software_version?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        >
          Update Environment
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
          Delete Environment
        </button>
      </form>
    </div>
  );
};

export default UpdateEnvironment;
