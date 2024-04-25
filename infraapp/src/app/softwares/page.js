"use client";
import styles from "../servers/servers.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Software() {
  const [softwares, setSoftwares] = useState([]);

  useEffect(() => {
    const fetchSoftwares = async () => {
      try {
        const response = await fetch("/api/Softwares");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const softwaresData = await response.json();
        setSoftwares(softwaresData);
      } catch (error) {
        console.error("Error fetching softwares:", error);
      }
    };

    fetchSoftwares();
  }, []);

  const updateAllReleases = async () => {
    // Loop through each software item
    for (const software of softwares) {
      if (!software.github) {
        console.error("No GitHub URL provided for software:", software.name);
        continue; // Skip this software if no GitHub URL is provided
      }

      const apiUrl = `/api/github-latest-release/repoUrl=${software.github}`;
      try {
        const releaseResponse = await fetch(apiUrl);
        if (!releaseResponse.ok) {
          throw new Error(`HTTP error! Status: ${releaseResponse.status}`);
        }
        const releaseData = await releaseResponse.json();
        const latestRelease = releaseData.latestRelease; // Assume releaseData is in the correct format

        // Prepare the update payload as expected by the server-side API
        const updatePayload = {
          name: software.name,
          approved_version_test: software.approved_version_test?.id,
          approved_version_main: software.approved_version_main?.id,
          github: software.github,
          ansible_groups: software.ansible_groups.map((group) => group.id),
          latest_release: latestRelease, // New data from GitHub
        };

        // Update the local state
        const updatedSoftwares = softwares.map((s) =>
          s.id === software.id ? { ...s, latestRelease: latestRelease } : s
        );
        setSoftwares(updatedSoftwares);

        // Update the database
        await fetch(`/api/Softwares/${software.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });
      } catch (error) {
        console.error(
          "Error fetching and updating release for",
          software.name,
          error
        );
      }
    }
    window.location.reload();
  };

  return (
    <main className={styles.serversPage}>
      <div className={styles.addServerLink}>
        <Link href="../addSoftware">
          <span className={styles.link}>Add software</span>
        </Link>
      </div>
      <button onClick={updateAllReleases} className={styles.updateButton}>
        Update All Releases
      </button>
      <div className={styles.serversContainer}>
        <h1>Softwares</h1>
        <table className={styles.serverTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Approved Version Test</th>
              <th>Approved Version Main</th>
              <th>Newest Version</th>
              <th>Versions</th>
              <th>Ansible Groups</th>
              <th>GitHub</th>
            </tr>
          </thead>
          <tbody>
            {softwares.map((software) => (
              <tr key={software.id}>
                <td>
                  <Link href={`/softwares/${software.id}`}>
                    <span className={styles.link}>{software.name}</span>
                  </Link>
                </td>
                <td
                  style={{
                    backgroundColor:
                      software.approved_version_test?.name ===
                      software.latest_release
                        ? "green"
                        : "red",
                  }}
                >
                  {software.approved_version_test && (
                    <Link
                      href={`/softwareVersions/${software.approved_version_test.id}`}
                    >
                      {software.approved_version_test.name}
                    </Link>
                  )}
                </td>
                <td
                  style={{
                    backgroundColor:
                      software.approved_version_main?.name ===
                      software.latest_release
                        ? "green"
                        : "red",
                  }}
                >
                  {software.approved_version_main && (
                    <Link
                      href={`/softwareVersions/${software.approved_version_main.id}`}
                    >
                      {software.approved_version_main.name}
                    </Link>
                  )}
                </td>
                <td>{software.latest_release || "N/A"}</td>
                <td>
                  {software.versions.map((v, index) => (
                    <React.Fragment key={v.id}>
                      <Link href={`/softwareVersions/${v.id}`}>
                        <span className={styles.link}>{v.name}</span>
                      </Link>
                      {index < software.versions.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {software.ansible_groups.map((ag, index) => (
                    <React.Fragment key={ag.id}>
                      <Link href={`/ansibleGroups/${ag.id}`}>
                        <span className={styles.link}>{ag.group_name}</span>
                      </Link>
                      {index < software.ansible_groups.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {software.github ? (
                    <a
                      href={software.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {software.github}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
