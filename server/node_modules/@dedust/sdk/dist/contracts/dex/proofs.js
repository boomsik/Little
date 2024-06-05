"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyVaultAddress = exports.createVaultProof = exports.createProof = exports.createStateInit = void 0;
const core_1 = require("@ton/core");
const common_1 = require("./common");
const constants_1 = require("../../constants");
function createStateInit(code, data) {
    return (0, core_1.beginCell)()
        .storeUint(0, 2) // split_depth:(Maybe (## 5)) special:(Maybe TickTock)
        .storeMaybeRef(code) // code:(Maybe ^Cell)
        .storeMaybeRef(data) // data:(Maybe ^Cell)
        .storeDict(null) // library:(HashmapE 256 SimpleLib)
        .endCell();
}
exports.createStateInit = createStateInit;
function createProof(factoryAddress, contractType, params) {
    return createStateInit(constants_1.BLANK_CODE, (0, core_1.beginCell)()
        .storeAddress(factoryAddress)
        .storeUint(contractType, 8)
        .storeWritable(params)
        .endCell());
}
exports.createProof = createProof;
function createVaultProof(factoryAddress, asset) {
    return createProof(factoryAddress, common_1.ContractType.VAULT, asset);
}
exports.createVaultProof = createVaultProof;
function verifyVaultAddress(vaultAddress, factoryAddress, asset) {
    const proof = createVaultProof(factoryAddress, asset);
    return vaultAddress.workChain === 0 && vaultAddress.hash.equals(proof.hash());
}
exports.verifyVaultAddress = verifyVaultAddress;
//# sourceMappingURL=proofs.js.map