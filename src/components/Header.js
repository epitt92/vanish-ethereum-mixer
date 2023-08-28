import logo from "../assets/images/logo.svg";
import { WalletIcon } from "./icons/WalletIcon";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <header className="relative pl-[4.5rem] pr-[5.66rem] flex items-center justify-between pt-[2.06rem] max-md:pl-8 max-md:pr-8 max-sm:px-3">
      <a href="/">
        <img
          src={logo}
          width={110}
          height={106.291428}
          alt="Logo"
          className="max-sm:w-[100px]"
        />
      </a>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className="text-red h-[48px] max-sm:h-[48px] px-[20px] max-sm:px-4 border-[1px] border-red-100 flex items-center justify-center bg-red09 hover:bg-red23 rounded-[27px]"
                    >
                      <WalletIcon className="mr-3" />
                      Connect wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      className="text-red h-[48px] max-sm:h-[48px] px-[20px] max-sm:px-4 border-[1px] border-red-100 flex items-center justify-center bg-red09 hover:bg-red23 rounded-[27px]"
                    >
                      <WalletIcon className="mr-3" />
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={openChainModal}
                      className="text-red h-[48px] max-sm:h-[48px] px-[20px] max-sm:px-4 border-[1px] border-red-100 flex items-center justify-center bg-red09 hover:bg-red23 rounded-[27px]"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 24,
                            height: 24,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 10,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 24, height: 24 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      className="text-red h-[48px] max-sm:h-[48px] px-[20px] max-sm:px-4 border-[1px] border-red-100 flex items-center justify-center bg-red09 hover:bg-red23 rounded-[27px]"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </header>
  );
};
