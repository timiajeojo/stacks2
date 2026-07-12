"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
var server_1 = require("next/server");
var firestore_1 = require("firebase-admin/firestore");
var firebaseAdmin_1 = require("../../../lib/firebaseAdmin");
function POST(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b, reference_1, uid, verifyRes, verifyData, amountNaira_1, userRef_1, txRef_1, err_1;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    _b = _c.sent(), reference_1 = _b.reference, uid = _b.uid;
                    if (!reference_1 || !uid) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Missing reference or uid" }, { status: 400 })];
                    }
                    return [4 /*yield*/, fetch("https://api.paystack.co/transaction/verify/".concat(encodeURIComponent(reference_1)), {
                            headers: {
                                Authorization: "Bearer ".concat(process.env.PAYSTACK_SECRET_KEY),
                            },
                        })];
                case 2:
                    verifyRes = _c.sent();
                    return [4 /*yield*/, verifyRes.json()];
                case 3:
                    verifyData = _c.sent();
                    if (!verifyRes.ok || ((_a = verifyData === null || verifyData === void 0 ? void 0 : verifyData.data) === null || _a === void 0 ? void 0 : _a.status) !== "success") {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Payment verification failed" }, { status: 400 })];
                    }
                    amountNaira_1 = verifyData.data.amount / 100;
                    userRef_1 = firebaseAdmin_1.adminDb.collection("users").doc(uid);
                    txRef_1 = userRef_1.collection("transactions").doc(reference_1);
                    // Idempotency guard: use the Paystack reference as the doc ID, so if
                    // this route is ever called twice for the same payment (retry, double
                    // click, etc.) the wallet only gets credited once.
                    return [4 /*yield*/, firebaseAdmin_1.adminDb.runTransaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var existing;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, t.get(txRef_1)];
                                    case 1:
                                        existing = _a.sent();
                                        if (existing.exists)
                                            return [2 /*return*/];
                                        t.set(txRef_1, {
                                            kind: "credit",
                                            status: "ok",
                                            method: "Paystack",
                                            amount: amountNaira_1,
                                            reference: reference_1,
                                            completed: true,
                                            createdAt: firestore_1.FieldValue.serverTimestamp(),
                                        });
                                        t.set(userRef_1, { walletBalance: firestore_1.FieldValue.increment(amountNaira_1) }, { merge: true });
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    // Idempotency guard: use the Paystack reference as the doc ID, so if
                    // this route is ever called twice for the same payment (retry, double
                    // click, etc.) the wallet only gets credited once.
                    _c.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ success: true, amount: amountNaira_1 })];
                case 5:
                    err_1 = _c.sent();
                    console.error("Paystack verify error:", err_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Something went wrong verifying the payment" }, { status: 500 })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
