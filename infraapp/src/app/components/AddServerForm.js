import React, { useState, useEffect, useRef } from "react";

function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

function AddServerForm() {
  const [hostname, setHostname] = useState("");
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [ansibleGroups, setAnsibleGroups] = useState([]);
  const [selectedAnsibleGroup, setSelectedAnsibleGroup] = useState("");
  const [softwareVersions, setSoftwareVersions] = useState([]);
  const [selectedSoftwareVersions, setSelectedSoftwareVersions] = useState([]);

  useEffect(() => {
    fetch("/api/environments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEnvironments(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching environments:", error));
    fetch("/api/ansibleGroup")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAnsibleGroups(data);
        } else {
          console.error("Invalid data format for Ansible groups:", data);
        }
      })
      .catch((error) => console.error("Error fetching Ansible groups:", error));
    fetch("/api/SoftwareVersions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSoftwareVersions(data);
        } else {
          console.error("Invalid data format for SoftwareVersions:", data);
        }
      })
      .catch((error) =>
        console.error("Error fetching SoftwareVersions:", error)
      );
  }, []);

  const selectRef = useRef(null); // Create a ref for the select element

  useOutsideClick(selectRef, () => {
    if (selectRef.current) {
      selectRef.current.style.display = "none"; // Hide select on outside click
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/addServer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostname,
          selectedEnvironment,
          selectedAnsibleGroup,
          selectedSoftwareVersions,
        }),
      });

      if (response.ok) {
        alert("Server added");
        const data = await response.json();
        console.log("Server added:", data);
        setHostname("");
        setSelectedEnvironment("");
        setSelectedAnsibleGroup("");
        setSelectedSoftwareVersions([]);
      } else {
        console.error("Failed to add server");
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
          <label htmlFor="hostname">Hostname:</label>
          <input
            id="hostname"
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
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
        <div>
          <label htmlFor="environment">Environment:</label>
          <select
            id="environment"
            value={selectedEnvironment}
            onChange={(e) => setSelectedEnvironment(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              boxSizing: "border-box",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            <option value="">Select an environment</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ansible-group">Ansible Group:</label>
          <select
            id="ansible-group"
            value={selectedAnsibleGroup}
            onChange={(e) => setSelectedAnsibleGroup(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              boxSizing: "border-box",
              borderRadius: "4px",
            }}
          >
            <option value="">Select an Ansible group</option>
            {ansibleGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.group_name}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            marginBottom: "20px",
            fontSize: "larger",
            position: "relative",
            marginTop: "20px",
          }}
        >
          {" "}
          {/* Add position relative */}
          <label
            htmlFor="software-versions"
            style={{ display: "block", marginBottom: "10px", fontSize: "18px" }}
          >
            Software Versions:
          </label>
          <button
            type="button"
            onClick={() => {
              const selectBox = document.getElementById("software-versions");
              selectBox.style.display =
                selectBox.style.display === "none" ? "" : "none";
            }}
            style={{
              backgroundColor: "#555",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "5px",
            }}
          >
            Select Software Versions
          </button>
          <select
            ref={selectRef} // Attach the ref to the select element
            id="software-versions"
            multiple
            style={{
              position: "absolute", // Position it absolutely
              top: "100%", // Position it right below the button
              left: 0,
              zIndex: 1,
              height: "100px",
              overflowY: "auto",
              backgroundColor: "#444",
              color: "white",
              border: "none",
              padding: "10px",
              marginTop: "15px",
              borderRadius: "4px",
              display: "none", // Initially hide
              width: "100%", // Match the width with the button
            }}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setSelectedSoftwareVersions(selectedOptions);
            }}
          >
            {softwareVersions.map((version) => (
              <option key={version.id} value={version.id}>
                {version.software.name + " " + version.name}{" "}
                {/* Concatenating the names */}
              </option>
            ))}
          </select>
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
          Add Server
        </button>
      </form>
    </div>
  );
}

export default AddServerForm;
