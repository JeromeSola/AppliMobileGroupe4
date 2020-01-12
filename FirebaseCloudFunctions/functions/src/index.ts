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
          firstNameLower: request.query.firstName.toLowerCase(),
          lastNameLower: request.query.lastName.toLowerCase(),
          username: username,
          access_token: request.query.access_token,
          level: 0,
          totalExperience: 0,
          achievements: [],
          friends: [],

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
            
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                let returnDoc = doc.data()
                returnDoc.firstName = req.query.newFirstName
                db.collection("Users").doc(doc.id).update({
                    firstName: req.query.newFirstName,
                    firstNameLower: req.query.newFirstName.toLowerCase()
                }).then(() => {
                    return res.status(200).send(returnDoc);
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
            
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                let returnDoc = doc.data()
                returnDoc.lastName = req.query.newLastName
                db.collection("Users").doc(doc.id).update({
                    lastName: req.query.newLastName,
                    lastNameLower: req.query.newLastName.toLowerCase()
                }).then(() => {
                    return res.status(200).send(returnDoc);
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
            
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                let returnDoc = doc.data()
                returnDoc.username = req.query.newUserName
                db.collection("Users").doc(doc.id).update({
                    username: req.query.newUserName
                }).then(() => {
                    return res.status(200).send(returnDoc);
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
        value: valeur associée à l'activité(nombre de pas, nombre de pompes)
        startTime : début de l'activité ( en millisecondes, résultat de Date.now() en JS ), sert à identifier l'activité googleFit
        endtime : fin de l'activité, idem
        
*/
exports.createRecordedActivity = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const activityDoc = {
        gmail: req.query.gmail,
        activityType: req.query.activityType,
        value: req.query.value, 
        startTime: req.query.startTime,
        endTime: req.query.endTime
    }
    db.collection('RecordedActivities')
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
            
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                const newFriend: string = req.query.friend
                let returnDoc = doc.data()               
                returnDoc.friends.push(newFriend)
                db.collection("Users").doc(doc.id).update({
                    friends: Firestore.FieldValue.arrayUnion(req.query.friend)
                }).then(() => {
                    return res.status(200).send(returnDoc);
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
            
            console.log(doc.id, " => ", doc.data());
            if (doc.data().gmail === req.query.gmail) {
                const removeFriend = req.query.friend
                let returnDoc = doc.data()               
                const key = returnDoc.friends.indexOf(removeFriend)               
                returnDoc.friends.splice(key,key)               
                db.collection("Users").doc(doc.id).update({
                    friends: Firestore.FieldValue.arrayRemove(req.query.friend)
                }).then(() => {
                    return res.status(200).send(returnDoc);
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
    .document('RecordedActivities/{activityId}')
    .onCreate(async (snap: any, context: any) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}

        const value = snap.data()
        const activity: string = value.activityType;
        const userMail = value.gmail;

        addXpFromActivity(userMail, activity)
        checkAchievements(userMail)
        
    })

/*  
    appelle checkLevelUp quand un doc utilisateur est modifié
*/
exports.onUserUpdate = functions.firestore
    .document('Users/{userId}')
    .onUpdate(async (change: any, context: any) => {
        checkLevelUp(change.after.data().gmail)
    })


/* 
    Fonction qui renvoie la quantité d'expérience que donne une certaine activité 
*/
function addXpFromActivity(userMail: string, activityType: string) {
    
    db.collection("ActivitiesExperience").get().then((querySnapshot: any) => {
        let xpReturn: number = 0
        querySnapshot.forEach(function (doc: any) {
            if (doc.data().activity === activityType) {
                xpReturn = doc.data().xp;
            }
        });
        return (xpReturn)
    }).then((xpReturn: number)=>{
        db.collection("Users").get().then(function (querySnapshot: any) {
            querySnapshot.forEach(function (doc: any) {
                if (doc.data().gmail === userMail){
                    const updatedExperience: number = doc.data().totalExperience + xpReturn;
                    db.collection("Users").doc(doc.id).update({       // attribue l'expérience
                            totalExperience: updatedExperience                       
                    })
                }
            })
        })
    })
}

/* 
    Fonction qui vérifie si de nouveaux succès ont été débloqués et actualise la liste de succès
*/
function checkAchievements(gmail: string) {
    db.collection("Users").get().then(async (querySnapshot: any)=> {       
        querySnapshot.forEach(async function (doc: any) {           
            if (doc.data().gmail === gmail) {
                
                let currentAchievements =  doc.data().achievements
                     
                checkAchievementThreeRunningWeek(gmail).then( (result: boolean)  => {                     
                    if ( ( currentAchievements.includes("1") ) || !result) {  
                        console.log("no new achievements 1" )                       
                    }else{
                        currentAchievements = currentAchievements.concat(doc.data().achievements.concat("1"))
                        db.collection("Users").doc(doc.id).update({                                  
                            achievements : currentAchievements                        
                        })
                    }                                                           
                }).catch((error) => console.error(error)).then(()=>{
                    checkAchievementSevenRunning(gmail).then(async (result: boolean)  => {                     
                        if ( ( currentAchievements.includes("2") ) || !result) {  
                            console.log("no new achievements 2" )                       
                        }else{
                            currentAchievements = currentAchievements.concat("2")
                            db.collection("Users").doc(doc.id).update({       
                                
                                achievements : currentAchievements                       
                            })
                        }                                                           
                    }).catch((error) => console.error(error)) 
                }).catch((error) => console.error(error))
                    
                
                
                
                
            }                                                
        })          
    })
}          

    


/* 
    Fonction qui vérifie si le succès 3 running en une semaine a été réalisé
*/
async function checkAchievementThreeRunningWeek(gmail: string): Promise<boolean> {
    const currentDate: number = Date.now();
    const myPromise = await db.collection("RecordedActivities").get().then((querySnapshot: any) => {
        let isAchievement: boolean = false;
        let activitiesThisWeek: number = 0;
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().activityType === "running" && doc.data().gmail === gmail) {
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

/* 
    Fonction qui vérifie si le succès 7 running en une tout a été réalisé
*/
async function checkAchievementSevenRunning(gmail: string): Promise<boolean> {

    const myPromise = await db.collection("RecordedActivities").get().then((querySnapshot: any) => {
        let isAchievement: boolean = false;
        let activitiesTotal: number = 0;
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().activityType === "running" && doc.data().gmail === gmail) {               
                activitiesTotal = activitiesTotal + 1              
            }
            if (activitiesTotal >= 7) {
                isAchievement = true
            }           
            return (isAchievement)
        })
        return(isAchievement)
    })    
    return myPromise
}


/* 
    Fonction qui attribue le bon niveau à un utilisateur en fonction de son niveau d'expérience
*/
function checkLevelUp(gmail: string) {
    db.collection("Users").get().then(function (querySnapshot: any) {
        querySnapshot.forEach(function (doc: any) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().gmail === gmail) {


                db.collection("Levels").get().then((querySnapshotLevels: any) => {     
                    let count: number = 0       
                    let updated: boolean = false        

                    querySnapshotLevels.docs[0].data().levels.forEach (() => {
                        if (querySnapshotLevels.docs[0].data().levels[count] > doc.data().totalExperience && updated === false) {    // vérifie si un palier d'xp a été franchi 
                            const newLevel = count-1
                            updated = true
                            
                            db.collection("Users").doc(doc.id).update({
                                level: newLevel
                            })                          
                        }
                        count = count + 1
                        
                    })
                    
                })                 
            }
        });
    });
}