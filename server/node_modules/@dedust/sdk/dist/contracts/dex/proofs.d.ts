/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address, Builder, Cell, Writable } from '@ton/core';
import { Asset, ContractType } from './common';
export declare function createStateInit(code: Cell, data: Cell): Cell;
export declare function createProof(factoryAddress: Address, contractType: ContractType, params: ((builder: Builder) => void) | Writable): Cell;
export declare function createVaultProof(factoryAddress: Address, asset: Asset): Cell;
export declare function verifyVaultAddress(vaultAddress: Address, factoryAddress: Address, asset: Asset): boolean;
