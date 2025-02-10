import { useEffect, useState } from 'react';
import Web3 from 'web3';

interface Props {
    web3: Web3 | null;
    account: string | null;
}

export default function TokenBalance({ web3, account }: Props) {
    const [ethBalance, setEthBalance] = useState<string | null>(null);

    useEffect(() => {
        if (web3 && account) {
            web3.eth.getBalance(account).then(balance => {
                setEthBalance(web3.utils.fromWei(balance, 'ether'));
            });
        }
    }, [web3, account]);

    return (
        <div className="p-4 w-[240px] bg-primary-800 text-white rounded-lg">
            <h2>Balances</h2>
            <p>ETH: {ethBalance ?? 'Loading...'}</p>
        </div>
    );
}
