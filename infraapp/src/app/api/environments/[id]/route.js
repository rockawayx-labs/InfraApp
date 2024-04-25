import prisma from "../../../../../lib/prisma";

export async function GET(req, { params }) {
  const environmentID = parseInt(params.id);

  const environment = await prisma.Environment.findUnique({
    where: {
      id: environmentID,
    },
    include: {
      servers: true,
      approvals: { include: { software_version: true } },
    },
  });
  return new Response(JSON.stringify(environment), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req, { params }) {
  const environmentId = parseInt(params.id);
  console.log(environmentId);
  if (isNaN(environmentId)) {
    return new Response(JSON.stringify("Invalid ID"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // First, delete related approvals
    await prisma.approval.deleteMany({
      where: { environment_id: environmentId },
    });

    // Then, delete the environment
    await prisma.Environment.delete({
      where: { id: environmentId },
    });

    return new Response(
      JSON.stringify({ message: "Environment deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting environment:", error);

    let status = 500;
    let errorMessage = "Internal Server Error";

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      status = 404;
      errorMessage = "Environment not found";
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
  const environmentId = parseInt(params.id);
  if (isNaN(environmentId)) {
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
  const { name, servers } = body;

  try {
    await prisma.Environment.update({
      where: { id: environmentId },
      data: { name },
    });

    await prisma.Environment.update({
      where: { id: environmentId },
      data: {
        servers: {
          set: servers.map((serverId) => ({ id: serverId })),
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "Environment updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating Environment:", error);
    return new Response(
      JSON.stringify({ error: "Error updating Environment" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
