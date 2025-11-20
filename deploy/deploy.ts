import type { HardhatRuntimeEnvironment } from "hardhat/types.js";

const func = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy EncryptedVotingSystem
  const deployedVotingSystem = await deploy("EncryptedVotingSystem", {
    from: deployer,
    log: true,
  });
};
func.id = "deploy_contracts"; // id required to prevent reexecution
func.tags = ["EncryptedVotingSystem"];

export default func;
