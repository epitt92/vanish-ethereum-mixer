import { usePrepareContractWrite } from "wagmi";
export const useContract = () => {
  const depositConfig = usePrepareContractWrite({
    address: "0x39172a3e6f13d9cc0cf6a0b93f4ea874c7821677",
    abi: [
      {
        inputs: [],
        name: "deposit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "deposit",
  });
  const depositERC20Config = usePrepareContractWrite({
    address: "0x39172a3e6f13d9cc0cf6a0b93f4ea874c7821677",
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "mixAmt", type: "uint256" }],
        name: "depositERC20",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [0],
    functionName: "depositERC20",
  });
  const mixConfig = usePrepareContractWrite({
    address: "0x39172a3e6f13d9cc0cf6a0b93f4ea874c7821677",
    abi: [
      {
        inputs: [
          {
            internalType: "address payable",
            name: "recipient",
            type: "address",
          },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "mix",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: ["", 0],
    functionName: "mix",
  });
  const mixERC20Config = usePrepareContractWrite({
    address: "0x39172a3e6f13d9cc0cf6a0b93f4ea874c7821677",
    abi: [
      {
        inputs: [
          {
            internalType: "address payable",
            name: "recipient",
            type: "address",
          },
          { internalType: "uint256", name: "mixAmt", type: "uint256" },
          { internalType: "uint256", name: "fee", type: "uint256" },
        ],
        name: "mixERC20",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: ["", 0, 0],
    functionName: "mixERC20",
  });
  return { depositConfig, depositERC20Config, mixConfig, mixERC20Config };
};
