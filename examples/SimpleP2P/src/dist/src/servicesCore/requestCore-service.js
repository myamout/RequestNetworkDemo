"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var ServicesContracts = require("../servicesContracts");
var ServicesExtensions = require("../servicesExtensions");
var artifacts_1 = require("../artifacts");
var ipfs_service_1 = require("../servicesExternal/ipfs-service");
var web3_single_1 = require("../servicesExternal/web3-single");
var requestCoreArtifact = artifacts_1.default.requestCoreArtifact;
var BN = web3_single_1.Web3Single.BN();
var EMPTY_BYTES_32 = '0x0000000000000000000000000000000000000000';
/**
 * The RequestCoreService class is the interface for the Request Core contract
 */
var RequestCoreService = /** @class */ (function () {
    /**
     * constructor to Instantiates a new RequestCoreService
     */
    function RequestCoreService() {
        this.web3Single = web3_single_1.Web3Single.getInstance();
        this.ipfs = ipfs_service_1.default.getInstance();
        this.abiRequestCore = requestCoreArtifact.abi;
        if (!requestCoreArtifact.networks[this.web3Single.networkName]) {
            throw Error('RequestCore Artifact does not have configuration for network: ' + this.web3Single.networkName);
        }
        this.addressRequestCore = requestCoreArtifact.networks[this.web3Single.networkName].address;
        this.instanceRequestCore = new this.web3Single.web3.eth.Contract(this.abiRequestCore, this.addressRequestCore);
    }
    /**
     * get the number of the last request (N.B: number !== id)
     * @return  promise of the number of the last request
     */
    RequestCoreService.prototype.getCurrentNumRequest = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.instanceRequestCore.methods.numRequests().call(function (err, data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (err)
                        return [2 /*return*/, reject(err)];
                    return [2 /*return*/, resolve(data)];
                });
            }); });
        });
    };
    /**
     * get the version of the contract
     * @return  promise of the version of the contract
     */
    RequestCoreService.prototype.getVersion = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.instanceRequestCore.methods.VERSION().call(function (err, data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (err)
                        return [2 /*return*/, reject(err)];
                    return [2 /*return*/, resolve(data)];
                });
            }); });
        });
    };
    /**
     * get the estimation of ether (in wei) needed to create a request
     * @param   _expectedAmount    amount expected of the request
     * @param   _currencyContract  address of the currency contract of the request
     * @param   _extension         address of the extension contract of the request
     * @return  promise of the number of wei needed to create the request
     */
    RequestCoreService.prototype.getCollectEstimation = function (_expectedAmount, _currencyContract, _extension) {
        var _this = this;
        _expectedAmount = new BN(_expectedAmount);
        return new Promise(function (resolve, reject) {
            if (!_this.web3Single.isAddressNoChecksum(_currencyContract)) {
                return reject(Error('_currencyContract must be a valid eth address'));
            }
            if (_extension && _extension !== '' && !_this.web3Single.isAddressNoChecksum(_extension)) {
                return reject(Error('_extension must be a valid eth address'));
            }
            _this.instanceRequestCore.methods.getCollectEstimation(_expectedAmount, _currencyContract, _extension)
                .call(function (err, data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (err)
                        return [2 /*return*/, reject(err)];
                    return [2 /*return*/, resolve(data)];
                });
            }); });
        });
    };
    /**
     * get a request by its requestId
     * @param   _requestId    requestId of the request
     * @return  promise of the object containing the request
     */
    RequestCoreService.prototype.getRequest = function (_requestId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.web3Single.isHexStrictBytes32(_requestId)) {
                return reject(Error('_requestId must be a 32 bytes hex string'));
            }
            // get information from the core
            _this.instanceRequestCore.methods.requests(_requestId).call(function (err, data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var dataResult, ccyContractDetails, extensionDetails, _a, _b, _c, _d, e_1;
                return tslib_1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (err)
                                return [2 /*return*/, reject(err)];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 9, , 10]);
                            if (data.creator === EMPTY_BYTES_32) {
                                return [2 /*return*/, reject(Error('request not found'))];
                            }
                            dataResult = {
                                balance: new BN(data.balance),
                                creator: data.creator,
                                currencyContract: data.currencyContract,
                                data: data.data,
                                expectedAmount: new BN(data.expectedAmount),
                                extension: data.extension !== EMPTY_BYTES_32 ? data.extension : undefined,
                                payee: data.payee,
                                payer: data.payer,
                                requestId: _requestId,
                                state: parseInt(data.state, 10)
                            };
                            if (!ServicesContracts.getServiceFromAddress(data.currencyContract)) return [3 /*break*/, 3];
                            return [4 /*yield*/, ServicesContracts.getServiceFromAddress(data.currencyContract)
                                    .getRequestCurrencyContractInfo(_requestId)];
                        case 2:
                            ccyContractDetails = _e.sent();
                            dataResult.currencyContract = Object.assign(ccyContractDetails, { address: dataResult.currencyContract });
                            _e.label = 3;
                        case 3:
                            if (!(data.extension
                                && data.extension !== ''
                                && ServicesExtensions.getServiceFromAddress(data.extension))) return [3 /*break*/, 5];
                            return [4 /*yield*/, ServicesExtensions.getServiceFromAddress(data.extension)
                                    .getRequestExtensionInfo(_requestId)];
                        case 4:
                            extensionDetails = _e.sent();
                            dataResult.extension = Object.assign(extensionDetails, { address: dataResult.extension });
                            _e.label = 5;
                        case 5:
                            if (!(dataResult.data && dataResult.data !== '')) return [3 /*break*/, 7];
                            _a = dataResult;
                            _b = {};
                            _d = (_c = JSON).parse;
                            return [4 /*yield*/, this.ipfs.getFile(dataResult.data)];
                        case 6:
                            _a.data = (_b.data = _d.apply(_c, [_e.sent()]), _b.hash = dataResult.data, _b);
                            return [3 /*break*/, 8];
                        case 7:
                            dataResult.data = undefined;
                            _e.label = 8;
                        case 8: return [2 /*return*/, resolve(dataResult)];
                        case 9:
                            e_1 = _e.sent();
                            return [2 /*return*/, reject(e_1)];
                        case 10: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    /**
     * get a request and method called by the hash of a transaction
     * @param   _hash    hash of the ethereum transaction
     * @return  promise of the object containing the request and the transaction
     */
    RequestCoreService.prototype.getRequestByTransactionHash = function (_hash) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var errors, warnings, transaction, ccyContract, ccyContractservice, method, request, txReceipt, event_1, methodGenerated, options, test_1, e_2, e_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 15, , 16]);
                        errors = [];
                        warnings = [];
                        return [4 /*yield*/, this.web3Single.getTransaction(_hash)];
                    case 1:
                        transaction = _a.sent();
                        if (!transaction) {
                            return [2 /*return*/, reject(Error('transaction not found'))];
                        }
                        ccyContract = transaction.to;
                        return [4 /*yield*/, ServicesContracts.getServiceFromAddress(ccyContract)];
                    case 2:
                        ccyContractservice = _a.sent();
                        // get information from the currency contract
                        if (!ccyContractservice) {
                            return [2 /*return*/, reject(Error('Contract is not supported by request'))];
                        }
                        method = ccyContractservice.decodeInputData(transaction.input);
                        if (!method.name) {
                            return [2 /*return*/, reject(Error('transaction data not parsable'))];
                        }
                        transaction.method = method;
                        request = void 0;
                        return [4 /*yield*/, this.web3Single.getTransactionReceipt(_hash)];
                    case 3:
                        txReceipt = _a.sent();
                        if (!txReceipt) return [3 /*break*/, 9];
                        if (!(txReceipt.status !== '0x1' && txReceipt.status !== 1)) return [3 /*break*/, 4];
                        errors.push('transaction has failed');
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(transaction.method
                            && transaction.method.parameters
                            && transaction.method.parameters._requestId)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getRequest(transaction.method.parameters._requestId)];
                    case 5:
                        // simple action
                        request = _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(txReceipt.logs
                            && txReceipt.logs[0]
                            && this.web3Single.areSameAddressesNoChecksum(txReceipt.logs[0].address, this.addressRequestCore))) return [3 /*break*/, 8];
                        event_1 = this.web3Single.decodeTransactionLog(this.abiRequestCore, 'Created', txReceipt.logs[0]);
                        if (!event_1) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getRequest(event_1.requestId)];
                    case 7:
                        request = _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 14];
                    case 9:
                        methodGenerated = ccyContractservice.generateWeb3Method(transaction.method.name, this.web3Single.resultToArray(transaction.method.parameters));
                        options = {
                            from: transaction.from,
                            gas: new BN(transaction.gas),
                            value: transaction.value
                        };
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this.web3Single.callMethod(methodGenerated, options)];
                    case 11:
                        test_1 = _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        e_2 = _a.sent();
                        warnings.push('transaction may failed: "' + e_2.message + '"');
                        return [3 /*break*/, 13];
                    case 13:
                        if (transaction.gasPrice < config_1.default.ethereum.gasPriceMinimumCriticalInWei) {
                            warnings.push('transaction gasPrice is low');
                        }
                        _a.label = 14;
                    case 14:
                        errors = errors.length === 0 ? undefined : errors;
                        warnings = warnings.length === 0 ? undefined : warnings;
                        return [2 /*return*/, resolve({ request: request, transaction: transaction, errors: errors, warnings: warnings })];
                    case 15:
                        e_3 = _a.sent();
                        return [2 /*return*/, reject(e_3)];
                    case 16: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * get a request's events
     * @param   _requestId    requestId of the request
     * @param   _fromBlock    search events from this block (optional)
     * @param   _toBlock    search events until this block (optional)
     * @return  promise of the array of events about the request
     */
    RequestCoreService.prototype.getRequestEvents = function (_requestId, _fromBlock, _toBlock) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.instanceRequestCore.methods.requests(_requestId).call(function (err, data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    var currencyContract, extension, networkName, optionFilters, eventsCoreRaw, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, eventsCore, eventsExtensions, eventsCurrencyContract, e_4;
                    return tslib_1.__generator(this, function (_w) {
                        switch (_w.label) {
                            case 0:
                                if (err)
                                    return [2 /*return*/, reject(err)];
                                _w.label = 1;
                            case 1:
                                _w.trys.push([1, 17, , 18]);
                                currencyContract = data.currencyContract;
                                extension = data.extension !== EMPTY_BYTES_32 ? data.extension : undefined;
                                networkName = this.web3Single.networkName;
                                optionFilters = {
                                    filter: { requestId: _requestId },
                                    fromBlock: _fromBlock ? _fromBlock : requestCoreArtifact.networks[networkName].blockNumber,
                                    toBlock: _toBlock ? _toBlock : 'latest'
                                };
                                eventsCoreRaw = [];
                                _b = (_a = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('Created', optionFilters)];
                            case 2:
                                /* tslint:disable:max-line-length */
                                eventsCoreRaw = _b.apply(_a, [_w.sent()]);
                                _d = (_c = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('Accepted', optionFilters)];
                            case 3:
                                eventsCoreRaw = _d.apply(_c, [_w.sent()]);
                                _f = (_e = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('Canceled', optionFilters)];
                            case 4:
                                eventsCoreRaw = _f.apply(_e, [_w.sent()]);
                                _h = (_g = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('UpdateBalance', optionFilters)];
                            case 5:
                                eventsCoreRaw = _h.apply(_g, [_w.sent()]);
                                _k = (_j = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('UpdateExpectedAmount', optionFilters)];
                            case 6:
                                eventsCoreRaw = _k.apply(_j, [_w.sent()]);
                                _m = (_l = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('NewPayee', optionFilters)];
                            case 7:
                                eventsCoreRaw = _m.apply(_l, [_w.sent()]);
                                _p = (_o = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('NewPayer', optionFilters)];
                            case 8:
                                eventsCoreRaw = _p.apply(_o, [_w.sent()]);
                                _r = (_q = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('NewExpectedAmount', optionFilters)];
                            case 9:
                                eventsCoreRaw = _r.apply(_q, [_w.sent()]);
                                _t = (_s = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('NewExtension', optionFilters)];
                            case 10:
                                eventsCoreRaw = _t.apply(_s, [_w.sent()]);
                                _v = (_u = eventsCoreRaw).concat;
                                return [4 /*yield*/, this.instanceRequestCore.getPastEvents('NewData', optionFilters)];
                            case 11:
                                eventsCoreRaw = _v.apply(_u, [_w.sent()]);
                                eventsCore = [];
                                return [4 /*yield*/, Promise.all(eventsCoreRaw.map(function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                            case 12:
                                eventsCore = _w.sent();
                                eventsExtensions = [];
                                if (!ServicesExtensions.getServiceFromAddress(extension)) return [3 /*break*/, 14];
                                return [4 /*yield*/, ServicesExtensions
                                        .getServiceFromAddress(extension)
                                        .getRequestEventsExtensionInfo(_requestId, _fromBlock, _toBlock)];
                            case 13:
                                eventsExtensions = _w.sent();
                                _w.label = 14;
                            case 14:
                                eventsCurrencyContract = [];
                                if (!ServicesContracts.getServiceFromAddress(currencyContract)) return [3 /*break*/, 16];
                                return [4 /*yield*/, ServicesContracts
                                        .getServiceFromAddress(currencyContract)
                                        .getRequestEventsCurrencyContractInfo(_requestId, _fromBlock, _toBlock)];
                            case 15:
                                eventsCurrencyContract = _w.sent();
                                _w.label = 16;
                            case 16: return [2 /*return*/, resolve(eventsCore
                                    .concat(eventsExtensions)
                                    .concat(eventsCurrencyContract)
                                    .sort(function (a, b) {
                                    var diffBlockNum = a._meta.blockNumber - b._meta.blockNumber;
                                    return diffBlockNum !== 0 ? diffBlockNum : a._meta.logIndex - b._meta.logIndex;
                                }))];
                            case 17:
                                e_4 = _w.sent();
                                return [2 /*return*/, reject(e_4)];
                            case 18: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    /**
     * get the list of requests connected to an address
     * @param   _address        address to get the requests
     * @param   _fromBlock      search requests from this block (optional)
     * @param   _toBlock        search requests until this block (optional)
     * @return  promise of the object of requests as {asPayer:[],asPayee[]}
     */
    RequestCoreService.prototype.getRequestsByAddress = function (_address, _fromBlock, _toBlock) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var networkName, eventsCorePayee, eventsCorePayer, e_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        networkName = this.web3Single.networkName;
                        return [4 /*yield*/, this.instanceRequestCore.getPastEvents('Created', {
                                filter: { payee: _address },
                                fromBlock: _fromBlock ? _fromBlock : requestCoreArtifact.networks[networkName].blockNumber,
                                toBlock: _toBlock ? _toBlock : 'latest'
                            })];
                    case 1:
                        eventsCorePayee = _a.sent();
                        return [4 /*yield*/, this.instanceRequestCore.getPastEvents('Created', {
                                filter: { payer: _address },
                                fromBlock: _fromBlock ? _fromBlock : requestCoreArtifact.networks[networkName].blockNumber,
                                toBlock: _toBlock ? _toBlock : 'latest'
                            })];
                    case 2:
                        eventsCorePayer = _a.sent();
                        return [4 /*yield*/, Promise.all(eventsCorePayee.map(function (e) {
                                return new Promise(function (resolveEvent, rejectEvent) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _c;
                                    return tslib_1.__generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                _a = resolveEvent;
                                                _b = {};
                                                _c = {
                                                    blockNumber: e.blockNumber
                                                };
                                                return [4 /*yield*/, this.web3Single.getBlockTimestamp(e.blockNumber)];
                                            case 1: return [2 /*return*/, _a.apply(void 0, [(_b._meta = (_c.timestamp = _d.sent(),
                                                        _c),
                                                        _b.requestId = e.returnValues.requestId,
                                                        _b)])];
                                        }
                                    });
                                }); });
                            }))];
                    case 3:
                        // clean the data and get timestamp for request as payee
                        eventsCorePayee = _a.sent();
                        return [4 /*yield*/, Promise.all(eventsCorePayer.map(function (e) {
                                return new Promise(function (resolveEvent, rejectEvent) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _c;
                                    return tslib_1.__generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                _a = resolveEvent;
                                                _b = {};
                                                _c = {
                                                    blockNumber: e.blockNumber
                                                };
                                                return [4 /*yield*/, this.web3Single.getBlockTimestamp(e.blockNumber)];
                                            case 1: return [2 /*return*/, _a.apply(void 0, [(_b._meta = (_c.timestamp = _d.sent(),
                                                        _c),
                                                        _b.requestId = e.returnValues.requestId,
                                                        _b)])];
                                        }
                                    });
                                }); });
                            }))];
                    case 4:
                        // clean the data and get timestamp for request as payer
                        eventsCorePayer = _a.sent();
                        return [2 /*return*/, resolve({ asPayee: eventsCorePayee,
                                asPayer: eventsCorePayer })];
                    case 5:
                        e_5 = _a.sent();
                        return [2 /*return*/, reject(e_5)];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * Get the file content from ipfs
     * @param   _hash        hash of the file
     * @return  promise of the content's file
     */
    RequestCoreService.prototype.getIpfsFile = function (_hash) {
        return this.ipfs.getFile(_hash);
    };
    return RequestCoreService;
}());
exports.default = RequestCoreService;
//# sourceMappingURL=requestCore-service.js.map