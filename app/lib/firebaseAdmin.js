"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDb = void 0;
var app_1 = require("firebase-admin/app");
var firestore_1 = require("firebase-admin/firestore");
// Vercel stores multi-line env vars with literal "\n" sequences —
// convert them back to real newlines for the PEM key to parse correctly.
var privateKey = (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n");
var adminApp = (0, app_1.getApps)().length > 0
    ? (0, app_1.getApps)()[0]
    : (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
exports.adminDb = (0, firestore_1.getFirestore)(adminApp);
