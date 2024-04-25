export async function GET(req, { params }) {
  const serverID = parseInt(params.id);

  const server = await prisma.Server.findUnique({
    where: { id: serverID },
    include: {
      ansible_group: true,
      environment: true,
      softwares: true,
    },
  });

  if (server && server.softwares) {
    server.softwares.sort((a, b) => a.name.localeCompare(b.name));
  }

  return new Response(JSON.stringify({ server }));
}

export async function DELETE(req, { params }) {
  const serverId = parseInt(params.id);
  if (isNaN(serverId)) {
    return new Response(JSON.stringify("Invalid ID"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const deleteResponse = await prisma.server.delete({
      where: { id: serverId },
    });

    return new Response(
      JSON.stringify({
        message: "Server deleted successfully",
        deleteResponse,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting Server:", error);

    let status = 500;
    let errorMessage = "Internal Server Error";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to delete does not exist
        status = 404;
        errorMessage = "Server not found";
      }
      // Add other error codes as needed
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(req, { params }) {
  const serverId = parseInt(params.id);
  if (isNaN(serverId)) {
    return new Response(JSON.stringify("Invalid ID"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const buffers = [];
  for await (const chunk of req.body) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString();
  const body = JSON.parse(data);

  const { hostname, ansible_group_id, environment_id, software_versions } =
    body;

  try {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: { softwares: true },
    });

    if (!server) {
      return new Response(JSON.stringify({ error: "Server not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentSoftwareVersions = server.softwares.map(
      (software) => software.id
    );

    const softwaresToDisconnect = currentSoftwareVersions.filter(
      (id) => !software_versions.includes(id)
    );

    const softwaresToConnect = software_versions.filter(
      (id) => !currentSoftwareVersions.includes(id)
    );

    await prisma.server.update({
      where: { id: serverId },
      data: {
        hostname: hostname,
        ansible_group_id: ansible_group_id,
        environment_id: environment_id,
        softwares: {
          disconnect: softwaresToDisconnect.map((id) => ({ id })),
          connect: softwaresToConnect.map((id) => ({ id })),
        },
        date_changed: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ message: "Server updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating Server:", error);
    return new Response(JSON.stringify({ error: "Error updating Server" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
