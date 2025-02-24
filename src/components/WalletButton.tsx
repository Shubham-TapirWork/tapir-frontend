import { createContext, useMemo } from "react";

// Thirdweb Wallet Provider
import { ConnectButton, darkTheme, ThirdwebProvider } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

// Constants
import { THIRDWEB_CLIENT_ID } from "@/constants/env";
import { thirdwebChain } from "@/constants/chains";

export const thirdwebClient = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export const thirdwebAllowedWallets = [
  createWallet("io.metamask"),
  walletConnect(),
  createWallet("com.coinbase.wallet"),
];

export const WalletButton = () => {
  // Thirdweb Wallet Implementation
  const Context = createContext({ open: () => {} });
  const value = useMemo(() => ({ open }), [open]);

  return (
    <Context.Provider value={value}>
      <ThirdwebProvider>
          <ConnectButton
            client={thirdwebClient}
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
                accentText: "#32a852",
              },
            })}
            chains={[
              thirdwebChain,
            ]}
          />
      </ThirdwebProvider>
    </Context.Provider>
  );
};