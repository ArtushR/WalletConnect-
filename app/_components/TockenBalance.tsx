import { useState, useEffect } from "react";
import Web3 from "web3";
import ERC20_ABI from "@/app/_abi/erc20_abi.json";

const WETH_ADDRESS = "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2";

interface Token {
    symbol: string;
    address: string;
    value: string;
}

interface Props {
    web3: Web3;
    account: string;
    selectedToken: Token;
    setSelectedToken: (token: Token) => void;
    data: Token[];
}

export default function TokenBalance({ web3, account, selectedToken, setSelectedToken, data }: Props) {
    const [ethBalance, setEthBalance] = useState("0");
    const [wethBalance, setWethBalance] = useState("0");
    const [erc20Balance, setErc20Balance] = useState("0");

    useEffect(() => {
        if (web3 && account) {
            fetchBalances();
        }
    }, [web3, account, selectedToken]);

    function handleTokenChange(value: string) {
        const tokenObj = data.find(token => token.address === value);
        if (tokenObj) {
            setSelectedToken(tokenObj);
        }
    }

    const fetchBalances = async () => {
        try {
            const balanceWei = await web3.eth.getBalance(account);
            setEthBalance(web3.utils.fromWei(balanceWei, "ether"));

            const wethContract = new web3.eth.Contract(ERC20_ABI, WETH_ADDRESS);
            const wethBalanceWei = await wethContract.methods.balanceOf(account).call();
            setWethBalance(web3.utils.fromWei(wethBalanceWei, "ether"));

            if (selectedToken?.address) {
                const erc20Contract = new web3.eth.Contract(ERC20_ABI, selectedToken.address);
                const erc20BalanceWei = await erc20Contract.methods.balanceOf(account).call();
                setErc20Balance(web3.utils.fromWei(erc20BalanceWei, "ether"));
            }
        } catch (error) {
            console.error("Error fetching balances", error);
        }
    };

    return (
        <div className="border p-4 rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold">Wallet Balances</h3>
            <p><strong>ETH:</strong> {parseFloat(ethBalance).toFixed(4)}</p>
            <p><strong>WETH:</strong> {parseFloat(wethBalance).toFixed(4)}</p>

            <div className="mt-2">
                <label className="block text-sm font-medium">Select ERC20 Token:</label>
                <select
                    value={selectedToken.address}
                    onChange={(e) => handleTokenChange(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                >
                    {data.map((token) => (
                        <option key={token.address} value={token.address}>{token.symbol}</option>
                    ))}
                </select>
                <p>
                    <strong>{selectedToken.symbol}:</strong> {parseFloat(erc20Balance).toFixed(4)}
                </p>
            </div>
        </div>
    );
}
