import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// @ts-ignore
const metricsCreate = (req, res) => {
  cors(req, res, () =>{
    db.collection("metrics").add(
      req.body
    ).then(resource => {
      db.collection("metrics").doc(resource.id).get()
        .then(metric => {
          res.status(201).send(metric.data());
        })
        .catch(err => {
          res.status(404).send(`Error getting document. ${err}`);
        });
    }).catch(err => {
        res.status(400).send(`Error adding document. ${err}`);
    });
  });
};

module.exports = metricsCreate;
