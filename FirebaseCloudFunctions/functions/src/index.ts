import * as functions from 'firebase-functions';

const Firestore = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'coachman-2aaa8',
});

function getUsernameFromMail(gmail: string): string {
  const reg = new RegExp('(.+)@([^.]+).(.+)', 'i');
  const result = gmail.match(reg);
  return (result === null) ? 'unknown' : result[1] + '_' + result[2] + '_' + result[3];
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


/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur à supprimer
*/
exports.deleteUser = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                db.collection("Users").doc(doc.id).delete()
            }
        }).then((doc: any) => {
            return res.status(200).send(doc);
        }).catch((err: any) => {
            console.error(err);
            return res.status(404).send({ error: 'unable to store', err });
        });
    });
});

/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur 
        newFirstName : nouveau prénom
*/
exports.updateUserFirstName = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                db.collection("Users").doc(doc.id).update({
                    firstName: req.query.newFirstName
                }).then(() => {
                    return res.status(200).send(doc);
                }).catch((err: any) => {
                    console.error(err);
                    return res.status(404).send({ error: 'unable to store', err });
                });
            }
        })
    });
})

/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur 
        newLastName : nouveau nom
*/
exports.updateUserLastName = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                db.collection("Users").doc(doc.id).update({
                    lastName: req.query.newLastName
                }).then(() => {
                    return res.status(200).send(doc);
                }).catch((err: any) => {
                    console.error(err);
                    return res.status(404).send({ error: 'unable to store', err });
                });
            }
        })
    });
})

/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur 
        newUserName : nouveau nom d'utilisateur
*/
exports.updateUserUserName = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                db.collection("Users").doc(doc.id).update({
                    username: req.query.newUserName
                }).then(() => {
                    return res.status(200).send(doc);
                }).catch((err: any) => {
                    console.error(err);
                    return res.status(404).send({ error: 'unable to store', err });
                });
            }
        })
    });
})


/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur 
        newAccessToken : nouveau token
*/
exports.updateUserAccessToken = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(async function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                let returnDoc = doc.data()
                returnDoc.access_token = req.query.newAccessToken
                db.collection("Users").doc(doc.id).update({
                    access_token: req.query.newAccessToken                    
                }).then(() => {
                    return res.status(200).send(returnDoc);
                }).catch((err: any) => {
                    console.error(err);
                    return res.status(404).send({ error: 'unable to store', err });
                });
            }
        })
    })
})




/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur 
        activityType : type d'activité présent dans la collection "activitiesExeperience"
        startTime : début de l'activité ( en secondes, résultat de Date.now() en JS ), sert à identifier l'activité googleFit
        endtime : fin de l'activité, idem
*/
exports.createRecordedActivity = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const activityDoc = {
        gmail: req.query.gmail,
        activityType: req.query.activityType,
        startTime: req.query.startTime,
        endTime: req.query.endTime
    }
    db.collection('recordedActivities')
        .add(activityDoc)
        .then((doc: any) => {
            res.status(200).send(activityDoc);
        }).catch((err: any) => {
            console.error(err);
            return res.status(404).send({ error: 'unable to store', err });
        });
});

/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur 
        friend : adresse gmail de l'utilisateur à ajouter en ami
*/
exports.addFriend = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(async function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                db.collection("Users").doc(doc.id).update({
                    friends: Firestore.FieldValue.arrayUnion(req.query.friend)
                }).then(() => {
                    return res.status(200).send(doc.data());
                }).catch((err: any) => {
                    console.error(err);
                    return res.status(404).send({ error: 'unable to store', err });
                });
            }

        })
    })
});

/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur 
        friend : adresse gmail de l'utilisateur à supprimer de la liste d'amis
*/
exports.deleteFriend = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(async function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                db.collection("Users").doc(doc.id).update({
                    friends: Firestore.FieldValue.arrayRemove(req.query.friend)
                }).then(() => {
                    return res.status(200).send(doc.data());
                }).catch((err: any) => {
                    console.error(err);
                    return res.status(404).send({ error: 'unable to store', err });
                });
            }

        })
    })
});

/*  
    Requête Get 
    arguments http :
        gmail : adresse gmail de l'utilisateur dont on veut récupérer les informations
*/
exports.getUserInformation = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    db.collection("Users").get().then(async function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                res.status(200).send(doc.data());
            }
            return res
        })
    })
});


/*  
    Fonction qui ajoute l'xp au bon utilisateur quand une activité est créée, puis vérifie si l'utilisateur a gagné un niveau
*/
exports.onRecordedActivityCreate = functions.firestore
    .document('recordedActivities/{activityId}')
    .onCreate(async (snap: any, context: any) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}

        const value = snap.data()
        const activity: string = value.activityType;
        const userMail = value.gmail;

        const xp = await getXpFromActivity(activity)
        console.log('result from getxpactivity : ' + xp);

        const achievement: boolean = await checkAchievementPushupsWeek(userMail);
        console.log("achievement" + achievement)

        db.collection("Users").get().then(function (querySnapshot: any) {
            querySnapshot.forEach(function (doc: any) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                if (doc.data().gmail === userMail) {
                    const newExperience: number = doc.data().totalExperience + xp;
                    console.log('total exp ' + doc.data().totalExperience);
                    db.collection("Users").doc(doc.id).update({       // attribue l'expérience
                        totalExperience: newExperience
                    }).then(() => {
                        const currentLevel = doc.data().level
                        db.collection("Levels").get().then((querySnapshotLevels: any) => {
                            if (querySnapshotLevels.docs[0].data().levels[currentLevel] <= newExperience) {    // vérifie si un palier d'xp a été franchi 
                                const newLevel = doc.data().level + 1
                                db.collection("Users").doc(doc.id).update({
                                    level: newLevel
                                })
                            }
                        })

                    })
                }
            });
        });
    });



/* 
    Fonction qui renvoie la quantité d'expérience que donne une certaine activité 
*/
async function getXpFromActivity(activityType: string): Promise<number> {
    let xpReturn: number = 0;
    const myPromise = await db.collection("activitiesExperience").get().then((querySnapshot: any) => {

        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().activity === activityType) {

                xpReturn = doc.data().xp;
            }
        });


        return (xpReturn)
    })

    return myPromise
}


/* 
    Fonction qui vérifie si le succès 3 pushups en une semaine a été réalisé
*/
async function checkAchievementPushupsWeek(gmail: string): Promise<boolean> {

    const currentDate: number = Date.now();

    const myPromise = await db.collection("recordedActivities").get().then((querySnapshot: any) => {
        let isAchievement: boolean = false;
        let activitiesThisWeek: number = 0;
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            console.log("activity" + doc.data().activityType)
            if (doc.data().activityType === "pushups") {
                console.log("différence secondes" + (currentDate - doc.data().startTime))
                if ((currentDate - doc.data().startTime) < 1000 * 60 * 60 * 24 * 7) {
                    activitiesThisWeek = activitiesThisWeek + 1
                }
            }

            if (activitiesThisWeek >= 3) {
                isAchievement = true
            }

            
            return (isAchievement)
        })
        return(isAchievement)
    })
    
    return myPromise
}

