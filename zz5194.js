const ethers = require('ethers');
const fs = require('fs');

// 读取接收地址文件
const data = fs.readFileSync('recipients.txt', 'utf-8');

// 按行分割地址并去除每行的空白字符
const addresses = data.split('\n').map(address => address.trim());

const privateKey = '0x'; // 实际私钥
const provider = new ethers.providers.JsonRpcProvider('https://opbnb-mainnet-rpc.bnbchain.org'); // BSC RPC
const wallet = new ethers.Wallet(privateKey, provider);

async function main() {
    for (let i = 0; i < addresses.length; i++) {
        try {
            // 获取当前链上的gas价格
            let currentGasPrice = await provider.getGasPrice();

            // 根据你的需求调整gas价格
            let adjustedGasPrice = currentGasPrice.mul(300).div(100); // 增加100%

            let amount = ethers.utils.parseUnits("0.001", 18); // 转账数量，根据你的代币小数位调整

            // 创建一个事务
            let tx = await wallet.sendTransaction({
                to: addresses[i],
                value: amount,
                gasPrice: adjustedGasPrice
            });

            console.log(`Transaction hash: ${tx.hash}`);

            // 等待事务被挖矿
            let receipt = await tx.wait();

            console.log(`Transaction ${receipt.transactionHash} confirmed in block ${receipt.blockNumber}`);
        } catch (error) {
            console.error(`Failed to send to ${addresses[i]}: ${error.message}`);
        }
    }
}

main().catch(console.error);