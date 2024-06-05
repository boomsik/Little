"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const AssetType_1 = require("./AssetType");
const core_1 = require("@ton/core");
const AssetError_1 = require("./AssetError");
class Asset {
    type;
    address;
    constructor(type, address) {
        this.type = type;
        this.address = address;
    }
    static native() {
        return new Asset(AssetType_1.AssetType.NATIVE);
    }
    static jetton(minter) {
        return new Asset(AssetType_1.AssetType.JETTON, minter);
    }
    static fromSlice(src) {
        const assetType = src.loadUint(4);
        switch (assetType) {
            case AssetType_1.AssetType.NATIVE:
                return Asset.native();
            case AssetType_1.AssetType.JETTON:
                return Asset.jetton(new core_1.Address(src.loadInt(8), src.loadBuffer(32)));
            default:
                throw AssetError_1.AssetError.notSupported();
        }
    }
    equals(other) {
        return this.toString() === other.toString();
    }
    writeTo(builder) {
        switch (this.type) {
            case AssetType_1.AssetType.NATIVE:
                builder.storeUint(AssetType_1.AssetType.NATIVE, 4);
                break;
            case AssetType_1.AssetType.JETTON:
                builder
                    .storeUint(AssetType_1.AssetType.JETTON, 4)
                    .storeInt(this.address.workChain, 8)
                    .storeBuffer(this.address.hash);
                break;
            default:
                throw AssetError_1.AssetError.notSupported();
        }
    }
    toSlice() {
        return (0, core_1.beginCell)().storeWritable(this).endCell().beginParse();
    }
    toString() {
        switch (this.type) {
            case AssetType_1.AssetType.NATIVE:
                return `native`;
            case AssetType_1.AssetType.JETTON:
                return `jetton:${this.address.toString()}`;
            default:
                throw AssetError_1.AssetError.notSupported();
        }
    }
}
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map