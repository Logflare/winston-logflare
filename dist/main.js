"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var logflare_transport_core_1 = require("logflare-transport-core");
var winston_transport_1 = __importDefault(require("winston-transport"));
function winstonToLogflareMapper(info) {
    var message = info.message, level = info.level, metadata = __rest(info, ["message", "level"]);
    var cleanedMetadata = lodash_1.default(metadata)
        .toPairs()
        .reject(function (_a) {
        var key = _a[0], value = _a[1];
        return lodash_1.default.isSymbol(key);
    })
        .fromPairs()
        .value();
    return {
        message: message,
        metadata: __assign(__assign({}, cleanedMetadata), { level: level }),
        timestamp: new Date().toISOString(),
    };
}
var WinstonLogflareTransport = /** @class */ (function (_super) {
    __extends(WinstonLogflareTransport, _super);
    function WinstonLogflareTransport(opts) {
        var _this = _super.call(this, opts) || this;
        _this.httpClient = new logflare_transport_core_1.LogflareHttpClient(opts);
        return _this;
    }
    WinstonLogflareTransport.prototype.log = function (info, callback) {
        var _this = this;
        setImmediate(function () {
            _this.emit("logged", info);
        });
        var logEvent = winstonToLogflareMapper(info);
        try {
            this.httpClient.addLogEvent(logEvent);
        }
        finally {
            callback();
        }
    };
    return WinstonLogflareTransport;
}(winston_transport_1.default));
module.exports = WinstonLogflareTransport;
//# sourceMappingURL=main.js.map