const express = require("express");
const app = express();
const db = require("./db");
app.use(express.static("public"));

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

app.listen(8080, () => console.log("hi"));
