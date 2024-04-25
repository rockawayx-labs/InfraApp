function AnsibleGroups({ id, group_name, environment, softwares, servers }) {
  return (
    <div>
      <h2>{group_name}</h2>
      <p>Environment ID: {environment}</p>
      <ul>
        <h3>Softwares:</h3>

        {softwares.map((software) => (
          <li key={software.id} style={{ listStyleType: "none" }}>
            {software.name}
          </li>
        ))}
      </ul>
      <ul>
        <h3>Servers:</h3>
        {servers.map((server) => (
          <li key={server.id} style={{ listStyleType: "none" }}>
            Hostname: {server.hostname}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnsibleGroups;
