"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var artifacts_1 = require("../artifacts");
var requestCore_service_1 = require("../servicesCore/requestCore-service");
// @ts-ignore
var Web3PromiEvent = require("web3-core-promievent");
var Types = require("../types");
var web3_single_1 = require("../servicesExternal/web3-single");
var requestCoreArtifact = artifacts_1.default.requestCoreArtifact;
var requestSynchroneExtensionEscrowArtifact = artifacts_1.default.requestSynchroneExtensionEscrowArtifact;
var BN = web3_single_1.Web3Single.BN();
/**
 * The RequestSynchroneExtensionEscrowService class is the interface for the Request Escrow extension
 */
var RequestSynchroneExtensionEscrowService = /** @class */ (function () {
    /**
     * constructor to Instantiates a new RequestSynchroneExtensionEscrowService
     */
    function RequestSynchroneExtensionEscrowService() {
        this.web3Single = web3_single_1.Web3Single.getInstance();
        this.abiRequestCore = requestCoreArtifact.abi;
        this.requestCoreServices = new requestCore_service_1.default();
        var networkName = this.web3Single.networkName;
        this.abiSynchroneExtensionEscrow = requestSynchroneExtensionEscrowArtifact.abi;
        if (!requestSynchroneExtensionEscrowArtifact.networks[networkName]) {
            throw Error('Escrow Artifact no configuration for network: ' + networkName);
        }
        this.addressSynchroneExtensionEscrow = requestSynchroneExtensionEscrowArtifact.networks[networkName].address;
        this.instanceSynchroneExtensionEscrow = new this.web3Single.web3.eth.Contract(this.abiSynchroneExtensionEscrow, this.addressSynchroneExtensionEscrow);
    }
    /**
     * parse extension parameters (generic method)
     * @param   _extensionParams    array of parameters for the extension (optional)
     * @return  return object with array of the parsed parameters
     */
    RequestSynchroneExtensionEscrowService.prototype.parseParameters = function (_extensionParams) {
        if (!_extensionParams || !this.web3Single.isAddressNoChecksum(_extensionParams[0])) {
            return { error: Error('first parameter must be a valid eth address') };
        }
        var ret = [];
        // parse escrow
        ret.push(this.web3Single.toSolidityBytes32('address', _extensionParams[0]));
        for (var i = 1; i < 9; i++) {
            ret.push(this.web3Single.toSolidityBytes32('bytes32', 0));
        }
        return { result: ret };
    };
    /**
     * release payment to Payee as payer or escrow
     * @dev emit the event 'broadcasted' with {transaction: {hash}} when the transaction is submitted
     * @param   _requestId         requestId of the request
     * @param   _options           options for the method (gasPrice, gas, value, from, numberOfConfirmation)
     * @return  promise of the object containing the request and the transaction hash ({request, transactionHash})
     */
    RequestSynchroneExtensionEscrowService.prototype.releaseToPayeeAction = function (_requestId, _options) {
        var _this = this;
        var promiEvent = Web3PromiEvent();
        _options = this.web3Single.setUpOptions(_options);
        this.web3Single.getDefaultAccountCallback(function (err, defaultAccount) {
            if (!_options.from && err)
                return promiEvent.reject(err);
            var account = _options.from || defaultAccount;
            _this.getRequest(_requestId).then(function (request) {
                if (err)
                    return promiEvent.reject(err);
                if (!request.extension) {
                    return promiEvent.reject(Error('request doesn\'t have an extension'));
                }
                if (request.extension.address.toLowerCase() !== _this.addressSynchroneExtensionEscrow.toLowerCase()) {
                    return promiEvent.reject(Error('request\'s extension is not sync. escrow'));
                }
                if (!_this.web3Single.areSameAddressesNoChecksum(account, request.payer)
                    && account !== request.extension.escrow) {
                    return promiEvent.reject(Error('account must be payer or escrow'));
                }
                if (request.extension.state !== Types.EscrowState.Created) {
                    return promiEvent.reject(Error('Escrow state must be \'Created\''));
                }
                if (request.state !== Types.State.Accepted) {
                    return promiEvent.reject(Error('State must be \'Accepted\''));
                }
                var method = _this.instanceSynchroneExtensionEscrow.methods.releaseToPayee(_requestId);
                _this.web3Single.broadcastMethod(method, function (hash) {
                    return promiEvent.eventEmitter.emit('broadcasted', { transaction: { hash: hash } });
                }, function (receipt) {
                    // we do nothing here!
                }, function (confirmationNumber, receipt) {
                    if (confirmationNumber === _options.numberOfConfirmation) {
                        var event_1 = _this.web3Single.decodeEvent(_this.abiRequestCore, 'EscrowReleaseRequest', receipt.events[0]);
                        _this.getRequest(event_1.requestId).then(function (requestAfter) {
                            promiEvent.resolve({ request: requestAfter, transaction: { hash: receipt.transactionHash } });
                        }).catch(function (e) { return promiEvent.reject(e); });
                    }
                }, function (error) {
                    return promiEvent.reject(error);
                }, _options);
            }).catch(function (e) { return promiEvent.reject(e); });
        });
        return promiEvent.eventEmitter;
    };
    /**
     * release payment to payer as payee or escrow
     * @dev emit the event 'broadcasted' with {transaction: {hash}} when the transaction is submitted
     * @param   _requestId         requestId of the request
     * @param   _options           options for the method (gasPrice, gas, value, from, numberOfConfirmation)
     * @return  promise of the object containing the request and the transaction hash ({request, transactionHash})
     */
    RequestSynchroneExtensionEscrowService.prototype.releaseToPayerAction = function (_requestId, _options) {
        var _this = this;
        var promiEvent = Web3PromiEvent();
        _options = this.web3Single.setUpOptions(_options);
        this.web3Single.getDefaultAccountCallback(function (err, defaultAccount) {
            if (!_options.from && err)
                return promiEvent.reject(err);
            var account = _options.from || defaultAccount;
            _this.getRequest(_requestId).then(function (request) {
                if (!request.extension) {
                    return promiEvent.reject(Error('request doesn\'t have an extension'));
                }
                if (request.extension.address.toLowerCase() !== _this.addressSynchroneExtensionEscrow.toLowerCase()) {
                    return promiEvent.reject(Error('request\'s extension is not sync. escrow'));
                }
                if (!_this.web3Single.areSameAddressesNoChecksum(account, request.payee)
                    && !_this.web3Single.areSameAddressesNoChecksum(account, request.extension.escrow)) {
                    return promiEvent.reject(Error('account must be payee or escrow'));
                }
                if (request.extension.state !== Types.EscrowState.Created) {
                    return promiEvent.reject(Error('Escrow state must be \'Created\''));
                }
                if (request.state !== Types.State.Accepted) {
                    return promiEvent.reject(Error('State must be \'Accepted\''));
                }
                var method = _this.instanceSynchroneExtensionEscrow.methods.releaseToPayerAction(_requestId);
                _this.web3Single.broadcastMethod(method, function (hash) {
                    return promiEvent.eventEmitter.emit('broadcasted', { transaction: { hash: hash } });
                }, function (receipt) {
                    // we do nothing here!
                }, function (confirmationNumber, receipt) {
                    if (confirmationNumber === _options.numberOfConfirmation) {
                        var event_2 = _this.web3Single.decodeEvent(_this.abiRequestCore, 'EscrowRefundRequest', receipt.events[0]);
                        _this.getRequest(event_2.requestId).then(function (requestAfter) {
                            promiEvent.resolve({ request: requestAfter, transaction: { hash: receipt.transactionHash } });
                        }).catch(function (e) { return promiEvent.reject(e); });
                    }
                }, function (error) {
                    return promiEvent.reject(error);
                }, _options);
            }).catch(function (e) { return promiEvent.reject(e); });
        });
        return promiEvent.eventEmitter;
    };
    /**
     * alias of requestCoreServices.getRequest()
     */
    RequestSynchroneExtensionEscrowService.prototype.getRequest = function (_requestId) {
        return this.requestCoreServices.getRequest(_requestId);
    };
    /**
     * Get info from extension contract (generic method)
     * @param   _requestId    requestId of the request
     * @return  promise of the object containing the information from the extension contract of the request
     */
    RequestSynchroneExtensionEscrowService.prototype.getRequestExtensionInfo = function (_requestId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.web3Single.isHexStrictBytes32(_requestId)) {
                return reject(Error('_requestId must be a 32 bytes hex string'));
            }
            _this.instanceSynchroneExtensionEscrow.methods.escrows(_requestId).call(function (err, data) {
                if (err)
                    return reject(err);
                return resolve({
                    balance: new BN(data.balance),
                    currencyContract: data.currencyContract,
                    escrow: data.escrow,
                    state: data.state
                });
            });
        });
    };
    /**
     * alias of requestCoreServices.getRequestEvents()
     */
    RequestSynchroneExtensionEscrowService.prototype.getRequestEvents = function (_requestId, _fromBlock, _toBlock) {
        return this.requestCoreServices.getRequestEvents(_requestId, _fromBlock, _toBlock);
    };
    /**
     * Get request events from extension contract (generic method)
     * @param   _requestId    requestId of the request
     * @param   _fromBlock    search events from this block (optional)
     * @param   _toBlock        search events until this block (optional)
     * @return  promise of the object containing the events from the extension contract of the request (always {} here)
     */
    RequestSynchroneExtensionEscrowService.prototype.getRequestEventsExtensionInfo = function (_requestId, _fromBlock, _toBlock) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var optionFilters, events, _a, _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        optionFilters = {
                            filter: { requestId: _requestId },
                            fromBlock: requestSynchroneExtensionEscrowArtifact.networks[this.web3Single.networkName].blockNumber,
                            toBlock: 'latest'
                        };
                        events = [];
                        _b = (_a = events).concat;
                        return [4 /*yield*/, this.instanceSynchroneExtensionEscrow.getPastEvents('EscrowPayment', optionFilters)];
                    case 1:
                        /* tslint:disable:max-line-length */
                        events = _b.apply(_a, [_h.sent()]);
                        _d = (_c = events).concat;
                        return [4 /*yield*/, this.instanceSynchroneExtensionEscrow.getPastEvents('EscrowReleaseRequest', optionFilters)];
                    case 2:
                        events = _d.apply(_c, [_h.sent()]);
                        _f = (_e = events).concat;
                        return [4 /*yield*/, this.instanceSynchroneExtensionEscrow.getPastEvents('EscrowRefundRequest', optionFilters)];
                    case 3:
                        events = _f.apply(_e, [_h.sent()]);
                        _g = resolve;
                        return [4 /*yield*/, Promise.all(events.map(function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return tslib_1.__generator(this, function (_a) {
                                    return [2 /*return*/, new Promise(function (resolveEvent, rejectEvent) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var _a, _b, _c;
                                            return tslib_1.__generator(this, function (_d) {
                                                switch (_d.label) {
                                                    case 0:
                                                        _a = resolveEvent;
                                                        _b = {};
                                                        _c = {
                                                            blockNumber: e.blockNumber,
                                                            logIndex: e.logIndex
                                                        };
                                                        return [4 /*yield*/, this.web3Single.getBlockTimestamp(e.blockNumber)];
                                                    case 1:
                                                        _a.apply(void 0, [(_b._meta = (_c.timestamp = _d.sent(),
                                                                _c),
                                                                _b.data = e.returnValues,
                                                                _b.name = e.event,
                                                                _b)]);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                });
                            }); }))];
                    case 4: 
                    /* tslint:enable:max-line-length */
                    return [2 /*return*/, _g.apply(void 0, [_h.sent()])];
                }
            });
        }); });
    };
    return RequestSynchroneExtensionEscrowService;
}());
exports.default = RequestSynchroneExtensionEscrowService;
//# sourceMappingURL=requestSynchroneExtensionEscrow-service.js.map