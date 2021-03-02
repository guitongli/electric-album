const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("public"));
const { s3Url } = require("./config.json");

const { s3upload } = require("./s3");

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
app.post("/upload", uploader.single("file"), s3upload, (req, res) => {
    if (req.file) {
        res.json({ succes: true });
    } else {
        res.json({ success: false });
        console.log("why");
    }
    console.log("file", req.file, "body", req.body);

    const { title, username, description } = req.body;

    const { filename } = req.file;
    db.insertImg(s3Url + filename, username, title, description)
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log("save to db problem", err);
        });
});

app.get("/comments/:id", (req, res) => {
    const image_id = req.params.id;
    db.getComments(image_id)
        .then((result) => {
            console.log(result);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(err);
        });
});
app.post("/comment", (req, res) => {
    console.log("he posted oh");
    console.log(req)});

app.get("/images");
app.listen(8080, () => console.log("hi"));
