const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app){

    app.get("/", function(req, res) {
          res.render("index");
    });

    app.get("/scrape", (req, res) => {

        axios.get("http://www.nytimes.com/").then(response => {
        
        const $ = cheerio.load(response.data);

        $("article").each((i, element) => {
        
            const result = {};

            result.title = $(element).children().text();
            result.link = $(element).find("a").attr("href");

            console.log(result);

            db.Article.create(result)
            .then(dbArticle => {
            
                console.log(dbArticle);
            })
            .catch(err => {
                
                console.log(err);
            });
        });
    
        res.send("Scrape Complete");
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