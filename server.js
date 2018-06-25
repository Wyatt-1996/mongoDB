var mongoose = require('mongoose');
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var PORT = process.env.PORT || 3000

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = require('./models');

mongoose.connect('mongodb://newUser123:newUser321@ds257640.mlab.com:57640/mongo-scraper');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static("public"))

// home
app.get('/', function (req, res) {
    db.Article.find()
        .exec()
        .then(function (doc) {
            res.render('index', { article: doc });
        });
});

// all articles
app.get('/all', function (req, res) {
    db.Article.find()
        .exec()
        .then(function (doc) {
            res.send(doc);
        });
});

// scrape articles
app.get('/scrape', function (req, res) {
    request('http://www.nytimes.com', function (err, response, html) {
        var $ = cheerio.load(html);
        var array = [];

        $('.story-heading').each(function () {
            var title = $(this).children('a').text();
            var link = $(this).children('a').attr('href');
            var summary = $(this).siblings('p').text();

            if (title && link && summary) {
                array.push({ title: title, link: link, summary: summary });
                var article = new db.Article({
                    title: title,
                    link: link,
                    summary: summary
                });
                article.save();
            };
        });
        res.send(array);
    });
});

// clear all scraped articles
app.get('/clear', function (req, res) {
    db.Article.remove({})
        .exec()
        .then(function (result) {
            res.send(result);
        });
});

// get all saved articles
app.get('/saved', function (req, res) {
    db.Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
        var hbsObject = {
            article: articles
        };
        res.render("saved", hbsObject);
    });
});


app.post('/notes', function (req, res) {
    db.Note.create(req.body, function (error, createdNote) {
        if (error) throw new Error(error);
        console.log(createdNote);
    });
});

// save article
app.post('/saved/:id', function (req, res) {
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        });
});

// remove saved article
app.post("/delete/:id", function (req, res) {
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        });
});

app.listen(PORT);