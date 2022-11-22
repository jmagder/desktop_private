import React, { useEffect, useState} from "react";
import {RingLoader} from "react-spinners";
import {scanBlockchain, NFTResult} from "../../Services/Web3Service";
import Card from "./card";

type Props = {
  address: string;
}

const NFTGallery = ({ address }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nftList, setNFTList] = useState<NFTResult[]>([]);

  useEffect(() => {
    const scanTheBlockchain = async () => {
      const results = await scanBlockchain(address, 1000);
      setNFTList(results);
      setIsLoading(false);
    };
    scanTheBlockchain().catch(console.error);
  }, [address]);
  return (
    <div className="NFTGallery">
      { address && <RingLoader loading={isLoading}/> }
      {
        nftList.map(({imageURL, name}) => {
          return (
            <Card imageURL={imageURL} name={name} />
          );
        })
      }
    </div>
  );
}
export default NFTGallery;