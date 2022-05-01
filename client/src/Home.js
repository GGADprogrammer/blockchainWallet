import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ModalCreateGroup from "./ModalCreateGroup";
import ModalJoinGroup from "./ModalJoinGroup";
import ModalTransferInExistingGroups from "./ModalTransferInExistingGroups";
import io from 'socket.io-client';
export default function Home(props) {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const socket = io(`http://${window.location.hostname}:8080`);
  const createGroupButtonClickedHandler = () => {
    setShowCreateGroup(
      (showCreateGroup) => (showCreateGroup = !showCreateGroup)
    );
  };
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const joinGroupButtonClickedHandler = () => {
    setShowJoinGroup((showJoinGroup) => (showJoinGroup = !showJoinGroup));
  };
  const [showTransfer, setShowTransfer] = useState(false);
  const [data, setData] = useState(null);
  const transferInExistingGroupsButtonClickedHandler = async () => {
      if(props.contract!=null){//&&data==null每次进都应该重新拿
      console.log(props.usrAddress)
      console.log(props.contract)
      // await props.contract.methods.set(props.usrAddress,).send();
      // const response = await props.contract.methods.get(props.usrAddress).call();
      // await props.contract.methods.set(props.web3.utils.toBN('123'),props.web3.utils.toBN('123')).send({from: props.usrAddress[0]});
      const response = await props.contract.methods.get(props.usrAddress[0]).call();
      setData(response);
      // console.log(response[0].channel)
      // console.log(response[0].nickname)
      // console.log(response[1])
      }
      setShowTransfer((showTransfer) => (showTransfer = !showTransfer));
  };
  return (
    <Container>
      <Row className="m-5">
        <Button variant="outline-success"
          size="lg"
          onClick={transferInExistingGroupsButtonClickedHandler}
        >
          Transfer in existing groups
        </Button>
      </Row>
      <Row className="m-5">
        <Button
          variant="outline-success"
          size="lg"
          onClick={createGroupButtonClickedHandler}
        >
          Create group
        </Button>
      </Row>
      <Row className="m-5">
        <Button
          variant="outline-success"
          size="lg"
          onClick={joinGroupButtonClickedHandler}
        >
          Join group
        </Button>
      </Row>
      <div className="modals">
        <ModalTransferInExistingGroups
          key={Math.random()}
          show={showTransfer}
          buttonClicked={transferInExistingGroupsButtonClickedHandler}
          contract={props.contract} 
          usrAddress={props.usrAddress}
          web3={props.web3}
          groups={data}
          socket={socket}
        />
        <ModalCreateGroup
          key={Math.random()}
          show={showCreateGroup}
          buttonClicked={createGroupButtonClickedHandler}
          contract={props.contract}
          usrAddress={props.usrAddress}
          web3={props.web3}
          socket={socket}
        />
        <ModalJoinGroup
          key={Math.random()}
          show={showJoinGroup}
          buttonClicked={joinGroupButtonClickedHandler}
          usrAddress={props.usrAddress}
          web3={props.web3}
          socket={socket}
        />
      </div>
    </Container>
  );
}
