pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract Mapping {
  struct data {
      address channel;
      string nickname;
  }
  function set(address user_addr, address channel_addr, string memory nickname) public{}
  function del(address party, address channel) public{}
  function get(address user_addr) public view returns (data[] memory){}
}

/**
 *
 * @dev Ethereum payment channels allow for off-chain transactions with an on-chain
 * settlement. In this implementation, a party (member1) can open a channel with a 
 * deposit, expiration, and member2. The member1 can then sign transactions off-chain
 * and send them to the member2, who can submit one of these signed transactions to 
 * chain to close and settle the channel.
 */
contract SimplePaymentChannel {
    //using SafeMath for uint256;
    //using ECRecovery for bytes32;

    Mapping pairs;
    address Mapping_addr;
    
    mapping (address => uint) public balances;
    string nickname;

    //============================================================================
    // EVENTS
    //============================================================================

    event ChannelOpened_1(address user, uint256 deposit);
    event ChannelOpened_2(address user, uint256 deposit);
    event ChannelClosed(uint256 member1Balance, uint256 member2Balance);
    event Checkpassed(bytes32 message, address recover, address shouldbe);
    event coinsent(address sender, address receiver, uint256 amount);

    // Creator of channel
    address payable public member1;
    // member2 of channel
    address payable public member2;
    // deposit amount
    uint256 public deposit;
    
    uint256 public member1Balance;
    uint256 public member2Balance;
    bool public isMember1BalanceSetUp;
    bool public isMember2BalanceSetUp;

    //============================================================================
    // PUBLIC FUNCTIONS
    //============================================================================

    /**
    * @dev Constructor
    */
    constructor(address _t, string memory groupname) public payable {
        pairs = Mapping(_t);
        Mapping_addr = _t;

        member1 = msg.sender;
        deposit = msg.value;
        balances[msg.sender] = deposit;
        nickname = groupname;

        pairs.set(msg.sender,address(this),groupname);
        emit ChannelOpened_1(member1, msg.value);
    }

    function showdeposit() public view returns(uint256){
        return deposit;
    }
    /**
    * @dev member2 set up
    */    
    // function setupmember2(bytes memory _signedMessage) public payable {
    //     member2 = msg.sender;
    //     require(member1 != member2);  
    //     require(msg.value == deposit);
    //     bytes32 message = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(member1, deposit))));
    //     bytes32 r;
    //     bytes32 s;
    //     uint8 v;
    //     assembly {
    //         r := mload(add(_signedMessage, 32))
    //         s := mload(add(_signedMessage, 64))
    //         v := byte(0, mload(add(_signedMessage, 96)))
    //     }

    //     address originalSigner = ecrecover(message, v, r, s);
    //     //uncommemt when we have the signed message
    //     //require(originalSigner == member1);
    //     balances[msg.sender] = deposit;
    //     emit ChannelOpened_2(member2, msg.value);
    // }
    
    function setupmember2() public payable {
        member2 = msg.sender;
        require(member1 != member2);  
        require(msg.value == deposit);
        balances[msg.sender] = deposit;
        pairs.set(msg.sender,address(this),nickname);
        emit ChannelOpened_2(member2, msg.value);
    }


    /**
    * @dev Close a channel with a signed message 
    * @param _balance1 uint256 The balance agreed to by the member1 in their signed message
    * @param _balance2 uint256 The balance agreed to by the member2 in their signed message
    * @param _signedMessage bytes The signed hash of the balance
    */
    function closeChannel(uint256 _balance1, uint256 _balance2, bytes memory _signedMessage, address addressOfMessage) public {
        require(member2 != address(0), 'The address of the player is invalid');
        require(_signedMessage.length == 65, 'The length of the message is invalid');
        require(addressOfMessage == member1 || addressOfMessage == member2, 'You must use a valid address of one of the players');
        require(isValidSignature(_balance1, _balance2, _signedMessage, addressOfMessage));

        if(addressOfMessage == member1) {
            member1Balance = _balance1;
            isMember1BalanceSetUp = true;
        } else {
            member2Balance = _balance2;
            isMember2BalanceSetUp = true;
        }
        member1.transfer(2 ether);
        if(isMember1BalanceSetUp && isMember2BalanceSetUp) {
            member2.transfer(member2Balance);
            pairs.del(member1, address(this));
            pairs.del(member2, address(this));
        }
        // selfdestruct();
    }



    //============================================================================
    // INTERNAL FUNCTIONS
    //============================================================================

    /**
    * @dev Derive and verify member1 address from signed message and message hash
    * @param _balance1 uint256 The balance agreed to by the member1 in their signed message
    * @param _signedMessage bytes The signed hash of the balance by the member1
    */
    function isValidSignature (uint256 _balance1, uint256 _balance2, bytes memory _signedMessage, address addressOfMessage)
        public
        returns (bool)
    {
        bytes32 message = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(_balance1, _balance2, addressOfMessage))));
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signedMessage, 32))
            s := mload(add(_signedMessage, 64))
            v := byte(0, mload(add(_signedMessage, 96)))
        }

        address originalSigner = ecrecover(message, v, r, s);
        emit Checkpassed(message, originalSigner, address(this));
        //uncommemt when we have the signed message
        //require(originalSigner == addressOfMessage, 'The signer must be the original address');
        return true;
    }

    

    function sendCoin(address receiver, uint amount) public returns(bool sufficient) {

		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
        emit coinsent(msg.sender, receiver, amount);
		return true;
	}


	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}

//  0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// 0xaa26cd86f4b65b9ae75313f11efe27f6a9a402e80103ca347aee4c070144b7c7
