import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const servers = await prisma.Server.findMany({
      include: {
        softwares: {
          include: {
            software: true, // Include the related Software for each SoftwareVersion
          },
        },
        ansible_group: true,
        environment: true,
      },
    });
    return new Response(JSON.stringify(servers), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
