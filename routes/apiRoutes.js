const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app){

    app.get("/", (req, res) => {

        axios.get("https://nytimes.com/").then(response => {
        
        const $ = cheerio.load(response.data);

        const array = [];

        $("article").each((i, element) => {
        
            const result = {};

            result.title = $(element).children().text();
            result.link = $(element).find("a").attr("href");
            result.summary = $(element).find("p").text();

            // console.log(result);

            array.push(result);
        });

        const hbsArticles = {
            Articles: array.slice(0, 3)
        };
    
        res.render("index", hbsArticles);
        });
    });
    
    app.get("/articles", (req, res) => {
        
        db.Article.find({})
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
    });

    app.get("/articles/:id", (req, res) => {

        db.Article.findOne({ _id: req.params.id })
    
        .populate("note")
        .then(dbArticle => {

            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
    });
    
    app.post("/articles/:id", (req, res) => {

        db.Note.create(req.body)
        .then(dbNote => {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
    });
}