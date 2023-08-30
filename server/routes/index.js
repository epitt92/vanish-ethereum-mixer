const express = require("express");
const { ethers } = require("ethers");
const { Web3 } = require("web3");
require("dotenv").config();
const contractABI = require("../config/abi.json");

const web3 = new Web3(
  new Web3.providers.HttpProvider(`${process.env.INFURA_ENDPOINT}`)
);

// Replace with your private key (without the '0x' prefix) and contract ABI
const privateKey = process.env.OPERATOR_WALLET_PRIVATEKEY;
const walletAddr = process.env.OPERATOR_WALLET_ADDRESS;
const contractAddress = process.env.CONTRACT_ADDRESS;
// Convert the private key into a signer
const contract = new web3.eth.Contract(contractABI, contractAddress, {
  from: walletAddr,
});

const routes = express.Router();
routes.post("/withdraw", async (req, res) => {
  const { sender, receiver, amount, timestamp, type } = req.body;
  console.log(sender, receiver, amount, timestamp, type);
  const checksummSender = web3.utils.toChecksumAddress(sender);
  const checksummReceiver = web3.utils.toChecksumAddress(receiver);
  let value = 0;
  let transaction;
  if (type === "ETH") {
    value = web3.utils.toWei(Number(amount), "ether");
  } else {
    value = ethers.parseUnits(`${amount}`, 9);
  }
  let hashValue = await contract.methods
    .computeHash(checksummSender, Number(timestamp), type, value)
    .call();
  console.log(hashValue);

  if (type === "ETH") {
    console.log("eth", value);
    transaction = contract.methods.mix(hashValue, checksummReceiver, value);
  } else {
    console.log("erc20", value);
    transaction = contract.methods.mixERC20(
      hashValue,
      checksummReceiver,
      value
    );
  }
  const gasPrice = await web3.eth.getGasPrice();
  const nonce = await web3.eth.getTransactionCount(walletAddr);
  const gasEstimate = await transaction.estimateGas({ from: walletAddr });
  const rawTx = {
    to: contractAddress,
    gas: gasEstimate,
    gasPrice: gasPrice,
    data: transaction.encodeABI(),
    nonce,
  };
  const tx = await web3.eth.accounts.signTransaction(rawTx, privateKey);
  try {
    web3.eth.sendSignedTransaction(tx.rawTransaction);
  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
  return res.json({ success: true });
});
module.exports = routes;
