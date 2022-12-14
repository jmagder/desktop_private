import React, { ChangeEventHandler } from 'react'
import { contracts } from './contracts'

interface Props {
  onSelection: ChangeEventHandler<HTMLInputElement>
}

const NFTCollectionSelector: React.FunctionComponent<Props> = ({ onSelection }: Props) => {
  return (
    <fieldset>
      <legend>Choose your NFT collection to scan, below:</legend>
        {contracts.map(contract => (
          <label key={contract.address}>
            <input type="radio" id={contract.address} name="nftSelector" value={contract.address} onChange={onSelection} />
            {contract.name}<br/>
          </label>
        ))}
    </fieldset>
  )
}
export default NFTCollectionSelector
