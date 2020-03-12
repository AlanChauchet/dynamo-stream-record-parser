"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseDynamoStreamRecord = function (value, useBigInt) {
    if (useBigInt === void 0) { useBigInt = false; }
    var result = {};
    if (!value) {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(function (val) { return parseDynamoStreamRecord(val, useBigInt); });
    }
    if (typeof value !== "object") {
        return value;
    }
    var keys = Object.keys(value);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        switch (key) {
            case "B":
            case "S":
                result = value[key] && value[key].toString();
                break;
            case "BS":
            case "SS":
                result = value[key];
                break;
            case "BOOL":
                result = Boolean(value[key]);
                break;
            case "N":
                result = value[key] && (useBigInt ? BigInt(value[key]) : +value[key]);
                break;
            case "NS":
                result = value[key].map(function (val) {
                    return useBigInt ? BigInt(val) : +val;
                });
                break;
            case "M":
                result = parseDynamoStreamRecord(value[key], useBigInt);
                break;
            case "L":
                result = value[key].map(function (val) {
                    return parseDynamoStreamRecord(val, useBigInt);
                });
                break;
            case "NULL":
                if (value[key]) {
                    result = null;
                }
                break;
            default:
                result[key] =
                    !!value[key] && typeof value[key] === "object"
                        ? parseDynamoStreamRecord(value[key], useBigInt)
                        : value[key];
        }
    }
    return result;
};
exports.parseDynamoStreamRecord = parseDynamoStreamRecord;
