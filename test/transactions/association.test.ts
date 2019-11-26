import { publicKey, verifySignature } from '@lto-network/lto-crypto'
import { association } from '../../src'
import { associationMinimalParams } from '../minimalParams'
import { binary } from '@lto-network/lto-marshall'

describe('association', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = association({ ...associationMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...associationMinimalParams })
    expect(tx.proofs.length).toEqual(1)
  })

  it('Should get correct signature', () => {
    const tx = association({ ...associationMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = association({ ...associationMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })
})