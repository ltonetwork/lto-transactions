import { publicKey, verifySignature } from '../../src/crypto'
import { data } from '../../src'
import { dataMinimalParams } from '../minimalParams'
import { binary } from '../../src/parseSerialize'

describe('data', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = data({ ...dataMinimalParams } as any, stringSeed)
    expect(tx.data.length).toEqual(3)
    expect(tx.proofs.length).toEqual(1)
  })

  it('Should throw on wrong data field type', () => {
    const tx = () => data({ ...dataMinimalParams, data: null } as any, stringSeed)
    const tx1 = () => data({ ...dataMinimalParams, data: { haha: 123 } } as any, stringSeed)
    expect(tx).toThrow('["data should be array"]')
    expect(tx1).toThrow('["data should be array"]')
  })


  it('Should get correct signature', () => {
    const tx = data({ ...dataMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = data({ ...dataMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })

  // Test correct serialization.Compare with value from old data function version
  it('Should correctly serialize', () => {
    const dataParams = {
      data: [
        {
          key: 'oneTwo',
          value: false,
        },
        {
          key: 'twoThree',
          value: 2,
        },
        {
          key: 'three',
          value: Uint8Array.from([1, 2, 3, 4]),
        },
      ],
      timestamp: 100000,
    }
    const tx = data(dataParams, 'seed')
    const barr = '12,1,26,205,53,236,36,225,249,197,208,91,167,95,7,134,151,79,89,254,109,158,209,102,127,50,190,240,113,147,22,40,192,217,0,3,0,6,111,110,101,84,119,111,1,0,0,8,116,119,111,84,104,114,101,101,0,0,0,0,0,0,0,0,2,0,5,116,104,114,101,101,2,0,4,1,2,3,4,0,0,0,0,0,1,134,160,0,0,0,0,0,1,134,160'
    expect(binary.serializeTx(tx).toString()).toEqual(barr)
  })
})