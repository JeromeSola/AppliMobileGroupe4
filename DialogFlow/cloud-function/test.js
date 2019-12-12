'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  function writeToDb (agent) {
    // Get parameter from Dialogflow with the string to add to the database
    const databaseEntry = agent.parameters.databaseEntry;
    const user={
        name: databaseEntry
    };

    const dialogflowAgentRef = db.collection('Dialogflow').doc();
    return db.runTransaction(t => {
      t.set(dialogflowAgentRef, user);
      return Promise.resolve('Write complete');

    }).then(doc => {
      agent.add(`Success to write to the Firestore database.`);
      return response.status(200).send(doc);

    }).catch(err => {
      console.error(err);
      agent.add(`Failed to write to the Firestore database.`);
      return response.status(404).send({ error: 'unable to store', err });
    });
  }

  function readFromDb (agent) {
    const userMessage = agent.parameters.databaseEntry;
    const baseRef = db.collection('Dialogflow').doc();

    return baseRef
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
          if (doc.data().name == userMessage){
              agent.add(doc.data().name);
          } else {
            agent.add('No data found in the database!');
          }
      });
    });
  }

  // Map from Dialogflow intent names to functions to be run when the intent is matched
  let intentMap = new Map();
  intentMap.set('ReadFromFirestore', readFromDb);
  intentMap.set('WriteToFirestore', writeToDb);
  agent.handlerequestuest(intentMap);
});