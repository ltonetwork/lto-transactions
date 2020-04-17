import { publicKey, verifySignature } from '@lto-network/lto-crypto'
import {revokeAssociation} from '../../src'
import { associationMinimalParams } from '../minimalParams'
import { binary } from '@lto-network/lto-marshall'

describe('revokeAssociation', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = revokeAssociation({ ...associationMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...associationMinimalParams })
    expect(tx.proofs.length).toEqual(1)
  })

  it('Should get correct signature', () => {
    const tx = revokeAssociation({ ...associationMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = revokeAssociation({ ...associationMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })

  it('Should correctly serialize', () => {
    const params = {
      hash: '7SDYMzGCZVFSwAGs7cFxj2rUBgUB8BVtPnPUuu4itKcX', // someparam
      associationType: 10,
      party: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      timestamp: 100000,
    }
    const tx = revokeAssociation(params, 'seed')
    const barr = '17,1,76,26,205,53,236,36,225,249,197,208,91,167,95,7,134,151,79,89,254,109,158,209,102,127,50,190,240,113,147,22,40,192,217,1,84,145,193,229,53,69,107,116,171,107,232,58,228,4,39,243,26,134,114,65,147,175,90,181,34,0,0,0,10,1,0,32,95,155,210,85,244,27,229,109,59,226,20,147,164,173,233,209,26,164,28,79,64,222,152,12,27,157,116,106,245,216,244,252,0,0,0,0,0,1,134,160,0,0,0,0,5,245,225,0'
    expect(binary.serializeTx(tx).toString()).toEqual(barr)
  })
})
