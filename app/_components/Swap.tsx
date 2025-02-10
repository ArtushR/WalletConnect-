import { useState, useEffect } from 'react';
import Web3 from 'web3';

const UNISWAP_ROUTER_V2 = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const UNISWAP_ABI = [
    {
        "name": "swapExactTokensForTokens",
        "type": "function",
        "inputs": [
            { "type": "uint256", "name": "amountIn" },
            { "type": "uint256", "name": "amountOutMin" },
            { "type": "address[]", "name": "path" },
            { "type": "address", "name": "to" },
            { "type": "uint256", "name": "deadline" }
        ],
        "stateMutability": "nonpayable"
    }
];

interface Props {
    web3: Web3 | null;
    account: string | null;
    setError: (msg: string) => void;
    setSuccess: (msg: string) => void;
}

export default function Swap({ web3, account, setError, setSuccess }: Props) {
    const [amount, setAmount] = useState('');
    const [gasFee, setGasFee] = useState('0');
    const [loading, setLoading] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [selectedToken, setSelectedToken] = useState('0x6B175474E89094C44Da98b954EedeAC495271d0F'); // Default to DAI

    useEffect(() => {
        if (web3 && account && amount) {
            estimateGasFee();
        }
    }, [amount, selectedToken]);

    const estimateGasFee = async () => {
        if (!web3 || !account || !amount) return;

        try {
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedGas = 200000;
            const fee = web3.utils.fromWei((BigInt(gasPrice) * BigInt(estimatedGas)).toString(), 'ether');
            setGasFee(parseFloat(fee).toFixed(6));
        } catch (error) {
            console.error("Failed to estimate gas fee", error);
        }
    };

    const handleMaxTransact = async () => {
        if (!web3 || !account) return;

        try {
            const balance = await web3.eth.getBalance(account);
            const gasPrice = await web3.eth.getGasPrice();
            const estimatedGas = 200000;
            const totalGasCost = BigInt(gasPrice) * BigInt(estimatedGas);
            const maxAmount = BigInt(balance) > totalGasCost ? BigInt(balance) - totalGasCost : BigInt(0);

            setAmount(parseFloat(web3.utils.fromWei(maxAmount.toString(), 'ether')).toFixed(6));
        } catch (error) {
            console.error("Error calculating max transaction amount", error);
        }
    };

    const swapTokens = async () => {
        if (!web3 || !account || !amount) return alert("Enter an amount!");

        try {
            setLoading(true);
            const router = new web3.eth.Contract(UNISWAP_ABI, UNISWAP_ROUTER_V2);

            const path = [
                web3.utils.toChecksumAddress('0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
                web3.utils.toChecksumAddress(selectedToken)
            ];

            const amountIn = web3.utils.toWei(amount, "ether");
            const amountOutMin = "0";
            const deadline = Math.floor(Date.now() / 1000) + 600;

            await router.methods
                .swapExactTokensForTokens(amountIn, amountOutMin, path, account, deadline)
                .send({ from: account });

            setSuccess("Swap Completed!");
        } catch (error) {
            console.error(error);
            setError("Swap failed!");
            setShowInput(false)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showInput && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="p-5 rounded-2xl bg-primary-200 w-[400px] pointer-events-auto">
                        <select
                            value={selectedToken}
                            onChange={(e) => setSelectedToken(e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        >
                            <option value="0x6B175474E89094C44Da98b954EedeAC495271d0F">DAI</option>
                            <option value="0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48">USDC</option>
                            <option value="0xdAC17F958D2ee523a2206206994597C13D831ec7">USDT</option>
                        </select>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter WETH amount"
                            className="border p-2 rounded w-full mb-2"
                        />
                        {Number(amount) === 0 && <p className="text-sm text-red-600">Amount cant be 0</p>}
                        <div className="flex w-full gap-2 items-center mt-2">
                            <button
                                onClick={handleMaxTransact}
                                className="border border-primary-600 bg-primary-600 text-white px-4 py-2 rounded flex-1"
                            >
                                Max Transact
                            </button>
                            <p className="border border-primary-300 text-primary-800 px-3 py-2 rounded">
                                Gas Fee: {gasFee} ETH
                            </p>
                        </div>
                        <div className="flex w-full justify-between gap-2.5 items-center">
                            <button
                                onClick={swapTokens}
                                className="bg-green-500 text-white px-4 py-2 rounded-xl mt-2 flex-1"
                                disabled={loading || Number(amount) === 0}
                            >
                                {loading ? "Swapping..." : "Swap WETH for ERC20"}
                            </button>
                            <button
                                onClick={() => setShowInput(false)}
                                className="px-4 py-2 rounded-xl mt-2 bg-primary-100 text-primary-800"
                            >
                                Cancel swap
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {!showInput && (
                <button
                    onClick={() => setShowInput(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                >
                    Start Swap
                </button>
            )}
        </>
    );
}
