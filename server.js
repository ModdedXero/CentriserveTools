if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

const sophosRouter = require("./routes/sophos");

app.use(express.static(path.join(__dirname, "frontend", "build")));

app.use("/api/sophos", sophosRouter);

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});