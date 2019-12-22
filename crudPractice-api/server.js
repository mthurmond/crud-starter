const express = require('express')

// use process.env variables to keep private variables
//attaches environment variables to process vars in node
//good for not exposing keys on github, for all local copies, 
//will need own env file. can share env file w/ this. 
//prevent it from being uploaded to github by adding to gitignore
//can also swap out api keys by environ (dev, prod)
require('dotenv').config()

// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests

// db Connection w/ Heroku
// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   }
// });

// db Connection w/ 
// could store as separate file. db.init function could save in db 
// variable. then in file have variable with initialized db. can 
// can then export to other files. 
// closure = save values in one context, use somewhere else

// function something() {
//   let prop = 'hey';
//   return function(evt) {
//     console.log(evt, prop);
//   }
// }

var db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1', //just generic ip for local host
    user : '',
    password : '',
    database : 'crud-practice-1'
  }
});

// Controllers - aka, the db queries
const main = require('./controllers/main')

// App, initializing library
const app = express()

// App Middleware
// can use any port that computer isn't using
// whitelist for CORS, response to single origin policy of browser
// browsers don't auto-accept stuff from sources page didn't come from
// so if accessing external API from different source, requires CORS
// headers to enable it. 
// by whitelisting 3001 below, that means that only ports 3000 and 3001 can access API.
// if putting star (*) everyone could access it
const whitelist = ['http://localhost:3001']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// middle layer, middle ware is put between beginning and end, will
// modify things. 
// ex: cors will now take all requests, and modify headers appropriately
// can write own middleware if you want to
// in this context, middleware is code we're accessing/executing between request and response.
// here, request comes in, middle ware does something, or before response goes out, or just does something (like morgan logs eacg request) ... so these happen in execution period 
app.use(helmet())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'

// App Routes - Auth
// actions to take for particular request types and endpoints
// can create catch-all, so all other scenarios handled by a request
// handler. like generic 404 page, doesn't exist. 
// express creates request and response objects, below we're exposing
// them to the request handlers. 
// instead of passing db into handler as argument, can import to 
// all the handlers. can put db in separate file, require it in
// to top-level stuff. like require db from x file. 
// if can eliminate db argument, arguments match, can get rid of anonymous function, then just use main.getTable..., etc. 
// then can simplify each request handler to...
// app.get('/crud', main.getTableData)
app.get('/', (req, res) => res.send('hello world'))
app.get('/crud', (req, res) => main.getTableData(req, res, db))
app.post('/crud', (req, res) => main.postTableData(req, res, db))
app.put('/crud', (req, res) => main.putTableData(req, res, db))
app.delete('/crud', (req, res) => main.deleteTableData(req, res, db))
app.get('*', (req, res) => res.send('sorry, nothing here, try another URL')) //added this one

// App Server Connection
// if not explicitly defining port, will default to 3000
app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})