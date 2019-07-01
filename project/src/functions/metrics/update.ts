import * as firebase from "firebase";
const db = firebase.firestore();

// @ts-ignore
const metricsUpdate = (req, res) => {
  db.collection("metrics").doc(req.params[0])
    .update(
      req.body
    ).then((metric) => {
      //TODO
      res.send(metric);
    })
    .catch(err => {
      res.status(404).send(`Error updating document. ${err}`);
    });
};

module.exports = metricsUpdate;
