const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const util = require('ethereumjs-util')

// connect infura for kovan
const web3 = new Web3('https://kovan.infura.io/v3/ddb78b6b5d824f9aacd209b3daf67253')

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
    // const result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    // console.log('result', result)
//    .on('receipt', console.log)
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
    await transferETH(account, '0xEeB46C02306577A3890c204Fc64D43b6cd353C1c', web3.utils.toWei('0.0005', 'ether'))
}

(async () => {
    await main()
})()