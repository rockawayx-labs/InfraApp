function SoftwareVersion({ id, name, github, software, servers, approved }) {
  // Ensure servers is always an array
  const serverList = Array.isArray(servers) ? servers : [];

  return (
    <div>
      <h2>{name}</h2>
      {github && (
        <p>
          <a href={github} target="_blank" rel="noopener noreferrer">
            {github}
          </a>
        </p>
      )}
      <p>Software: {software?.name || "N/A"}</p>

      {serverList.length > 0 ? (
        <>
          <h3>Servers:</h3>
          <ul style={{ listStyleType: "none" }}>
            {serverList.map((server) => (
              <li key={server.id}>{server.hostname}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No servers</p>
      )}

      <p>Approved: {approved ? "Yes" : "No"}</p>
    </div>
  );
}

export default SoftwareVersion;
