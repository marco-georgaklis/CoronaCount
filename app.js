//import modules
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

//attached modules
const config = require("./config");
const funs = require("./functions");
const unirest = require("unirest");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

var country = "Global"
app.get("/", function (req, resp) {
    const day = funs.getDate();

    let corona = unirest("GET", "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total");

    corona.headers({
        "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        "x-rapidapi-key": config.apiKey
    });


    corona.query({"country": country});

    corona.end(function (res) {
        let data = res.body.data;
        resp.render('index', {country: country, date: day, numcount: funs.formatNumber(data.confirmed), deathcount: funs.formatNumber(data.deaths), recovered: funs.formatNumber(data.recovered)});
    });



})

app.get("/Global", function (req,res) {
    country = "Global"
    res.redirect("/");
})

app.post("/", function(req, res){
    country = _.capitalize(req.body.search);
    if(country === "Usa" || country === "United states"){
        country = "USA";
    }

    res.redirect("/")
})

app.listen(3000, function () {
    console.log("server started on port 3000");
})