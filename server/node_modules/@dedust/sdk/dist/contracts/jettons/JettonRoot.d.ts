/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address, Cell, Contract, ContractProvider } from '@ton/core';
import { JettonWallet } from './JettonWallet';
export declare class JettonRoot implements Contract {
    readonly address: Address;
    private constructor();
    static createFromAddress(address: Address): JettonRoot;
    getWalletAddress(provider: ContractProvider, ownerAddress: Address): Promise<Address>;
    getWallet(provider: ContractProvider, ownerAddress: Address): Promise<JettonWallet>;
    getJettonData(provider: ContractProvider): Promise<{
        totalSupply: bigint;
        isMintable: boolean;
        adminAddress: Address | null;
        content: Cell;
        walletCode: Cell;
    }>;
}
