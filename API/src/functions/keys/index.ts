import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// GET request
// send all keys in a specific objective

// @ts-ignore
const keys = (req, res) => {
  cors(req, res, () =>{
    const keys$ = db.collection("keys").where("objectiveId","==", req.query.objectiveId).get();
    const metrics$ = db.collection("metrics").get();
    Promise.all([keys$, metrics$]).then(([keysList, metricsList]) => {
      const finalKeys = Array<any>();
      keysList.forEach(key => {
        let metricsCount = 0;
        let metrics: any = [];
        metricsList.forEach(el => {
          if (el.data()['keyId'] == key.id) {
            metricsCount += 1;
            if (key.data()['evaluationType'] === 'check') {
              metrics.push(el.data());
            }
          }
        });
        finalKeys.push({
          ...key.data(),
          id: key.id,
          metricsCount: metricsCount,
          metrics: metrics
        });
      });
      res.send(finalKeys);
    }).catch();
  });
};

module.exports = keys;
