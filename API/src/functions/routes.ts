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

const articles = require("./tech-articles");
const clockify = require("./clockify/clockify");
const keys = require("./keys/index");
const keysUpdate = require("./keys/update");
const metrics = require("./metrics/index");
const metricsCreate = require("./metrics/create");
const metricsUpdate = require("./metrics/update");
const metricsDelete = require("./metrics/delete");
const objectives = require("./objectives");
const okrs = require("./okrs/index");
const okrCreate = require("./okrs/create");

module.exports = {
  "articles": functions.https.onRequest(articles),
  "clockify": functions.https.onRequest(clockify),
  "objectives": functions.https.onRequest(objectives),
  "keys": functions.https.onRequest(keys),
  "keysUpdate": functions.https.onRequest(keysUpdate),
  "metrics": functions.https.onRequest(metrics),
  "metricsCreate": functions.https.onRequest(metricsCreate),
  "metricsDelete": functions.https.onRequest(metricsDelete),
  "metricsUpdate": functions.https.onRequest(metricsUpdate),
  "okrs": functions.https.onRequest(okrs),
  "okrCreate": functions.https.onRequest(okrCreate)
};
