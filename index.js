const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const util = require('ethereumjs-util')

// connect infura for kovan
const web3 = new Web3('https://kovan.infura.io/v3/ddb78b6b5d824f9aacd209b3daf67253')

const abi = [
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "candidateNames",
				"type": "string[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "voteForCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "VoteReceived",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "candidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidateList",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "totalVotesFor",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const contractAddress = '0x869827073917f936b803FFcF2274244A184c6B7A'

async function transferETH(account, toAddress, amount) {
    const txCount = await web3.eth.getTransactionCount(account.address)
    let rawTx = {
        from: account.address,
        to: toAddress,
        nonce: util.bufferToHex(txCount), // sequence number of user
        gasPrice: util.bufferToHex(40 * 10 ** 9),
        gasLimit: util.bufferToHex(21000),
        value: util.bufferToHex(parseInt(amount)),
        data: '0x' // no data
    }
    console.log('rawTx', rawTx)

    // { option }
    let tx = new Tx(rawTx, { chain: 'kovan' })
    // from buffer value to string hex
    console.log('tx', tx.serialize().toString('hex'))

    // sign transaction
    // from string hex to Buffer value
    tx.sign(new Buffer.from(account.privateKey, 'hex'))
    // tx has v, r, s when signed
    console.log('tx.v', tx.v)
    console.log('tx.r', tx.r)
    console.log('tx.s', tx.s)

    // ready to broadcast
    //* Can be published to network
    let serializedTx = tx.serialize()
    console.log('serializedTx', serializedTx.toString('hex'))

    //* Broadcast transaction with infura
    //! We can also publish signed transaction hash (serialzedTx) to other nodes
    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    console.log('result', result)
//    .on('receipt', console.log)
}

async function readCandidateCount() {
    const contract = new web3.eth.Contract(abi, contractAddress)
    const candidateCount = await contract.methods.candidateCount().call()
    return candidateCount
}

async function voteCandidate(account, name) {
    const contract = new web3.eth.Contract(abi, contractAddress)

    const txCount = await web3.eth.getTransactionCount(account.address)
    let rawTx = {
        from: account.address,
        to: contractAddress, // call contract address
        nonce: util.bufferToHex(txCount), // sequence number of user
        gasPrice: util.bufferToHex(6 * 10 ** 9),
        gasLimit: util.bufferToHex(65000),
        value: '0x0', // no value
        data: contract.methods.voteForCandidate(name).encodeABI() // convert transaction to dataform
    }
    console.log('rawTx', rawTx)

    // { option }
    let tx = new Tx(rawTx, { chain: 'kovan' })
    // from buffer value to string hex
    console.log('tx', tx.serialize().toString('hex'))

    // sign transaction
    // from string hex to Buffer value
    tx.sign(new Buffer.from(account.privateKey, 'hex'))
    // tx has v, r, s when signed
    console.log('tx.v', tx.v)
    console.log('tx.r', tx.r)
    console.log('tx.s', tx.s)

    // ready to broadcast
    //* Can be published to network
    let serializedTx = tx.serialize()
    console.log('serializedTx', serializedTx.toString('hex'))

    //* Broadcast transaction with infura
    //! We can also publish signed transaction hash (serialzedTx) to other nodes
    const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    console.log('result', result)
}

async function createAccount() {
    return web3.eth.accounts.create()
}

async function loadAccount() {
    return { 
        address: '0xC2c36441E7809f4D8058612c6fb09feFCe8a1bdd',
        //privateKey: '0x52ccdef77d40d10152a17b66d717f2bc87c9e7ac2af69f5f2ee1b1056f866ac7'
        // remove 0x
        privateKey: '52ccdef77d40d10152a17b66d717f2bc87c9e7ac2af69f5f2ee1b1056f866ac7'
    }
}

async function main() {
    // Load account
    const account = await loadAccount()
    console.log('account', account)

    // Get balance
    const balance = await web3.eth.getBalance(account.address)
    const balanceInETH = await web3.utils.fromWei(balance, 'ether')
    console.log('balance', balanceInETH)

    // Get block number
    const currentBlockNumber = await web3.eth.getBlockNumber()
    console.log('currentBlockNumber', currentBlockNumber)

    // Transfer ether to other account
    // await transferETH(account, '0xEeB46C02306577A3890c204Fc64D43b6cd353C1c', web3.utils.toWei('0.0005', 'ether'))

    // read candidate count
    const candidateCount = await readCandidateCount()
    console.log('candidateCount', candidateCount)

    await voteCandidate(account, 'Cat')
}

(async () => {
    await main()
})()