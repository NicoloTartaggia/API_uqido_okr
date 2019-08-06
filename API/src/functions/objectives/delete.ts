import * as firebase from "firebase";
const db = firebase.firestore();
const cors = require('cors')({origin: true});


//DELETE request
//Delete document data in metrics collection if it exists.
// @ts-ignore
const objectivesDelete = (req, res) => {
  cors(req, res, () =>{
    const docRef = db.collection("objectives").doc(req.params[0]);
    docRef.get()
      .then(doc => {
        if(!doc.exists) {
          res.status(404).send(`Cannot find document ${req.params[0]}`);
        } else{
          docRef.delete()
            .catch(err => {
              res.status(404).send(`Cannot delete document. ${err}`);
            });
          res.status(200).send(`Document ${req.params[0]} deleted successfully`);
        }
      })
      .catch(err => {
        res.status(404).send(`Error getting document. ${err}`);
      });
  });
};

module.exports = objectivesDelete;
