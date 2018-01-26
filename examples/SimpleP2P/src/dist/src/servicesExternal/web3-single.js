"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var WEB3 = require('web3');
// ethereumjs-abi.js modified to support solidity packing of bytes32 array
var ETH_ABI = require('../lib/ethereumjs-abi-perso.js');
/**
 * The Web3Single class is the singleton class containing the web3.js interface
 */
var Web3Single = /** @class */ (function () {
    /**
     * Private constructor to Instantiates a new Web3Single
     * @param   provider        The Web3.js Provider instance you would like the requestNetwork.js
     *                          library to use for interacting with the Ethereum network.
     * @param   networkId       the Ethereum network ID.
     */
    function Web3Single(web3Provider, networkId) {
        /**
         * cache of the blocks timestamp
         */
        this.blockTimestamp = {};
        this.web3 = new WEB3(web3Provider || new WEB3.providers.HttpProvider(config_1.default.ethereum.nodeUrlDefault[config_1.default.ethereum.default]));
        this.networkName = networkId ? Web3Single.getNetworkName(networkId) : config_1.default.ethereum.default;
    }
    /**
     * Initialized the class Web3Single
     * @param   provider        The Web3.js Provider instance you would like the requestNetwork.js library
     *                          to use for interacting with the Ethereum network.
     * @param   networkId       the Ethereum network ID.
     */
    Web3Single.init = function (web3Provider, networkId) {
        this._instance = new this(web3Provider, networkId);
    };
    /**
     * get the instance of Web3Single
     * @return  The instance of the Web3Single class.
     */
    Web3Single.getInstance = function () {
        return this._instance;
    };
    /**
     * return BN of web3
     * @return Web3.utils.BN
     */
    Web3Single.BN = function () {
        return WEB3.utils.BN;
    };
    /**
     * get Network name from network Id
     * @param    _networkId    network id
     * @return   network name
     */
    Web3Single.getNetworkName = function (_networkId) {
        switch (_networkId) {
            case 1: return 'main';
            case 2: return 'morden';
            case 3: return 'ropsten';
            case 4: return 'rinkeby';
            case 42: return 'kovan';
            default: return 'private';
        }
    };
    /**
     * Send a web3 method
     * @param    _method                             the method to send
     * @param    _callbackTransactionHash            callback when the transaction is submitted
     * @param    _callbackTransactionReceipt         callback when the transacton is mined (0 confirmation block)
     * @param    _callbackTransactionConfirmation    callback when a new confirmation block is mined (up to 20)
     * @param    _callbackTransactionError           callback when an error occured
     * @param    _options                            options for the method (gasPrice, gas, value, from)
     */
    Web3Single.prototype.broadcastMethod = function (_method, _callbackTransactionHash, _callbackTransactionReceipt, _callbackTransactionConfirmation, _callbackTransactionError, _options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options, accounts, e_1, forcedGas;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = Object.assign({}, _options || {});
                        options.numberOfConfirmation = undefined;
                        if (!!options.from) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.web3.eth.getAccounts()];
                    case 2:
                        accounts = _a.sent();
                        options.from = accounts[0];
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, _callbackTransactionError(e_1)];
                    case 4:
                        forcedGas = options.gas;
                        options.value = options.value ? options.value : 0;
                        options.gas = forcedGas ? forcedGas : 90000000;
                        options.gasPrice = options.gasPrice
                            ? options.gasPrice
                            : this.web3.utils.toWei(config_1.default.ethereum.gasPriceDefault, config_1.default.ethereum.gasPriceDefaultUnit);
                        // get the gas estimation
                        _method.estimateGas(options, function (err, estimateGas) {
                            if (err)
                                return _callbackTransactionError(err);
                            // it is safer to add 5% of gas
                            options.gas = forcedGas ? forcedGas : Math.floor(estimateGas * 1.05);
                            // try the method offline
                            _method.call(options, function (errCall, resultCall) {
                                if (errCall) {
                                    // let's try with more gas (*2)
                                    options.gas = forcedGas ? forcedGas : Math.floor(estimateGas * 2);
                                    // try the method offline
                                    _method.call(options, function (errCall2, resultCall2) {
                                        if (errCall2)
                                            return _callbackTransactionError(errCall2);
                                        // everything looks fine, let's send the transation
                                        _method.send(options)
                                            .on('transactionHash', _callbackTransactionHash)
                                            .on('receipt', _callbackTransactionReceipt)
                                            .on('confirmation', _callbackTransactionConfirmation)
                                            .on('error', _callbackTransactionError);
                                    });
                                }
                                else {
                                    // everything looks fine, let's send the transation
                                    _method.send(options)
                                        .on('transactionHash', _callbackTransactionHash)
                                        .on('receipt', _callbackTransactionReceipt)
                                        .on('confirmation', _callbackTransactionConfirmation)
                                        .on('error', _callbackTransactionError);
                                }
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send a web3 method
     * @param    _method    the method to call()
     * @param    _options   options for the method (gasPrice, gas, value, from)
     */
    Web3Single.prototype.callMethod = function (_method, _options) {
        return new Promise(function (resolve, reject) {
            _method.estimateGas(_options, function (errEstimateGas, estimateGas) {
                if (errEstimateGas)
                    return reject(errEstimateGas);
                _method.call(_options, function (errCall, resultCall) {
                    if (errCall)
                        return reject(errCall);
                    return resolve(resultCall);
                });
            });
        });
    };
    /**
     * Get the default account (account[0] of the wallet)
     * @return    Promise of the default account
     */
    Web3Single.prototype.getDefaultAccount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.web3.eth.getAccounts(function (err, accs) {
                            if (err)
                                return reject(err);
                            if (accs.length === 0)
                                return reject(Error('No accounts found'));
                            return resolve(accs[0]);
                        });
                    })];
            });
        });
    };
    /**
     * Get the default account (account[0] of the wallet) With a callback
     * @param    _callback    callback with the default account
     */
    Web3Single.prototype.getDefaultAccountCallback = function (_callback) {
        this.web3.eth.getAccounts(function (err, accs) {
            if (err)
                return _callback(err, undefined);
            if (accs.length === 0)
                return _callback(Error('No accounts found'), undefined);
            return _callback(undefined, accs[0]);
        });
    };
    /**
     * Convert a value in solidity bytes32 string
     * @param    _type    type of the value to convert (e.g: address, uint, int etc...)
     * @param    _value   value to convert
     * @return   solidity like bytes32 string
     */
    Web3Single.prototype.toSolidityBytes32 = function (_type, _value) {
        return this.web3.utils.bytesToHex(ETH_ABI.toSolidityBytes32(_type, _value));
    };
    /**
     * Convert an array to an array in solidity bytes32 string
     * TODO : only support addresses so far.
     * @param    _array   array to convert
     * @param    _length  length of the final array
     * @return   array of solidity like bytes32 string
     */
    Web3Single.prototype.arrayToBytes32 = function (_array, _length) {
        _array = _array ? _array : [];
        var ret = [];
        _array.forEach(function (o) {
            // @ts-ignore
            ret.push(this.web3.utils.bytesToHex(ETH_ABI.toSolidityBytes32('address', o)));
        }.bind(this));
        // fill the empty case with zeros
        for (var i = _array.length; i < _length; i++) {
            ret.push(this.web3.utils.bytesToHex(ETH_ABI.toSolidityBytes32('bytes32', 0)));
        }
        return ret;
    };
    /**
     * Check if an address is valid (ignoring case)
     * @param    _address   address to check
     * @return   true if address is valid
     */
    Web3Single.prototype.isAddressNoChecksum = function (_address) {
        if (!_address)
            return false;
        return _address && this.web3.utils.isAddress(_address.toLowerCase());
    };
    /**
     * Check if two addresses are equals (ignoring case)
     * @param    _address1   address to check
     * @param    _address2   address to check
     * @return   true if _address1 is the same as _address2
     */
    Web3Single.prototype.areSameAddressesNoChecksum = function (_address1, _address2) {
        if (!_address1 || !_address2)
            return false;
        return _address1.toLowerCase() === _address2.toLowerCase();
    };
    /**
     * Check if a string is a bytes32
     * @param    _hex   string to check
     * @return   true if _hex is a bytes32
     */
    Web3Single.prototype.isHexStrictBytes32 = function (_hex) {
        return this.web3.utils.isHexStrict(_hex) && _hex.length === 66; // '0x' + 32 bytes * 2 characters = 66
    };
    /**
     * generate web3 method
     * @param   _contractInstance    contract instance
     * @param   _name                method's name
     * @param   _parameters          method's _parameters
     * @return  return a web3 method object
     */
    Web3Single.prototype.generateWeb3Method = function (_contractInstance, _name, _parameters) {
        return _contractInstance.methods[_name].apply(null, _parameters);
    };
    /**
     * Decode transaction input data
     * @param    _abi     abi of the contract
     * @param    _data    input data
     * @return   object with the method name and parameters
     */
    Web3Single.prototype.decodeInputData = function (_abi, _data) {
        var _this = this;
        if (!_data)
            return {};
        var method = {};
        _abi.some(function (o) {
            if (o.type === 'function') {
                var sign_1 = o.name + '(';
                o.inputs.forEach(function (i, index) {
                    sign_1 += i.type + ((index + 1) === o.inputs.length ? '' : ',');
                });
                sign_1 += ')';
                var encoded = _this.web3.eth.abi.encodeFunctionSignature(sign_1);
                if (encoded === _data.slice(0, 10)) {
                    method = { signature: sign_1, abi: o };
                    return true;
                }
            }
            return false;
        });
        if (!method.signature) {
            return {};
        }
        var onlyParameters = '0x' + (_data.slice(10));
        try {
            return { name: method.abi.name,
                parameters: this.web3.eth.abi.decodeParameters(method.abi.inputs, onlyParameters) };
        }
        catch (e) {
            return {};
        }
    };
    /**
     * Decode transaction log parameters
     * @param    _abi      abi of the contract
     * @param    _event    event name
     * @param    _log      log to decode
     * @return   object with the log decoded
     */
    Web3Single.prototype.decodeTransactionLog = function (_abi, _event, _log) {
        var eventInput;
        var signature = '';
        _abi.some(function (o) {
            if (o.name === _event) {
                eventInput = o.inputs;
                signature = o.signature;
                return true;
            }
            return false;
        });
        if (_log.topics[0] !== signature) {
            return null;
        }
        return this.web3.eth.abi.decodeLog(eventInput, _log.data, _log.topics.slice(1));
    };
    /**
     * Decode transaction event parameters
     * @param    _abi          abi of the contract
     * @param    _eventName    event name
     * @param    _event        event to decode
     * @return   object with the event decoded
     */
    Web3Single.prototype.decodeEvent = function (_abi, _eventName, _event) {
        var eventInput;
        _abi.some(function (o) {
            if (o.name === _eventName) {
                eventInput = o.inputs;
                return true;
            }
            return false;
        });
        return this.web3.eth.abi.decodeLog(eventInput, _event.raw.data, _event.raw.topics.slice(1));
    };
    /**
     * Create or Clean options for a method
     * @param    _options    options for the method (gasPrice, gas, value, from, numberOfConfirmation)
     * @return   options cleaned
     */
    Web3Single.prototype.setUpOptions = function (_options) {
        if (!_options)
            _options = {};
        if (!_options.numberOfConfirmation)
            _options.numberOfConfirmation = 0;
        if (_options.gasPrice)
            _options.gasPrice = new WEB3.utils.BN(_options.gasPrice);
        if (_options.gas)
            _options.gas = new WEB3.utils.BN(_options.gas);
        return _options;
    };
    /**
     * get Transaction Receipt
     * @param    _hash    transaction hash
     * @return   Transaction receipt
     */
    Web3Single.prototype.getTransactionReceipt = function (_hash) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.web3.eth.getTransactionReceipt(_hash)];
            });
        });
    };
    /**
     * get Transaction
     * @param    _hash    transaction hash
     * @return   transaction
     */
    Web3Single.prototype.getTransaction = function (_hash) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.web3.eth.getTransaction(_hash)];
            });
        });
    };
    /**
     * get timestamp of a block
     * @param    _blockNumber    number of the block
     * @return   timestamp of a blocks
     */
    Web3Single.prototype.getBlockTimestamp = function (_blockNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var block, e_2;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    if (!!this.blockTimestamp[_blockNumber]) return [3 /*break*/, 2];
                                    return [4 /*yield*/, this.web3.eth.getBlock(_blockNumber)];
                                case 1:
                                    block = _a.sent();
                                    if (!block)
                                        throw Error('block ' + _blockNumber + ' not found');
                                    this.blockTimestamp[_blockNumber] = block.timestamp;
                                    _a.label = 2;
                                case 2: return [2 /*return*/, resolve(this.blockTimestamp[_blockNumber])];
                                case 3:
                                    e_2 = _a.sent();
                                    return [2 /*return*/, resolve()];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Web3Single.prototype.resultToArray = function (obj) {
        var result = [];
        for (var i = 0; i < obj.__length__; i++) {
            result.push(obj[i]);
        }
        return result;
    };
    return Web3Single;
}());
exports.Web3Single = Web3Single;
//# sourceMappingURL=web3-single.js.map