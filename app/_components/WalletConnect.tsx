"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import TokenBalance from "@/app/_components/TockenBalance";
import WrapETH from "@/app/_components/WrapEth";
import Swap from "@/app/_components/Swap";
import { MOCK_TRANSACTIONS } from "@/app/mockData";

export default function WalletConnect() {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && window.ethereum) {
            setWeb3(new Web3(window.ethereum));
        }
    }, [isClient]);

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
            setError("MetaMask not detected!");
            return;
        }

        try {
            const ethereum = window.ethereum;
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
            setSuccess("Wallet connected");
        } catch (error) {
            console.error(error);
            setError("Failed to connect wallet.");
        }
    };

    return (
        <div className="p-4 text-primary-800 rounded-lg">
            <div className="mb-3">{error && (
                <div className="flex justify-between items-center rounded-2xl w-full bg-red-600 text-white font-semibold p-5">
                    <p>{error}</p>
                    <button onClick={() => setError('')} className="px-2 rounded-3xl bg-primary-100 text-primary-800">x</button>
                </div>
            )}
            {success && (
                <div className="flex justify-between items-center rounded-2xl bg-green-400 text-white font-semibold p-5">
                    <p>{success}</p>
                    <button onClick={() => setSuccess('')} className="px-2 rounded-3xl bg-primary-100 text-primary-800">x</button>
                </div>
            )}</div>
            {account ? (
                <div className="grid gap-5">
                    <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                    {web3 && <TokenBalance web3={web3} account={account} />}
                    <div className="flex flex-1 gap-5 items-center">
                        {web3 && <WrapETH web3={web3} account={account} setError={setError} />}
                        {web3 && <Swap web3={web3} account={account} setError={setError} setSuccess={setSuccess} />}
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
                    className="w-full bg-primary-500 text-white px-4 py-5 rounded-2xl"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
