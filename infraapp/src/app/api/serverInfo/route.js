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
      // Perform your data processing here
      console.log('Received data:');
      console.log('Server:', server);
      console.log('Software:', software);
      console.log('Version:', version);
  
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