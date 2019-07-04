import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
const db = firebase.firestore();
const cors = require('cors')({origin: true});

// GET request
// send all the okr in OKRs collection
// @ts-ignore
const okrs = (req, res) => {
  cors(req, res, () =>{
    if (req.query.current === "true") {
      const okrRef = db.collection("okrs");
      const currentDate = Math.round(new Date().getTime() / 1000);
      console.log(currentDate);
      okrRef.get()
        .then(okrList => {
          let okrIsPresent: boolean = false;
          okrList.forEach(okr => {
            const currentOkr = okr.data();
            const startingAt: Timestamp = currentOkr['startingAt'];
            const endingAt: Timestamp = currentOkr['endingAt'];
            if (startingAt.seconds < currentDate && endingAt.seconds >= currentDate) {
              okrIsPresent = true;
              res.send(currentOkr);
            }
          });
          if(!okrIsPresent) {
            res.status(404).send({error: 'Missing current okr'});
          }
        })
        .catch();
    } else {
      db.collection("okrs").get()
        .then(okrList => {
          const result = Array<any>();
          okrList.forEach(okr => {
            result.push(okr.data());
          });
          res.send(result);
        })
        .catch(err => {
          res.status(404).send(`Error getting document. ${err}`);
        });
    }
  });
};

module.exports = okrs;
