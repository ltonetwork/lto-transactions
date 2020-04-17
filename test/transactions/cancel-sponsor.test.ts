import { publicKey, verifySignature } from '@lto-network/lto-crypto'
import { cancelSponsor } from '../../src'
import { cancelSponsorMinimalParams } from '../minimalParams'
import { binary } from '@lto-network/lto-marshall'

describe('cancelSponsor', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = cancelSponsor({ ...cancelSponsorMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...cancelSponsorMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = cancelSponsor({ ...cancelSponsorMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = cancelSponsor({ ...cancelSponsorMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })

  it('Should correctly serialize', () => {
    const params = {
      recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      timestamp: 1585310194893,
    }
    const tx = cancelSponsor(params, 'seed')
    const barr = '19,1,76,26,205,53,236,36,225,249,197,208,91,167,95,7,134,151,79,89,254,109,158,209,102,127,50,190,240,113,147,22,40,192,217,1,84,145,193,229,53,69,107,116,171,107,232,58,228,4,39,243,26,134,114,65,147,175,90,181,34,0,0,1,113,27,217,220,205,0,0,0,0,29,205,101,0'
    expect(binary.serializeTx(tx).toString()).toEqual(barr)
  })
})
