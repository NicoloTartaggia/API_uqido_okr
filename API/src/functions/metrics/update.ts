import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// @ts-ignore
const metricsUpdate = (req, res) => {
  cors(req, res, () =>{
    db.collection("metrics").doc(req.params[0])
      .update(
        req.body
      ).then(() => {
        db.collection("metrics").doc(req.params[0]).get()    //another call to db to send back the updated document
          .then(metric => {
            res.status(201).send(metric.data());
          })
          .catch(err => {
            res.status(404).send(`Error getting document. ${err}`);
          });
      })
      .catch(err => {
        res.status(404).send(`Error updating document. ${err}`);
      });
  });
};

module.exports = metricsUpdate;
