"use client";
import React, { useState, useEffect, useRef } from "react";
import "./AddAnsibleGroup.css";

const AddAnsibleGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [ecosystems, setEcosystems] = useState([]);
  const [selectedEcosystem, setSelectedEcosystem] = useState("");
  const [softwares, setSoftwares] = useState([]);
  const [selectedSoftwares, setSelectedSoftwares] = useState(new Set());
  useEffect(() => {
    fetch("/api/ecosystems")
      .then((res) => res.json())
      .then(setEcosystems)
      .catch((error) => console.error("Error fetching ecosystems:", error));

    fetch("/api/Softwares")
      .then((res) => res.json())
      .then(setSoftwares)
      .catch((error) => console.error("Error fetching softwares:", error));
  }, []);

  const handleSoftwareCheckboxChange = (softwareId) => {
    setSelectedSoftwares((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(softwareId)) {
        updatedSelected.delete(softwareId);
      } else {
        updatedSelected.add(softwareId);
      }
      return updatedSelected;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const softwareIdsArray = Array.from(selectedSoftwares);
      const response = await fetch("/api/addAnsibleGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName,
          selectedEcosystem,
          selectedSoftwares: softwareIdsArray,
        }),
      });

      if (response.ok) {
        alert("Ansible Group added");
        setGroupName("");
        setSelectedEcosystem("");
        setSelectedSoftwares(new Set()); // Reset as a new Set
      } else {
        console.error("Failed to add Ansible Group");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="add-ansible-group">
      <form onSubmit={handleSubmit}>
        {/* Group Name */}
        <div>
          <label htmlFor="groupName">Group Name:</label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>

        {/* Ecosystem Selection */}
        <div>
          <label htmlFor="ecosystem">Ecosystem:</label>
          <select
            id="ecosystem" // Ensure this ID is assigned
            value={selectedEcosystem}
            onChange={(e) => setSelectedEcosystem(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "15px",
              boxSizing: "border-box",
              borderRadius: "4px",
              // Remove the inline color style if it's set in the CSS
            }}
          >
            <option value="">Select an ecosystem</option>
            {ecosystems.map((ecosystem) => (
              <option key={ecosystem.id} value={ecosystem.id}>
                {ecosystem.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Softwares:</label>
          <div>
            {softwares.map((software) => (
              <div key={software.id} className="software-checkbox">
                <input
                  type="checkbox"
                  id={`software-${software.id}`}
                  checked={selectedSoftwares.has(software.id)}
                  onChange={() => handleSoftwareCheckboxChange(software.id)}
                />
                <label htmlFor={`software-${software.id}`}>
                  {software.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Add Ansible Group</button>
      </form>
    </div>
  );
};

export default AddAnsibleGroup;
