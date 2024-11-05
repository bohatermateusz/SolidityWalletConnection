// script.js

// Select DOM elements
const enableMetaMaskButton = document.querySelector('.enableMetamask');
const statusText = document.querySelector('.statusText');
const listenToEventsButton = document.querySelector('.startStopEventListener');
const contractAddr = document.querySelector('#address');
const eventResult = document.querySelector('.eventResult');
const deployContractButton = document.querySelector('.deployContract');

// Buy Tokens Elements
const buyTokensButton = document.querySelector('.buyTokensButton');
const buyAmountInput = document.querySelector('#buyAmount');

// Get Current Price Elements
const getCurrentPriceButton = document.querySelector('.getCurrentPriceButton');
const currentPriceDisplay = document.querySelector('#currentPrice');

// Get Market Cap Elements
const getMarketCapButton = document.querySelector('.getMarketCapButton');
const marketCapDisplay = document.querySelector('#marketCap');

// Get Token Details Elements
const getTokenDetailsButton = document.querySelector('.getTokenDetailsButton');
const tokenDetailsDisplay = document.querySelector('#tokenDetails');

// Transfer Tokens Elements
const transferButton = document.querySelector('.transferButton');
const transferToInput = document.querySelector('#transferTo');
const transferAmountInput = document.querySelector('#transferAmount');

// Approve Tokens Elements
const approveButton = document.querySelector('.approveButton');
const approveSpenderInput = document.querySelector('#approveSpender');
const approveAmountInput = document.querySelector('#approveAmount');

// Transfer From Elements
const transferFromButton = document.querySelector('.transferFromButton');
const transferFromAddressInput = document.querySelector('#transferFromAddress');
const transferToAddressInput = document.querySelector('#transferToAddress');
const transferFromAmountInput = document.querySelector('#transferFromAmount');

// Add event listeners
enableMetaMaskButton.addEventListener('click', () => {
    enableDapp();
});
listenToEventsButton.addEventListener('click', () => {
    listenToEvents();
});
deployContractButton.addEventListener('click', () => {
    deployNewCoin();
});

// Buy Tokens Event
buyTokensButton.addEventListener('click', () => {
    buyTokens();
});

// Get Current Price Event
getCurrentPriceButton.addEventListener('click', () => {
    getCurrentPrice();
});

// Get Market Cap Event
getMarketCapButton.addEventListener('click', () => {
    getMarketCap();
});

// Get Token Details Event
getTokenDetailsButton.addEventListener('click', () => {
    getTokenDetails();
});

// Transfer Tokens Event
transferButton.addEventListener('click', () => {
    transferTokens();
});

// Approve Tokens Event
approveButton.addEventListener('click', () => {
    approveTokens();
});

// Transfer From Event
transferFromButton.addEventListener('click', () => {
    transferFromTokens();
});

// Declare variables
let accounts;
let web3;
let contractInstance;

