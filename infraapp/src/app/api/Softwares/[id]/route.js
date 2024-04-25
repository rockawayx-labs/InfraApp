import prisma from "../../../../../lib/prisma";
export async function GET(req, { params }) {
  const softwareID = parseInt(params.id);

  const software = await prisma.Software.findUnique({
    where: { id: softwareID },
    include: {
      approved_version_test: true,
      approved_version_main: true,
      newest_version: true,
      versions: true,
      ansible_groups: true,
    },
  });
  return new Response(JSON.stringify({ software }));
}

export async function POST(req, { params }) {
  const softwareId = parseInt(params.id);
  if (isNaN(softwareId)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = JSON.parse(await req.text());
  const {
    name,
    approved_version_test,
    approved_version_main,
    github,
    ansible_groups,
    latest_release, // Include latest_release in the destructuring
  } = data;

  try {
    const updateData = {
      name,
      github,
      latest_release: latest_release, // Update latest_release field
      approved_version_test: approved_version_test
        ? { connect: { id: approved_version_test } }
        : {},
      approved_version_main: approved_version_main
        ? { connect: { id: approved_version_main } }
        : {},
      ansible_groups: {
        set: ansible_groups.map((id) => ({ id })),
      },
    };

    await prisma.software.update({
      where: { id: softwareId },
      data: updateData,
    });

    return new Response(
      JSON.stringify({ message: "Software updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating Software:", error);
    return new Response(JSON.stringify({ error: "Error updating Software" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req, { params }) {
  const softwareId = parseInt(params.id);
  if (isNaN(softwareId)) {
    return new Response(JSON.stringify("Invalid ID"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    await prisma.software.delete({
      where: { id: softwareId },
    });

    return new Response(
      JSON.stringify({ message: "Software deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting software:", error);

    let status = 500;
    let errorMessage = "Internal Server Error";

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      status = 404;
      errorMessage = "Software not found";
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
