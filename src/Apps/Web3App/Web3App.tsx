import React, {ChangeEventHandler, useState} from "react";
import BlockHeight from "./BlockHeight";
import NFTCollectionSelector from "./NFTCollectionSelector";
import NFTGallery from "./NFTGallery";

const Web3App = () => {
  const [selectedAddress, setSelectedAddress] = useState("");

  const changeEventHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selectedAddress = event.target.value;
    setSelectedAddress(selectedAddress);
  }

    return (
      <div className="Web3App" style={{padding: '5px 20px', overflow: 'auto'}}>
        <BlockHeight updateInterval={6000} />
        <p>
          Please select an NFT collection to see what has been traded in the last 1000 blocks:
        </p>
        <NFTCollectionSelector onSelection={changeEventHandler}/>
        <NFTGallery address={selectedAddress} />
      </div>
    )
}

export default Web3App;