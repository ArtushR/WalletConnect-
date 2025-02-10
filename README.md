# WalletConnect DApp

## Overview
This project is a decentralized application (DApp) that allows users to connect their Ethereum wallet, view token balances, wrap ETH to WETH, and swap tokens using the Uniswap V2 Router. The application is built using React and Web3.js.

## Features
- **Wallet Connection**: Connect your MetaMask wallet to interact with the Ethereum blockchain.
- **Token Balance Display**: View your current token balance.
- **Wrap ETH**: Convert ETH to WETH for trading.
- **Swap Tokens**: Swap WETH for ERC-20 tokens using Uniswap V2.
- **Max Transaction Calculation**: Automatically calculate the maximum ETH that can be swapped after deducting gas fees.
- **Error and Success Messages**: Displays messages for transaction status with auto-dismiss after 5 seconds.

## Technologies Used
- React (Next.js framework)
- Web3.js
- Tailwind CSS for styling
- Uniswap V2 Router

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/walletconnect-dapp.git
   cd walletconnect-dapp
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
1. Open the application in your browser.
2. Click **Connect Wallet** to connect your MetaMask account.
3. View your token balance and wrap ETH if needed.
4. Enter the amount of WETH you want to swap and select a token.
5. Click **Swap WETH for ERC20** to initiate the swap.

## Environment Variables
Create a `.env.local` file and add the following environment variables if required:
```sh
NEXT_PUBLIC_INFURA_ID=your_infura_project_id
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key
```

## Known Issues & Fixes
- **Web3ValidatorError: value "" at "/0" must pass "uint256" validation**
    - Ensure you enter a valid amount before swapping.
    - Added validation to prevent sending empty or zero transactions.

## Future Enhancements
- Add more token swap options.
- Implement better slippage protection.
- Support multiple networks (Polygon, BSC, etc.).
- Improve UI/UX.

## License
This project is licensed under the MIT License.

## Author
[Your Name]


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
