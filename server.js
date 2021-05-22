'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const DATABASE_URL=process.env.DATABASE_URL;

// Application Setup
const app = express();

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended:true}))
// const {query}=require('express')
// Specify a directory for static resources
app.use(express.static('./public/'))
// define our  reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set('view engine','ejs')
// Use app cors
// app.use(cors)
app.use(cors())

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
// app.get('/',indexHandler);
// app.post('/',indexTowHandler);

// app.get('/favorite-quotes',favoriteHandler);
// app.put('/favorite-quotes',favoriteTwoHandler);
// app.delete('/favorite-quotes',favoriteThreeHandler);
// // callback functions
// // -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
// function indexHandler(req,res){
//     let url='https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
//     superagent.get(url).set('User-Agent', '1.0').then(x=>{
//         let data=x.body;
//         res.render('index',{recivedData:data})
//     })
// }

// function indexTowHandler(req,res){
//     let data=req;
//     console.log(data);

//     // let character =data.character
//     // let quote=data.quote;
//     // let image=data.image;
//     // let values=[character,quote,image]
//     // let SQL ='INSERT INTO myCollection (character,quote,image) VALUES ($1,$2,$3) RETURNING *'
//     // client.query(SQL,values).then(x=>{
//     //    res.render('favorite-quotes',{fav:x.rows})
      
//     // })

// };

// function favoriteHandler(req,res){
//     let SQL='SELECT * FROM mycollection '
//     client.query(SQL).then(x=>{
//         res.render('favorite-quotes',{fav:x.rows})
       
//      })
// }
// function favoriteTwoHandler(req,res){
//     let data=req.body;
//     let character =data.character
//     let quote=data.quote;
//     let image=data.image;
//     let id =data.id;
//     let values=[character,quote,image,id]

//     let SQL=`UPDATE mycollection SET character=$1,quot$2, image=$3 WHERE id=${id} `
//     client.query(SQL,values).then(x=>{
//         res.redirect(`/favorite-quotes/${id}`)
       
//      })

// }

// function favoriteThreeHandler(req,res){
//     let id =req.params.id
//     let SQL= 'DELETE FROM mycollection WHERE id=$1'
//     client.query(SQL,[id]).then(x=>{
//         res.redirect(`/favorite-quotes/${id}`)
       
//      })
// }

// --------------------------------------------------------------------------------------------------------------------------
app.get('/',homehandler)

app.post('/favorite-quotes',addHandler)
app.get('/favorite-quotes',addHandler2)


app.get('/favorite-quotes/:quote_id',detailHandler)
app.put('/favorite-quotes/:quote_id',updateHandler)
app.delete('/favorite-quotes/:quote_id',deleteHandler)



function homehandler(req,res){
    let url ="https://thesimpsonsquoteapi.glitch.me/quotes?count=10"
    superagent.get(url).set('User-Agent', '1.0').then(x=>{
        // console.log(x.body);
        res.render('index',{data:x.body})
    })
}
function addHandler(req,res){
    let {image,character,quote,characterDirection}=req.body
    let sql=` INSERT INTO mycollection (image,character,quote,characterDirection) VALUES($1,$2,$3,$4)`
    let safeValues=[image,character,quote,characterDirection]
    client.query(sql,safeValues).then(x=>{
        res.redirect('/favorite-quotes')
    })
}
function addHandler2(req,res){
    let sql=`SELECT * FROM mycollection`
    client.query(sql).then(x=>{
        // console.log(x.rows);

        res.render('favorite',{data:x.rows})
    })

}
function detailHandler(req,res){
    console.log(req.params);
    let id=req.params.quote_id
    let sql=`SELECT * FROM mycollection WHERE id=${id}`
    client.query(sql).then(y=>{
   
        res.render('details',{data:y.rows[0]})
    })
}
 function updateHandler(req,res){
     let id=req.params.quote_id
    let {image,character,quote}=req.body
    let sql=`UPDATE mycollection SET image=$1,character=$2,quote=$3 WHERE id=$4 `
    let safeValues=[image,character,quote,id]
    client.query(sql,safeValues).then(y=>{
   
        res.redirect(`/favorite-quotes/${id}`)
    })

 }
 function deleteHandler(req,res){
    let id=req.params.quote_id
    let sql=`DELETE FROM mycollection WHERE id=${id} `
    client.query(sql).then(y=>{
   
        res.redirect(`/favorite-quotes`)
    })
 }

// helper functions
app.use('*',notFoundHandler)
function notFoundHandler(req,res){
res.status(404).send('this page not found')
}
app.use(errorHandler);
function errorHandler(err,res,req,next){
res.status(500).render('error',{err:err})
}
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
