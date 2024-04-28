const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

async function updateContractAddress() {
    const raffle = await ethers.getContract("Raffle")
    const contractAddress = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId.toString() in contractAddress) {
        if (!contractAddress[network.config.chainId.toString()].includes(raffle.address)) {
            contractAddress[network.config.chainId.toString()] = raffle.address
        }
    } else {
        contractAddress[network.config.toString()] = [raffle.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddress))
}

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end....")
        await updateContractAddress()
        await updateAbi()
        console.log("Front end written!")
    }
}

module.exports.tags = ["all", "frontend"]
