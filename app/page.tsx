"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import WalletConnect from "@/app/_components/WalletConnect";

export default function Home() {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && window.ethereum) {
            setWeb3(new Web3(window.ethereum));
        }
    }, [isClient]);

    return (
        <div className="bg-primary-100 w-[450px] m-auto flex-col justify-center p-20 border-l-4 border-b-4 border-primary-500 rounded-3xl h-1/2 items-center text-primary-900">
            {isClient && <WalletConnect />}
        </div>
    );
}
