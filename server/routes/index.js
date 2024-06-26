const express = require("express");
const { ethers } = require("ethers");
const { Web3 } = require("web3");
require("dotenv").config();
const contractABI = require("../config/abi.json");
const { INFURA_ENDPOINTS, CONTRACT_ADDRESS } = require("../config/index");

// Replace with your private key (without the '0x' prefix) and contract ABI
const privateKey = process.env.OPERATOR_WALLET_PRIVATEKEY;
const walletAddr = process.env.OPERATOR_WALLET_ADDRESS;

const routes = express.Router();
routes.post("/withdraw", async (req, res) => {
  const { sender, receiver, amount, timestamp, type, chainId } = req.body;

  try {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`${INFURA_ENDPOINTS[chainId]}`)
    );
    console.log("web3");
    const contractAddress = CONTRACT_ADDRESS[chainId];
    // Convert the private key into a signer
    const contract = new web3.eth.Contract(contractABI, contractAddress, {
      from: walletAddr,
    });

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
    let fee = await contract.methods.computeFee(sender, value).call();
    console.log(hashValue, fee);
    let rVal = BigInt(value) - fee;
    if (type === "ETH") {
      console.log("eth", rVal);
      transaction = contract.methods.mix(hashValue, checksummReceiver, rVal);
    } else {
      console.log("erc20", rVal);
      transaction = contract.methods.mixERC20(
        hashValue,
        checksummReceiver,
        rVal
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
    await web3.eth.sendSignedTransaction(tx.rawTransaction);
  } catch (err) {
    console.log("Error", err);
    return res.json({ success: false });
  }
  return res.json({ success: true });
});
module.exports = routes;
