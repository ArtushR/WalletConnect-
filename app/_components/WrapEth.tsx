import { useState } from "react";
import Web3 from "web3";

const WETH_ADDRESS = "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WETH_ABI = [
    { "constant": false, "inputs": [], "name": "deposit", "outputs": [], "type": "function", "stateMutability": "payable" }
];

interface Props {
    web3: Web3 | null;
    account: string | null;
}

export default function WrapETH({ web3, account, setError  }: Props) {
    const [loading, setLoading] = useState(false);

    const wrapETH = async () => {
        if (!web3 || !account) {
            setError("Wallet not connected!");
            return;
        }
        if (loading) return;

        try {
            setLoading(true);

            const wethContract = new web3.eth.Contract(WETH_ABI, WETH_ADDRESS);

            await wethContract.methods.deposit().send({
                from: account,
                value: web3.utils.toWei("0.1", "ether"),
            });

        } catch (error: any) {
            console.error(error);

            if (error.code === -32002) {
                setError("Pending transaction detected. Approve or reject it in MetaMask.");
            } else {
                setError("Transaction failed! Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <div className="flex flex-col items-center">
            <button
                onClick={wrapETH}
                className="bg-green-400 px-4 py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <svg
                            className="w-5 h-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2L4 12l8 5 8-5-8-10zm0 15l-8-5 8 10 8-10-8 5z" />
                        </svg>
                        Processing...
                    </>
                ) : (
                    "Wrap ETH"
                )}
            </button>


        </div>
        </>
    );
}
