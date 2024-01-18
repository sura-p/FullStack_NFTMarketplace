require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
//console.log(process.env);
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  
  solidity: "0.8.10",
  paths: {
    artifacts: './src/components/templates/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
// React_App_ prefix should be mendatory for privatekey in react(.env file) like React_App_privatekey
    sepolia: {
     
      url: "https://eth-sepolia.g.alchemy.com/v2/Zg0fGGNnFHhAll9YiaK2vz6YkhdeFNqB",
      accounts: ["482984883dbdec2abae410eb621cd7ef752661134bc3befdb413ccdefb2e104b"],
      gasPrice: 20000000000,
      gas: 6000000,
  },
     localhost: {
      host: "HTTP://127.0.0.1",
      port: 7545,
      network_id: 5777,
      gasPrice: 20000000000,
      gas: 6000000,
  }
  }
}























// require("dotenv").config();

// require("@nomiclabs/hardhat-etherscan");
// require("@nomiclabs/hardhat-waffle");
// require("hardhat-gas-reporter");
// require("solidity-coverage");

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// // You need to export an object to set up your config
// // Go to https://hardhat.org/config/ to learn more

// /**
//  * @type import('hardhat/config').HardhatUserConfig
//  */
// module.exports = {
//   solidity: "0.8.10",
//   networks: {
//     ropsten: {
//       url: process.env.ROPSTEN_URL || "",
//       accounts:
//         process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
//   gasReporter: {
//     enabled: process.env.REPORT_GAS !== undefined,
//     currency: "USD",
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY,
//   },
// };
