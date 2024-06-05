/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { AssetType } from './AssetType';
import { Address, Builder, Slice, Writable } from '@ton/core';
export declare class Asset implements Writable {
    readonly type: AssetType;
    readonly address?: Address | undefined;
    private constructor();
    static native(): Asset;
    static jetton(minter: Address): Asset;
    static fromSlice(src: Slice): Asset;
    equals(other: Asset): boolean;
    writeTo(builder: Builder): void;
    toSlice(): Slice;
    toString(): string;
}
