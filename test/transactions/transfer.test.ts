import { publicKey, verifySignature } from '../../src/crypto'
import { transfer } from '../../src'
import { transferMinimalParams } from '../minimalParams'
import { binary } from '../../src/parseSerialize'

describe('transfer', () => {

  const stringSeed = '3MyuPwbiobZFnZzrtyY8pkaHoQHYmyQxxY1'

  it('should build from minimal set of params', () => {
    const tx = transfer({ ...transferMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...transferMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = transfer({ ...transferMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = transfer({ ...transferMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })
})
