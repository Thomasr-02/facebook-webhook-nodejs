'use strict' ;

// Imports dependencies and set up http server const 
const express =require('express'); 
const bodyParser =require('body-parser'); 
const app = express();
app.use( bodyParser . json ()); // creates express http server


// Sets server port and logs message on success 
app.listen(process.env.PORT || 1337 , () => console.log('webhook is listening' ));   

// Creates the endpoint for our webhook 
app.post( '/webhook' , ( req , res ) => {     
  let body = req.body ;
  // Checks this is an event from a page subscription 
  if ( body.object==='page') {
      // Iterates over each entry - there may be multiple if batched 
      body.entry.forEach(function(entry){ 

        // Gets the message. entry.messaging is an array, but // will only ever contain one message, so we get index 0 
        let webhook_event = entry.messaging[0]; 
        console.log(webhook_event);
      });
      
      // Returns a '200 OK' response to all requests 
      res.status(200).send('EVENT_RECEIVED');
  } else { // Returns a '404 Not Found' if event is not from a page subscription 
    res.sendStatus(404);
  }
});


// Adds support for GET requests to our webhook 
app.get('/webhook',(req,res)=>{   

  // Your verify token. Should be a random string. 
  let VERIFY_TOKEN = "EAAELSM0Kr1gBAAVFYHAatsXuOheAFypjPVF1kzU5AVtZCrqNVHxBTv4742qESJhEc6N0diia5SJ3FqZBvZBnfuPCNFnUkZANysQhGDqnZB6QQBJGDS6z9aPKQoJjJh7MO0WBaE1ZAQbLEoaW6q99St0PmLjCM7ZCweAy3dzcLWdzY0wg5jAaWbyGqo1e53FkJAZD" 
    
  // Parse the query params 
  let mode =req.query['hub.mode']; 
  let token =req.query['hub.verify_token']; 
  let challenge =req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request 
  if ( mode && token ) {
    // Checks the mode and token sent is correct 
    if ( mode === 'subscribe' && token === VERIFY_TOKEN ) {
      // Responds with the challenge token from the request 
      console.log('WEBHOOK_VERIFIED'); 
      res.status(200).send(challenge);

    } else { // Responds with '403 Forbidden' if verify tokens do not match 
      res.sendStatus(403); 
    }
  } 
});  