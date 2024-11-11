const express = require('express')
const lib = require('./utils')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('templates'));

app.get('/short/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const url = await lib.findOriginORM(id);
        console.log(url)
        if (url == null) {
            res.send("<h1>404</h1>");
        }
        else {
            res.redirect(url);
        }
    } catch (err) {
        res.send(err)
    }
})

app.get('/create', async (req, res) => {
    try {
        const url = req.query.url;
        console.log("NTN", url)
        const newID = await lib.shortUrl(url);
        res.send(newID);
    } catch (err) {
        console.log(err)
        res.send(err)
    }
});

app.listen(port, () => {
    console.log(`CS1 app listening on port ${port}`);
})
