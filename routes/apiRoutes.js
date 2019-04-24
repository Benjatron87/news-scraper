const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app){

    app.get("/", function(req, res){

        db.Article.find({})
        .then(data => {

            let num = data.length;

            const result = {
                Articles: data.slice(num - 5, num)
            }

            res.render("index", result);
        })
        .catch(err => {
            res.json(err);
        });
    })

    app.get("/saved", function(req, res){

        db.Article.find({})
        .then(data => {
            const result = {
                Articles: data
            }

            res.render("saved", result);
        })
        .catch(err => {
            res.json(err);
        });
    })

    app.get("/scrape", (req, res) => {

        axios.get("https://nytimes.com/section/world/americas").then(response => {
        
            const $ = cheerio.load(response.data);
        
            $(".css-ye6x8s").each((i, element) => {
            
                const result = {};

                result.title = $(element).find("h2").text().trim();
                result.link = $(element).find("a").attr("href");
                result.summary = $(element).find("p").text().trim();
                result.saved = false;

                db.Article.create(result)
                .then(data => {
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
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        });
    });

    app.get("/articles/:id", (req, res) => {

        db.Article.findOne({ _id: req.params.id })
        .then(data => {
            console.log(data.saved);

            res.json(data);
          })
          .catch(err => {
            res.json(err);
          });
    });

    app.put("/articles/:id", (req, res) => {

        db.Article.findOneAndUpdate({ _id: req.params.id }, {saved: req.body.saved}, { new: true })
          .then(data => {
            console.log(data)
              res.json(data);
          })
          .catch(err => {
           
            res.json(err);
          });
    });
}
  