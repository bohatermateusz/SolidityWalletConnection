// script.js

// Select DOM elements
const enableMetaMaskButton = document.querySelector('.enableMetamask');
const statusText = document.querySelector('.statusText');
const listenToEventsButton = document.querySelector('.startStopEventListener');
const contractAddr = document.querySelector('#address');
const eventResult = document.querySelector('.eventResult');

// Add event listeners
enableMetaMaskButton.addEventListener('click', () => {
    enableDapp();
});
listenToEventsButton.addEventListener('click', () => {
    listenToEvents();
});

// Declare variables
let accounts;
let web3;

// Function to enable the DApp
async function enableDapp() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });
            web3 = new Web3(window.ethereum);
            statusText.innerHTML = "Connected account: " + accounts[0];

            listenToEventsButton.removeAttribute("disabled");
            contractAddr.removeAttribute("disabled");
        } catch (error) {
            if (error.code === 4001) {
                statusText.innerHTML = "Error: Permission denied for MetaMask";
                console.log('User rejected the request.');
            } else {
                console.error("Error connecting to MetaMask: ", error);
            }
        }
    } else {
        statusText.innerHTML = "Error: MetaMask is not installed.";
    }
}

// ABI definition
let abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "TokensSent",
        "type": "event"
    }
];

// Function to listen to events
async function listenToEvents() {
    let contractInstance = new web3.eth.Contract(abi, contractAddr.value);
    contractInstance.events.TokensSent().on("data", (event) => {
        eventResult.innerHTML = JSON.stringify(event) + "<br />=====<br />" + eventResult.innerHTML;
    });
}
