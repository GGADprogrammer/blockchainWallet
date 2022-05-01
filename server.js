const express = require('express')
const app = express()
options={
    cors:true,
    origins:["http://127.0.0.1:3000"],
   }
const http = require('http').createServer(app)
const io = require('socket.io')(http, options)
const ethereumjs = require('ethereumjs-abi')
const ethereumjsUtil = require('ethereumjs-util')
const port = 8080//3000


//&& nodemon server.js
let channels = {}
let channel = {
    contractAddress: '',
    addressParty1: '',
    addressParty2: '',
    socketParty1: '',
    socketParty2: '',
    balanceParty1: '',
    balanceParty2: ''
}


async function start() {
    io.on('connection', socket => {
        console.log('User connected', socket.id)

        socket.on('GetBalance', data=>{
            res = {
                addressParty1:channels[data.contractAddress].addressParty1,
                addressParty2:channels[data.contractAddress].addressParty2,
                balanceParty1:channels[data.contractAddress].balanceParty1,
                balanceParty2:channels[data.contractAddress].balanceParty2,
            }
            io.emit('balanced_get',res)
        })

        socket.on('create channel', data => {
            console.log('1. Received party-1')
            channel.contractAddress = data.contractAddress
            channel.balanceParty1 = data.balanceParty1,
            channel.addressParty1 = data.addressParty1,
            channel.socketParty1 = data.socketParty1
            let channelCopy = Object.assign({},channel)
            channels[data.contractAddress] = channelCopy
            channel = {
                contractAddress: '',
                addressParty1: '',
                addressParty2: '',
                socketParty1: '',
                socketParty2: '',
                balanceParty1: '',
                balanceParty2: ''
            }
        })

        socket.on('join channel', data => {
            console.log('2. Received party-2')
            console.log(channels[data.contractAddress])
            channels[data.contractAddress].balanceParty2 = data.balanceParty2
            channels[data.contractAddress].addressParty2 = data.addressParty2
            channels[data.contractAddress].socketParty2 = data.socketParty2
        })

        socket.on('signed-message', message => {
            channel = channels[message.contractAddress]
            if(message.sender != channel.addressParty1 && message.sender != channel.addressParty2) {
                console.log('error here')
                return 'error' //io.to(channel.socketParty1).emit('error', 'The received address of the first Party is invalid')
            }

            const isValid = verifyMessage(message.signedMessage, channel.balanceParty1, channel.balanceParty2, message.amount, message.sender)
            if(!isValid){
                console.log('error here') 
                return 'error'
             } //io.to(message.sender).emit('error', 'The received message is not valid, generate a new one again')

            if (message.sender == channel.addressParty1){
                channel.balanceParty1 = channel.balanceParty1 - message.amount;
                channel.balanceParty2 = channel.balanceParty2 + message.amount;
            }
            else{
                channel.balanceParty1 = channel.balanceParty1 + message.amount;
                channel.balanceParty2 = channel.balanceParty2 - message.amount;
            }

            let channelCopy = Object.assign({}, channel)
            channels[channel.contractAddress]=channelCopy

            io.emit('balance_changed', channel)
            }
        )
        socket.on('close channel', message =>{
            channels[message.contractAddress].balanceParty1 = message.balance1
            channels[message.contractAddress].balanceParty2 = message.balance2
        })
    })
    http.listen(port, '0.0.0.0')
    console.log(`Listening on localhost:${port}`)
}


function verifyMessage(signedMessage, balance1, balance2, amount, PartyAddress) {
	const hash = generateHash(balance1,balance2,amount)
	const message = ethereumjs.soliditySHA3(
		['string', 'bytes32'],
		['\x19Ethereum Signed Message:\n32', hash]
	)
	const splitSignature = ethereumjsUtil.fromRpcSig(signedMessage)
	const publicKey = ethereumjsUtil.ecrecover(message, splitSignature.v, splitSignature.r, splitSignature.s)
	const signer = ethereumjsUtil.pubToAddress(publicKey).toString('hex')
	const isMessageValid = (signer.toLowerCase() == ethereumjsUtil.stripHexPrefix(PartyAddress).toLowerCase())
	return isMessageValid
}

function generateHash(balance1, balance2, amount) {
	const hash = '0x' + ethereumjs.soliditySHA3(
		['uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
		[String(balance1), String(balance2), String(amount)]
	).toString('hex')

	return hash
}

function signMessage(hash) {
	return new Promise((resolve, reject) => {
		web3.personal.sign(hash, web3.eth.defaultAccount, (err, result) => {
			if(err) return reject(err)
			resolve(result)
		})
	})
}

start()