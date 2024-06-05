"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapTonConnect = void 0;
const core_1 = require("@ton/core");
const DEFAULT_TTL = 5 * 60 * 1000; // minutes
const wrapTonConnect = (tonConnect, ttl = DEFAULT_TTL) => {
    return {
        get address() {
            return tonConnect.account ? core_1.Address.parse(tonConnect.account.address) : undefined;
        },
        async send(args) {
            await tonConnect.sendTransaction({
                validUntil: Date.now() + ttl,
                messages: [
                    {
                        address: args.to.toString(),
                        amount: args.value.toString(10),
                        stateInit: args.init
                            ? (0, core_1.beginCell)()
                                .storeWritable((0, core_1.storeStateInit)(args.init))
                                .endCell()
                                .toBoc()
                                .toString('base64')
                            : undefined,
                        payload: args.body?.toBoc().toString('base64'),
                    },
                ],
            });
        },
    };
};
exports.wrapTonConnect = wrapTonConnect;
//# sourceMappingURL=wrapTonConnect.js.map