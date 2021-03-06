import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});

// GET request
// send all the objectives in current OKRs collection
// @ts-ignore
const objectives  = (req, res) => {
  const result = new Map();
  cors(req, res, () =>{
    db.collection("objectives").where("okrId", "==", req.query.okrId).get()
      .then(objList => {
        const finalObjectives: Array<any> = [];
        objList.forEach(obj => {
          result.set(obj.id, obj.data());
        });
        result.forEach((v, k) => {
          finalObjectives.push({
            id: k,
            description: v.description,
            okrId: v.okrId
          });
        });
        res.send(finalObjectives);
      })
      .catch(err => {
        res.status(404).send(`Error getting document. ${err}`);
      });
  });
};

module.exports = objectives;
