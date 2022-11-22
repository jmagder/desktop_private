import React, { useEffect, useState } from 'react'
import { updateBlockNumber } from '../../Services/Web3Service'

interface Props {
  updateInterval: number
}

const BlockHeight: React.FunctionComponent<Props> = ({ updateInterval }: Props) => {
  const [currentBlock, setCurrentBlock] = useState(0)

  useEffect(() => {
    const fetchBlockNumber = async (): Promise<Function> => {
      return await updateBlockNumber(setCurrentBlock, updateInterval)
    }

    const cancelFnPromise = fetchBlockNumber()
    cancelFnPromise.catch(console.error)
    return () => {
      cancelFnPromise.then(cancelFn => cancelFn()).catch(console.error)
    }
  })

  return (
      <div>
          <p>Current block height: {currentBlock}</p>
      </div>
  )
}

export default BlockHeight
