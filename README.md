# AR AUTH

This is a permaweb app hosted on the arweave blockchain that allows arweave to safely store their wallets in the blockchain. In exchange for this, they get an arweave phrase which they can use for login purposes for supported permaweb apps.

Check the [Live Demo here](https://f5hpy3qbh2ju.arweave.net/YIZY14pTrbl42h-txRSU5EzW9ZnizLEVA6qHyAmJQSU).

## Developers
To be enable to add the `Ar Auth` functionality into your permaweb app, simpl do the following.

1. Add [arweave-js](https://github.com/ArweaveTeam/arweave-js) into your project, as described in the repo.
2. Add the `crypto.js`  dependency as a script tag, into your project. i.e.
```html
<script src="https://f5hpy3qbh2ju.arweave.net/YIZY14pTrbl42h-txRSU5EzW9ZnizLEVA6qHyAmJQSU/js/crypto.js"></script>
```
3. Get the arweave login phrase from the user on login i.e. via an `<input/>` tag. This phrase has to be a valid 12 word [bip39 phrase](https://github.com/bitcoinjs/bip39) otherwise the decryption will fail.
4. Create a public key from the phrase, using the first 4 words of the phrase and then encode it in base64 i.e.
```js
let publicKey = "";
 mnemonic.split(" ").forEach((word, index) => {
    if (index <= 3) {
       publicKey += word;
    }
});
publicKey = btoa(publicKey);
```
5. Use the public key above and do an [ARQL query](https://github.com/mul1sh/weave-reminders/blob/master/src/helpers/arweave/index.js#L18) to get the encrypted wallet.
```js
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
```

6. Finally [get the details of the transaction](https://github.com/mul1sh/weave-reminders/blob/master/src/views/Login.vue#L95) returned above and then decrypt it to get the wallet details.

```js
const data = tx.get('data', {decode: true, string: true});
const encryptedWallet = CryptoJS.AES.decrypt(data, mnemonic);
const stringWallet = encryptedWallet.toString(CryptoJS.enc.Utf8);
const userWallet = JSON.parse(stringWallet);
```
7. Use the wallet as required :)

## Future Changes

I want to work with the arweave team and continously improve the functionality of this permaweb app by adding the following features
- Ability to define wallet roles so as to minimize the risk of losing funds in case of wallet compromise.
- Find ways of reducing the size of the arweave phrase without degrading its entrophy.
- Find ways of notifying the user in case suspicious wallet use is detected.

## Contribution guide
* Fork the repository
* `npm install` or `yarn install`
* Make changes
* Open Pull Request

- [CHANGELOG](./CHANGELOG.md)
- [version-badge](https://img.shields.io/badge/version-2.0.0-blue.svg)
- [license-badge](https://img.shields.io/badge/license-MIT-blue.svg)

## License

[MIT](./LICENSE.md)
