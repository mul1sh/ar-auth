import Arweave from 'arweave/web';
import * as bip39 from 'bip39';

var util = require('util')

const arweaveOptions = {
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 443,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
};

const arweave = Arweave.init(arweaveOptions);


export const getEncryptedWallet = async (publicKey) => {
    let arweaveTransactions = [];

	try {
      arweaveTransactions = await arweave.arql({
		      op: "and",
			  expr1: {
			    op: "equals",
			    expr1: "ar-auth-public-key",
			    expr2: publicKey
			  },
			  expr2: {
			    op: "equals",
			    expr1: "app-id",
			    expr2: "ar-auth"
			  }
		});
	}
	catch(error) {
      console.log("unable to get wallet transactions");
	}

	return arweaveTransactions;
}

export const getTransactionDetails = async (transactionId) => {
	let transactionDetails = null;

	try {
		transactionDetails = await arweave.transactions.get(transactionId);
	}
	catch(error) {
		console.error(error);
		console.error("unable to get transaction details");
	}

	return transactionDetails;
}


// function generates a jwk key to encypt the users wallet
const encryptUserWallet = async (userWallet) => {

	let encryptionData = {};

	try {
		const mnemonic = bip39.generateMnemonic(128);

		encryptionData.phrase = mnemonic;

		console.log(bip39.generateMnemonic(128));

		let publicKey = "";
		mnemonic.split(" ").forEach((word, index) => {
	        if (index <= 3) {
	           publicKey += word;
	        }
		});
		encryptionData.publicKey = btoa(publicKey);
	    const encryptedWallet = CryptoJS.AES.encrypt(JSON.stringify(userWallet), mnemonic).toString();
	    encryptionData.encryptedWallet = encryptedWallet;
	}

	catch (error) {
		console.log(error);
	}

	return encryptionData;
}

export const saveWallet = async (userWallet) => {

	let walletSaved = {};

	try {
	   const { encryptedWallet, publicKey, phrase } = await encryptUserWallet(userWallet);
	   
       let transaction = await arweave.createTransaction({ data: encryptedWallet }, userWallet);

       walletSaved.phrase = phrase;

       transaction.addTag('ar-auth-public-key', publicKey);
	   transaction.addTag('app-id', 'ar-auth');

	   await arweave.transactions.sign(transaction, userWallet);

	   const response = await arweave.transactions.post(transaction);
	   walletSaved.tx = response.status === 200 ? response.config.data : null;
       
	}
	catch (error) {
		console.error(error);
		console.error("unable to save wallet");

		walletSaved = undefined;
	}
	
	return walletSaved;

}
