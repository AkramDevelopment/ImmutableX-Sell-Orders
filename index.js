const providers = require("@ethersproject/providers");
const wallet = require("@ethersproject/wallet");
const {
  ImmutableXClient,
  ERC721TokenType,
  ETHTokenType,
} = require("@imtbl/imx-sdk");
require("dotenv").config();

const provider = new providers.AlchemyProvider(
  process.env.NETWORK,
  process.env.API_KEY
);
const signer = new wallet.Wallet(process.env.WALLET_KEY).connect(provider);

let IMXURL;
let STARK;
let REGISTRATION;

if (process.env.NETWORK == "mainnet") {
  IMXURL = "https://api.x.immutable.com/v1";
  STARK = "0x5FDCCA53617f4d2b9134B29090C87D01058e27e9";
  REGISTRATION = "0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c";
} else {
  STARK = "0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef";
  IMXURL = "https://api.ropsten.x.immutable.com/v1";
  REGISTRATION = "0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864";
}

const intiateSale = async (price, contractAddress, tokenID) => {
  const client = await ImmutableXClient.build({
    publicApiUrl: IMXURL,
    signer: signer,
    starkContractAddress: STARK,
    registrationContractAddress: REGISTRATION,
  });

  try {
    await client.createOrder({
      amountSell: "1",
      amountBuy: price, //2 ETH price
      user: process.env.ADDRESS.toLowerCase(), //Address of the wallet you are using
      include_fees: true, //Includes fees in price (true/false)
      tokenSell: {
        type: ERC721TokenType.ERC721,
        data: {
          tokenAddress: contractAddress.toLowerCase(),
          tokenId: tokenID.toLowerCase(),
        },
      },
      tokenBuy: {
        type: ETHTokenType.ETH,
        data: {
          decimals: 18,
        },
      },
    });

    console.log("Token", tokenID, "has been listed for sale!");
  } catch (err) {
    console.error("There was an issue creating sale for NFT token ID", tokenID);
  }
};

//Make sure everything is in string form!

/*/
Example usage of the function: 
intiateSale(
  "2000000000000000000", <---- Price in ETH
  "0xaa84c36e454e632c6880d2563986be75718fbc6f", <---- Contract Address 
  "100" <---- tokenID
);

/*/
