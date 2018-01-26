"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var artifacts_1 = require("./artifacts");
var requestEthereum_service_1 = require("./servicesContracts/requestEthereum-service");
/**
 * getServiceFromAddress return the service of a coresponding currency contract address
 * @param   address     The address of the currency contract
 * @return  The service object or undefined if not found
 */
exports.getServiceFromAddress = function (address) {
    if (!address)
        return;
    if (isThisArtifact(artifacts_1.default.requestEthereumArtifact, address)) {
        return new requestEthereum_service_1.default();
    }
};
var isThisArtifact = function (artifact, address) {
    if (!address)
        return false;
    var sanitizedAdress = address.toLowerCase();
    return Object.keys(artifact.networks)
        .some(function (k) {
        var network = artifact.networks[k];
        if (!network.address)
            return false;
        return network.address.toLowerCase() === sanitizedAdress;
    });
};
//# sourceMappingURL=servicesContracts.js.map