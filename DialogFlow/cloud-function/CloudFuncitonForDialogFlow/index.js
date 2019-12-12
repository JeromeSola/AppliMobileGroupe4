'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
admin.initializeApp(functions.config().firebase);

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  function writeToDb (agent) {
    // Get parameter from Dialogflow with the string to add to the database
    const databaseEntry = agent.parameters.databaseEntry;
    const user={
      name: databaseEntry
    };

    const baseRef = db.collection('dialogflow').doc();
    return db.runTransaction(t => {
      t.set(baseRef, user);
      return Promise.resolve('Write complete');

    }).then(doc => {
      agent.add(`Success to write to the Firestore database. Doc: ` + doc);

    }).catch(err => {
      agent.add(`Failed to write to the Firestore database. Erreur:` + err);
    });
  }

  function readFromDb (agent) {
    // Get the database collection 'dialogflow' and document 'agent'
    const userMessage = agent.parameters.databaseEntry;
    const baseRef = db.collection('Dialogflow').doc();

    // Get the value of 'entry' in the document and send it to the user
    return baseRef
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        console.log(doc.data().name);
        console.log(userMessage);
        agent.add("On a: " + doc.data().name + " et " + userMessage);
          if (doc.data().name == userMessage){
              agent.add("On a: " + doc.data().name);
          } 
      });
    })
    .catch(err => {
      console.error(err);
    });
  }

  // Map from Dialogflow intent names to functions to be run when the intent is matched
  let intentMap = new Map();
  intentMap.set('ReadFromFirestore', readFromDb);
  intentMap.set('WriteToFirestore', writeToDb);
  agent.handleRequest(intentMap);
});