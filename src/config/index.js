export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const MIXER_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "timestamp", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "mixAmt", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "depositERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "computeFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const MIXER_ADDRESS = {
  1: "0x9602F7e63BD5f84B4593D65Bb9DFf0cC4A5f2336",
  5: "0x9602F7e63BD5f84B4593D65Bb9DFf0cC4A5f2336",
  56: "0x177cba12dc0a4dec8b447d271d18f331ea1eaa4f",
  97: "0x177cba12dc0a4dec8b447d271d18f331ea1eaa4f",
};
export const TOKEN_ADDRESS = "0xa83Ae363078C97F556550900E4C7fd2809d07A25";

export const BSC_TOKEN_ADDRESS = "0x221c5B1a293aAc1187ED3a7D7d2d9aD7fE1F3FB0";
export const API_ENDPOINT =
  "https://vanish-mixer-1bb389a10c6a.herokuapp.com/api";
