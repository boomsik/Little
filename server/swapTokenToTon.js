const { Address, toNano, TonClient4, WalletContractV4 } = require("@ton/ton");
const {
    Asset,
    Factory,
    JettonRoot,
    JettonWallet,
    MAINNET_FACTORY_ADDR,
    Pool,
    PoolType,
    VaultJetton,
} = require("@dedust/sdk");
const { mnemonicToPrivateKey } = require("ton-crypto");
const dotenv = require("dotenv");
dotenv.config();

const SCALE_ADDR = Address.parse(
    "EQCLWvCj44QYTeLujnCYKH7DoAuk_O7QI-LnAt3X5bOfNFMy"
);

async function swapTokenToTon(importTokenAddress, importTokenAmount) {
    try {
        const tonClient = new TonClient4({
            endpoint: "https://mainnet-v4.tonhubapi.com",
        });

        console.log("Клиент TON инициализирован.");

        const mnemonic = process.env.MNEMONIC;
        if (!mnemonic) {
            throw new Error("Мнемоническая фраза не найдена в .env файле.");
        }
        console.log("Мнемоническая фраза загружена.");

        const keys = await mnemonicToPrivateKey(mnemonic.split(" "));
        console.log("Приватный ключ получен из мнемонической фразы.");

        const wallet = tonClient.open(
            WalletContractV4.create({
                publicKey: keys.publicKey,
                workchain: 0,
            })
        );
        console.log("Кошелек инициализирован.");

        const sender = wallet.sender(keys.secretKey);
        console.log("Отправитель создан.");

        const factory = tonClient.open(
            Factory.createFromAddress(MAINNET_FACTORY_ADDR)
        );
        console.log("Фабрика инициализирована.");

        const scaleRoot = tonClient.open(
            JettonRoot.createFromAddress(Address.parse(importTokenAddress))
        );
        const scaleVault = tonClient.open(
            await factory.getJettonVault(Address.parse(importTokenAddress))
        );
        console.log("Хранилище Jetton для токена инициализировано.");

        const scaleWallet = tonClient.open(
            await scaleRoot.getWallet(wallet.address)
        );
        console.log("Кошелек Jetton для пользователя инициализирован.");

        const pool = tonClient.open(
            Pool.createFromAddress(
                await factory.getPoolAddress({
                    poolType: PoolType.VOLATILE,
                    assets: [Asset.jetton(scaleRoot.address), Asset.native()],
                })
            )
        );
        console.log("Пул инициализирован.");

        const lastBlock = await tonClient.getLastBlock();
        console.log("Последний блок загружен:", lastBlock);

        const poolState = await tonClient.getAccountLite(
            lastBlock.last.seqno,
            pool.address
        );

        if (poolState.account.state.type !== "active") {
            throw new Error("Пул не существует.");
        }
        console.log("Пул активен.");

        const vaultState = await tonClient.getAccountLite(
            lastBlock.last.seqno,
            scaleVault.address
        );

        if (vaultState.account.state.type !== "active") {
            throw new Error("Jetton Vault не существует.");
        }
        console.log("Jetton Vault активен.");

        const amountIn = toNano(importTokenAmount);
        console.log("Количество для обмена:", amountIn.toString());

        const { amountOut: expectedAmountOut } = await pool.getEstimatedSwapOut(
            {
                assetIn: Asset.jetton(scaleRoot.address),
                amountIn,
            }
        );
        console.log(
            "Ожидаемое количество на выходе:",
            expectedAmountOut.toString()
        );

        const minAmountOut = (expectedAmountOut * 90n) / 100n; // expectedAmountOut - 10%
        console.log(
            "Минимальное количество на выходе (с учетом проскальзывания):",
            minAmountOut.toString()
        );

        await scaleWallet.sendTransfer(sender, toNano("0.3"), {
            amount: amountIn,
            destination: scaleVault.address,
            responseAddress: wallet.address, // вернуть газ пользователю
            forwardAmount: toNano("0.25"),
            forwardPayload: VaultJetton.createSwapPayload({
                poolAddress: pool.address,
            }),
        });
        console.log("Обмен отправлен.");
    } catch (error) {
        console.error("Ошибка в функции swapTokenToTon:", error);
        throw error;
    }
}

module.exports = { swapTokenToTon };
