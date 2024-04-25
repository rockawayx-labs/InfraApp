/**
 * @next/legacy
 */

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

function AddSoftwareForm() {
  const [showAnsibleDropdown, setShowAnsibleDropdown] = useState(false);
  const ansibleDropdownRef = useRef(null);
  const [name, setName] = useState("");
  const [github, setGithub] = useState("");
  const [ansibleGroups, setAnsibleGroups] = useState([]);
  const [selectedAnsibleGroups, setSelectedAnsibleGroups] = useState([]);

  useOutsideClick(ansibleDropdownRef, () => setShowAnsibleDropdown(false));

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/addSoftware", {
        // Adjust the endpoint as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          github,
          selectedAnsibleGroups,
        }),
      });

      if (response.ok) {
        alert("Software added");
        const data = await response.json();
        console.log("Software added:", data);
        setName("");
        setGithub("");
        setSelectedAnsibleGroups([]);
      } else {
        console.error("Failed to add software");
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
          <label htmlFor="name">Software Name:</label>
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
          <label htmlFor="github">GitHub URL:</label>
          <input
            id="github"
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              boxSizing: "border-box",
              borderRadius: "4px",
            }}
          />
        </div>
        <div
          style={{
            marginBottom: "20px",
            fontSize: "larger",
            position: "relative", // This makes the child absolute elements position relative to this div
          }}
        >
          <label /* Your label styles */>Ansible Groups:</label>
          <button
            type="button"
            onClick={() => setShowAnsibleDropdown(!showAnsibleDropdown)}
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
            Select Ansible Groups
          </button>
          {showAnsibleDropdown && (
            <select
              ref={ansibleDropdownRef}
              multiple
              id="ansible-groups"
              value={selectedAnsibleGroups}
              onChange={(e) =>
                setSelectedAnsibleGroups(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              style={{
                position: "absolute", // Absolutely position this element
                top: "100%", // Position it right below the button
                left: 0,
                zIndex: 1,
                height: "100px",
                overflowY: "auto",
                backgroundColor: "#444",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "4px",
                display: "block", // Ensure it's displayed
                width: "100%", // Match the width with the parent div
              }}
            >
              {ansibleGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_name}
                </option>
              ))}
            </select>
          )}
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
          Add Software
        </button>
      </form>
    </div>
  );
}

export default AddSoftwareForm;
