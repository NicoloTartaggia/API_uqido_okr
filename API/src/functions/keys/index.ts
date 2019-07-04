import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// GET request
// send all keys in a specific objective

// @ts-ignore
const keys = (req, res) => {
  cors(req, res, () =>{
  db.collection("keys").where("objectiveId","==", req.query.objectiveId).get()
    .then(keysList => {
      const result = Array<any>();
      keysList.forEach((obj: any) => {
        result.push(obj.data());
      });
      res.send(result);
    })
    .catch();
  });
};

module.exports = keys;
