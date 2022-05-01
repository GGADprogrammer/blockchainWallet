import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import SimplePaymentChannel from "./contracts/SimplePaymentChannel.json";
//import io from 'socket.io-client';
export default function ModalCreateGroup(props) {
  const [show, setShow] = useState(props.show);
  const [resAddress, setResAddress] = useState(undefined);
  const [nickname, setNickname] = useState('');
  const [initial, setInitial] = useState('');
  //const socket = io(`http://${window.location.hostname}:8080`);//`http://${window.location.hostname}:8080`
  const buttonConfirmClicked = async () => {
    console.log(props.contract)
    //Contract object and account info
    let deploy_contract = new props.web3.eth.Contract(SimplePaymentChannel.abi);
    // Function Parameter
    let payload = {
      data: SimplePaymentChannel.bytecode,
      arguments: [props.contract._address,nickname]
    }
    let parameter = {
      from: props.usrAddress[0],
      value: props.web3.utils.toWei(initial,'ether'),
      nickname: nickname
    }
    // Function Call
    deploy_contract.deploy(payload)
    .send(parameter, (err, transactionHash) => {
        console.log('Transaction Hash :', transactionHash);
    }).on('confirmation', () => {}).then((newContractInstance) => {
        console.log('Deployed Contract Address : ', newContractInstance.options.address);
        setResAddress(newContractInstance.options.address);
        let data = {
          contractAddress: newContractInstance.options.address,
          balanceParty1:parseInt(initial),
          addressParty1:props.usrAddress[0],
          socketParty1:0
        }
        console.log(data)
        props.socket.emit('create channel',data)
    })
    
  };

  return (
    <Modal show={props.show} fullscreen={true} onHide={props.buttonClicked}>
      <Modal.Header closeButton>
        <Modal.Title>Create Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {resAddress === undefined ? (
          <>
            <Form.Label htmlFor="basic-url">
              Set Initial Value for this Group
            </Form.Label>
            <InputGroup>
              <FormControl
                aria-label="initvalue"
                aria-describedby="inputGroup-initval"
                placeholder="Initial Value"
                value={initial}
                onChange={e => setInitial(e.target.value)}
              />
            </InputGroup>
            <Form.Label htmlFor="basic-url" className="pt-5">
              Set Nickname for this Group
            </Form.Label>
            <InputGroup>
              <FormControl
                aria-label="nickname"
                aria-describedby="inputGroup-nickname"
                placeholder="Nickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </InputGroup>
          </>
        ) : (
          <>Your Address: {resAddress}</>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.buttonClicked}>
          Close
        </Button>
        {resAddress === undefined ? (
          <Button variant="success" onClick={buttonConfirmClicked} disabled={props.web3==null}>
            Confirm
          </Button>
        ) : (
          <></>
        )}
      </Modal.Footer>
    </Modal>
  );
}
