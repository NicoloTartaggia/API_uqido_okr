import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// @ts-ignore
const keysCreate = (req, res) => {
  cors(req, res, () =>{
    const key = req.body['key'];
    const metrics = req.body['metrics'];
    db.collection("keys").add(
      key
    ).then(resource => {
      metrics.forEach((metric: any) => {
        const metricBody = {
          ...metric,
          keyId: resource.id
        };
        db.collection("metrics").add(
          metricBody
        ).catch(err => {
          res.status(400).send(`Error adding metric. ${err}`);
        });
      });
      db.collection("keys").doc(resource.id).get()
        .then(keyResult => {
          res.status(201).send(keyResult.data());
        })
        .catch(err => {
          res.status(404).send(`Error getting document. ${err}`);
        });
    }).catch(err => {
      res.status(400).send(`Error adding document. ${err}`);
    });
  });
};

module.exports = keysCreate;
