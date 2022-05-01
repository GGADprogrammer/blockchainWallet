import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import SimplePaymentChannelContract from "./contracts/SimplePaymentChannel.json";
// page information
let Channel = {
    address1: '',
    address2: '',
    balance1: '',
    balance2: '',
}


export default function LocalWallet(props) {
    const [checked, setChecked] = useState(false);
    const [balance, setBalance] = useState(-1);
    const [amount, setAmount] = useState(0);
    const buttonTransferClicked = () => {
        setChecked(!checked);
    };
    function getBalance(){
        if (props.usrAddress[0] == Channel.address1){
            return Channel.balance1;
        }
        else{
            return Channel.balance2;
        }
    }
    function setListeners(){
        console.log('triggered')
        props.socket.on('balance_changed', data=>{
        // get the balance by data.balanceParty1 and data.balanceParty2
        // update Channel
        console.log(data)
        Channel.address1 = data.addressParty1
        Channel.address2 = data.addressParty2
        Channel.balance1 = data.balanceParty1
        Channel.balance2 = data.balanceParty2
        setBalance(getBalance())
        })
    }
    React.useEffect(() => {
        let data = {
            contractAddress: props.channelAddr,
        }
        if(props.socket!=null && props.channelAddr!=null && balance == -1){//&& (balance == '-1') 
                props.socket.emit('GetBalance',data)
                props.socket.on('balanced_get', data=>{
                    console.log(data)
                    Channel.address1 = data.addressParty1
                    Channel.address2 = data.addressParty2
                    Channel.balance1 = data.balanceParty1
                    Channel.balance2 = data.balanceParty2
                    setBalance(getBalance())
                })
        }
        setListeners()
        },[])
    
    async function transfer(){
        if (parseInt(amount) > parseInt(getBalance())) return ('You can not transfer more than your current balance');
        const hash = generateHash1(Channel.balance1,Channel.balance2,amount);
        const signedMessage = await signMessage(hash);
        let data = {
            contractAddress:props.channelAddr,
            sender:props.usrAddress[0],
            signedMessage: signedMessage,
            amount: amount
        }
        props.socket.emit('signed-message',data)
    }
    // function generateHash(balance1, balance2, amount) {
    //     const ethereumjs = require('ethereumjs-abi')
    //     //ethereumjs.soliditySHA3
    //     // const hash = '0x' + props.web3.utils.sha3(
    //     //     ['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
    //     //     [String(balance1), String(balance2), String(amount)]
    //     // ).toString('hex')
    
    //     // return hash

    //     return '0x76'
    // }
    function generateHash1(balance1, balance2, amount) {
        // const hash = '0x' + ethereumjs.soliditySHA3(
        //     ['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        //     [String(balance1), String(balance2), String(amount)]
        // ).toString('hex')
        const hash = props.web3.utils.soliditySha3(
            {type: 'uint256', value: String(balance1)},
            {t:'uint256',v: String(balance2)},
            {t:'uint256',v: String(amount)}); 
        return hash
    }
    
    function generateHash2(balance1, balance2) {
        // const hash = '0x' + ethereumjs.soliditySHA3(
        //     ['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
        //     [String(balance1), String(balance2), String(amount)]
        // ).toString('hex')
        const hash = props.web3.utils.soliditySha3(
            {type: 'uint256', value: String(balance1)},
            {t:'uint256',v: String(balance2)}); 
        return hash
    }
    async function endChannel(){
        const hash = generateHash2(Channel.balance1,Channel.balance2);
        const signedMessage = await signMessage(hash);
        const instance = new props.web3.eth.Contract(
            SimplePaymentChannelContract.abi,
            props.channelAddr
        );
        const response = await instance.methods
        .closeChannel(Channel.balance1,Channel.balance2, signedMessage, props.usrAddress[0])
        .send({from: props.usrAddress[0]})
        console.log(response)
        //{
        //     gas: 7e6
        // }, (err, result) => {
        //     console.log(err, result)
        // })
        // judge whether the reponse is valid
        let data = {
            contractAddress: props.channelAddr,
            balance1:Channel.balance1,
            balance2:Channel.balance2
        }
        props.socket.emit('close channel',data)
    }
    function signMessage(hash) {
        return new Promise((resolve, reject) => {//personalprops.web3.eth.defaultAccount
            props.web3.eth.sign(hash, props.usrAddress[0], (err, result) => {
                if(err) return reject(err)
                resolve(result)
            })
        })
    }
    return (
        <div style={{display:'flex',alignItems:'center'}}>
            {/* <p>TEST current address:{props.addr}</p> */}

            <Container style={{ }}>
                <Row>
                    <Col><h1 style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}> Group: {props.name} </h1></Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}><hr
                    style={{
                        color: 'black',
                        backgroundColor: 'black',
                        height: 5,
                        width: '50%'
                    }}
                /></Row>
                <Row><h4 style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>Balance:  {JSON.stringify(balance)} ETH</h4></Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}><Button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '300px',
                    marginBottom: '25px'
                }}
                    variant="outline-danger"
                    onClick={endChannel}
                >Settle Up and Close Channel</Button>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '500px',
                        marginBottom:'25px'
                    }}
                        variant={checked ? "success" : "outline-success"}
                        onClick={buttonTransferClicked}
                    >{checked ? "How much do you want to transfer?" : "Transfer"}</Button>
                </Row>
                {checked === true ? (
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    <InputGroup className="mb-3" style={{width:'525px'}}>
                    <FormControl
                        placeholder="Transfer amount"
                        aria-label="Transfer amount"
                        aria-describedby="basic-addon2"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={transfer}>
                        Confirm
                    </Button>
                </InputGroup></Row>):(<></>)
                }
            </Container>
        </div>
    );
}











// socket.on('finish-2-messages', message => {
//         let contract = web3.eth.contract(abi).at(game.contractAddress)

//         contract.closeChannel(message.signedMessage1, message.callPlayer1, message.betPlayer1, message.balancePlayer1, message.nonce1, message.sequence, message.addressPlayer1, {
//             gas: 7e6
//         }, (err, result) => {
//             console.log(err, result)

//             contract.closeChannel(message.signedMessage2, message.callPlayer2, message.betPlayer2, message.balancePlayer2, message.nonce2, message.sequence, message.addressPlayer2, {
//                 gas: 7e6
//             }, (err, result) => {
//                 console.log(err, result)
//             })
//         })
//     })