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

module.exports.insertImg = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4);`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getComments = (image_id) => {
    const q = `SELECT * FROM comments
    WHERE image_id = $1;`;
    const params = [image_id];
    return db.query(q, params);
};

module.exports.insertCom = (image_id, username, content) => {
    const q = `INSERT INTO comments (image_id, username, content)
    VALUES ($1, $2, $3);`;
    const params = [image_id, username, content];
    return db.query(q, params);
};
