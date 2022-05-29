const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded())
app.use(cors());

app.get('/', function(req, res) {
    res.status(200).sendFile(path.join(__dirname, '/index.html'));
});

app.get('/:page', function(req, res) {
    if(req.params.page==='favicon.ico') return res.status(200);
    res.status(200).sendFile(path.join(__dirname, `/${req.params.page}`), null, function(err){
        // if(err && err.code==='ENOENT'){
        //     res.status(404).sendFile(path.join(__dirname, PUBLIC_DIR, `/404.html`));
        // }
    });
});

// // ALWAYS stay at bottom, 404 catch all
// app.get('*', function(req, res){
//     res.status(404).sendFile(path.join(__dirname, PUBLIC_DIR, `/404.html`));
// });

app.listen(PORT, ()=>{
    console.log("Listening on port "+PORT);
});