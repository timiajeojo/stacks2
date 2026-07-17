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
var firebaseAdmin_1 = require("../../../lib/firebaseAdmin");
var verifyAuth_1 = require("../../../lib/verifyAuth");
var smspool_1 = require("../../../lib/smspool");
var pricing_1 = require("../../../lib/pricing");
function POST(req) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var uid, _e, rentalId, days, countryName, _f, countriesOk, countriesData, entry, usdPrice, costNaira_1, userRef_1, userSnap, walletBalance, buyRes, order_1, rentalCode_1, rentalRef_1, err_1;
        var _this = this;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, verifyAuth_1.verifyRequestUser)(req)];
                case 1:
                    uid = _g.sent();
                    if (!uid) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Not signed in" }, { status: 401 })];
                    }
                    return [4 /*yield*/, req.json()];
                case 2:
                    _e = _g.sent(), rentalId = _e.rentalId, days = _e.days, countryName = _e.countryName;
                    if (!rentalId || !days) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "rentalId and days are required" }, { status: 400 })];
                    }
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, , 9]);
                    return [4 /*yield*/, (0, smspool_1.smspoolFetch)("/rental/retrieve_all", { type: "1" })];
                case 4:
                    _f = _g.sent(), countriesOk = _f.ok, countriesData = _f.data;
                    entry = countriesOk && (countriesData === null || countriesData === void 0 ? void 0 : countriesData.data)
                        ? countriesData.data.find(function (r) { return String(r.ID) === String(rentalId); })
                        : null;
                    usdPrice = (_a = entry === null || entry === void 0 ? void 0 : entry.pricing) === null || _a === void 0 ? void 0 : _a[String(days)];
                    if (!usdPrice) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid rental/duration combination" }, { status: 400 })];
                    }
                    costNaira_1 = Math.ceil((0, pricing_1.usdToNgn)(Number(usdPrice)));
                    userRef_1 = firebaseAdmin_1.adminDb.collection("users").doc(uid);
                    return [4 /*yield*/, userRef_1.get()];
                case 5:
                    userSnap = _g.sent();
                    walletBalance = userSnap.exists
                        ? Number(((_b = userSnap.data()) === null || _b === void 0 ? void 0 : _b.walletBalance) || 0)
                        : 0;
                    if (walletBalance < costNaira_1) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })];
                    }
                    return [4 /*yield*/, (0, smspool_1.smspoolFetch)("/purchase/rental", {
                            id: String(rentalId),
                            days: String(days),
                            create_token: "0",
                        })];
                case 6:
                    buyRes = _g.sent();
                    if (!buyRes.ok || !((_c = buyRes.data) === null || _c === void 0 ? void 0 : _c.success)) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: ((_d = buyRes.data) === null || _d === void 0 ? void 0 : _d.message) || "Rental purchase failed" }, { status: 422 })];
                    }
                    order_1 = buyRes.data;
                    rentalCode_1 = String(order_1.rental_code);
                    rentalRef_1 = userRef_1.collection("longTermRentals").doc(rentalCode_1);
                    return [4 /*yield*/, firebaseAdmin_1.adminDb.runTransaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                t.set(userRef_1, { walletBalance: FieldValue.increment(-costNaira_1) }, {
                                    merge: true,
                                });
                                t.set(rentalRef_1, {
                                    rentalCode: rentalCode_1,
                                    number: order_1.phonenumber,
                                    country: countryName || "",
                                    days: order_1.days,
                                    costNaira: costNaira_1,
                                    expiresAt: Number(order_1.expiry) * 1000,
                                    status: "pending",
                                    purchasedAt: FieldValue.serverTimestamp(),
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 7:
                    _g.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ success: true, rentalCode: rentalCode_1 })];
                case 8:
                    err_1 = _g.sent();
                    console.error("SMSPool rental purchase error:", err_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Server error placing rental order" }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
