var express = require('express');
// var expressLayouts = require('express-ejs-layouts');
var port = 3000;

var app = express();

app.set('view engine', 'ejs');

// app.use(expressLayouts);

// app.use(express.static("public"));

// app.get('/', function(req, res) {
//   var locals = {
//     title: 'Page Title',
//     description: 'Page Description',
//     header: 'Page Header'
//   };
//   res.render('the-view', locals);
// });

// app.listen(3000);
app.listen(port, () => {
    console.log(`Webserver app listening on port ${port}`);
});

