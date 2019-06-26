import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
admin.initializeApp();

import * as firebase from "firebase";
firebase.initializeApp({
    apiKey: "AIzaSyC-4wigg58el_UqZ3kJ_YGZmLHHsxcD0JI",
    authDomain: "okr-platform.firebaseapp.com",
    databaseURL: "https://okr-platform.firebaseio.com",
    projectId: "okr-platform",
    storageBucket: "okr-platform.appspot.com",
    messagingSenderId: "331935303484",
    appId: "1:331935303484:web:7e38cd831da5d3cd"
});
const db = firebase.firestore();
//const cors = require("cors"); //allow cross origin access
//const express = require("express");
//const app = express();

// GET request
// send all the okr in OKRs collection
exports.okrs = functions.https.onRequest((req, res) =>{
    db.collection("OKRs").get()
        .then(function(okrList: any) {
            const result = Array<any>();
            okrList.forEach((okr: any) => {
                result.push(okr.data());
            });
            res.send(result);
        })
        .catch();
});

// GET request
// send all the objectives collections in OKRs collection
exports.objectives = functions.https.onRequest((req, res) => {
    const result = Array<any>();
    db.collection("OKRs/YIyrWlWpnZ2Eo7HAijyU/objectives").get()
        .then(function (snap: any) {
            snap.forEach((obj: any) => {
                result.push(obj.data());
            })
            res.send(result);
       })
       .catch();
})

exports.keys = functions.https.onRequest((req, res) => {
    db.collection("OKRs/YIyrWlWpnZ2Eo7HAijyU/objectives/").get()
        .then(function (snap: any) {
            const result = Array<any>();
            snap.forEach((obj : any) =>{
                console.log(obj);
                result.push(obj.data());
            })
            // @ts-ignore
            res.send(result);
        })
        .catch()
})
