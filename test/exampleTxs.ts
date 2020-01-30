export const transferTx = { type: 4,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421461,
  proofs:
   [ '22J76sGhLRo3S5pkqGjCi9fijpEeGGRmnv7canxeon2n2MNx1HhvKaBz2gYTdpJQohmUusRKR3yoCAHptRnJ1Fwe' ],
  id: 'EG3WvPWWEU5DdJ7xfB3Y5TRJNzMpt6urgKoP7docipvW',
  recipient: 'aaaa',
  amount: 10000 }

export const leaseTx = { type: 8,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421538,
  proofs:
   [ '26qYvpvh4fedfwbDB93VJDjhUsPQiHqnZuveFr5UtBpAwnStPjS95MgA92c72SRJdU3mPsHJc6SQAraVsu2SPMRc' ],
  id: '5xhvoX9caefDAiiRgUzZQSUHyKfjW5Wx2v2Vr8QR9e4d',
  recipient: 'sssss',
  amount: 10000 }

export const cancelLeaseTx = { type: 9,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421556,
  chainId: 'W',
  proofs:
   [ '5yytwFhmSJhPoRViBKt8AjYkBLxHYxgrs9mSPs3khT4iFLzqbkyyAYu7qbPsJ4iut8BKFFADX2J6hfVwxNFkHTjo' ],
  id: '656pBWMAPfVMu1gbSZ5dd5WTRQzWNo2phfJsD2rDBKfh',
  leaseId: 'test' }

export const massTransferTx = { type: 11,
  version: 1,
  fee: 200000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421576,
  proofs:
   [ '2Un2WpTiFBdhhh7nXd99ci3gAqonuz4xBkWrDS1MJ5fUo9AW12aiYXi3KvnRrmt3C7HqE3BrokzAnYAckd3ggu7D' ],
  id: '7mEAv8DgVgo9xgg4nSMNBeFjuKUsnnqanQgqFw2VEKmG',
  transfers:
   [ { recipient: 'aaa', amount: 10000 },
     { recipient: 'aab', amount: 10000 } ] }

export const dataTx = { type: 12,
  version: 1,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  fee: 100000,
  timestamp: 1542539421605,
  proofs:
   [ '5AMn7DEwZ6VvDLkJNdP5EW1PPJQKeWjy8qp5HoCGWaWWEPYdr1Ewkqor6NfLPDrGQdHd5DFUoE7CtwSrfAUMKLAY' ],
  id: 'F7fkrYuJAsJfJRucwty7dcBoMS95xBufxBi7AXqCFgXg',
  data:
   [ { type: 'binary', key: 'someparam', value: 'base64:AQIDBA==' },
     { key: 'someparam2', type: 'binary', value: 'base64:YXNkYQ==' },
     { type: 'boolean', key: 'someparam3', value: true } ] }

export const setScriptTx = { type: 13,
  version: 1,
  fee: 1000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421635,
  chainId: 'W',
  proofs:
   [ '35x1Rphm1mr24ELJgpLP6dK3wMW7cG6nWsFUcMF3RvxKr3UjEuo4NfYnQf6MEanD7bxBdKDuYxbBJZYQQ495ax3w' ],
  id: 'J8SBGZzSLybdsgpFjDNxVwB8mixkZoEJkgHya3EiXXPc',
  script: 'base64:AQa3b8tH' }

export const anchorTx = { type: 15,
  version: 1,
  fee: 1000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421652,
  proofs:
   [ '4ffQFcfv9NG8GtNB5c1yamFvEFoixvgYBHPmfwSAkZeVRiCwZvB2HWWiMcbiujGhWGxXnho37bWqELnQ6DBPCaj4' ],
  id: '4ERUXALAziaWJ1Acsmpnfjgtv1ixHSWXRp5dBR837o4e',
  anchors: [
    '7SDYMzGCZVFSwAGs7cFxj2rUBgUB8BVtPnPUuu4itKcX', // someparam
    '2ZQbGRzfGJEihHoDCdS6DTnvrQV9gkj7KdyapmJ1UbXt', // someparam2
    '2hy3qKT5PuhWUxe9ACP4HnxRvxzcRqUommTZX4FQp8BE'  // someparam3
  ] }

export const invokeAssociationTx = { type: 16,
  version: 1,
  fee: 1000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421680,
  proofs:
      [ 'KL8ggXHZiBxe32zdYwBV6k4fJ6AvEfM3Hn4HmfcPpPDqtakS2NonckAVJ53N1s2gzX7kxADPR9afmP3f3qYteLY' ],
  id: '9NrYcPr6zN7rr9nypvuQHSTToNniyYXKiDFK3UDeQ6F8',
  party: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  associationType: 2,
  hash: '7SDYMzGCZVFSwAGs7cFxj2rUBgUB8BVtPnPUuu4itKcX'
}

export const revokeAssociationTx = { type: 17,
  version: 1,
  fee: 1000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421682,
  proofs:
      [ 'KL8ggXHZiBxe32zdYwBV6k4fJ6AvEfM3Hn4HmfcPpPDqtakS2NonckAVJ53N1s2gzX7kxADPR9afmP3f3qYteLY' ],
  id: '9NrYcPr6zN7rr9nypvuQHSTToNniyYXKiDFK3UDeQ6F8',
  party: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  associationType: 2,
  hash: '7SDYMzGCZVFSwAGs7cFxj2rUBgUB8BVtPnPUuu4itKcX'
}

export const exampleTxs = {
  4: transferTx,
  8: leaseTx,
  9: cancelLeaseTx,
  11: massTransferTx,
  12: dataTx,
  13: setScriptTx,
  15: anchorTx,
  16: invokeAssociationTx,
  17: revokeAssociationTx,
}
