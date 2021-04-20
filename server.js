'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
// const {query}=require('express')
// Specify a directory for static resources
app.use(express.static('./public/'))
// define our  reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set('view engine','ejs')
// Use app cors
// app.use(cors)

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/',indexHandler);
app.post('/',indexTowHandler);

app.get('/favorite-quotes',favoriteHandler);
app.put('/favorite-quotes',favoriteTwoHandler);
app.delete('/favorite-quotes',favoriteThreeHandler);
// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function indexHandler(req,res){
    let url='https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
    superagent.get(url).set('User-Agent', '1.0').then(x=>{
        let data=x.body;
        res.render('index',{recivedData:data})
    })
}

function indexTowHandler(req,res){
    let data=req.body;
    let character =data.character
    let quote=data.quote;
    let image=data.image;
    let values=[character,quote,image]
    let SQL ='INSERT INTO myCollection (character,quote,image) VALUES ($1,$2,$3) RETURNING *'
    client.query(SQL,values).then(x=>{
       res.render('favorite-quotes',{fav:x.rows})
      
    })

};

function favoriteHandler(req,res){
    let SQL='SELECT * FROM mycollection '
    client.query(SQL).then(x=>{
        res.render('favorite-quotes',{fav:x.rows})
       
     })
}
function favoriteTwoHandler(req,res){
    let data=req.body;
    let character =data.character
    let quote=data.quote;
    let image=data.image;
    let id =data.id;
    let values=[character,quote,image,id]

    let SQL=`UPDATE mycollection SET character=$1,quot$2, image=$3 WHERE id=${id} `
    client.query(SQL,values).then(x=>{
        res.redirect(`/favorite-quotes/${id}`)
       
     })

}

function favoriteThreeHandler(req,res){
    let id =req.params.id
    let SQL= 'DELETE FROM mycollection WHERE id=$1'
    client.query(SQL,[id]).then(x=>{
        res.redirect(`/favorite-quotes/${id}`)
       
     })
}




// helper functions
app.use('*',notFoundHandler)
function notFoundHandler(req,res){
res.status(404).send('this page not found')
}
// app.use(errorHandler);
// function errorHandler(err,res,req,next){
// res.status(500).render('error',{err:err})
// }
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
