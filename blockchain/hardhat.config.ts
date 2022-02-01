import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.7", settings: {} }],
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
  }
};
export default config;