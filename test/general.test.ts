import { publicKey, verifySignature } from '../src/crypto'
import {signTx } from '../src'
import { serialize } from '../src/general'
import { TTx } from '../src'
import { exampleTxs } from './exampleTxs'

const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

describe('signTx', () => {

  const txs = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x] as TTx)
  txs.forEach(tx => {
    it('type: ' + tx.type, () => {
      const signed = signTx(tx, stringSeed)
      const bytes = serialize(signed)
      expect(verifySignature(publicKey(stringSeed), bytes, signed.proofs[1]!)).toBeTruthy()
    })
  })
})
