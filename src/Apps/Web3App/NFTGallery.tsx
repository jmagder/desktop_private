import React, { useEffect, useState} from "react";
import {RingLoader} from "react-spinners";
import {scanBlockchain} from "../../Services/Web3Service";

type Props = {
  address: string;
}

const NFTGallery = ({ address }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scanTheBlockchain = async () => {
      await scanBlockchain(address, 1000);
    };
    scanTheBlockchain().catch(console.error);
  });
  return (
    <div>
      <RingLoader />
    </div>
  );
}
export default NFTGallery;