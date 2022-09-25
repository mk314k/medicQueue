const Blockchain = artifacts.require("./Blockchain.sol");

module.exports = function(deployer) {
  deployer.deploy(Blockchain);
};
