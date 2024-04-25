export async function GET() {
  try {
    const versions = await prisma.SoftwareVersion.findMany({
      orderBy: {
        name: "asc", // Sorts the versions alphabetically by name in ascending order
      },

      include: {
        software: true,
        servers: true,
        approvals: {
          include: {
            environment: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(versions), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch software versions" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
