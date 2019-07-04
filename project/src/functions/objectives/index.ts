import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});

// GET request
// send all the objectives in current OKRs collection
// @ts-ignore
const objectives  = (req, res) => {
  const result = new Map();
  cors(req, res, () =>{
    // if(req.query.okrId) {
      db.collection("objectives").where("okrId", "==", req.query.okrId).get()
        .then(objList => {
          const objectiveFinal: Array<{id: string, description: string}> = [];
          objList.forEach(obj => {
            result.set(obj.id, obj.data());
          });
          result.forEach((v, k) => {
            objectiveFinal.push({
              id: k,
              description: v.description
            });
          });
          res.send(objectiveFinal);
        })
        .catch(err => {
          res.status(404).send(`Error getting document. ${err}`);
        });
    // } else{
    //   db.collection("objectives").get()
    //     .then(objList => {
    //       const result = Array<any>();
    //       objList.forEach(obj => {
    //         result.push(obj.id);
    //       });
    //       res.send(result);
    //     })
    //     .catch(err => {
    //       res.status(404).send(`Error getting document. ${err}`);
    //     });
    // }
  });
};

module.exports = objectives;
