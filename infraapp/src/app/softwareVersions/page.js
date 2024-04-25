"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./servers.module.css";

async function fetchSoftwareVersions() {
  const response = await fetch("/api/SoftwareVersions");
  if (!response.ok) {
    throw new Error("Failed to fetch software versions");
  }
  return response.json();
}

async function fetchSoftwares() {
  const response = await fetch("/api/Softwares");
  if (!response.ok) {
    throw new Error("Failed to fetch softwares");
  }
  return response.json();
}

async function fetchEnvironments() {
  const response = await fetch("/api/environments");
  if (!response.ok) {
    throw new Error("Failed to fetch environments");
  }
  return response.json();
}

function SelectionModal({ items, onSelect, onClose, title, allLabel }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <ul>
          <li
            key="all"
            onClick={() => onSelect(null)}
            style={{ backgroundColor: "lightblue" }}
          >
            {allLabel}
          </li>
          {items.map((item) => (
            <li key={item.id} onClick={() => onSelect(item)}>
              {item.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function SoftwareVersionsPage() {
  const [softwareVersions, setSoftwareVersions] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [showSoftwareModal, setShowSoftwareModal] = useState(false);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);

  useEffect(() => {
    fetchSoftwareVersions().then(setSoftwareVersions);
    fetchSoftwares().then(setSoftwares);
    fetchEnvironments().then(setEnvironments);
  }, []);

  const handleSoftwareSelect = (software) => {
    setSelectedSoftware(software);
    setShowSoftwareModal(false);
  };

  const handleEnvironmentSelect = (environment) => {
    // First, check if environment is null which means "All environments" was selected
    if (environment === null) {
      setSelectedEnvironment(null); // Clear any specific environment filter
    } else if (environment.id === "notApproved") {
      setSelectedEnvironment("notApproved"); // Specific handling for "Not Approved"
    } else {
      setSelectedEnvironment(environment); // Regular environment selection
    }
    setShowEnvironmentModal(false);
  };

  const filteredSoftwareVersions = softwareVersions.filter((version) => {
    const softwareMatch = selectedSoftware
      ? version.software?.id === selectedSoftware.id
      : true;

    const environmentMatch = () => {
      if (selectedEnvironment === "notApproved") {
        return version.approvals.length === 0; // Correct check for no approvals
      } else if (selectedEnvironment) {
        return version.approvals.some(
          (approval) => approval.environment?.id === selectedEnvironment.id
        );
      }
      return true; // No environment filter applied
    };

    return softwareMatch && environmentMatch();
  });

  return (
    <main className={styles.serversPage}>
      <div className={styles.addServerLink}>
        <Link href="../addSoftwareVersion">Add Software Version</Link>
      </div>
      <div className={styles.serversContainer}>
        <h1>Software Versions</h1>
        <table className={styles.serverTable}>
          <thead>
            <tr>
              <th>
                Software
                <span
                  onClick={() => setShowSoftwareModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  ⏬
                </span>
              </th>
              <th>Name</th>
              <th>GitHub</th>
              <th>Servers</th>
              <th>
                Approved in
                <span
                  onClick={() => setShowEnvironmentModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  ⏬
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSoftwareVersions.map((version) => (
              <tr key={version.id}>
                <td>
                  {version.software && (
                    <Link href={`/softwares/${version.software.id}`}>
                      {version.software.name}
                    </Link>
                  )}
                </td>
                <td>
                  <Link href={`/softwareVersions/${version.id}`}>
                    {version.name}
                  </Link>
                </td>
                <td>
                  {version.github && (
                    <a
                      href={version.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  )}
                </td>
                <td>
                  {version.servers.map((server, index) => (
                    <React.Fragment key={server.id}>
                      <Link href={`/servers/${server.id}`}>
                        {server.hostname}
                      </Link>
                      {index < version.servers.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {version.approvals.map((approval, index) => (
                    <React.Fragment key={index}>
                      {approval.environment && (
                        <Link href={`/environments/${approval.environment.id}`}>
                          {approval.environment.name}
                        </Link>
                      )}
                      {index < version.approvals.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showSoftwareModal && (
        <SelectionModal
          items={softwares}
          onSelect={handleSoftwareSelect}
          onClose={() => setShowSoftwareModal(false)}
          title="Select a Software"
          allLabel="All Softwares"
        />
      )}
      {showEnvironmentModal && (
        <SelectionModal
          items={[{ id: "notApproved", name: "Not Approved" }, ...environments]}
          onSelect={handleEnvironmentSelect}
          onClose={() => setShowEnvironmentModal(false)}
          title="Select an Environment"
          allLabel="All Environments"
        />
      )}
    </main>
  );
}

export default SoftwareVersionsPage;
