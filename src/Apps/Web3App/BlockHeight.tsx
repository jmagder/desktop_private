import React, {useEffect, useState} from "react";
import {updateBlockNumber} from "../../Services/Web3Service";

type Props = {
  updateInterval: number
}

const BlockHeight = ({updateInterval} : Props) => {
    const [currentBlock, setCurrentBlock] = useState(0);

    useEffect( () => {
        const fetchBlockNumber = async () => {
          return await updateBlockNumber(setCurrentBlock, updateInterval);
        }

        const cancelFnPromise = fetchBlockNumber();
        cancelFnPromise.catch(console.error);
        return () => {
          cancelFnPromise.then(cancelFn => cancelFn());
        }
    })

    return (
      <div>
          <p>Current block height: {currentBlock}</p>
      </div>
    )
}

export default BlockHeight;