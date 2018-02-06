var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require("lodash");

var offers = [
    {
        id: 0,
        offerTitle: "mon titre",
        offerText: "super lampe à vendre",
        offerPrice: "100 €",
        offerPicture: "aebfd6fb84b7721e3f9971c491b10cfa",
        offerCity: "Paris",
        nickName: "lilie",
        email: 'rama@gmail.com',
        phoneNumber: '0650505050',
    }
];
var idCounter = 0;

app.use(bodyParser.urlencoded({extended: true}));

var multer = require('multer');
var upload = multer ({dest: 'public/uploads/'});

app.use(express.static("public"));

app.get('/', function(req, res){
    res.render('home.ejs', {offers: offers});
});

app.get('/deposer', function(req, res) {
    res.render('placeAnOffer.ejs');
});

app.post('/deposer', upload.single("offerPicture"), function(req, res){
    var offerTitle = req.body.offerTitle;
    var offerText = req.body.offerText;
    var offerPrice = req.body.offerPrice;
    var offerPicture = req.file.filename;
    var nickName = req.body.nickName;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    var offerCity = req.body.offerCity;
    
    var newOffer = {
        id: idCounter,
        offerTitle: offerTitle,
        offerText: offerText,
        offerPrice: offerPrice,
        offerPicture: offerPicture,
        offerCity: offerCity,
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
    var offer = _.find(offers, ['id', parseInt(req.params.id)]);
    res.render('offer.ejs', {offer: offer});
});

app.listen(3000, function() {
    console.log('server started');
});