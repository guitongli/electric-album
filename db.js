const spicedPg = require("spiced-pg");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    // const { db_user, db_secret } = require("./secrets.json");
    db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);
}

module.exports.getImgs = () => {
    const q = `SELECT * FROM images;`;
    return db.query(q);
};
