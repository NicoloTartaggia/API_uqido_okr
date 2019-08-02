import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


// @ts-ignore
const okrCreate = (req, res) => {
  cors(req, res, () =>{
    db.collection("okrs").add(
      req.body
    ).then(data => {
      const okrId = data.id;
      db.collection("okrs").doc(data.id)
        .update({
          id: data.id
        }).then(() => {
          db.collection("okrs").doc(okrId).get()
            .then(okr => {
              res.status(201).send(okr.data());
            })
            .catch(err => {
              res.status(404).send(`Error getting document. ${err}`);
            });
        })
        .catch(err => {
          res.status(400).send(`Error updating document. ${err}`);
        });
    }).catch(err => {
      res.status(400).send(`Error adding document. ${err}`);
    });
  });
};

module.exports = okrCreate;
