"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const UpdateSoftware = ({ params }) => {
  const id = parseInt(params.id);

  const [software, setSoftware] = useState(null);
  const [softwareVersions, setSoftwareVersions] = useState([]);
  const [ansibleGroups, setAnsibleGroups] = useState([]);
  const [name, setName] = useState("");
  const [approvedVersionTest, setApprovedVersionTest] = useState(null);
  const [approvedVersionMain, setApprovedVersionMain] = useState(null);
  const [github, setGithub] = useState("");
  const [selectedAnsibleGroups, setSelectedAnsibleGroups] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/Softwares/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setSoftware(data.software);
          setName(data.software.name);
          setApprovedVersionTest(data.software.approved_version_test?.id);
          setApprovedVersionMain(data.software.approved_version_main?.id);
          setGithub(data.software.github);
          setSelectedAnsibleGroups(
            data.software.ansible_groups.map((ag) => ag.id)
          );

          // Fetch software versions associated with this software
          fetch(`/api/SoftwareVersions/softwareId/${id}`)
            .then((response) => response.json())
            .then((data) => setSoftwareVersions(data))
            .catch((error) =>
              console.error("Error fetching software versions:", error)
            );
        })
        .catch((error) => console.error("Error fetching software:", error));

      fetch("/api/AnsibleGroups")
        .then((response) => response.json())
        .then((data) => setAnsibleGroups(data))
        .catch((error) =>
          console.error("Error fetching ansible groups:", error)
        );
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Confirmation dialog before proceeding
    const isConfirmed = window.confirm(
      "Are you sure you want to update this software?"
    );
    if (!isConfirmed) {
      return; // Stop the function if the user does not confirm
    }

    const updatedSoftware = {
      name,
      approved_version_test: approvedVersionTest,
      approved_version_main: approvedVersionMain,
      github,
      ansible_groups: selectedAnsibleGroups,
      latest_release: "",
    };

    const response = await fetch(`/api/Softwares/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSoftware),
    });

    if (response.ok) {
      console.log("Software updated successfully");
      window.alert("Software info updated");
    } else {
      console.error("Failed to update Software");
      window.alert("Failed to update Software");
    }
  };

  const handleAnsibleGroupChange = (groupId) => {
    const updatedGroups = selectedAnsibleGroups.includes(groupId)
      ? selectedAnsibleGroups.filter((id) => id !== groupId)
      : [...selectedAnsibleGroups, groupId];
    setSelectedAnsibleGroups(updatedGroups);
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this software?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/Softwares/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.alert("Software deleted successfully");
          // Redirect or perform further actions as needed
        } else {
          console.error("Failed to delete software");
        }
      } catch (error) {
        console.error("Error deleting software:", error);
      }
    }
  };

  if (!software) return <div>Loading...</div>;

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
        {/* Software Name */}
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="softwareName" style={{ marginBottom: "5px" }}>
            Software Name:
          </label>
          <input
            type="text"
            id="softwareName"
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

        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="approvedVersionTest" style={{ marginBottom: "5px" }}>
            Approved Version Test:
          </label>
          <select
            id="approvedVersionTest"
            value={approvedVersionTest ?? ""}
            onChange={(e) =>
              setApprovedVersionTest(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            style={{
              color: "white",
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
            }}
          >
            {softwareVersions.length === 0 ? (
              <option value="" disabled>
                No versions available
              </option>
            ) : (
              <>
                <option
                  value=""
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Select a version
                </option>
                {softwareVersions.map((version) => (
                  <option
                    key={version.id}
                    value={version.id}
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {version.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="approvedVersionMain" style={{ marginBottom: "5px" }}>
            Approved Version Main:
          </label>
          <select
            id="approvedVersionMain"
            value={approvedVersionMain ?? ""}
            onChange={(e) =>
              setApprovedVersionMain(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            style={{
              color: "white",
              width: "100%",
              padding: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
            }}
          >
            {softwareVersions.length === 0 ? (
              <option value="" disabled>
                No versions available
              </option>
            ) : (
              <>
                <option
                  value=""
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Select a version
                </option>
                {softwareVersions.map((version) => (
                  <option
                    key={version.id}
                    value={version.id}
                    style={{ backgroundColor: "black", color: "white" }}
                  >
                    {version.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* GitHub URL */}
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label htmlFor="githubUrl" style={{ marginBottom: "5px" }}>
            GitHub URL:
          </label>
          <input
            type="text"
            id="githubUrl"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
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

        {/* Ansible Groups Checkboxes */}
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label style={{ marginBottom: "5px" }}>Ansible Groups:</label>
          {ansibleGroups.map((group) => (
            <div
              key={group.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <input
                type="checkbox"
                id={`ansibleGroup-${group.id}`}
                checked={selectedAnsibleGroups.includes(group.id)}
                onChange={() => handleAnsibleGroupChange(group.id)}
                style={{ marginRight: "10px" }}
              />
              <Link href={`/ansibleGroups/${group.id}`} passHref>
                <span style={{ color: "white", cursor: "pointer" }}>
                  {group.group_name}
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
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Update Software
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
          Delete Software
        </button>
      </form>
    </div>
  );
};

export default UpdateSoftware;
