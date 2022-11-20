import React from "react";
import BlockHeight from "./BlockHeight";

const Web3App = () => {

    return (
      <div>
          <BlockHeight updateInterval={3000} />
      </div>
    )
}

export default Web3App;