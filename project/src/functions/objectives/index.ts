import * as firebase from "firebase";
const db = firebase.firestore();

// GET request
// send all the objectives in current OKRs collection
// @ts-ignore
const objectives  = (req, res) => {
  db.collection("objectives").where("okrId","==", req.query.okrId).get()
    .then(objList => {
      const result = Array<any>();
      objList.forEach(obj => {
        result.push(obj.data());
      });
      res.send(result);
    })
    .catch(err => {
      res.status(404).send(`Error getting document. ${err}`);
    });
};

module.exports = objectives;
