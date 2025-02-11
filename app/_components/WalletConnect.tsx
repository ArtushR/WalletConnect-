"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import TokenBalance from "@/app/_components/TockenBalance";
import WrapETH from "@/app/_components/WrapEth";
import Swap from "@/app/_components/Swap";
import { MOCK_TRANSACTIONS } from "@/app/mockData";

const ERC20_TOKENS = [
    { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", value: "524" },
    { symbol: "USDC", address: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", value: "45760" },
    { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", value: "5100" }
];

export default function WalletConnect() {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [transactions] = useState(MOCK_TRANSACTIONS);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedToken, setSelectedToken] = useState(ERC20_TOKENS[0]);


    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            setWeb3(new Web3(window.ethereum));
        }
    }, []);

    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setAccount(null);
                setError("Wallet disconnected");
            } else {
                setAccount(accounts[0]);
                setSuccess("Wallet changed");
            }
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, []);

    // Auto-hide error/success messages after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const connectWallet = async () => {
        if (!window.ethereum) {
            setError("MetaMask not detected! Please add an extension to your browser or install the app");
            return;
        }

        setLoading(true);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
            setSuccess("Wallet connected");
        } catch (error) {
            setError("Failed to connect wallet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 text-primary-800 rounded-lg">
            <div className="mb-3">
                {error && (
                    <div className="flex justify-between items-center text-sm rounded-2xl w-full bg-red-600 text-white p-5">
                        <p>{error}</p>
                        <button onClick={() => setError('')} className="px-2 rounded-3xl bg-primary-100 text-primary-800">x</button>
                    </div>
                )}
                {success && (
                    <div className="flex justify-between items-center text-sm rounded-2xl bg-green-400 text-white p-5">
                        <p>{success}</p>
                        <button onClick={() => setSuccess('')} className="px-2 rounded-3xl bg-primary-100 text-primary-800">x</button>
                    </div>
                )}
            </div>

            {account ? (
                <div className="grid gap-5">
                    <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                    {web3 && <TokenBalance web3={web3} account={account} selectedToken={selectedToken} setSelectedToken={setSelectedToken} data={ERC20_TOKENS} />}
                    <div className="flex flex-1 gap-5 items-center">
                        {web3 && <WrapETH web3={web3} account={account} setError={setError} />}
                        {web3 && <Swap web3={web3} account={account} setError={setError} setSuccess={setSuccess} selectedToken={selectedToken} setSelectedToken={setSelectedToken} data={ERC20_TOKENS}/>}
                    </div>
                    <div className="mt-4 w-full text-sm">
                        <h3 className="text-lg font-semibold">Recent Transactions</h3>
                        {transactions.map((tx) => (
                            <div key={tx.id} className="border-b py-2">
                                <p>WETH: {tx.amountWETH} → ERC20: {tx.amountERC20}</p>
                                <p>To: {tx.recipient}</p>
                                <p>Status: <span className={tx.status === "success" ? "text-green-500" : "text-yellow-500"}>{tx.status}</span></p>
                                <p>{new Date(tx.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    disabled={loading}
                    className="flex gap-2.5 w-full justify-center bg-primary-500 text-white text-center px-4 py-5 rounded-2xl"
                ><svg
                    className="w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 2L4 12l8 5 8-5-8-10zm0 15l-8-5 8 10 8-10-8 5z" />
                </svg>
                    {loading ? "Connecting..." : "Connect Wallet"}
                </button>
            )}
        </div>
    );
}
