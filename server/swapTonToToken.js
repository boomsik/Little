const { Address, toNano, TonClient4, WalletContractV4 } = require("@ton/ton");
const {
    Asset,
    Factory,
    JettonRoot,
    MAINNET_FACTORY_ADDR,
    Pool,
    PoolType,
    VaultNative,
} = require("@dedust/sdk");
const { mnemonicToPrivateKey } = require("ton-crypto");
const dotenv = require("dotenv");
dotenv.config();

async function swapTonToToken(pairAddress, tonAmount) {
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

        async function importToken(tokenAddress) {
            try {
                const jettonRoot = tonClient.open(
                    JettonRoot.createFromAddress(Address.parse(tokenAddress))
                );
                console.log(`Импортирован токен с адресом ${tokenAddress}`);
                return jettonRoot;
            } catch (error) {
                console.error("Ошибка импорта токена:", error);
                throw error;
            }
        }

        const newTokenRoot = await importToken(pairAddress);
        if (!newTokenRoot || !newTokenRoot.address) {
            throw new Error(
                "newTokenRoot или newTokenRoot.address неопределен"
            );
        }

        const poolAddress = await factory.getPoolAddress({
            poolType: PoolType.VOLATILE,
            assets: [Asset.native(), Asset.jetton(newTokenRoot.address)],
        });
        if (!poolAddress) {
            throw new Error("poolAddress неопределен");
        }

        const pool = tonClient.open(Pool.createFromAddress(poolAddress));
        console.log("Пул для нового токена инициализирован.");

        const nativeVault = tonClient.open(
            VaultNative.createFromAddress(
                await factory.getVaultAddress(Asset.native())
            )
        );
        console.log("Вольт инициализирован.");

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
            nativeVault.address
        );

        if (vaultState.account.state.type !== "active") {
            throw new Error("Native Vault не существует.");
        }
        console.log("Native Vault активен.");

        const amountIn = toNano(tonAmount); // Используем введенное количество токенов
        console.log("Количество для обмена:", amountIn.toString());

        const { amountOut: expectedAmountOut } = await pool.getEstimatedSwapOut(
            {
                assetIn: Asset.native(),
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

        await nativeVault.sendSwap(sender, {
            poolAddress: pool.address,
            amount: amountIn,
            limit: minAmountOut,
            gasAmount: toNano("0.25"),
        });
        console.log("Обмен отправлен.");
    } catch (error) {
        console.error("Ошибка в функции swapTonToToken:", error);
        throw error;
    }
}

module.exports = { swapTonToToken };
