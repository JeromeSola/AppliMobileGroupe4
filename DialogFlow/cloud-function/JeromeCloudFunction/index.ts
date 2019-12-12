'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
admin.initializeApp();
const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'labgroup4-835fe',
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.addUser = functions.https.onRequest((req, res) => {
    
    const agent = new WebhookClient({ req, res });

    function writeToDb (agent) {

        const message = agent.parameters.databaseEntry;

        const user={
            name: req.query.name
        }

        return db.collection('Dialogflow').doc('agent')
        .add({user})
        .then( (doc: any) => {
            agent.add(`Success to write to the Firestore database.`);
            return res.status(200).send(doc);
            
        }).catch((err: any) => {
            console.error(err);
            agent.add(`Failed to write to the Firestore database.`);
            return res.status(404).send({ error: 'unable to store', err });
        });
    }

    function readFromDb (agent) {
  
      return db.collection('Dialogflow').doc('agent')
      .get()
      .then( (doc: any) => {
          agent.add(doc.data().entry);
          return Promise.resolve('Read complete');

      }).catch((err : any) => {
          console.error(err);
          agent.add('Error reading entry from the Firestore database.');
          return res.status(404).send({ error: 'unable to store', err });

        });
    }

    // Map from Dialogflow intent names to functions to be run when the intent is matched
    let intentMap = new Map();
    intentMap.set('ReadFromFirestore', readFromDb);
    intentMap.set('WriteToFirestore', writeToDb);
    agent.handleRequest(intentMap);

  });