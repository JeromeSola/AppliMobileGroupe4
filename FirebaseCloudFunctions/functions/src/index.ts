import * as functions from 'firebase-functions';

const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'coachman-2aaa8',
});

function getUsernameFromMail(gmail: string): string {
  const reg = new RegExp('(.+)@(?:.+)', 'i');
  const result = gmail.match(reg);
  return (result === null) ? 'unknown' : result[1];
}

export const onUserLogin = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  const usersRef = db.collection('Users')
  usersRef.get()
  .then((docSnapshot: any) => {
      let userInfo;
      docSnapshot.forEach((doc: any) => {
          if (doc._fieldsProto.gmail !== undefined && doc._fieldsProto.gmail.stringValue === request.query.gmail) { userInfo = doc.data(); }
      });
      if (userInfo !== undefined) { response.status(208).send(userInfo); }
      else {
        const username = getUsernameFromMail(request.query.gmail);
        const userDoc = {
          gmail: request.query.gmail,
          firstName: request.query.firstName,
          lastName: request.query.lastName,
          username: username,
          access_token: request.query.access_token
        }
        db.collection('Users')
        .add(userDoc)
        .then((doc: any) => {
            response.status(200).send(userDoc);
        }).catch((err: any) => {
            console.error(err);
            return response.status(404).send({ error: 'unable to store', err });
        });
      }          
  })
});
