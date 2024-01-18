/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
//import '../../App.css'
import { nftmarketaddress } from './config'
import NFT_MarketPlace from './artifacts/contracts/NFT_MarketPlace.sol/NFT_MarketPlace.json'
import Button from 'react-bootstrap/Button';

import Cards from '../../Components/Cards'
//import Categories from './pages/Categories'

let nfti;

function g(x){
  nfti=x;
}

function Index_Home() {
   const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    try {
      /* create a generic provider and query for unsold market items */
      const provider = new ethers.providers.JsonRpcProvider()
      const tokenContract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, provider)
      const data = await tokenContract.fetchMarketItems()
  
      const items = await Promise.all(data.map(async i => {
        try {
          const tokenUri = await tokenContract.uri(i.tokenId.toNumber())
          const meta = await axios.get(`https://nftstorage.link/ipfs/${tokenUri.split("//")[1]}`)
          console.log(meta);
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            
            image: `https://nftstorage.link/ipfs/${meta.data.image.split('//')[1]}`,
            name: meta.data.name,
            description: meta.data.description,
            categories: meta.data.properties.categories
          };
          return item;
        } catch (error) {
          console.error("Error fetching data for tokenId", i.tokenId.toNumber(), ":", error);
          // Handle specific error or decide how to handle this error
          return null; // or any other placeholder value
        }
      }));
  
      // Filter out null values from the array (items with errors)
      const filteredItems = items.filter(item => item !== null);
  
      console.log(filteredItems);
      setNfts(filteredItems);
      setLoadingState('loaded');
    } catch (error) {
      console.error("Error loading NFTs:", error);
      // Handle the main error, such as setting an error state
    }
  }
  


 
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    // console.log(price)
    // console.log(nfts)
    const transaction = await contract.createMarketSale(nft.tokenId, 1, { value: price })
    // console.log(transaction)
    //await transaction.wait()
    loadNFTs()
  }
  g(nfts);
  console.log(nfti);
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
   


      <>
       <Cards nfti={nfts} heading="Check out these EPIC NFTs!" />
        
      </>
    
    //   <div className="flip-card">
    //   <div className="flip-card-inner">
    //     <div className="flip-card-front">
    //       <img src={nft.image}  style={{width:'300px',height:'300px'}}/>
    //     </div>
    //     <div className="flip-card-back">
    //       <h1 className='Title'>{nft.name}</h1> 
    //       <p>{nft.description}</p> 
    //       <Button variant="btn btn-primary" className='button' onClick={() => buyNft(nft)}>Buy</Button>
    //     </div>
    //   </div>
    // </div>


      
      // <Card style={{ width: '18rem' ,height:'80%' }} classNameName='main-card'>
      //   <Card.Img className='image' variant="top" src={nft.image} style={{ width:'100%' ,height:'50%'}} />
      //   <Card.Body className='body'>
      //     <Card.Title className='title' ><h3>{nft.name}</h3></Card.Title>
      //     <Card.Text className='text'>  {nft.description}</Card.Text>
      //     <Button variant="outline-success" className='button' onClick={() => buyNft(nft)}>Buy</Button>
      //   </Card.Body>
      // </Card>




      // <div className="flex justify-center"  >
      //   <div className="px-4" style={{ maxWidth: '600px'}}>
      //   <div  className="card" style={{width: '80%',height:'600px',display:'grid',gridTemplateColumns:'auto auto auto' ,margin:'10px  0px 0px 10px'}}>
      //       {
      //         nfts.map((nft, i) => (
      //           <div key={i} className="border shadow rounded-xl overflow-hidden"  >
      //             <img src={nft.image} width="400px" height="250px" />
      //             <div className="p-4">
      //               <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
      //               <div style={{ height: '70px', overflow: 'hidden' }}>
      //                 <p className="text-gray-400">{nft.description}</p>
      //               </div>
      //             </div>
      //             <div className="p-4 bg-black">
      //               <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
      //               <button className="btn btn-primary" onClick={() => buyNft(nft)}>Buy</button>
      //               {/* <button className="btn btn-primary">Buy</button> */}
      //             </div>
      //           </div>
      //         ))
      //       }
      //     </div>
      //   </div>
      // </div>
      
  )
}
export {nfti};
export default Index_Home;