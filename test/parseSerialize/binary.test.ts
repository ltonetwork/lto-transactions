import { binary } from '../../src/parseSerialize'
import {exampleTxs} from './exampleTxs'
import Long = require('long')
import BigNumber from 'bignumber.js'

describe('Tx serialize/parse', ()=> {
  Object.entries(exampleTxs).forEach(([type, tx]) => {
    it(`Type: ${type}`, () => {
      const expectedBytes = null
      const bytes = binary.serializeTx(tx)
      const parsed = binary.parseTx<number>(bytes, parseInt)
      // delete non serializable fields. Should write typesafe excludeKeys function instead
      delete (tx as any).proofs
      delete (tx as any).signature
      delete (tx as any).sender
      delete (tx as any).id
      expect(parsed).toMatchObject(tx)
    })
  })

  it('Should correctly serialize LONGjs', ()=>{
    const tx: any = exampleTxs[12]
    const bytes = binary.serializeTx({...tx, fee: Long.fromNumber(tx.fee)})
    const parsed = binary.parseTx<number>(bytes, parseInt)
    expect(tx).toMatchObject(parsed)
  })

  it('Should convertLongFields LONGjs', ()=>{
    const tx = exampleTxs[12]
    const bytes = binary.serializeTx(tx)

    const parsed = binary.parseTx(bytes, Long.fromString)
    expect(parsed.fee).toBeInstanceOf(Long)
    expect(parsed.data[3].value).toBeInstanceOf(Long)
    expect(parsed.timestamp).toBeInstanceOf(Long)
  })

  it('Should convertLongFields to bignumber.js', ()=>{
    const tx = exampleTxs[12]
    const bytes = binary.serializeTx(tx)

    const parsed = binary.parseTx(bytes, x => new BigNumber(x))
    expect(parsed.fee).toBeInstanceOf(BigNumber)
    expect(parsed.data[3].value).toBeInstanceOf(BigNumber)
    expect(parsed.timestamp).toBeInstanceOf(BigNumber)
  })
})
