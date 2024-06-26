import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SendTransferForm } from "./containers/SendTransferForm";
import { StakeVanishForm } from "./containers/StakeVanishForm/StakeVanishForm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli, bsc, bscTestnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const { chains, publicClient } = configureChains(
  [mainnet, goerli, bsc, bscTestnet],
  [
    infuraProvider({ apiKey: "4dc50d3e62a34a3ba2065fcbff7664e0" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Vanish",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <SendTransferForm />,
  },
  {
    path: "/stake",
    element: <StakeVanishForm />,
  },
]);

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        appInfo={{
          appName: "Vanish",
        }}
        theme={darkTheme()}
        chains={chains}
      >
        <>
          <Header />
          <div className="mb-[30px]" />
          <div className="my-auto">
            <RouterProvider router={router} />
            {/* <SendTransferForm /> */}
            {/* <StakeVanishForm /> */}
          </div>
          <div className="mb-[48px]" />
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="dark"
          />
        </>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
