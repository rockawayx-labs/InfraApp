const regex = /"server":"([^"]+)".*?(?:"result":"([^\/]+)\/(v\d+\.\d+\.\d+)|"data":{"version":"([^\/]+)\/(v\d+\.\d+\.\d+))/;

// Function to extract server, software name, and version
function extractInfo(input) {
  const match = input.match(regex);
  if (match) {
    const server = match[1];
    const software = match[2] || match[4];
    const version = match[3] || match[5];
    return { server, software, version };
  } else {
    return null;
  }
}

export async function POST(req, { params }) {
    const buffers = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const body = JSON.parse(data);
    const { server, software, version } = extractInfo(JSON.stringify(body));



  
    try {
      
      const existingServer = await prisma.server.findUnique({
        where: {
          hostname: server,
        },
        include: {
          softwares: {
            include: {
              software: true,
            },
          },
        },
      });

      if (!existingServer) {
        return new Response(
          JSON.stringify({ error: 'Server not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const existingSoftwareVersion = await prisma.softwareVersion.findFirst({
        where: {
          name: version,
          software: {
            name: software.toLowerCase(),
          },
        },
      });
  
      if (!existingSoftwareVersion) {
        return new Response(
          JSON.stringify({ error: 'Software version not found or does not match the software name' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(existingSoftwareVersion);
  

      const updatedSoftwares = existingServer.softwares.filter(
        (sv) => sv.software.name !== software.toLowerCase()
      ).map((sv) => ({ id: sv.id }));
  
      // Add the new software version to the server
      updatedSoftwares.push({ id: existingSoftwareVersion.id });
  
      // Update the server's software versions
      await prisma.server.update({
        where: {
          id: existingServer.id,
        },
        data: {
          softwares: {
            set: updatedSoftwares.map((sv) => ({ id: sv.id })),
          },
        },
      });
  
      // Send a success response
      return new Response(
        JSON.stringify({ message: "Data received successfully!" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      // Handle errors
      console.error("Error processing data:", error);
      return new Response(
        JSON.stringify({ error: "Error processing data" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }