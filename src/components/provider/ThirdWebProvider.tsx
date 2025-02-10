import { createThirdwebClient } from "thirdweb";
import { ConnectButton, darkTheme, ThirdwebProvider } from "thirdweb/react";

export const thirdwebClient = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export const thirdwebAllowedWallets = [
  createWallet("io.metamask"),
  walletConnect(),
  createWallet("com.coinbase.wallet"),
];

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { thirdwebChain } from "@/constants/chains";
import { THIRDWEB_CLIENT_ID } from "@/constants/env";

const Context = createContext({ open: () => {} });

export default function ThirdWebProvider({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const open = useCallback(
    () => (ref.current?.children[0] as HTMLElement)?.click(),
    []
  );
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
        {children}
      </ThirdwebProvider>
    </Context.Provider>
  );
}

export function useThirdWeb() {
  return useContext(Context).open;
}
