import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// @ts-ignore
const objectiveCreate = (req, res) => {
  cors(req, res, () =>{
    db.collection("objectives").add(
      req.body
    ).then(resource => {
      db.collection("objectives").doc(resource.id).get()
        .then(objective => {
          res.status(201).send(objective.data());
        })
        .catch(err => {
          res.status(404).send(`Error getting document. ${err}`);
        });
    }).catch(err => {
      res.status(400).send(`Error adding document. ${err}`);
    });
  });
};

module.exports = objectiveCreate;
