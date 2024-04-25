"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const UpdateSoftwareVersion = ({ params }) => {
  const { data: session } = useSession();
  const userEmail = session.user?.email || "No email found";
  const id = parseInt(params.id);
  const [softwareVersion, setSoftwareVersion] = useState(null);
  const [name, setName] = useState("");
  const [github, setGithub] = useState("");
  const [servers, setServers] = useState([]);
  const [allServers, setAllServers] = useState([]); // Full list of servers
  const [selectedServers, setSelectedServers] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [initialSelectedEnvironments, setInitialSelectedEnvironments] =
    useState([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState([]);

  useEffect(() => {
    if (id) {
      // Fetch the software version details including approvals
      fetch(`/api/SoftwareVersions/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setSoftwareVersion(data);
          setName(data.name);
          setGithub(data.github);
          setApprovals(data.approvals || []);
          setSelectedServers(data.servers.map((server) => server.id));
          setSelectedEnvironments(
            data.approvals.map((approval) => approval.environment_id)
          );
          if (data.approvals) {
            const initialEnvIds = data.approvals.map(
              (approval) => approval.environment_id
            );
            setInitialSelectedEnvironments(initialEnvIds);
          }
        });

      // Fetch all servers
      fetch("/api/servers")
        .then((response) => response.json())
        .then((serverData) => setAllServers(serverData));

      // Fetch all environments
      fetch("/api/environments")
        .then((response) => response.json())
        .then((environmentData) => {
          setEnvironments(environmentData);
        });
    }
  }, [id]);

  useEffect(() => {
    if (environments.length > 0 && approvals.length > 0) {
      // Initialize environments with a selected property based on approvals
      const updatedEnvironments = environments.map((env) => {
        const isSelected = approvals.some(
          (approval) => approval.environment_id === env.id
        );
        return { ...env, selected: isSelected };
      });
      setEnvironments(updatedEnvironments);
    }
  }, [environments, approvals]);

  const handleEnvironmentCheckboxChange = (environmentId) => {
    setSelectedEnvironments((prevSelected) => {
      if (prevSelected.includes(environmentId)) {
        return prevSelected.filter((id) => id !== environmentId);
      } else {
        return [...prevSelected, environmentId];
      }
    });
  };

  const handleServerChange = (serverId) => {
    setSelectedServers((prevSelected) => {
      const currentIndex = prevSelected.indexOf(serverId);
      if (currentIndex === -1) {
        return [...prevSelected, serverId]; // Add serverId
      } else {
        return prevSelected.filter((id) => id !== serverId); // Remove serverId
      }
    });
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this software version?")
    ) {
      // Call the delete API endpoint
      try {
        const response = await fetch(`/api/SoftwareVersions/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Software Version deleted successfully");
          // Redirect or update the UI accordingly
        } else {
          console.error("Failed to delete Software Version");
        }
      } catch (error) {
        console.error("Error deleting software version:", error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any changes were made
    const hasChanges =
      name !== softwareVersion.name ||
      github !== softwareVersion.github ||
      selectedServers.sort().toString() !==
        softwareVersion.servers
          .map((s) => s.id)
          .sort()
          .toString() ||
      selectedEnvironments.sort().toString() !==
        softwareVersion.approvals
          .map((a) => a.environment_id)
          .sort()
          .toString();

    if (hasChanges) {
      // Confirmation dialog
      if (
        !window.confirm(
          "Are you sure you want to update this software version?"
        )
      ) {
        return; // If the user clicks "Cancel", exit the function
      }
    }

    const updatedSoftwareVersion = {
      name,
      github,
      servers: selectedServers,
      environments: selectedEnvironments,
      email: userEmail,
    };

    try {
      const response = await fetch(`/api/SoftwareVersions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSoftwareVersion),
      });

      if (response.ok) {
        alert("Software Version updated successfully"); // Display a success message
        console.log("Software Version updated successfully");
      } else {
        console.error("Failed to update Software Version");
      }
    } catch (error) {
      console.error("Error submitting form:", error); // Log any network errors
    }
  };

  if (!softwareVersion) return <div>Loading...</div>;

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
        {/* Name Input */}

        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label style={{ marginBottom: "10px" }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              color: "white",
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
        </div>

        {/* GitHub Input */}

        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label style={{ marginBottom: "5px" }}>GitHub:</label>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            style={{
              color: "white",
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
        </div>

        <div
          style={{
            marginBottom: "15px",
            width: "100%",
            border: "1px solid white",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <label style={{ color: "white", marginBottom: "10px" }}>
            Servers:
          </label>

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
              <Link href={`/servers/${server.id}`}>
                <span style={{ cursor: "pointer", color: "white" }}>
                  {server.hostname}
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div
          style={{
            marginBottom: "15px",
            width: "100%",
            border: "1px solid white",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <label style={{ color: "white", marginBottom: "10px" }}>
            Approve on:
          </label>

          {environments.map((env) => (
            <div
              key={env.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedEnvironments.includes(env.id)}
                onChange={() => handleEnvironmentCheckboxChange(env.id)}
                style={{ marginRight: "10px" }}
              />
              <Link href={`/environments/${env.id}`}>
                <span style={{ cursor: "pointer", color: "white" }}>
                  {env.name}
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Submit Button */}
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
          Update Software Version
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
          Delete Software Version
        </button>
      </form>
    </div>
  );
};

export default UpdateSoftwareVersion;
