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
describe('getRequestByTransactionHash', function () {
    var arbitraryAmount = 100000000;
    rn = new requestNetwork_1.default('http://localhost:8545', 10000000000);
    web3 = rn.requestEthereumService.web3Single.web3;
    beforeEach(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var accounts;
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
                    return [2 /*return*/];
            }
        });
    }); });
    it('createRequestAsPayee getRequestByTransactionHash', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, rn.requestCoreService.getRequestByTransactionHash(result.transaction.hash)];
                case 2:
                    data = _a.sent();
                    chai_1.expect(data.transaction.method.name, 'name is wrong').to.equal('createRequestAsPayee');
                    chai_1.expect(data.transaction.method.parameters._payer.toLowerCase(), '_payer is wrong').to.equal(payer);
                    chai_1.expect(data.transaction.method.parameters._expectedAmount, '_expectedAmount is wrong').to.equal(arbitraryAmount.toString());
                    chai_1.expect(data.transaction.method.parameters._extension, '_extension is wrong').to.equal('0x0000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams.length, '_extensionParams length is wrong').to.equal(9);
                    chai_1.expect(data.transaction.method.parameters._extensionParams[0], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[1], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[2], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[3], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[4], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[5], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[6], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[7], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._extensionParams[8], '_extensionParams is wrong').to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
                    chai_1.expect(data.transaction.method.parameters._data, '_data is wrong').to.equal('');
                    return [2 /*return*/];
            }
        });
    }); });
    it('accept getRequestByTransactionHash', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var resultCreateRequestAsPayee, resultAccept, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount)];
                case 1:
                    resultCreateRequestAsPayee = _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.accept(resultCreateRequestAsPayee.request.requestId, { from: payer })];
                case 2:
                    resultAccept = _a.sent();
                    return [4 /*yield*/, rn.requestCoreService.getRequestByTransactionHash(resultAccept.transaction.hash)];
                case 3:
                    data = _a.sent();
                    chai_1.expect(data.transaction.method.name, 'name is wrong').to.equal('accept');
                    chai_1.expect(data.transaction.method.parameters._requestId, '_requestId is wrong').to.equal(resultCreateRequestAsPayee.request.requestId);
                    utils.expectEqualsBN(data.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(data.request.balance, 0, 'balance is wrong');
                    chai_1.expect(data.request.creator.toLowerCase(), 'creator is wrong').to.equal(defaultAccount);
                    chai_1.expect(data.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(data.request.payee.toLowerCase(), 'payee is wrong').to.equal(defaultAccount);
                    chai_1.expect(data.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(data.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(data.request.state, 'state is wrong').to.equal(1);
                    chai_1.expect(data.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    return [2 /*return*/];
            }
        });
    }); });
    it('paymentAction getRequestByTransactionHash', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var resultCreateRequestAsPayee, resultAccept, resultPaymentAction, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount)];
                case 1:
                    resultCreateRequestAsPayee = _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.accept(resultCreateRequestAsPayee.request.requestId, { from: payer })];
                case 2:
                    resultAccept = _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(resultCreateRequestAsPayee.request.requestId, arbitraryAmount, 10, { from: payer })];
                case 3:
                    resultPaymentAction = _a.sent();
                    return [4 /*yield*/, rn.requestCoreService.getRequestByTransactionHash(resultPaymentAction.transaction.hash)];
                case 4:
                    data = _a.sent();
                    chai_1.expect(data.transaction.method.name, 'name is wrong').to.equal('paymentAction');
                    chai_1.expect(data.transaction.method.parameters._requestId, '_requestId is wrong').to.equal(resultCreateRequestAsPayee.request.requestId);
                    chai_1.expect(data.transaction.method.parameters._additionals, '_additionals is wrong').to.equal('10');
                    utils.expectEqualsBN(data.request.expectedAmount, arbitraryAmount + 10, 'expectedAmount is wrong');
                    utils.expectEqualsBN(data.request.balance, arbitraryAmount, 'balance is wrong');
                    chai_1.expect(data.request.creator.toLowerCase(), 'creator is wrong').to.equal(defaultAccount);
                    chai_1.expect(data.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(data.request.payee.toLowerCase(), 'payee is wrong').to.equal(defaultAccount);
                    chai_1.expect(data.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(data.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(data.request.state, 'state is wrong').to.equal(1);
                    chai_1.expect(data.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    return [2 /*return*/];
            }
        });
    }); });
    it('not valid txHash getRequestByTransactionHash', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rn.requestCoreService.getRequestByTransactionHash('0x9999999999999999999999999999999999999999999999999999999999999999')];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    chai_1.expect(e_1.message, 'exception not right').to.equal('transaction not found');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('not tx request getRequestByTransactionHash', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var tx, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.sendTransaction({ from: defaultAccount,
                        to: otherGuy,
                        value: 100000 })];
                case 1:
                    tx = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestCoreService.getRequestByTransactionHash(tx.transactionHash)];
                case 3:
                    _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    chai_1.expect(e_2.message, 'exception not right').to.equal('Contract is not supported by request');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=getRequestByTransactionHash.js.map