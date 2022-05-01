This project use yarn (instead of npm) and truffle to build smart contract.
The command for build the initial project is `yarn truffle unbox react`

### Commands:

## First time

For the first time (or when missing packages), run `yarn` command under root folder

## Connect Ganache and Metamsk:

After I tested, install ganache software may be a better choice...
Set up a ganache project, link truffle-config.json and use the keyword from metamask.
To get your keywords, open Metamask plugin -> click the image on the right top -> settings -> security & privacy -> reveal phrase
Also for network setting you have to toggle show test networks by clicking chossing network dropdown.
Finally, Import Account with private key from ganache. You'll see the value sync with ganache.

## Build the smart contract

run `yarn truffle migrate`, you'll see ganache's status of contract changes.

## Start webserver

cd to client and run `yarn start`, you'll see metamask window and tell's you to do a transaction. After the transaction is done, you'll see storage changes.

## Test

run `yarn truffle test`
