// Current HTTP Request method is REST API

// Load environment variables from file if not on production server
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Initialize required packages (express: Server router, path: string concat, fs: file reader)
const express = require("express");
const path = require("path");
const fs = require("fs");

// Inititialze express server and port
const app = express();
const port = process.env.PORT || 5000;

// Initialize routers
const sophosRouter = require("./routes/sophos");
const dattoRouter = require("./routes/datto");
const agentsRouter = require("./routes/agents");

// Set path for public folder for UI
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Map routes to routers
app.use("/api/sophos", sophosRouter);
app.use("/api/datto", dattoRouter);
app.use("/api/agents", agentsRouter);

// Send client Index.html for web data (Doesn't work without static build from React)
if (process.env.NODE_ENV === "production") {
    app.get("/*", (req, res) => {
        const filePath = path.join(__dirname, "frontend", "build", "index.html");
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                return console.log(err);
            } else {
                res.send(data);
            }
        });
    });
}

// Start server listening on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});