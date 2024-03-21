var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var port = 3000;

var app = express();

app.set('view engine', 'ejs');

app.use(expressLayouts);

app.use(express.static("public"));



app.get('/', function(req, res) {
    var locals = {
      title: 'Gardens by the Bay',
      description: 'Page Description',
      header: 'Page Header',
      layout:'mainlayout.ejs'
    };
    res.render('index', locals);
  });


app.get('/about', function(req, res) {
    var locals = {
        title: 'About',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('about.ejs', locals);
});

app.get('/buytickets', function(req, res) {
    var locals = {
        title: 'Buy Tickets',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('buytickets.ejs', locals);
});

app.get('/cloudforest', function(req, res) {
    var locals = {
        title: 'Cloud Forest',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('cloudforest.ejs', locals);
});

app.get('/contact', function(req, res) {
    var locals = {
        title: 'Contact',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('contact.ejs', locals);
});

app.get('/dragonfly', function(req, res) {
    var locals = {
        title: 'Dragonfly',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('dragonfly.ejs', locals);
});

app.get('/floralfantasy', function(req, res) {
    var locals = {
        title: 'Floral Fantasy',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('floralfantasy.ejs', locals);
});

app.get('/flowerdome', function(req, res) {
    var locals = {
        title: 'Flower Dome',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('flowerdome.ejs', locals);
});

app.get('/ourhistory', function(req, res) {
    var locals = {
        title: 'Our History',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('ourhistory.ejs', locals);
});

app.get('/ourstory', function(req, res) {
    var locals = {
        title: 'Our Story',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('ourstory.ejs', locals);
});

app.get('/serenegarden', function(req, res) {
    var locals = {
        title: 'Serene Garden',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('serenegarden.ejs', locals);
});

app.get('/supertreeobservatory', function(req, res) {
    var locals = {
        title: 'Supertree Observatory',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('supertreeobservatory.ejs', locals);
});

app.get('/sustainabilityefforts', function(req, res) {
    var locals = {
        title: 'Sustainability Efforts',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('sustainabilityefforts.ejs', locals);
});

app.listen(port, () => {
    console.log(`Webserver app listening on port ${port}`);
});

