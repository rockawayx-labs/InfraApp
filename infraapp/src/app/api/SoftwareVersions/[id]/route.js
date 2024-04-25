export async function GET(req, { params }) {
  console.log(params);
  const versionID = parseInt(params.id);

  const version = await prisma.SoftwareVersion.findUnique({
    where: { id: versionID },
    include: {
      software: true,
      servers: true,
      approvals: { include: { environment: true } },
    },
  });
  return new Response(JSON.stringify(version), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req, { params }) {
  const softwareVersionId = parseInt(params.id);
  if (isNaN(softwareVersionId)) {
    return new Response(JSON.stringify("Invalid ID"), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buffers = [];
  for await (const chunk of req.body) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString();
  const body = JSON.parse(data);
  const { name, github, servers, environments, email } = body;
  console.log(body);

  try {
    const softwareVersion = await prisma.softwareVersion.findUnique({
      where: { id: softwareVersionId },
      include: { servers: true, approvals: { include: { environment: true } } },
    });

    if (!softwareVersion) {
      return new Response(
        JSON.stringify({ error: "SoftwareVersion not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.softwareVersion.update({
      where: { id: softwareVersionId },
      data: { name, github },
    });

    await updateServers(softwareVersionId, servers, softwareVersion.servers);
    await updateApprovals(
      softwareVersionId,
      environments,
      softwareVersion.approvals,
      email
    );

    return new Response(
      JSON.stringify({ message: "SoftwareVersion updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating SoftwareVersion:", error);
    return new Response(
      JSON.stringify({ error: "Error updating SoftwareVersion" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function updateApprovals(
  softwareVersionId,
  selectedEnvironments,
  currentApprovals,
  email
) {
  const currentEnvironmentIds = currentApprovals
    ? currentApprovals.map((approval) => approval.environment_id)
    : [];

  for (const environmentId of selectedEnvironments) {
    if (!currentEnvironmentIds.includes(environmentId)) {
      await prisma.approval.create({
        data: {
          environment_id: environmentId,
          software_version_id: softwareVersionId,
          date: new Date(),
          approver: email,
        },
      });
    }
  }

  for (const approval of currentApprovals) {
    if (!selectedEnvironments.includes(approval.environment_id)) {
      await prisma.approval.delete({
        where: { id: approval.id },
      });
    }
  }
}

async function updateServers(
  softwareVersionId,
  selectedServers,
  currentServers
) {
  const currentServerIds = currentServers.map((server) => server.id);

  const serversToDisconnect = currentServerIds
    .filter((id) => !selectedServers.includes(id))
    .map((id) => ({ id }));

  const serversToConnect = selectedServers
    .filter((id) => !currentServerIds.includes(id))
    .map((id) => ({ id }));

  await prisma.softwareVersion.update({
    where: { id: softwareVersionId },
    data: {
      servers: {
        disconnect: serversToDisconnect,
        connect: serversToConnect,
      },
    },
  });
}

export async function DELETE(req, { params }) {
  const versionId = parseInt(params.id);

  try {
    await prisma.softwareVersion.delete({
      where: { id: versionId },
    });

    return new Response(
      JSON.stringify({ message: "Software Version deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting software version:", error);

    return new Response(
      JSON.stringify({ error: "Error deleting software version" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
