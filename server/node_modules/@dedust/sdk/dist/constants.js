"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLANK_CODE = exports.MAINNET_FACTORY_ADDR = exports.MAINNET_API_URL = void 0;
const core_1 = require("@ton/core");
exports.MAINNET_API_URL = 'https://api.dedust.io';
exports.MAINNET_FACTORY_ADDR = core_1.Address.parse('EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67');
exports.BLANK_CODE = core_1.Cell.fromBoc(Buffer.from('te6ccgEBBAEAlgABFP8A9KQT9LzyyAsBAgJwAwIACb8pMvg8APXeA6DprkP0gGBB2onai9qPHDK3AgFA4LEAIZGWCgOeLAP0BQDXnoGSA/YB2s/ay9rI4v/aIxx72omh9IGmDqJljgvlwgcIHgmmPgMEITZ1R/V0K+XoB6Z+AmGpph4CA6hD9ghDodo92qYgjCCLBAHKTdqHsdqD2+ID5f8=', 'base64'))[0];
//# sourceMappingURL=constants.js.map