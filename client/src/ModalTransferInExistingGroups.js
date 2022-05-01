import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup"
import LocalWallet from "./LocalWallet";
function createData(groupAddress, nickname) {
    return {
        groupAddress,
        nickname
    };
}
//const rows = [
//     createData( 
//         "0x86",
//         "elephant"
//     ),
//     createData(
//         "0x87",
//         "horse"
//     ),
//     createData(
//         "0x88",
//         "duck"
//     )
// ];
// 

export default function ModalTransferInExistingGroups(props) {
    const [haveChosenGroup, setHaveChosenGroup] = useState(false);
    const [groupAddr, setGroupAddr] = useState("");
    const [groupName, setGroupName] = useState("");
    const [rows,setRows] =useState([]);
    //const [balances,setBalances] =useState(null);
    React.useEffect(() => {
        if(props.groups!=null){
            const tmp=[]
            props.groups.map((group) => (
                tmp.push(createData(group.channel,group.nickname))
            ))
            setRows(tmp);
            console.log(props.groups)
            console.log(rows)
        }
        },[props.groups])
    // async function getData() {
    //     console.log(props.usrAddress)
    //     console.log(props.contract)
    //     //await props.contract.methods.set(props.usrAddress,"86").send();
    //     //const response = await props.contract.methods.get(props.usrAddress).call();
    //     //setData(response);
    //     //console.log(response)
    // }
    // React.useEffect(() => {
    //     getData();
    // }, []);
    // React.useEffect(async () => {
    //     if(props.contract!=null&&data==null){
    //     console.log(props.usrAddress)
    //     console.log(props.contract)
    //     // await props.contract.methods.set(props.usrAddress,).send();
    //     // const response = await props.contract.methods.get(props.usrAddress).call();
    //     await props.contract.methods.set(props.web3.utils.toBN('123'),props.web3.utils.toBN('123')).send({from: props.usrAddress[0]});
    //     const response = await props.contract.methods.get(props.web3.utils.toBN('123')).call();
    //     setData(response);
    //     console.log(response)
    //     }
    //      })//,[props.contract]
    function ButtonRow(props) {
        const { row } = props;
        return (
            <ListGroup.Item style={{ width: '100%' }} action onClick={function (event) {
                setGroupAddr(row.groupAddress);
                setHaveChosenGroup(true);
                setGroupName(row.nickname)
            }
            }
                variant="info">
                {row.nickname}
            </ListGroup.Item>
        );
    }
    return (
        <Modal
            className="modals"
            show={props.show}
            fullscreen={true}
            onHide={props.buttonClicked}
        >
            <Modal.Header closeButton>
                <Modal.Title>Transfer in Existing Groups</Modal.Title>
            </Modal.Header>
            {props.groups===null?(<p>loading...</p>):(<Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {haveChosenGroup === false ? (
                    <>
                        <ListGroup defaultActiveKey="#link1" style={{ width: '100%' }}>
                            {rows.map((row) => (
                                <ButtonRow key={row.groupAddress} row={row} />
                            ))}
                        </ListGroup>
                    </>
                ) : (
                    <LocalWallet 
                        channelAddr={groupAddr} 
                        name={groupName} 
                        usrAddress={props.usrAddress}
                        web3={props.web3}
                        socket={props.socket}
                    />
                )}
            </Modal.Body>)}
            {/* <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {haveChosenGroup === false ? (
                    <>
                        <ListGroup defaultActiveKey="#link1" style={{ width: '100%' }}>
                            {rows.map((row) => (
                                <ButtonRow key={row.groupAddress} row={row} />
                            ))}
                        </ListGroup>
                    </>
                ) : (
                    <LocalWallet addr={groupAddr} name={groupName} />
                )}
            </Modal.Body> */}
            <Modal.Footer>
                <Button variant="secondary" onClick={props.buttonClicked}>
                    Close
                </Button>
                {/* {haveChosenGroup === false ? (
                    <Button variant="success" onClick={buttonConfirmClicked}>
                        Join
                    </Button>
                ) : (
                    <></>
                )} */}
            </Modal.Footer>
        </Modal>
    );
}
