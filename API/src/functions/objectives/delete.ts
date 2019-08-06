import * as firebase from "firebase";

const db = firebase.firestore();
const cors = require('cors')({origin: true});


//DELETE request
//Delete document data in metrics collection if it exists.
// @ts-ignore
const objectivesDelete = (req, res) => {
  cors(req, res, () => {
    const docRef = db.collection("objectives").doc(req.params[0]);
    docRef.get()
      .then(doc => {
        db.collection("keys").where("objectiveId", "==", doc.id).get()
          .then(keys => {
            keys.forEach(key => {
              const keyRef = db.collection("keys").doc(key.id);
              keyRef.get().then(keyDoc => {
                db.collection("metric").where("keyId", "==", keyDoc.id).get()
                  .then(metrics => {
                    metrics.forEach(metric => {
                      const metricRef = db.collection("metric").doc(metric.id);
                      metricRef.get().then(metricDoc => {
                        metricRef.delete()
                          .catch(err => {
                            res.status(404).send(`Cannot delete document. ${err}`);
                          });
                      })
                        .catch(err => {
                          res.status(404).send(`Cannot find document. ${err}`);
                        });
                    })
                  })
                  .catch(err => {
                    res.status(404).send(`Cannot find document. ${err}`);
                  });
                keyRef.delete()
                  .catch(err => {
                    res.status(404).send(`Cannot delete document. ${err}`);
                  });
              })
                .catch(err => {
                  res.status(404).send(`Cannot find document. ${err}`);
                });
            })
          })
          .catch(err => {
            res.status(404).send(`Cannot find document. ${err}`);
          });
        docRef.delete()
          .catch(err => {
            res.status(404).send(`Cannot delete document. ${err}`);
          });
        res.status(200).send(`Document ${req.params[0]} deleted successfully`);
      })
      .catch(err => {
        res.status(404).send(`Error getting document. ${err}`);
      });
  });
};

module.exports = objectivesDelete;
