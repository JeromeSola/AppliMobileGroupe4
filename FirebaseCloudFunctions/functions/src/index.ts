import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();
const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'coachman-2aaa8',
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.addUser = functions.https.onRequest(async (req, res) => {

    const user={
        mail: req.query.mail,
        name: req.query.name,
        family_name: req.query.family_name,
        access_token:req.query.access_token
    }
    return db.collection('Users')
      .add({user})
      .then( (doc: any) => {
        return res.status(200).send(doc);
      }).catch((err: any) => {
        console.error(err);
        return res.status(404).send({ error: 'unable to store', err });
      });
  });
