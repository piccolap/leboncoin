var express = require('express');
var expressSession = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var _ = require("lodash");
var MongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
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
    offerType: String,
    Type:String,
    created: { type: Date, default: Date.now }
  });

var BDOffer = mongoose.model("BDOffer", offerSchema);

// var idCounter = 0;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var multer = require('multer');
var upload = multer ({dest: 'public/uploads/'});

// Activer la gestion de la session
app.use(expressSession({
    secret: 'secretWord75',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }));

  // Activer `passport`
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // JSON.stringify
passport.deserializeUser(User.deserializeUser()); // JSON.parse

app.use(express.static("public"));

// Routes 
app.get('/', function(req, res){
    BDOffer.find({}, function(err, offers){
        if(!err) {
            res.render('home.ejs', {offers: offers});
        }
    }) 
});

/* app.get('/secret', function(req, res) {
    if (req.isAuthenticated()) {
      console.log(req.user);
      res.render('secret');
    } else {
      res.redirect('/');
    }
  }); */
  
  app.get('/register', function(req, res) {
    if (req.isAuthenticated()) {
      /* res.redirect('/secret'); */
      res.redirect('/');
    } else {
      res.render('register');
    }
  });
  
  app.post('/register', function(req, res) {
    // Créer un utilisateur, en utilisant le model defini
    // Nous aurons besoin de `req.body.username` et `req.body.password`
    User.register(
      new User({
        username: req.body.username,
        // D'autres champs peuvent être ajoutés ici
      }),
      req.body.password, // password will be hashed
      function(err, user) {
        if (err) {
          console.log(err);
          return res.render('register');
        } else {
          passport.authenticate('local')(req, res, function() {
            res.redirect('/');
          });
        }
      }
    );
  });
  
  app.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  });
  
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
  
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect('/');
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
    var obj = {
        offerTitle: req.body.offerTitle,
        offerType:req.body.offerType,
        Type:req.body.Type,
        offerText: req.body.offerText,
        offerPrice: req.body.offerPrice,
        offerCity: req.body.offerCity,
        nickName: req.body.nickName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber, 

    }

    if(req.file) {
        obj.offerPicture = req.file.filename;
    }    
    var newOffer = new BDOffer(obj);
    newOffer.save(function(err, obj) {
        if (err) {
          console.log("something went wrong");
        } else {
          console.log("we just saved the new Offer " + obj.offerTitle);
          res.redirect('/annonce/'+ obj._id);
        }
      });

    // offers.push(newOffer);
    //push the new ads
    // idCounter++;
});

app.get('/annonce/:id', function(req, res){
    BDOffer.find({_id:req.params.id}, function(err, offer){
        console.log(offer[0]);
        if(!err) {
        res.render('offer.ejs', {offer: offer[0]});
        }
    })
});

app.get('/annonce/:id/editer', function(req, res){
    BDOffer.find({_id:req.params.id}, function(err, offer){
        console.log(offer[0]);
        if(!err) {
        res.render('editOffer.ejs', {offer: offer[0]});
        }
    })
});

app.get('/annonce/:id/getNumber', function(req, res){
    BDOffer.find({_id:req.params.id}, function(err, offer){
        if(!err) {
        res.send({number: offer[0].phoneNumber})
        }
    })
});

app.post('/annonce/:id/editer', upload.single("offerPicture"), function(req, res){
    var updatedOffer = {
        offerTitle: req.body.offerTitle,
        offerType:req.body.offerType,
        Type:req.body.Type,
        offerText: req.body.offerText,
        offerPrice: req.body.offerPrice,
        offerCity: req.body.offerCity,
        nickName: req.body.nickName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    };
    if(req.file) {
        updatedOffer.offerPicture = req.file.filename;
    }
    BDOffer.findOneAndUpdate({_id: req.params.id}, updatedOffer, function(err, object) {
        res.redirect('/annonce/' + req.params.id);
    });
});

app.get('/delete/:id', function(req, res){
    BDOffer.deleteOne({_id: req.params.id}, function(err) {
        if(!err){ 
            res.redirect('/');
        } else {
            console.log(err);
        }
    });
});

//Sélectionner le type "Offres" ou demandes //

app.get('/annonces/Offres', function(req, res){
    BDOffer.find({Type:'Offres'}, function(err, offers){
        // console.log("offers:", offers);
        if(!err) {
        res.render('home.ejs', {offers: offers});
        }
    })
});

app.get('/annonces/Demandes', function(req, res){
    BDOffer.find({Type:'Demandes'}, function(err, offers){
        // console.log(offers);
        if(!err) {
        res.render('home.ejs', {offers: offers});
        }
    })
});

app.listen(3000, function() {
    console.log('server has started');
});