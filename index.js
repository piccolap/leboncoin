var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require("lodash");

var mongoose = require("mongoose");
mongoose.connect("mongodb://10.90.0.34:27017/leboncoin-Tsiry");

var offerSchema = new mongoose.Schema({
    offerTitle: String,
    offerText: String,
    offerPrice: String,
    offerPicture: String,
    offerCity: String,
    nickName: String,
    email: String,
    phoneNumber: String,
    created: { type: Date, default: Date.now }
  });

var BDOffer = mongoose.model("BDOffer", offerSchema);

// var idCounter = 0;

app.use(bodyParser.urlencoded({extended: true}));

var multer = require('multer');
var upload = multer ({dest: 'public/uploads/'});

app.use(express.static("public"));

app.get('/', function(req, res){
    BDOffer.find({}, function(err, offers){
        if(!err) {
            res.render('home.ejs', {offers: offers});
        }
    }) 
});

// Student.find({}, function(err, students) {
//     if (!err) {
//       console.log(students);

app.get('/deposer', function(req, res) {
    res.render('placeAnOffer.ejs');
});

app.post('/deposer', upload.single("offerPicture"), function(req, res){
    // var offerTitle = req.body.offerTitle;
    // var offerText = req.body.offerText;
    // var offerPrice = req.body.offerPrice;
    // var offerPicture = req.file.filename;
    // var nickName = req.body.nickName;
    // var email = req.body.email;
    // var phoneNumber = req.body.phoneNumber;
    // var offerCity = req.body.offerCity;
    
    var newOffer = new BDOffer({
        offerTitle: req.body.offerTitle,
        offerText: req.body.offerText,
        offerPrice: req.body.offerPrice,
        offerPicture: req.file.filename,
        offerCity: req.body.offerCity,
        nickName: req.body.nickName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    });

    newOffer.save(function(err, obj) {
        if (err) {
          console.log("something went wrong");
        } else {
          console.log("we just saved the new Offer " + obj.name);
        }res.redirect('/annonce/'+ obj._id);
      });
    // offers.push(newOffer);
    //push the new ads
    // idCounter++;
});

app.get('/annonce/:id', function(req, res){
    BDOffer.find({offer:offer}, function(err, offer){
        if(!err) {
    // var offer = _.find(offers, ['id', parseInt(req.params.id)]);
        res.render('offer.ejs', {offer: offer});
        }
    })
});

app.listen(3000, function() {
    console.log('server started');
});