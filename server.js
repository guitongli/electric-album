const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/gallery", (req, res) => {
    db.getImgs()
        .then((result) => {
            const chronolist = result.rows.sort(function (a, b) {
                return new Date(b.created_at) - new Date(a.created_at);
            });
            res.json(chronolist);

            console.log("refreshed");
        })
        .catch((err) => console.log(err));
});
app.post("/upload", uploader.single("file"), (req, res) => {
    console.log("file", req.file, "body", req.body);
    if (req.file) {
        res.json({ succes: true });
    } else {
        res.json({ success: false });
        console.log("why");
    }
});
app.listen(8080, () => console.log("hi"));
