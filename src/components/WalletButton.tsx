import { ConnectButton, darkTheme } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";

// Constants
import { client } from "@/client";
import { defineChain } from "thirdweb";
import { CHAIN_ID } from "@/constants/env";

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
        size: "compact",
        titleIcon: "/Logo.svg",
        title: "Connect Wallet",
        // welcomeScreen: {
        //   title: `Your gateway to the decentralized world`,
        //   subtitle: `Connect a wallet to get started`,
        // },
      }}
      theme={darkTheme({
        colors: {
          accentText: "#a855f7",
          primaryButtonBg: "hsl(271, 91%, 65%)",
          primaryButtonText: "hsl(0, 0%, 100%)",
        },
      })}
      chain={defineChain(CHAIN_ID)}
    />
  );
};
