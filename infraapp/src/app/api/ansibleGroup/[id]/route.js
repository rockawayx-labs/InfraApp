export async function GET(req, { params }) {
  const groupID = parseInt(params.id);

  const ansibleGroup = await prisma.ansibleGroup.findUnique({
    where: { id: groupID },
    include: {
      servers: true,
      softwares: true,
    },
  });
  return new Response(JSON.stringify({ ansibleGroup }));
}

export async function DELETE(req, { params }) {
  const ansibleGroupId = parseInt(params.id);
  if (isNaN(ansibleGroupId)) {
    return new Response(JSON.stringify("Invalid ID"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    await prisma.ansibleGroup.delete({
      where: { id: ansibleGroupId },
    });

    return new Response(
      JSON.stringify({ message: "Ansible Group deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting Ansible Group:", error);

    let status = 500;
    let errorMessage = "Internal Server Error";
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      status = 404;
      errorMessage = "Ansible Group not found";
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
