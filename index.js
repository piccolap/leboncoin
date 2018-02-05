var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require("lodash");

var offers = [];
var idCounter = 0;

app.use(bodyParser.urlencoded({extended: true}));

var multer = require('multer');
var upload = multer ({dest: 'uploads/'});

app.use(express.static("public"));

app.get('/deposer', function(req, res) {
    res.render('placeAnOffer.ejs');
});

app.post('/deposer', function(req, res){
    var offerTitle = req.body.offerTitle;
    var offerText = req.body.offerText;
    var offerPrice = req.body.offerPrice;
    var offerPicture = req.body.offerPicture;
    var nickName = req.body.nickName;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    
    var newOffer = {
        id: idCounter,
        offerTitle: offerTitle,
        offerTex: offerText,
        offerPrice: offerPrice,
        offerPicture: offerPicture,
        nickName: nickName,
        email: email,
        phoneNumber: phoneNumber,
    };

    offers.push(newOffer);
    //push the new ads
    res.redirect('/annonce/'+ idCounter);

    idCounter++;
});

app.get('/annonce/:id', function(req, res){
    getOffer(req.params.id, function(offer) {
        console.log(offer);
        res.render('offer.ejs', {offer: offer});
    });
});

app.listen(3000, function() {
    console.log('server started');
});

function getOffer(id, cb) {
    var offer = _.filter(offers, ['id', id]);
    return cb(offer);
}