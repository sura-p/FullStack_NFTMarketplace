import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import '../App.css'
import { nftmarketaddress } from '../components/templates/config'
import NFT_MarketPlace from '../components/templates/artifacts/contracts/NFT_MarketPlace.sol/NFT_MarketPlace.json'
import Button from 'react-bootstrap/Button';



function FilterCard(props) {


    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    
    useEffect(() => {
      loadNFTs()
    }, [])
    async function loadNFTs() {
      /* create a generic provider and query for unsold market items */
      // const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/04132d4001834221a021b8e2eac7766c")
      const provider = new ethers.providers.JsonRpcProvider()
  
      //await window.ethereum.request({ method: 'eth_requestAccounts' })
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      //const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, provider)
      // console.log(tokenContract)
      const data = await tokenContract.fetchMarketItems()
      // console.log(data)
      // let meta ;
      /*
      *  map over items returned from smart contract and format 
      *  them as well as fetch their token metadata
      */
      const items = await Promise.all(data.map(async i => {
        console.log(i.tokenId.toNumber())
        console.log(i.seller)
        console.log(i.owner)
        console.log(i.seller)
        console.log(i.image)
        const tokenUri = await tokenContract.uri(i.tokenId.toNumber())
        console.log(tokenUri)
  
        const meta = await axios.get(`https://nftstorage.link/ipfs/${tokenUri.split("//")[1]}`)
        console.log(meta)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: `https://nftstorage.link/ipfs/${meta.data.image.split('//')[1]}`,
          name: meta.data.name,
          description: meta.data.description,
          categories:meta.data.properties.categories
          //     amount:meta.data.amount
        }
        return item
      }))
      setNfts(items)
     
      setLoadingState('loaded')
    }



      console.log(nfts);
 
  
  let flag = `${props.flag}`;
  
  let categories = props.filter;
  let filteredNFTS =[{}];
  // if(flag!="false"){
    nfts.map((nft,i)=>{
          if(nft.categories==categories)
          filteredNFTS =nft;
      }
      )
  // }
  console.log(filteredNFTS);

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className='cards'>
      <h1>{props.heading}</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <div className='cards__item'>
            {
              
             nfts.map((nfts,i)=>{
               if (nfts.categories==props.categories) {
                 
               
               return(<CardItem
                src={nfts.image}
                text={nfts.description}
                label={nfts.price}
                path='/services'
              />)
              
             }}
               
               
                    

              )
              
            }
           
            
          </div>
          

          
        </div>
      </div>
    </div>
  );
}

export default FilterCard;