// ABI definition (replace with your actual ABI)
let abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "buyTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "positionManagerAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "wethAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentPrice",
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
		"inputs": [],
		"name": "marketCap",
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
		"inputs": [],
		"name": "MAX_SUPPLY",
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
		"inputs": [],
		"name": "MAX_TICK",
		"outputs": [
			{
				"internalType": "int24",
				"name": "",
				"type": "int24"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_TICK",
		"outputs": [
			{
				"internalType": "int24",
				"name": "",
				"type": "int24"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
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
		"inputs": [],
		"name": "nonfungiblePositionManager",
		"outputs": [
			{
				"internalType": "contract INonfungiblePositionManager",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
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
		"inputs": [],
		"name": "totalSupply",
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
		"inputs": [],
		"name": "weth9",
		"outputs": [
			{
				"internalType": "contract IWETH9",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Function to enable the DApp
async function enableDapp() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });
            web3 = new Web3(window.ethereum);
            statusText.innerHTML = "Connected account: " + accounts[0];

            // Enable buttons after connecting
            listenToEventsButton.removeAttribute("disabled");
            contractAddr.removeAttribute("disabled");
            deployContractButton.removeAttribute("disabled");
            buyTokensButton.removeAttribute("disabled");
            getCurrentPriceButton.removeAttribute("disabled");
            getMarketCapButton.removeAttribute("disabled");
            getTokenDetailsButton.removeAttribute("disabled");
            transferButton.removeAttribute("disabled");
            approveButton.removeAttribute("disabled");
            transferFromButton.removeAttribute("disabled");
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

// Function to deploy a new coin (Already provided earlier)
// Ensure you have the bytecode and correct constructor parameters

async function deployNewCoin() {
    // Generate random name and symbol
    const randomName = 'Coin' + Math.floor(Math.random() * 1000000);
    const randomSymbol = 'SYM' + Math.floor(Math.random() * 1000000);

    // Addresses required by the constructor
    const positionManagerAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'; // Uniswap V3 Position Manager on Polygon
    const wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'; // WETH on Polygon

    // Get the deployer account
    const deployer = accounts[0];

    // Contract bytecode (you need to provide this)
    const bytecode = '608060405234801561000f575f5ffd5b506040516125ef3803806125ef8339818101604052810190610031919061057d565b838381600390816100429190610829565b5080600490816100529190610829565b5050503360065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160085f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060075f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061012f30690472698b413b4320000061013860201b60201c565b505050506109dd565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036101a8575f6040517fec442f0500000000000000000000000000000000000000000000000000000000815260040161019f9190610907565b60405180910390fd5b6101b95f83836101bd60201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361020d578060025f828254610201919061094d565b925050819055506102db565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610296578381836040517fe450d38c00000000000000000000000000000000000000000000000000000000815260040161028d9392919061098f565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610322578060025f828254039250508190555061036c565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516103c991906109c4565b60405180910390a3505050565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b610435826103ef565b810181811067ffffffffffffffff82111715610454576104536103ff565b5b80604052505050565b5f6104666103d6565b9050610472828261042c565b919050565b5f67ffffffffffffffff821115610491576104906103ff565b5b61049a826103ef565b9050602081019050919050565b8281835e5f83830152505050565b5f6104c76104c284610477565b61045d565b9050828152602081018484840111156104e3576104e26103eb565b5b6104ee8482856104a7565b509392505050565b5f82601f83011261050a576105096103e7565b5b815161051a8482602086016104b5565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61054c82610523565b9050919050565b61055c81610542565b8114610566575f5ffd5b50565b5f8151905061057781610553565b92915050565b5f5f5f5f60808587031215610595576105946103df565b5b5f85015167ffffffffffffffff8111156105b2576105b16103e3565b5b6105be878288016104f6565b945050602085015167ffffffffffffffff8111156105df576105de6103e3565b5b6105eb878288016104f6565b93505060406105fc87828801610569565b925050606061060d87828801610569565b91505092959194509250565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061066757607f821691505b60208210810361067a57610679610623565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026106dc7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826106a1565b6106e686836106a1565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61072a610725610720846106fe565b610707565b6106fe565b9050919050565b5f819050919050565b61074383610710565b61075761074f82610731565b8484546106ad565b825550505050565b5f5f905090565b61076e61075f565b61077981848461073a565b505050565b5b8181101561079c576107915f82610766565b60018101905061077f565b5050565b601f8211156107e1576107b281610680565b6107bb84610692565b810160208510156107ca578190505b6107de6107d685610692565b83018261077e565b50505b505050565b5f82821c905092915050565b5f6108015f19846008026107e6565b1980831691505092915050565b5f61081983836107f2565b9150826002028217905092915050565b61083282610619565b67ffffffffffffffff81111561084b5761084a6103ff565b5b6108558254610650565b6108608282856107a0565b5f60209050601f831160018114610891575f841561087f578287015190505b610889858261080e565b8655506108f0565b601f19841661089f86610680565b5f5b828110156108c6578489015182556001820191506020850194506020810190506108a1565b868310156108e357848901516108df601f8916826107f2565b8355505b6001600288020188555050505b505050505050565b61090181610542565b82525050565b5f60208201905061091a5f8301846108f8565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610957826106fe565b9150610962836106fe565b925082820190508082111561097a57610979610920565b5b92915050565b610989816106fe565b82525050565b5f6060820190506109a25f8301866108f8565b6109af6020830185610980565b6109bc6040830184610980565b949350505050565b5f6020820190506109d75f830184610980565b92915050565b611c05806109ea5f395ff3fe60806040526004361061010c575f3560e01c806370a0823111610094578063a9059cbb11610063578063a9059cbb1461036f578063b44a2722146103ab578063d0febe4c146103d5578063dd62ed3e146103df578063eb91d37e1461041b57610113565b806370a08231146102b55780638da5cb5b146102f157806395d89b411461031b578063a1634b141461034557610113565b80632c135b93116100db5780632c135b93146101e3578063313ce5671461020d57806332cb6b0c1461023757806350879c1c146102615780636882a8881461028b57610113565b806306fdde0314610117578063095ea7b31461014157806318160ddd1461017d57806323b872dd146101a757610113565b3661011357005b5f5ffd5b348015610122575f5ffd5b5061012b610445565b604051610138919061126f565b60405180910390f35b34801561014c575f5ffd5b5061016760048036038101906101629190611320565b6104d5565b6040516101749190611378565b60405180910390f35b348015610188575f5ffd5b506101916104f7565b60405161019e91906113a0565b60405180910390f35b3480156101b2575f5ffd5b506101cd60048036038101906101c891906113b9565b610500565b6040516101da9190611378565b60405180910390f35b3480156101ee575f5ffd5b506101f761052e565b60405161020491906113a0565b60405180910390f35b348015610218575f5ffd5b50610221610534565b60405161022e9190611424565b60405180910390f35b348015610242575f5ffd5b5061024b61053c565b60405161025891906113a0565b60405180910390f35b34801561026c575f5ffd5b5061027561054a565b6040516102829190611498565b60405180910390f35b348015610296575f5ffd5b5061029f61056f565b6040516102ac91906114cc565b60405180910390f35b3480156102c0575f5ffd5b506102db60048036038101906102d691906114e5565b610576565b6040516102e891906113a0565b60405180910390f35b3480156102fc575f5ffd5b506103056105bb565b604051610312919061151f565b60405180910390f35b348015610326575f5ffd5b5061032f6105e0565b60405161033c919061126f565b60405180910390f35b348015610350575f5ffd5b50610359610670565b60405161036691906114cc565b60405180910390f35b34801561037a575f5ffd5b5061039560048036038101906103909190611320565b610694565b6040516103a29190611378565b60405180910390f35b3480156103b6575f5ffd5b506103bf6106b6565b6040516103cc9190611558565b60405180910390f35b6103dd6106db565b005b3480156103ea575f5ffd5b5061040560048036038101906104009190611571565b61078d565b60405161041291906113a0565b60405180910390f35b348015610426575f5ffd5b5061042f61080f565b60405161043c91906113a0565b60405180910390f35b606060038054610454906115dc565b80601f0160208091040260200160405190810160405280929190818152602001828054610480906115dc565b80156104cb5780601f106104a2576101008083540402835291602001916104cb565b820191905f5260205f20905b8154815290600101906020018083116104ae57829003601f168201915b5050505050905090565b5f5f6104df610888565b90506104ec81858561088f565b600191505092915050565b5f600254905090565b5f5f61050a610888565b90506105178582856108a1565b610522858585610933565b60019150509392505050565b60055481565b5f6012905090565b690472698b413b4320000081565b60075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b620d89e881565b5f5f5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6060600480546105ef906115dc565b80601f016020809104026020016040519081016040528092919081815260200182805461061b906115dc565b80156106665780601f1061063d57610100808354040283529160200191610666565b820191905f5260205f20905b81548152906001019060200180831161064957829003601f168201915b5050505050905090565b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2761881565b5f5f61069e610888565b90506106ab818585610933565b600191505092915050565b60085f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f6106e461080f565b90505f816106f0610534565b600a6106fc9190611768565b3461070791906117b2565b6107119190611820565b90508061071d30610576565b101561075e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107559061189a565b60405180910390fd5b610769303383610933565b3460055f82825461077a91906118b8565b92505081905550610789610a23565b5050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b5f5f66038d7ea4c6800090505f6509184e72a00090505f61082f30610576565b690472698b413b4320000061084491906118eb565b90505f61084f610534565b600a61085b9190611768565b828461086791906117b2565b6108719190611820565b8461087c91906118b8565b90508094505050505090565b5f33905090565b61089c8383836001610a40565b505050565b5f6108ac848461078d565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461092d578181101561091e578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016109159392919061191e565b60405180910390fd5b61092c84848484035f610a40565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036109a3575f6040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161099a919061151f565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610a13575f6040517fec442f05000000000000000000000000000000000000000000000000000000008152600401610a0a919061151f565b60405180910390fd5b610a1e838383610c0f565b505050565b6825f273933db570000060055410610a3e57610a3d610e28565b5b565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610ab0575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610aa7919061151f565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b20575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610b17919061151f565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610c09578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610c0091906113a0565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610c5f578060025f828254610c5391906118b8565b92505081905550610d2d565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610ce8578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610cdf9392919061191e565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610d74578060025f8282540392505081905550610dbe565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e1b91906113a0565b60405180910390a3505050565b610e5c3060085f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610e5730610576565b61088f565b5f47905060075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db0826040518263ffffffff1660e01b81526004015f604051808303818588803b158015610ec7575f5ffd5b505af1158015610ed9573d5f5f3e3d5ffd5b505050505060075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b360085f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836040518363ffffffff1660e01b8152600401610f5b929190611953565b6020604051808303815f875af1158015610f77573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610f9b91906119a4565b505f5f5f5f60075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16106110265760075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16308661102130610576565b611054565b3060075f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661105230610576565b875b93509350935093505f610bb890505f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff2761890505f620d89e890505f6040518061016001604052808973ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff1681526020018562ffffff1681526020018460020b81526020018360020b81526020018781526020018681526020015f81526020015f815260200160065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020014281525090505f5f5f5f60085f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166388316456866040518263ffffffff1660e01b81526004016111a89190611af8565b6080604051808303815f875af11580156111c4573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906111e89190611b6b565b935093509350935050505050505050505050505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f611241826111ff565b61124b8185611209565b935061125b818560208601611219565b61126481611227565b840191505092915050565b5f6020820190508181035f8301526112878184611237565b905092915050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6112bc82611293565b9050919050565b6112cc816112b2565b81146112d6575f5ffd5b50565b5f813590506112e7816112c3565b92915050565b5f819050919050565b6112ff816112ed565b8114611309575f5ffd5b50565b5f8135905061131a816112f6565b92915050565b5f5f604083850312156113365761133561128f565b5b5f611343858286016112d9565b92505060206113548582860161130c565b9150509250929050565b5f8115159050919050565b6113728161135e565b82525050565b5f60208201905061138b5f830184611369565b92915050565b61139a816112ed565b82525050565b5f6020820190506113b35f830184611391565b92915050565b5f5f5f606084860312156113d0576113cf61128f565b5b5f6113dd868287016112d9565b93505060206113ee868287016112d9565b92505060406113ff8682870161130c565b9150509250925092565b5f60ff82169050919050565b61141e81611409565b82525050565b5f6020820190506114375f830184611415565b92915050565b5f819050919050565b5f61146061145b61145684611293565b61143d565b611293565b9050919050565b5f61147182611446565b9050919050565b5f61148282611467565b9050919050565b61149281611478565b82525050565b5f6020820190506114ab5f830184611489565b92915050565b5f8160020b9050919050565b6114c6816114b1565b82525050565b5f6020820190506114df5f8301846114bd565b92915050565b5f602082840312156114fa576114f961128f565b5b5f611507848285016112d9565b91505092915050565b611519816112b2565b82525050565b5f6020820190506115325f830184611510565b92915050565b5f61154282611467565b9050919050565b61155281611538565b82525050565b5f60208201905061156b5f830184611549565b92915050565b5f5f604083850312156115875761158661128f565b5b5f611594858286016112d9565b92505060206115a5858286016112d9565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806115f357607f821691505b602082108103611606576116056115af565b5b50919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f8160011c9050919050565b5f5f8291508390505b600185111561168e5780860481111561166a5761166961160c565b5b60018516156116795780820291505b808102905061168785611639565b945061164e565b94509492505050565b5f826116a65760019050611761565b816116b3575f9050611761565b81600181146116c957600281146116d357611702565b6001915050611761565b60ff8411156116e5576116e461160c565b5b8360020a9150848211156116fc576116fb61160c565b5b50611761565b5060208310610133831016604e8410600b84101617156117375782820a9050838111156117325761173161160c565b5b611761565b6117448484846001611645565b9250905081840481111561175b5761175a61160c565b5b81810290505b9392505050565b5f611772826112ed565b915061177d83611409565b92506117aa7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484611697565b905092915050565b5f6117bc826112ed565b91506117c7836112ed565b92508282026117d5816112ed565b915082820484148315176117ec576117eb61160c565b5b5092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b5f61182a826112ed565b9150611835836112ed565b925082611845576118446117f3565b5b828204905092915050565b7f4e6f7420656e6f75676820746f6b656e7320617661696c61626c6500000000005f82015250565b5f611884601b83611209565b915061188f82611850565b602082019050919050565b5f6020820190508181035f8301526118b181611878565b9050919050565b5f6118c2826112ed565b91506118cd836112ed565b92508282019050808211156118e5576118e461160c565b5b92915050565b5f6118f5826112ed565b9150611900836112ed565b92508282039050818111156119185761191761160c565b5b92915050565b5f6060820190506119315f830186611510565b61193e6020830185611391565b61194b6040830184611391565b949350505050565b5f6040820190506119665f830185611510565b6119736020830184611391565b9392505050565b6119838161135e565b811461198d575f5ffd5b50565b5f8151905061199e8161197a565b92915050565b5f602082840312156119b9576119b861128f565b5b5f6119c684828501611990565b91505092915050565b6119d8816112b2565b82525050565b5f62ffffff82169050919050565b6119f5816119de565b82525050565b611a04816114b1565b82525050565b611a13816112ed565b82525050565b61016082015f820151611a2e5f8501826119cf565b506020820151611a4160208501826119cf565b506040820151611a5460408501826119ec565b506060820151611a6760608501826119fb565b506080820151611a7a60808501826119fb565b5060a0820151611a8d60a0850182611a0a565b5060c0820151611aa060c0850182611a0a565b5060e0820151611ab360e0850182611a0a565b50610100820151611ac8610100850182611a0a565b50610120820151611add6101208501826119cf565b50610140820151611af2610140850182611a0a565b50505050565b5f61016082019050611b0c5f830184611a19565b92915050565b5f81519050611b20816112f6565b92915050565b5f6fffffffffffffffffffffffffffffffff82169050919050565b611b4a81611b26565b8114611b54575f5ffd5b50565b5f81519050611b6581611b41565b92915050565b5f5f5f5f60808587031215611b8357611b8261128f565b5b5f611b9087828801611b12565b9450506020611ba187828801611b57565b9350506040611bb287828801611b12565b9250506060611bc387828801611b12565b9150509295919450925056fea2646970667358221220e8e03932f4b9842a57a6e4ec6501f96ad870e6370c8e2b66450def9c0ffd5aeb64736f6c634300081b0033'; // Replace with your contract's bytecode

    // Create a contract instance
    const contract = new web3.eth.Contract(abi);

    // Prepare deployment options
    const deployOptions = {
        data: bytecode,
        arguments: [randomName, randomSymbol, positionManagerAddress, wethAddress]
    };

    // Deploy the contract
    contract.deploy(deployOptions)
        .send({
            from: deployer,
            gas: 3000000,
            gasPrice: await web3.eth.getGasPrice()
        })
        .on('transactionHash', (hash) => {
            statusText.innerHTML = 'Transaction sent. Hash: ' + hash;
        })
        .on('receipt', (receipt) => {
            console.log('Contract deployed at address', receipt.contractAddress);
            statusText.innerHTML = 'Contract deployed at address ' + receipt.contractAddress;
            contractAddr.value = receipt.contractAddress; // Set the contract address input
            // Initialize the contract instance
            contractInstance = new web3.eth.Contract(abi, receipt.contractAddress);
        })
        .on('error', (error) => {
            console.error('Error deploying contract', error);
            statusText.innerHTML = 'Error deploying contract: ' + error.message;
        });
}

// Function to initialize contract instance after entering address
contractAddr.addEventListener('change', () => {
    const addr = contractAddr.value;
    if (web3.utils.isAddress(addr)) {
        contractInstance = new web3.eth.Contract(abi, addr);
        statusText.innerHTML = 'Contract loaded at address: ' + addr;
    } else {
        statusText.innerHTML = 'Invalid contract address.';
    }
});

// Function to listen to events
async function listenToEvents() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }
    contractInstance.events.TokensSent().on("data", (event) => {
        eventResult.innerHTML = JSON.stringify(event) + "<br />=====<br />" + eventResult.innerHTML;
    }).on("error", (error) => {
        console.error("Error listening to events:", error);
    });
}

// Function to buy tokens
async function buyTokens() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }

    const amountInEth = buyAmountInput.value;
    if (!amountInEth || isNaN(amountInEth) || amountInEth <= 0) {
        statusText.innerHTML = "Please enter a valid ETH amount.";
        return;
    }

    try {
        const tx = await contractInstance.methods.buyTokens().send({
            from: accounts[0],
            value: web3.utils.toWei(amountInEth, 'ether'),
            gas: 300000
        });

        statusText.innerHTML = `Tokens bought successfully. Transaction hash: ${tx.transactionHash}`;
    } catch (error) {
        console.error("Error buying tokens:", error);
        statusText.innerHTML = `Error buying tokens: ${error.message}`;
    }
}

// Function to get current price
async function getCurrentPrice() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }

    try {
        const price = await contractInstance.methods.getCurrentPrice().call();
        // Assuming price is in wei
        const priceInEth = web3.utils.fromWei(price, 'ether');
        currentPriceDisplay.innerHTML = `Current Price: ${priceInEth} ETH`;
    } catch (error) {
        console.error("Error getting current price:", error);
        statusText.innerHTML = `Error getting current price: ${error.message}`;
    }
}

