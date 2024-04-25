import prisma from "../../../../lib/prisma";

export async function GET() {
  try {
    const softwares = await prisma.Software.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        approved_version_test: true,
        approved_version_main: true,
        newest_version: true,
        versions: true,
        ansible_groups: true,
      },
    });
    return new Response(JSON.stringify(softwares), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch softwares" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
