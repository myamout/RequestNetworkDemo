"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
require("mocha");
var artifacts_1 = require("../../../src/artifacts");
var requestNetwork_1 = require("../../../src/requestNetwork");
var utils = require("../../utils");
var WEB3 = require('web3');
var BN = WEB3.utils.BN;
var addressRequestEthereum = artifacts_1.default.requestEthereumArtifact.networks.private.address;
var addressSynchroneExtensionEscrow = artifacts_1.default.requestSynchroneExtensionEscrowArtifact.networks.private.address;
var rn;
var web3;
var defaultAccount;
var payer;
var payee;
var otherGuy;
var coreVersion;
var currentNumRequest;
var requestId;
describe('paymentAction', function () {
    var arbitraryAmount = 100000000;
    rn = new requestNetwork_1.default('http://localhost:8545', 10000000000);
    web3 = rn.requestEthereumService.web3Single.web3;
    beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var accounts, req;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getAccounts()];
                case 1:
                    accounts = _a.sent();
                    defaultAccount = accounts[0].toLowerCase();
                    payer = accounts[2].toLowerCase();
                    payee = accounts[3].toLowerCase();
                    otherGuy = accounts[4].toLowerCase();
                    return [4 /*yield*/, rn.requestCoreService.getVersion()];
                case 2:
                    coreVersion = _a.sent();
                    return [4 /*yield*/, rn.requestCoreService.getCurrentNumRequest()];
                case 3:
                    currentNumRequest = _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount, '', '', [], { from: payee })];
                case 4:
                    req = _a.sent();
                    requestId = req.request.requestId;
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 0, { from: payer })
                            .on('broadcasted', function (data) {
                            chai_1.expect(data.transaction, 'data.transaction.hash is wrong').to.have.property('hash');
                        })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(1);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result.transaction, 'result.transaction.hash is wrong').to.have.property('hash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with additional', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 10, { from: payer })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount + 10, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(1);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result.transaction, 'result.transaction.hash is wrong').to.have.property('hash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with not valid requestId', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, result_1, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction('0x00000000000000', arbitraryAmount, 0, { from: payer })];
                case 3:
                    result_1 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    utils.expectEqualsObject(e_1, Error('_requestId must be a 32 bytes hex string (eg.: \'0x0000000000000000000000000000000000000000000000000000000000000000\''), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request with not valid additional', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, result_2, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, -1, { from: payer })];
                case 3:
                    result_2 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    utils.expectEqualsObject(e_2, Error('_additional must a positive integer'), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request with not valid amount', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, result_3, e_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, -1, 0, { from: payer })];
                case 3:
                    result_3 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    utils.expectEqualsObject(e_3, Error('_amount must a positive integer'), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request canceled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, result_4, e_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.cancel(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 0, { from: payer })];
                case 3:
                    result_4 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    utils.expectEqualsObject(e_4, Error('request must be accepted'), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request created', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 0, { from: payer })
                        .on('broadcasted', function (data) {
                        chai_1.expect(data.transaction, 'data.transaction.hash is wrong').to.have.property('hash');
                    })];
                case 1:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(1);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result.transaction, 'result.transaction.hash is wrong').to.have.property('hash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with additional higher than amount', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, 1, 2, { from: payer })
                            .on('broadcasted', function (data) {
                            chai_1.expect(data.transaction, 'data.transaction.hash is wrong').to.have.property('hash');
                        })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount + 2, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, 1, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(1);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result.transaction, 'result.transaction.hash is wrong').to.have.property('hash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with higher amount than expected', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount + 1, 0, { from: payer })
                            .on('broadcasted', function (data) {
                            chai_1.expect(data.transaction, 'data.transaction.hash is wrong').to.have.property('hash');
                        })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount + 1, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(1);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result.transaction, 'result.transaction.hash is wrong').to.have.property('hash');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=paymentAction.js.map