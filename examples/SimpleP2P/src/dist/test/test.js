"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config = require('../src/config.json');
var requestNetwork_1 = require("../src/requestNetwork");
var rn = new requestNetwork_1.default("http://localhost:8545", 10000000000);
function foo() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee('0xf17f52151ebef6c7334fad080c5704d77216b732', // 1
                        200000)];
                case 1:
                    result = _a.sent();
                    console.log('createRequestAsPayee');
                    console.log(result);
                    return [4 /*yield*/, rn.requestCoreService.getRequestsByAddress('0x627306090abab3a6e1400e9345bc60c78a8bef57')];
                case 2:
                    // result = await rn.requestEthereumService.createRequestAsPayee( 
                    // 		'0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e', // 1
                    // 		200000,
                    // 		'{"reason":"wine purchased"}',
                    // 		'',
                    // 		[],
                    // 		{from:'0xf17f52151ebef6c7334fad080c5704d77216b732'}
                    // );
                    // console.log('createRequestAsPayee')
                    // console.log(result)
                    result = _a.sent();
                    console.log('getRequestsByAddress');
                    console.log(result);
                    console.log(result.asPayee);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log('Error: ', err_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
foo();
//# sourceMappingURL=test.js.map