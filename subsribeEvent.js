const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const util = require('ethereumjs-util')

// connect infura for kovan
//const web3 = new Web3('wss://kovan.infura.io/ws/v3/ddb78b6b5d824f9aacd209b3daf67253')
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

const sleep = (waitTimeMs) => new Promise(resolve => setTimeout(resolve, waitTimeMs))

async function subscribeEvent() {
    console.log('OK')

    const contract = new web3.eth.Contract(abi, contractAddress)

    // https://web3js.readthedocs.io/en/v1.7.1/web3-eth-subscribe.html?highlight=subscribe#id11
    contract.events.VoteReceived()
    .on('data', async (event) => {
        console.log(event)
    })
}

// https://web3js.readthedocs.io/en/v1.7.1/web3-eth-contract.html?highlight=getpastevent#getpastevents
// More useful than subscribeEvent on Production
async function getPastEvents() {
    const contract = new web3.eth.Contract(abi, contractAddress)
    const events_1 = await contract.getPastEvents('VoteReceived', {fromBlock: 30567648, toBlock: 30580000})
	const events_2 = await contract.getPastEvents('VoteReceived', {fromBlock: 30580000, toBlock: 30585000})
    console.log(events_2)
}

async function main() {
   await getPastEvents()

   await sleep(10000000)
}

(async () => {
    await main()
})()