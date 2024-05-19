"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./servers.module.css";

async function fetchServers() {
  const response = await fetch("/api/servers");
  if (!response.ok) {
    throw new Error("Failed to fetch servers");
  }
  return response.json();
}

async function fetchAnsibleGroups() {
  const response = await fetch("/api/ansibleGroup");
  if (!response.ok) {
    throw new Error("Failed to fetch ansible groups");
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
  if (!items) {
    return <div>Loading...</div>;
  }

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
              {item.group_name || item.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function AnsibleGroupModal({ ansibleGroups, onSelect, onClose }) {
  if (!ansibleGroups) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Select an Ansible Group</h2>
        <ul>
          <li
            key="all"
            onClick={() => onSelect(null)}
            style={{ backgroundColor: "lightblue", marginTop: "15px" }}
          >
            All ansible groups
          </li>
          {ansibleGroups.map((group) => (
            <li key={group.id} onClick={() => onSelect(group)}>
              {group.group_name}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Servers() {
  const [servers, setServers] = useState([]);
  const [ansibleGroups, setAnsibleGroups] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);

  const deleteServer = async (serverId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this server?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/servers/${serverId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Update local state to reflect the deletion
          setServers(servers.filter((server) => server.id !== serverId));
        } else {
          console.error("Failed to delete server");
        }
      } catch (error) {
        console.error("Error deleting server:", error);
      }
    }
  };

  useEffect(() => {
    fetchServers().then((data) => {
      setServers(data);
    });
  }, []);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupModal(false);
  };

  const handleEnvironmentSelect = (environment) => {
    setSelectedEnvironment(environment);
    setShowEnvironmentModal(false);
  };

  const filteredServers = servers.filter((server) => {
    return (
      (!selectedGroup || server.ansible_group_id === selectedGroup.id) &&
      (!selectedEnvironment || server.environment_id === selectedEnvironment.id)
    );
  });

  return (
    <main className={styles.serversPage}>
      <div className={styles.addServerLink}>
        <Link href="../addServer">
          <span className={styles.link}>Add server</span>
        </Link>
      </div>
      <div className={styles.serversContainer}>
        <h1>Servers</h1>
        <table className={styles.serverTable}>
          <thead>
            <tr>
              <th>Hostname</th>
              <th>
                Ansible Group
                <span
                  onClick={() => setShowGroupModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⏬
                </span>
              </th>

              <th>
                Environment
                <span
                  onClick={() => setShowEnvironmentModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⏬
                </span>
              </th>
              <th>Softwares</th>
            </tr>
          </thead>
          <tbody>
            {filteredServers.map((server) => (
              <tr key={server.id}>
                <td>
                  <Link href={`/servers/${server.id}`}>
                    <span className={styles.link}>{server.hostname}</span>
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/ansibleGroups/${server.ansible_group?.id || ""}`}
                  >
                    <span className={styles.link}>
                      {server.ansible_group?.group_name || "N/A"}
                    </span>
                  </Link>
                </td>
                <td>
                  <Link href={`/environments/${server.environment?.id || ""}`}>
                    <span className={styles.link}>
                      {server.environment ? server.environment.name : "N/A"}
                    </span>
                  </Link>
                </td>
                <td>
                  {server.softwares.map((softwareVersion, index) => (
                    <React.Fragment key={softwareVersion.id}>
                      <Link href={`/softwareVersions/${softwareVersion.id}`}>
                        <span
                          className={styles.link}
                          style={{
                            backgroundColor:
                              softwareVersion.software?.latest_release ===
                              softwareVersion.name
                                ? "green"
                                : "red",
                          }}
                        >
                          {softwareVersion.software?.name +
                            " " +
                            softwareVersion.name}
                        </span>
                      </Link>
                      {index < server.softwares.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showGroupModal && (
        <SelectionModal
          items={ansibleGroups}
          onSelect={handleGroupSelect}
          onClose={() => setShowGroupModal(false)}
          title="Select an Ansible Group"
          allLabel="All ansible groups"
        />
      )}
      {showEnvironmentModal && (
        <SelectionModal
          items={environments}
          onSelect={handleEnvironmentSelect}
          onClose={() => setShowEnvironmentModal(false)}
          title="Select an Environment"
          allLabel="All environments"
        />
      )}
    </main>
  );
}
