'use client'

import AddressChoice from '@/app/components/cart/addressChoice'
import CartProductList from '@/app/components/cart/cartProductList'
import Summary from '@/app/components/cart/summary'
import React, { useEffect, useState } from 'react'
import { CartItem } from '../utils/types';

export default function Cart() {
  const [selectedAddress, setSelectedAddress] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState(0);

  const handleCartChange = () => {
    const storedCartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalAmount = storedCartItems.reduce((acc: number, item: CartItem) => {
      return acc + ((item.product.discountedPrice) || 0) * Number(item.quantity);
    }, 0);
    setTotalPrice(totalAmount);
  }

  useEffect(()=>{
    handleCartChange();
  },[])

  useEffect(()=>{
    const selectedAddress = parseInt(localStorage.getItem('selectedAddress') || '0');
    setSelectedAddress(selectedAddress);
  },[selectedAddress])


  return (
    <div className='flex flex-col mt-16'>
      <div className='flex flex-col mt-4 ml-8 mr-8 space-y-2 items-center justify-center overflow-scroll md:flex-row'>
        <CartProductList onCartChange={handleCartChange} />
        <Summary totalPrice={totalPrice} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} onCartChange={handleCartChange}/>
        
      </div>
      <div className='flex flex-row mt-1 ml-8 mr-1 space-y-2'>
        <AddressChoice selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}/>
      </div>
    </div>
  )
}