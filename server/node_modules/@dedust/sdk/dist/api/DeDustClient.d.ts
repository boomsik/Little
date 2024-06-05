/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address } from '@ton/core';
import { AssetBalance, PoolData, TradeData } from './types';
export declare class DeDustClient {
    private httpClient;
    constructor({ endpointUrl, timeout, }: {
        endpointUrl: string;
        timeout?: number;
    });
    getAccountAssets(accountAddress: Address): Promise<AssetBalance[]>;
    getPools(): Promise<PoolData[]>;
    getPoolTrades(poolAddress: Address, { afterLT, pageSize }?: {
        afterLT?: bigint;
        pageSize?: number;
    }): Promise<TradeData[]>;
}
