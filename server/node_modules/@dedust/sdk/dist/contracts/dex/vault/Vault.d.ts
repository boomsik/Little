/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address, Cell, Contract, ContractProvider } from '@ton/core';
import { Asset, ReadinessStatus } from '../common';
export interface SwapStep {
    poolAddress: Address;
    limit?: bigint;
    next?: SwapStep;
}
export interface SwapParams {
    deadline?: number;
    recipientAddress?: Address | null;
    referralAddress?: Address | null;
    fulfillPayload?: Cell | null;
    rejectPayload?: Cell | null;
}
export declare abstract class Vault implements Contract {
    readonly address: Address;
    protected constructor(address: Address);
    abstract getReadinessStatus(provider: ContractProvider): Promise<ReadinessStatus>;
    getAsset(provider: ContractProvider): Promise<Asset>;
    protected static packSwapParams({ deadline, recipientAddress, referralAddress, fulfillPayload, rejectPayload, }: SwapParams): Cell;
    protected static packSwapStep({ poolAddress, limit, next }: SwapStep): Cell;
}
