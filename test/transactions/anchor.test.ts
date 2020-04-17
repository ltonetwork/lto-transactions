import { publicKey, verifySignature } from '@lto-network/lto-crypto'
import { anchor } from '../../src'
import { anchorMinimalParams } from '../minimalParams'
import { binary } from '@lto-network/lto-marshall'

describe('anchor', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = anchor({ ...anchorMinimalParams } as any, stringSeed)
    expect(tx.anchors.length).toEqual(3)
    expect(tx.proofs.length).toEqual(1)
  })

  it('Should get correct signature', () => {
    const tx = anchor({ ...anchorMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = anchor({ ...anchorMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })

  // Test correct serialization.Compare with value from old anchor function version
  it('Should correctly serialize', () => {
    const anchorParams = {
      anchors: [
        '7SDYMzGCZVFSwAGs7cFxj2rUBgUB8BVtPnPUuu4itKcX', // someparam
        '2ZQbGRzfGJEihHoDCdS6DTnvrQV9gkj7KdyapmJ1UbXt', // someparam2
        '2hy3qKT5PuhWUxe9ACP4HnxRvxzcRqUommTZX4FQp8BE',  // someparam3
      ],
      timestamp: 100000,
    }
    const tx = anchor(anchorParams, 'seed')
    const barr = '15,1,26,205,53,236,36,225,249,197,208,91,167,95,7,134,151,79,89,254,109,158,209,102,127,50,190,240,113,147,22,40,192,217,0,3,0,32,95,155,210,85,244,27,229,109,59,226,20,147,164,173,233,209,26,164,28,79,64,222,152,12,27,157,116,106,245,216,244,252,0,32,23,40,242,111,105,242,9,209,49,85,32,185,52,151,180,184,122,95,115,170,185,81,232,46,13,188,109,4,234,144,201,31,0,32,25,90,75,62,114,125,73,18,148,213,11,160,29,102,250,187,83,239,83,246,236,94,13,21,71,20,218,91,59,52,136,149,0,0,0,0,0,1,134,160,0,0,0,0,1,125,120,64'
    expect(binary.serializeTx(tx).toString()).toEqual(barr)
  })
})
