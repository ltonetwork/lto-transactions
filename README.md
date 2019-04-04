# lto-transactions  [![npm version](https://badge.fury.io/js/%40lto-network%2Flto-transactions.svg)](https://badge.fury.io/js/%40lto-network%2Flto-transactions)

[![License][license-image]][license-url] ![Coverage badge gree][coverage-badge-green]

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/make-coverage-badge.svg
[coverage-badge-green]:https://img.shields.io/badge/Coverage-98.77%25-brightgreen.svg

Using this library you can easily create and sign transactions for LTO blockchain.
It also allows you to multi-sign existing transactions or create them without signature at all.

This library is a set of transaction constructing functions:
* [Alias](https://legalthings.github.io/lto-transactions/globals.html#alias)
* [Issue](https://legalthings.github.io/lto-transactions/globals.html#issue)
* [Reissue](https://legalthings.github.io/lto-transactions/globals.html#reissue)
* [Burn](https://legalthings.github.io/lto-transactions/globals.html#burn)
* [Lease](https://legalthings.github.io/lto-transactions/globals.html#lease)
* [Cancel lease](https://legalthings.github.io/lto-transactions/globals.html#cancellease)
* [Transfer](https://legalthings.github.io/lto-transactions/globals.html#transfer)
* [Mass transfer](https://legalthings.github.io/lto-transactions/globals.html#masstransfer)
* [Set script](https://legalthings.github.io/lto-transactions/globals.html#setscript)
* [Data](https://legalthings.github.io/lto-transactions/globals.html#data)
* [Set asset script](https://legalthings.github.io/lto-transactions/globals.html#setassetscript)
* [Order](https://legalthings.github.io/lto-transactions/globals.html#order)

Check full documentation on [GitHub Pages](https://legalthings.github.io/lto-transactions/index.html).

### Transactions

The idea is really simple - you create transaction and sign it from a minimal set of required params.
If you want to create [Transfer transaction](https://legalthings.github.io/lto-transactions/interfaces/itransfertransaction.html) the minimum you need to provide is **amount** and **recipient** as defined in [Transfer params](https://legalthings.github.io/lto-transactions/interfaces/itransferparams.html):
```js

const { transfer } = require('@lto-network/lto-transactions')
const seed = 'some example seed phrase'
const signedTranserTx = transfer({ 
  amount: 1,
  recipient: '3P6fVra21KmTfWHBdib45iYV6aFduh4WwC2',
  //Timestamp is optional but it was overrided, in case timestamp is not provided it will fallback to Date.now(). You can set any oftional params yourself. go check full docs
  timestamp: 1536917842558 
}, seed)
```

Output will be a signed transfer transaction:
```js
{
  id: '8NrUwgKRCMFbUbqXKQAHkGnspmWHEjKUSi5opEC6Havq',
  type: 4,
  version: 2,
  recipient: '3P6fVra21KmTfWHBdib45iYV6aFduh4WwC2',
  attachment: undefined,
  feeAssetId: undefined,
  assetId: undefined,
  amount: 1,
  fee: 100000,
  senderPublicKey: '6nR7CXVV7Zmt9ew11BsNzSvVmuyM5PF6VPbWHW9BHgPq',
  timestamp: 1536917842558,
  proofs: [
    '25kyX6HGjS3rkPTJRj5NVH6LLuZe6SzCzFtoJ8GDkojY9U5oPfVrnwBgrCHXZicfsmLthPUjTrfT9TQL2ciYrPGE'
  ]
}
```

You can also create transaction, but not sign it:
```javascript
const unsignedTransferTx = transfer({ 
  amount: 1,
  recipient: '3P6fVra21KmTfWHBdib45iYV6aFduh4WwC2',
  //senderPublicKey is required if you omit seed
  senderPublicKey: '6nR7CXVV7Zmt9ew11BsNzSvVmuyM5PF6VPbWHW9BHgPq' 
})
```

Now you are able to POST it to LTO API or store for future purpose or you can add another signature from other party:
```js
const otherPartySeed = 'other party seed phrase'
const transferSignedWithTwoParties = transfer(signedTranserTx, seed)
```

So now there are two proofs:
```js
{
  id: '8NrUwgKRCMFbUbqXKQAHkGnspmWHEjKUSi5opEC6Havq',
  type: 4,
  version: 2,
  recipient: '3P6fVra21KmTfWHBdib45iYV6aFduh4WwC2',
  attachment: undefined,
  feeAssetId: undefined,
  assetId: undefined,
  amount: 1,
  fee: 100000,
  senderPublicKey: '6nR7CXVV7Zmt9ew11BsNzSvVmuyM5PF6VPbWHW9BHgPq',
  timestamp: 1536917842558,
  proofs: [
    '25kyX6HGjS3rkPTJRj5NVH6LLuZe6SzCzFtoJ8GDkojY9U5oPfVrnwBgrCHXZicfsmLthPUjTrfT9TQL2ciYrPGE',
    'CM9emPzpe6Ram7ZxcYax6s7Hkw6698wXCMPSckveFAS2Yh9vqJpy1X9nL7p4RKgU3UEa8c9RGXfUK6mFFq4dL9z'
  ]
}
```

### Broadcast
To send transaction you can use either node [REST API](https://nodes.lto.network/api-docs/index.html#!/transactions/broadcast) or [broadcast](https://legalthings.github.io/lto-transactions/globals.html#broadcast) helper function:
```javascript
const {broadcast} =  require('@lto-network/lto-transactions');
const nodeUrl = 'https://nodes.lto.network';

broadcast(signedTx, nodeUrl).then(resp => console.log(resp))
```
You can send tx to any lto node you like:. E.g.:
* https://testnet.legalthings.one - lto TESTNET nodes hosted by LTO Network
* https://nodes.lto.network - lto MAINNET nodes hosted by LTO Network
#### Important!!!
Most transactions require chainId as parameter, e.g: [IBurnParams](https://legalthings.github.io/lto-transactions/interfaces/iburnparams.html). By default chainId is 'W', which means MAINNET. To make transaction in TESTNET be sure to pass chainId if it is present in params interface and then send it to TESTNET node

