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
describe('createRequestAsPayee', function () {
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
    it('create request without extension', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount, '{"reason":"weed purchased"}', '', [], { from: payee })
                        .on('broadcasted', function (data) {
                        chai_1.expect(data.transaction, 'data.transaction.hash is wrong').to.have.property('hash');
                    })];
                case 1:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, 0, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(0);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    utils.expectEqualsObject(result.request.data.data, { "reason": "weed purchased" }, 'data.data is wrong');
                    chai_1.expect(result.request.data, 'data.hash is wrong').to.have.property('hash');
                    chai_1.expect(result.transaction, 'result.transaction.hash is wrong').to.have.property('hash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('create request without extension (implicit parameters)', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount)
                        .on('broadcasted', function (data) {
                        chai_1.expect(data.transaction, 'data.transaction.hash is wrong').to.have.property('hash');
                    })];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.transaction).to.have.property('hash');
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, 0, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(defaultAccount);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(defaultAccount);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(0);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result.request.data, 'request.data is wrong').to.be.undefined;
                    return [2 /*return*/];
            }
        });
    }); });
    it('create request _payer not address', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee('0xNOTADDRESS', arbitraryAmount)];
                case 1:
                    result = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    utils.expectEqualsObject(e_1, Error('_payer must be a valid eth address'), 'exception not right');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('create request payer == payee', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(defaultAccount, arbitraryAmount)];
                case 1:
                    result = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    utils.expectEqualsObject(e_2, Error('_payer must be a valid eth address'), 'exception not right');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('create request amount < 0', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, e_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, new WEB3.utils.BN(-1))];
                case 1:
                    result = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _a.sent();
                    utils.expectEqualsObject(e_3, Error('_expectedAmount must a positive integer'), 'exception not right');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('create request _extension not address', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, e_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount, '', '0xNOTADDRESS')];
                case 1:
                    result = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _a.sent();
                    utils.expectEqualsObject(e_4, Error('_extension must be a valid eth address'), 'exception not right');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('create request _extension not handled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, e_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount, '', addressRequestEthereum)];
                case 1:
                    result = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 3];
                case 2:
                    e_5 = _a.sent();
                    utils.expectEqualsObject(e_5, Error('_extension is not supported'), 'exception not right');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('create request with _extension handled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount, '', addressSynchroneExtensionEscrow, [otherGuy])
                        .on('broadcasted', function (data) {
                        chai_1.expect(data.transaction, 'data.transaction.hash is wrong').to.have.property('hash');
                    })];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.transaction).to.have.property('hash');
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, 0, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(defaultAccount);
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(defaultAccount);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal(0);
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result.request.extension.address.toLowerCase(), 'extension.address is wrong').to.equal(addressSynchroneExtensionEscrow);
                    chai_1.expect(result.request.data, 'request.data is wrong').to.be.undefined;
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=createRequestAsPayee.js.map