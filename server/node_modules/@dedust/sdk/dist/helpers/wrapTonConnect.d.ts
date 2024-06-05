import type { ITonConnect } from '@tonconnect/sdk';
import { Sender } from '@ton/core';
export declare const wrapTonConnect: (tonConnect: ITonConnect, ttl?: number) => Sender;
