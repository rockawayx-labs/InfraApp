"use client";
import styles from "../environments/servers.module.css";
import { useState, useEffect } from "react";
import prisma from "../../../lib/prisma";

async function getAnsibleGroup(groupId) {
  const groups = await prisma.ansibleGroup.findUnique({
    where: { id: groupId },
    include: {
      servers: true,
      softwares: true,
    },
  });
  return groups;
}

async function getAllServersAndSoftwares() {
  const servers = await prisma.Server.findMany({});
  const softwares = await prisma.Software.findMany({});
  return { servers, softwares };
}

export default function Groups(groupID) {
  const [group, setGroup] = useState(null);
  const [allServers, setAllServers] = useState([]);
  const [allSoftwares, setAllSoftwares] = useState([]);
  const [selectedServers, setSelectedServers] = useState([]);
  const [selectedSoftwares, setSelectedSoftwares] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const id = parseInt(groupID);
      const fetchedGroup = await getAnsibleGroup(id);
      setGroup(fetchedGroup);

      const serversAndSoftwares = await getAllServersAndSoftwares();
      setAllServers(serversAndSoftwares.servers);
      setAllSoftwares(serversAndSoftwares.softwares);
    }

    fetchData();
  }, [groupID]);

  const handleServerChange = (serverId) => {
    const updatedServers = selectedServers.includes(serverId)
      ? selectedServers.filter((id) => id !== serverId)
      : [...selectedServers, serverId];
    setSelectedServers(updatedServers);
  };

  const handleSoftwareChange = (softwareId) => {
    const updatedSoftwares = selectedSoftwares.includes(softwareId)
      ? selectedSoftwares.filter((id) => id !== softwareId)
      : [...selectedSoftwares, softwareId];
    setSelectedSoftwares(updatedSoftwares);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  if (!group) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.groupForm}>
      <div>
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
          value={group.group_name}
          onChange={(e) => setGroup({ ...group, group_name: e.target.value })}
        />
      </div>

      <div>
        <label>Servers:</label>
        {allServers.map((server) => (
          <div key={server.id}>
            <input
              type="checkbox"
              id={`server-${server.id}`}
              checked={selectedServers.includes(server.id)}
              onChange={() => handleServerChange(server.id)}
            />
            <label htmlFor={`server-${server.id}`}>{server.name}</label>
          </div>
        ))}
      </div>

      <div>
        <label>Softwares:</label>
        {allSoftwares.map((software) => (
          <div key={software.id}>
            <input
              type="checkbox"
              id={`software-${software.id}`}
              checked={selectedSoftwares.includes(software.id)}
              onChange={() => handleSoftwareChange(software.id)}
            />
            <label htmlFor={`software-${software.id}`}>{software.name}</label>
          </div>
        ))}
      </div>

      <button type="submit">Save Changes</button>
    </form>
  );
}
