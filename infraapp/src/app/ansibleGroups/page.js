import prisma from "../../../lib/prisma";
import styles from "./servers.module.css";
import Link from "next/link";
import React from "react";

async function getAnsibleGroups() {
  const groups = await prisma.ansibleGroup.findMany({
    include: {
      servers: true,
      softwares: true,
      ecosystem: true,
    },
  });
  return groups;
}

export default async function Groups() {
  const groups = await getAnsibleGroups();
  console.log({ groups });
  return (
    <main className={styles.serversPage}>
      <div className={styles.addServerLink}>
        <Link href="../addAnsibleGroup">
          <span className={styles.link}>Add Group</span>
        </Link>
      </div>
      <div className={styles.serversContainer}>
        <h1>Ansible Groups</h1>
        <table className={styles.serverTable}>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Ecosystem</th>
              <th>Softwares</th>
              <th>Servers</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>
                  <Link href={`/ansibleGroups/${group.id}`} className="link">
                    {group.group_name}
                  </Link>
                </td>
                <td>
                  {group.ecosystem ? (
                    <Link
                      href={`/ecosystems/${group.ecosystem.id}`}
                      className="link"
                    >
                      {group.ecosystem.name}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  {group.softwares.map((software, index) => (
                    <React.Fragment key={software.id}>
                      <Link href={`/softwares/${software.id}`} className="link">
                        {software.name}
                      </Link>
                      {index < group.softwares.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {group.servers.map((server, index) => (
                    <React.Fragment key={server.id}>
                      <Link href={`/servers/${server.id}`} className="link">
                        {server.hostname}
                      </Link>
                      {index < group.servers.length - 1 ? ", " : ""}
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
