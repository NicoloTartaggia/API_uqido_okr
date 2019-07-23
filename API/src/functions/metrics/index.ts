import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// @ts-ignore
const metrics = (req, res) => {
  cors(req, res, () =>{
    db.collection("metrics").where("keyId", "==", req.query.keyId).get()
      .then(metricsList => {
        const result = Array<any>();
        metricsList.forEach(metric => {
          result.push({
            ...metric.data(),
            id: metric.id
          });
        });
        res.send(result);
      })
      .catch(err => {
        res.status(404).send(`Error getting document. ${err}`);
      });
  });
};

module.exports = metrics;
