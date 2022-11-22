import React from "react";
import "./card.scss";

type Props = {
  imageURL: string;
  name: string;
}

const Card = ({ imageURL, name }: Props) => {
  return (
    <div className="Card">
      <img src={imageURL}  alt={name}/>
      <div>{name}</div>
    </div>
  );
}
export default Card;