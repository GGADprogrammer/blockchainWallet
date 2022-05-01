import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import SimplePaymentChannelContract from "./contracts/SimplePaymentChannel.json";
export default function ModalJoinGroup(props) {
  const [confirmJoin, setConfirmJoin] = useState(false);
  const [resSuccess, setResSuccess] = useState(false);
  const [groupAddr, setGroupAddr] = useState("");
  const [joinETH, setJoinETH] = useState(0);
  const buttonJoinClicked = async () => {
    setConfirmJoin(true);
    const instance = new props.web3.eth.Contract(
      SimplePaymentChannelContract.abi,
      groupAddr
    );
    const response = await instance.methods.showdeposit().call();
    setJoinETH(props.web3.utils.fromWei(response,'ether'));
    console.log(response)
  };
  const buttonConfirmClicked = async () => {
    setResSuccess(true);
    const instance = new props.web3.eth.Contract(
      SimplePaymentChannelContract.abi,
      groupAddr
    );
    console.log('confirmJoin paras:'.concat(props.usrAddress[0]).concat('  ').concat(props.web3.utils.toWei(joinETH,'ether')))
    await instance.methods
    .setupmember2()
    .send({from: props.usrAddress[0],
    value: props.web3.utils.toWei(joinETH,'ether'),});
    let data = {
      contractAddress: groupAddr,
      balanceParty2:joinETH,
      addressParty2:props.usrAddress[0],
      socketParty2:0
    }
    console.log('join channel contractChannelAddress'.concat(groupAddr))
    props.socket.emit('join channel',data)
  };

  return (
    <Modal
      className="modals"
      show={props.show}
      fullscreen={true}
      onHide={props.buttonClicked}
    >
      <Modal.Header closeButton>
        <Modal.Title>Join Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {resSuccess === false && confirmJoin === false && (
          <>
            <Form.Label htmlFor="basic-url">
              Enter the group address you want to join
            </Form.Label>
            <InputGroup>
              <FormControl
                aria-label="initvalue"
                aria-describedby="inputGroup-initval"
                placeholder="Group Address"
                value={groupAddr}
                onChange={(e) => setGroupAddr(e.target.value)}
              />
              <Button variant="success" onClick={buttonJoinClicked}>
                Join
              </Button>
            </InputGroup>
          </>
        )}
        {resSuccess === false && confirmJoin === true && (
          <>
            <div className="d-flex justify-content-center align-items-center">
              Join Group({groupAddr}) needs {joinETH} ETH, confirm to proceed:{" "}
              <Button variant="outline-danger" onClick={buttonConfirmClicked}>
                Confirm
              </Button>
            </div>
          </>
        )}

        {resSuccess === true && confirmJoin === true && (
          <>You successfully join the group: {groupAddr}</>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.buttonClicked}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
