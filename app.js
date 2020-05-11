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

//using ejs templating
app.set('view engine', 'ejs');

//The deafult country being queried for
var country = "Global"


app.get("/", function (req, resp) {
    const day = funs.getDate();

    //get request to coronavirus app
    let corona = unirest("GET", "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total");

    corona.headers({
        "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        "x-rapidapi-key": config.apiKey
    });


    corona.query({"country": country});

    corona.end(function (res) {

        let data = res.body.data;

        //if country searched is the same as country that api sent, no warning needed
        let popup = true;
        if(_.toLower(data.location) === _.toLower(country)){
            popup = false;
        }

        resp.render('index', {
            country: data.location,
            date: day,
            numcount: funs.formatNumber(data.confirmed),
            deathcount: funs.formatNumber(data.deaths),
            recovered: funs.formatNumber(data.recovered),
            popup: popup,
        });
    });

})

//if user wants to return to global
app.get("/Global", function (req,res) {
    country = "Global"
    res.redirect("/");
})

//when a country is searched for
app.post("/", function(req, res){
    country = _.capitalize(req.body.search);

    //change name of US to match API query
    if(country === "Usa" || country === "United states"){
        country = "US";
    }

    res.redirect("/")
})

//running server locally
app.listen(3000, function () {
    console.log("server started on port 3000");
})