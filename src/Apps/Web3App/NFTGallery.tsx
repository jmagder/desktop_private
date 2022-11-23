import React, { useEffect, useState } from 'react'
import { RingLoader } from 'react-spinners'
import { scanBlockchain, NFTResult } from '../../Services/Web3Service'
import Card from './card'

interface Props {
  address: string
}

const NFTGallery: React.FunctionComponent<Props> = ({ address }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [nftList, setNFTList] = useState<NFTResult[]>([])

  useEffect(() => {
    const scanTheBlockchain = async (): Promise<void> => {
      const results = await scanBlockchain(address, 1000)
      setNFTList(results)
      setIsLoading(false)
    }
    scanTheBlockchain().catch(console.error)
  }, [address])
  return (
    <div className="NFTGallery">
      { (address !== '') && isLoading && <RingLoader/> }
      {
        nftList.map((props) => {
          return (
            <Card {...props} key={`${props.transactionHash}-${props.fromAddress}-${props.token}`}/>
          )
        })
      }
      {
        nftList.length === 0 && (address !== '') && !isLoading ? <h2>No NFTs found</h2> : ''
      }
    </div>
  )
}
export default NFTGallery