// Function to get market cap
async function getMarketCap() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }

    try {
        const marketCap = await contractInstance.methods.marketCap().call();
        // Assuming marketCap is in wei
        const marketCapInEth = web3.utils.fromWei(marketCap, 'ether');
        marketCapDisplay.innerHTML = `Market Cap: ${marketCapInEth} ETH`;
    } catch (error) {
        console.error("Error getting market cap:", error);
        statusText.innerHTML = `Error getting market cap: ${error.message}`;
    }
}

// Function to get token details
async function getTokenDetails() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }

    try {
        const name = await contractInstance.methods.name().call();
        const symbol = await contractInstance.methods.symbol().call();
        const totalSupply = await contractInstance.methods.totalSupply().call();
        const owner = await contractInstance.methods.owner().call();

        // Assuming totalSupply has decimals (18)
        const totalSupplyFormatted = web3.utils.fromWei(totalSupply, 'ether');

        tokenDetailsDisplay.innerHTML = `
            Name: ${name}<br>
            Symbol: ${symbol}<br>
            Total Supply: ${totalSupplyFormatted} ${symbol}<br>
            Owner: ${owner}
        `;
    } catch (error) {
        console.error("Error getting token details:", error);
        statusText.innerHTML = `Error getting token details: ${error.message}`;
    }
}

