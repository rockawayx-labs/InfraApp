import prisma from "../../../../../../lib/prisma"; // Adjust the import path according to your project structure

export async function GET(req, { params }) {
  try {
    const swID = parseInt(params.id);
    const versions = await prisma.SoftwareVersion.findMany({
      where: {
        software_id: swID,
      },
      orderBy: {
        name: "asc",
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

    const versionsWithApprovals = versions.filter(
      (version) => version.approvals.length > 0
    );

    return new Response(JSON.stringify(versionsWithApprovals), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch software versions:", error);
  }
}
