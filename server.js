const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArticles";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect(MONGODB_URI);

require("./routes/apiRoutes")(app);

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
