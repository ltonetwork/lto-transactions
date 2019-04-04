import { publicKey, verifySignature } from '@lto-network/lto-crypto'
import { anchor } from '../../src'
import { anchorMinimalParams } from '../minimalParams'
import { binary } from '@waves/marshall'

describe('anchor', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = anchor({ ...anchorMinimalParams } as any, stringSeed)
    expect(tx.anchors.length).toEqual(3)
    expect(tx.proofs.length).toEqual(1)
  })

  it('Should throw on wrong anchors field type', () => {
    const tx = () => anchor({ ...anchorMinimalParams, anchors: null } as any, stringSeed)
    const tx1 = () => anchor({ ...anchorMinimalParams, anchors: { haha: 123 } } as any, stringSeed)
    expect(tx).toThrow('["anchors should be array"]')
    expect(tx1).toThrow('["anchors should be array"]')
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
        '5f9bd255f41be56d3be21493a4ade9d11aa41c4f40de980c1b9d746af5d8f4fc', // someparam
        '1728f26f69f209d1315520b93497b4b87a5f73aab951e82e0dbc6d04ea90c91f', // someparam2
        '195a4b3e727d491294d50ba01d66fabb53ef53f6ec5e0d154714da5b3b348895'  // someparam3
      ],
      timestamp: 100000,
    }
    const tx = anchor(anchorParams, 'seed')
    const barr = '12,1,252,114,65,226,103,96,110,242,73,35,82,18,85,173,252,168,159,237,67,226,116,182,178,180,249,152,104,50,219,208,174,108,0,3,0,6,111,110,101,84,119,111,1,0,0,8,116,119,111,84,104,114,101,101,0,0,0,0,0,0,0,0,2,0,5,116,104,114,101,101,2,0,4,1,2,3,4,0,0,0,0,0,1,134,160,0,0,0,0,0,1,134,160'
    expect(binary.serializeTx(tx).toString()).toEqual(barr)
  })
})