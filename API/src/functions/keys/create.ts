import * as firebase from "firebase";

const db = firebase.firestore();
const cors = require('cors')({origin: true});


// @ts-ignore
const keysCreate = (req, res) => {
  cors(req, res, () => {
    const key = req.body['key'];
    const metrics = req.body['metrics'];
    db.collection("keys").add(
      key
    ).then(resource => {
      const metricsToSendBack: any = [];
      const promises: Promise<any>[] = [];
      metrics.forEach((metric: any) => {
        const metricBody = {
          ...metric,
          keyId: resource.id
        };
        const p = new Promise((resolve, reject) => {
          db.collection("metrics").add(
            metricBody
          )
            .then(metricResult => {
              resolve({
                ...metric,
                  id: metricResult.id
              })
              // metricsToSendBack.push({
              //   ...metric,
              //   id: metricResult.id
              // })
            })
            .catch(err => {
              res.status(400).send(`Error adding metric. ${err}`);
            });
        });
        promises.push(p);
      });
      Promise.all(promises).then(promisedMetrics => {
        promisedMetrics.forEach(metric => metricsToSendBack.push(metric));
        db.collection("keys").doc(resource.id).get()
          .then(keyResult => {
            res.status(201).send({
              ...keyResult.data(),
              id: keyResult.id,
              metricsChecked: 0,
              metricsCount: metrics.length,
              metrics: metricsToSendBack
            });
          })
          .catch(err => {
            res.status(404).send(`Error getting document. ${err}`);
          });
      }).catch(err => console.log(err));
    }).catch(err => {
      res.status(400).send(`Error adding document. ${err}`);
    });
  });
};

module.exports = keysCreate;
