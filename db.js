const spicedPg = require("spiced-pg");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    // const { db_user, db_secret } = require("./secrets.json");
    db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);
}

module.exports.getImgs = () => {
    const q = `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 3;`;
    return db.query(q);
};

module.exports.getImg = (id) => {
    const q = `SELECT * FROM images
    WHERE id = $1;`;
    const params = [id];
    return db.query(q, params);
};
module.exports.insertImg = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getComments = (image_id) => {
    const q = `SELECT * FROM comments
    WHERE image_id = $1
    ORDER BY created_at DESC;`;
    const params = [image_id];
    return db.query(q, params);
};

module.exports.insertCom = (image_id, username, content) => {
    const q = `INSERT INTO comments (image_id, username, content)
    VALUES ($1, $2, $3)
    RETURNING *;`;
    const params = [image_id, username, content];
    return db.query(q, params);
};

module.exports.getMore = (lowestId) => {
    const q = `SELECT url, title, id, (
      SELECT id FROM images
      ORDER BY id ASC
      LIMIT 1
  ) AS "lowestId" FROM images
  WHERE id < $1
  ORDER BY id DESC
  LIMIT 3;`;
  const params = [lowestId]
    return db.query(q, params);
};

module.exports.count =() => {
    const q = `SELECT id
FROM images
WHERE id = ( SELECT MAX(id) FROM images );`;
return db.query(q)
}