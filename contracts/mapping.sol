pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Mapping {
    struct data {
      address channel;
      string nickname;
  }
  mapping(address => data[]) private user_channel;

  function set(address user_addr, address channel_addr, string memory nickname) public{
    data memory element;
    element.channel = channel_addr;
    element.nickname = nickname;
    user_channel[user_addr].push(element);
  }

  function get(address user_addr) public view returns (data[] memory) {
    return user_channel[user_addr];
  }

  function del(address party, address channel) public{
    for(uint i = 0; i < user_channel[party].length; i++){
      if (user_channel[party][i].channel == channel){
        user_channel[party][i] = user_channel[party][user_channel[party].length-1];
        delete user_channel[party][user_channel[party].length-1];
        user_channel[party].length--;
        break;
      }
    }
  }

}
