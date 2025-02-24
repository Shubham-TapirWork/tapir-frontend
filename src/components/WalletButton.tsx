import { ConnectButton, darkTheme } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";

// Constants
import { thirdwebChain } from "@/constants/chains";
import { client } from "@/client";

export const thirdwebAllowedWallets = [
  createWallet("io.metamask"),
  walletConnect(),
  createWallet("com.coinbase.wallet"),
];

export const WalletButton = () => {
  return (
    <ConnectButton
      client={client}
      wallets={thirdwebAllowedWallets}
      connectModal={{
        showThirdwebBranding: false,
        size: "wide",
        title: "Connect Wallet",
        welcomeScreen: {
          title: `Your gateway to the decentralized world`,
          subtitle: `Connect a wallet to get started`,
        },
      }}
      theme={darkTheme({
        colors: {
          accentText: "#a855f7",
        },
      })}
      chains={[thirdwebChain]}
    />
  );
};
