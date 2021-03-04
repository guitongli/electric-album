const express = require('express');
const app = express();
const db = require('./db');
app.use(express.static('public'));
const { s3Url } = require('./config.json');

const { s3upload } = require('./s3');

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }))
app.get('/gallery', (req, res) => {
    db
        .getImgs()
        .then(result => {
            res.json(result.rows);

            console.log('supplied photos');
        })
        .catch(err => console.log(err));
});

app.get('/gallery/:id', (req, res)=>{
    const {id} = req.params;
    console.log('single image',req.params)
    db.getImg(id).then((result)=>{ 
        res.json(result.rows)
    }).catch((err)=>{console.log(err)})
})
app.post('/upload', uploader.single('file'), s3upload, (req, res) => {
    // if (req.file) {
    //     res.json({ succes: true });
    // } else {
    //     res.json({ success: false });
    //     console.log("why");
    // }
    console.log('file', req.file, 'body', req.body);

    const { title, username, description } = req.body;
    if (req.file.size > 300000) {
        res.sendStatus('oversize');
    }
    const { filename } = req.file;
    db
        .insertImg(s3Url + filename, username, title, description)
        .then(result => {
            db
                .getImgs()
                .then(result => {
                    //    res.json(result.rows);
                    res.redirect('/gallery');
                })
                .catch(err => {
                    console.log('cant send updated photos', err);
                });
        })
        .catch(err => {
            console.log('save to db problem', err);
        });
});

app.get('/comments/:id', (req, res) => {
    const image_id = req.params.id;
    console.log("loading comments")
    db
        .getComments(image_id)
        .then(result => {
            console.log('got all the comments');
            res.json(result.rows);
        })
        .catch(err => {
            console.log(err);
        });
});
app.post('/comment', (req, res) => {
    console.log('got new comment');
    const { image_id, username, comment } = req.body;
    db
        .insertCom(image_id, username, comment)
        .then(result => {
            res.json(result.rows[0]);
            console.log('inserted a comment', result);
        })
        .catch(err => {
            console.log('at insertion', err);
        });
});

app.post('/more/:id', (req, res) => {
    console.log(req.params.id);
    db
        .getMore(req.params.id)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.log(err);
        });
});
app.get('/count', (req, res)=>{
    db.count().then((result)=>{
        res.json(result)
    }).catch((err)=>{console.log(err)})
});
app.listen(8080, () => console.log('hi'));
