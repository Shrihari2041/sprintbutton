var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
define(["require", "exports", "./XDM"], function (require, exports, XDM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Web SDK version number. Can be specified in an extension's set of demands like: vss-sdk-version/3.0
     */
    exports.sdkVersion = 3.1;
    var global = window;
    if (global._AzureDevOpsSDKVersion) {
        console.error("The AzureDevOps SDK is already loaded. Only one version of this module can be loaded in a given document.");
    }
    global._AzureDevOpsSDKVersion = exports.sdkVersion;
    /**
     * DevOps host level
     */
    var HostType;
    (function (HostType) {
        HostType[HostType["Unknown"] = 0] = "Unknown";
        /**
         * The Deployment host
         */
        HostType[HostType["Deployment"] = 1] = "Deployment";
        /**
         * The Enterprise host
         */
        HostType[HostType["Enterprise"] = 2] = "Enterprise";
        /**
         * The organization host
         */
        HostType[HostType["Organization"] = 4] = "Organization";
    })(HostType = exports.HostType || (exports.HostType = {}));
    var hostControlId = "DevOps.HostControl";
    var serviceManagerId = "DevOps.ServiceManager";
    var parentChannel = XDM_1.channelManager.addChannel(window.parent);
    var teamContext;
    var webContext;
    ;
    var hostPageContext;
    var extensionContext;
    var initialConfiguration;
    var initialContributionId;
    var userContext;
    var hostContext;
    var themeElement;
    var resolveReady;
    var readyPromise = new Promise(function (resolve) {
        resolveReady = resolve;
    });
    /**
     * Register a method so that the host frame can invoke events
     */
    function dispatchEvent(eventName, params) {
        var global = window;
        var evt;
        if (typeof global.CustomEvent === "function") {
            evt = new global.CustomEvent(eventName, params);
        }
        else {
            params = params || { bubbles: false, cancelable: false };
            evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
        }
        window.dispatchEvent(evt);
    }
    parentChannel.getObjectRegistry().register("DevOps.SdkClient", {
        dispatchEvent: dispatchEvent
    });
    /**
     * Initiates the handshake with the host window.
     *
     * @param options - Initialization options for the extension.
     */
    function init(options) {
        return new Promise(function (resolve) {
            var initOptions = __assign({}, options, { sdkVersion: exports.sdkVersion });
            parentChannel.invokeRemoteMethod("initialHandshake", hostControlId, [initOptions]).then(function (handshakeData) {
                hostPageContext = handshakeData.pageContext;
                webContext = hostPageContext ? hostPageContext.webContext : undefined;
                teamContext = webContext ? webContext.team : undefined;
                initialConfiguration = handshakeData.initialConfig || {};
                initialContributionId = handshakeData.contributionId;
                var context = handshakeData.context;
                extensionContext = context.extension;
                userContext = context.user;
                hostContext = context.host;
                if (handshakeData.themeData) {
                    applyTheme(handshakeData.themeData);
                    window.addEventListener("themeChanged", function (ev) {
                        applyTheme(ev.detail.data);
                    });
                }
                resolveReady();
                resolve();
            });
        });
    }
    exports.init = init;
    /**
    * Register a callback that gets called once the initial setup/handshake has completed.
    * If the initial setup is already completed, the callback is invoked at the end of the current call stack.
    */
    function ready() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, readyPromise];
            });
        });
    }
    exports.ready = ready;
    /**
    * Notifies the host that the extension successfully loaded (stop showing the loading indicator)
    */
    function notifyLoadSucceeded() {
        return parentChannel.invokeRemoteMethod("notifyLoadSucceeded", hostControlId);
    }
    exports.notifyLoadSucceeded = notifyLoadSucceeded;
    /**
    * Notifies the host that the extension failed to load
    */
    function notifyLoadFailed(e) {
        return parentChannel.invokeRemoteMethod("notifyLoadFailed", hostControlId, [e]);
    }
    exports.notifyLoadFailed = notifyLoadFailed;
    function getWaitForReadyError(method) {
        return "Attempted to call " + method + "() before init() was complete. Wait for init to complete or place within a ready() callback.";
    }
    /**
    * Get the configuration data passed in the initial handshake from the parent frame
    */
    function getConfiguration() {
        if (!initialConfiguration) {
            throw new Error(getWaitForReadyError("getConfiguration"));
        }
        return initialConfiguration;
    }
    exports.getConfiguration = getConfiguration;
    /**
    * Gets the information about the contribution that first caused this extension to load.
    */
    function getContributionId() {
        if (!initialContributionId) {
            throw new Error(getWaitForReadyError("getContributionId"));
        }
        return initialContributionId;
    }
    exports.getContributionId = getContributionId;
    /**
    * Gets information about the current user
    */
    function getUser() {
        if (!userContext) {
            throw new Error(getWaitForReadyError("getUser"));
        }
        return userContext;
    }
    exports.getUser = getUser;
    /**
    * Gets information about the host (i.e. an Azure DevOps organization) that the page is targeting
    */
    function getHost() {
        if (!hostContext) {
            throw new Error(getWaitForReadyError("getHost"));
        }
        return hostContext;
    }
    exports.getHost = getHost;
    /**
    * Get the context about the extension that owns the content that is being hosted
    */
    function getExtensionContext() {
        if (!extensionContext) {
            throw new Error(getWaitForReadyError("getExtensionContext"));
        }
        return extensionContext;
    }
    exports.getExtensionContext = getExtensionContext;
    /**
    * Gets information about the team that the page is targeting
    */
    function getTeamContext() {
        if (!teamContext) {
            throw new Error(getWaitForReadyError("getTeamContext"));
        }
        return teamContext;
    }
    exports.getTeamContext = getTeamContext;
    /**
    * Get the context about the host page
    */
    function getPageContext() {
        if (!hostPageContext) {
            throw new Error(getWaitForReadyError("getPageContext"));
        }
        return hostPageContext;
    }
    exports.getPageContext = getPageContext;
    /**
    * Get the context about the web
    */
    function getWebContext() {
        if (!webContext) {
            throw new Error(getWaitForReadyError("getWebContext"));
        }
        return webContext;
    }
    exports.getWebContext = getWebContext;
    /**
    * Get the contribution with the given contribution id. The returned contribution has a method to get a registered object within that contribution.
    *
    * @param contributionId - Id of the contribution to get
    */
    function getService(contributionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ready().then(function () {
                        return parentChannel.invokeRemoteMethod("getService", serviceManagerId, [contributionId]);
                    })];
            });
        });
    }
    exports.getService = getService;
    /**
    * Register an object (instance or factory method) that this extension exposes to the host frame.
    *
    * @param instanceId - unique id of the registered object
    * @param instance - Either: (1) an object instance, or (2) a function that takes optional context data and returns an object instance.
    */
    function register(instanceId, instance) {
        parentChannel.getObjectRegistry().register(instanceId, instance);
    }
    exports.register = register;
    /**
    * Removes an object that this extension exposed to the host frame.
    *
    * @param instanceId - unique id of the registered object
    */
    function unregister(instanceId) {
        parentChannel.getObjectRegistry().unregister(instanceId);
    }
    exports.unregister = unregister;
    /**
    * Fetch an access token which will allow calls to be made to other DevOps services
    */
    function getAccessToken() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, parentChannel.invokeRemoteMethod("getAccessToken", hostControlId).then(function (tokenObj) { return tokenObj.token; })];
            });
        });
    }
    exports.getAccessToken = getAccessToken;
    /**
    * Fetch an token which can be used to identify the current user
    */
    function getAppToken() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, parentChannel.invokeRemoteMethod("getAppToken", hostControlId).then(function (tokenObj) { return tokenObj.token; })];
            });
        });
    }
    exports.getAppToken = getAppToken;
    /**
    * Requests the parent window to resize the container for this extension based on the current extension size.
    *
    * @param width - Optional width, defaults to scrollWidth
    * @param height - Optional height, defaults to scrollHeight
    */
    function resize(width, height) {
        var body = document.body;
        if (body) {
            var newWidth = typeof width === "number" ? width : (body ? body.scrollWidth : undefined);
            var newHeight = typeof height === "number" ? height : (body ? body.scrollHeight : undefined);
            parentChannel.invokeRemoteMethod("resize", hostControlId, [newWidth, newHeight]);
        }
    }
    exports.resize = resize;
    /**
     * Applies theme variables to the current document
     */
    function applyTheme(themeData) {
        if (!themeElement) {
            themeElement = document.createElement("style");
            themeElement.type = "text/css";
            document.head.appendChild(themeElement);
        }
        var cssVariables = [];
        if (themeData) {
            for (var varName in themeData) {
                cssVariables.push("--" + varName + ": " + themeData[varName]);
            }
        }
        themeElement.innerText = ":root { " + cssVariables.join("; ") + " } body { color: var(--text-primary-color) }";
        dispatchEvent("themeApplied", { detail: themeData });
    }
    exports.applyTheme = applyTheme;
});
