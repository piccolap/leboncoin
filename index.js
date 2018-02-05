var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var ads = [];

app.use(bodyParser.urlencoded({extended: true}));

var multer = require('multer');
var upload = multer ({dest: 'uploads/'});

app.use(express.static("public"));

app.get('/deposer', function(req, res) {
    res.render('placeAnOffer.ejs');
});

app.post('/deposer', function(req, res){

    
    //push the new ads
    res.redirect('/deposer/0');
})

app.listen(3000, function() {
    console.log('server started');
});