// Function to transfer tokens
async function transferTokens() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }

    const toAddress = transferToInput.value;
    const amount = transferAmountInput.value;

    if (!web3.utils.isAddress(toAddress)) {
        statusText.innerHTML = "Invalid recipient address.";
        return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
        statusText.innerHTML = "Please enter a valid amount.";
        return;
    }

    try {
        // Assuming the token has 18 decimals
        const amountInWei = web3.utils.toWei(amount, 'ether');
        const tx = await contractInstance.methods.transfer(toAddress, amountInWei).send({
            from: accounts[0],
            gas: 300000
        });

        statusText.innerHTML = `Transfer successful. Transaction hash: ${tx.transactionHash}`;
    } catch (error) {
        console.error("Error transferring tokens:", error);
        statusText.innerHTML = `Error transferring tokens: ${error.message}`;
    }
}

// Function to approve tokens
async function approveTokens() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }

    const spenderAddress = approveSpenderInput.value;
    const amount = approveAmountInput.value;

    if (!web3.utils.isAddress(spenderAddress)) {
        statusText.innerHTML = "Invalid spender address.";
        return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
        statusText.innerHTML = "Please enter a valid amount.";
        return;
    }

    try {
        // Assuming the token has 18 decimals
        const amountInWei = web3.utils.toWei(amount, 'ether');
        const tx = await contractInstance.methods.approve(spenderAddress, amountInWei).send({
            from: accounts[0],
            gas: 300000
        });

        statusText.innerHTML = `Approval successful. Transaction hash: ${tx.transactionHash}`;
    } catch (error) {
        console.error("Error approving tokens:", error);
        statusText.innerHTML = `Error approving tokens: ${error.message}`;
    }
}

// Function to transfer tokens from another address
async function transferFromTokens() {
    if (!contractInstance) {
        statusText.innerHTML = "Please enter a valid contract address.";
        return;
    }

    const fromAddress = transferFromAddressInput.value;
    const toAddress = transferToAddressInput.value;
    const amount = transferFromAmountInput.value;

    if (!web3.utils.isAddress(fromAddress)) {
        statusText.innerHTML = "Invalid 'From' address.";
        return;
    }

    if (!web3.utils.isAddress(toAddress)) {
        statusText.innerHTML = "Invalid 'To' address.";
        return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
        statusText.innerHTML = "Please enter a valid amount.";
        return;
    }

    try {
        // Assuming the token has 18 decimals
        const amountInWei = web3.utils.toWei(amount, 'ether');
        const tx = await contractInstance.methods.transferFrom(fromAddress, toAddress, amountInWei).send({
            from: accounts[0],
            gas: 300000
        });

        statusText.innerHTML = `Transfer From successful. Transaction hash: ${tx.transactionHash}`;
    } catch (error) {
        console.error("Error transferring tokens from:", error);
        statusText.innerHTML = `Error transferring tokens from: ${error.message}`;
    }
}
