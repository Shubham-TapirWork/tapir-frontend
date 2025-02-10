import { defineChain } from "thirdweb";

export const thirdwebChain = defineChain({
  id: 11155111,
  name: "Ethereum Sepolia",
  rpc: "https://ethereum-sepolia-rpc.publicnode.com",
  testnet: true,
  nativeCurrency: {
    name: "Ethereum Sepolia",
    symbol: "ETH",
    decimals: 18,
  },
  chain: "Ethereum Sepolia",
  shortName: "Sepolia",
  chainId: 11155111,
  slug: "Sepolia",
  slip44: 714,
  explorers: [
    {
      name: "explorer",
      url: "https://sepolia.etherscan.io",
      standard: "EIP3091",
    },
  ],
  icon: {
    url: "logotosepolialink",
    width: 512,
    height: 512,
    format: "png",
  },
  infoURL: "https://sepolia.etherscan.io",
});