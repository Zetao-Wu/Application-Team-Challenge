const http = require("http");
const { app } = require("./app");

const PORT = 5001;

function startServer() {
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
}

startServer();
