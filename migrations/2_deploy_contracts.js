//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Mapping = artifacts.require("./Mapping.sol");
//var SimplePaymentChannel = artifacts.require("./SimplePaymentChannel.sol");
module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
  //deployer.deploy(SimplePaymentChannel);
  deployer.deploy(Mapping);
};
