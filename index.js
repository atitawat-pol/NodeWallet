const Web3 = require('web3')

// connect infura for kovan
const web3 = new Web3('https://kovan.infura.io/v3/ddb78b6b5d824f9aacd209b3daf67253')

async function main() {
    const balance = await web3.eth.getBalance('0xEeB46C02306577A3890c204Fc64D43b6cd353C1c')
    console.log(balance)
}

(async () => {
    await main()
})()