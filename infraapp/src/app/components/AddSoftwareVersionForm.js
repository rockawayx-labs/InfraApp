import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

function AddSoftwareVersionForm() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [github, setGithub] = useState("");
  const [softwares, setSoftwares] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState("");
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resSoftwares = await fetch("/api/Softwares");
        const dataSoftwares = await resSoftwares.json();
        setSoftwares(dataSoftwares);
        if (dataSoftwares.length > 0) {
          const initialSoftware = dataSoftwares[0];
          setSelectedSoftware(initialSoftware.id);
        }

        const resEnvironments = await fetch("/api/environments");
        const dataEnvironments = await resEnvironments.json();
        setEnvironments(dataEnvironments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSoftware && name) {
      const software = softwares.find(
        (sw) => sw.id === parseInt(selectedSoftware)
      );
      if (software) {
        setGithub(`${software.github}/releases/tag/${name}`);
      }
    } else {
      setGithub("");
    }
  }, [selectedSoftware, name, softwares]);

  const handleEnvironmentCheckboxChange = (envId) => {
    setSelectedEnvironments((prev) => {
      return prev.includes(envId)
        ? prev.filter((id) => id !== envId)
        : [...prev, envId];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const softwareVersionData = {
      name,
      github,
      creator: session?.user?.email,
      last_editor: session?.user?.email,
      date_created: new Date().toISOString(),
      last_change: new Date().toISOString(),
      software_id: selectedSoftware,
      selectedEnvironments,
    };

    try {
      const response = await fetch("/api/addSoftwareVersion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(softwareVersionData),
      });

      if (response.ok) {
        alert("Software Version added successfully!");
        setName("");
        setGithub("");
        setSelectedSoftware(softwares.length > 0 ? softwares[0].id : null);
        setSelectedEnvironments([]);
      } else {
        const errorText = await response.text();
        alert("Failed to add Software Version: " + errorText);
        console.error("Failed to add Software Version:", errorText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form: " + error.message);
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
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="software">Software:</label>
          <select
            id="software"
            value={selectedSoftware}
            onChange={(e) => setSelectedSoftware(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              boxSizing: "border-box",
              borderRadius: "4px",
            }}
          >
            <option value="">Select Software</option>
            {softwares.map((software) => (
              <option key={software.id} value={software.id}>
                {software.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px", fontSize: "larger" }}>
          <label htmlFor="name">Software Version Name:</label>
          <input
            id="name"
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
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="github">GitHub Release URL:</label>
          <input
            id="github"
            type="text"
            value={github}
            readOnly
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              boxSizing: "border-box",
              borderRadius: "4px",
              backgroundColor: "#666", // To indicate read-only
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="environments">Approve on Environments:</label>
          <div style={{ marginTop: "15px" }}>
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
                  id={`env-${env.id}`}
                  checked={selectedEnvironments.includes(env.id)}
                  onChange={() => handleEnvironmentCheckboxChange(env.id)}
                  style={{ marginRight: "10px" }}
                />
                <label htmlFor={`env-${env.id}`} style={{ color: "white" }}>
                  {env.name}
                </label>
              </div>
            ))}
          </div>
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
            marginTop: "30px",
          }}
        >
          Add Software Version
        </button>
      </form>
    </div>
  );
}

export default AddSoftwareVersionForm;
