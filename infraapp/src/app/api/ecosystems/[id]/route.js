import prisma from "../../../../../lib/prisma";

export async function GET(req, { params }) {
  const ecosystemID = parseInt(params.id);

  const ecosystem = await prisma.Ecosystem.findUnique({
    where: {
      id: ecosystemID,
    },
    include: {
      groups: true,
    },
  });
  return new Response(JSON.stringify(ecosystem), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(req, { params }) {
    const ecosystemId = parseInt(params.id);
    if (isNaN(ecosystemId)) {
      return new Response(JSON.stringify("Invalid ID"), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  
    try {
      // First, delete related data (if any)
      // Here, you can add additional deletion logic if needed
  
      // Then, delete the ecosystem
      await prisma.ecosystem.delete({
        where: { id: ecosystemId },
      });
  
      return new Response(
        JSON.stringify({ message: "Ecosystem deleted successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error deleting ecosystem:", error);
  
      let status = 500;
      let errorMessage = "Internal Server Error";
  
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        status = 404;
        errorMessage = "Ecosystem not found";
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
    const ecosystemId = parseInt(params.id);
    if (isNaN(ecosystemId)) {
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
    const { name } = body;
  
    try {
      await prisma.ecosystem.update({
        where: { id: ecosystemId },
        data: { name },
      });
  
      return new Response(
        JSON.stringify({ message: "Ecosystem updated successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error updating ecosystem:", error);
      return new Response(
        JSON.stringify({ error: "Error updating ecosystem" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }