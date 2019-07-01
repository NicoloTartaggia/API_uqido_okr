import * as admin from "firebase-admin";
import * as firebase from "firebase";
import * as functions from 'firebase-functions';
admin.initializeApp();
firebase.initializeApp({
  apiKey: "AIzaSyC-4wigg58el_UqZ3kJ_YGZmLHHsxcD0JI",
  authDomain: "okr-platform.firebaseapp.com",
  databaseURL: "https://okr-platform.firebaseio.com",
  projectId: "okr-platform",
  storageBucket: "okr-platform.appspot.com",
  messagingSenderId: "331935303484",
  appId: "1:331935303484:web:7e38cd831da5d3cd"
});

const keys = require("./keys");
const metrics = require("./metrics");
const metricsCreate = require("./metrics/create");
const metricsUpdate = require("./metrics/update");
const metricsDelete = require("./metrics/delete");
const objectives = require("./objectives");
const okrs = require("./okrs");

module.exports = {
  "keys": functions.https.onRequest(keys),
  "metrics": functions.https.onRequest(metrics),
  "objectives": functions.https.onRequest(objectives),
  "okrs": functions.https.onRequest(okrs),
  "metricsCreate": functions.https.onRequest(metricsCreate),
  "metricsDelete": functions.https.onRequest(metricsDelete),
  "metricsUpdate": functions.https.onRequest(metricsUpdate)
};
