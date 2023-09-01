require("dotenv").config();

module.exports = {
  INFURA_ENDPOINTS: {
    1: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    5: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    56: "https://bsc-dataseed.binance.org/",
    97: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
  },
  CONTRACT_ADDRESS: {
    1: "0x9602F7e63BD5f84B4593D65Bb9DFf0cC4A5f2336",
    5: "0x9602F7e63BD5f84B4593D65Bb9DFf0cC4A5f2336",
    56: "0x177CBA12dc0A4dEc8b447d271d18F331eA1eaA4f",
    97: "0x177CBA12dc0A4dEc8b447d271d18F331eA1eaA4f",
  },
};
