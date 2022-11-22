import React from "react";
import "./card.scss";

type Props = {
  imageURL: string;
  name: string;
  blockNumber: number;
  fromAddress: string;
  toAddress: string;
  transactionHash: string;
}

const Card = ({ imageURL, name, blockNumber, fromAddress, toAddress, transactionHash }: Props) => {
  return (
    <div className="Card">
      <img src={imageURL} alt={name}/>
      <div>Block number: {blockNumber}</div>
      <div>From: {fromAddress}</div>
      <div>To: {toAddress}</div>
      <div><a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">Etherscan</a></div>
    </div>
  );
}
export default Card;