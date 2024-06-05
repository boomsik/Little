"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetError = void 0;
class AssetError extends Error {
    static notSupported() {
        return new AssetError('Asset is not supported.');
    }
}
exports.AssetError = AssetError;
//# sourceMappingURL=AssetError.js.map