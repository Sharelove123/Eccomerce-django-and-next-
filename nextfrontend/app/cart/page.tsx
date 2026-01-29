'use client'

import AddressChoice from '@/app/components/cart/addressChoice'
import CartProductList from '@/app/components/cart/cartProductList'
import Summary from '@/app/components/cart/summary'
import React, { useEffect, useState } from 'react'
import { CartItem } from '../utils/types';
import { Abril_Fatface, Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ['latin'] });

export default function Cart() {
  const [selectedAddress, setSelectedAddress] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState(0);

  const handleCartChange = () => {
    const storedCartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalAmount = storedCartItems.reduce((acc: number, item: CartItem) => {
      const price = item.product.discountedPrice || item.product.orginalPrice || 0;
      return acc + (price * Number(item.quantity));
    }, 0);
    setTotalPrice(totalAmount);
  }

  useEffect(() => {
    handleCartChange();
    const savedAddress = parseInt(localStorage.getItem('selectedAddress') || '0');
    if (savedAddress) setSelectedAddress(savedAddress);
  }, [])

  const handleAddressSelect = (id: number) => {
    setSelectedAddress(id);
    localStorage.setItem('selectedAddress', id.toString());
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 overflow-x-hidden">

      {/* Brutalist Header */}
      <div className="container mx-auto px-4 md:px-0 mb-12 border-b-4 border-black pb-8">
        <h1 className={`${oswald.className} text-7xl md:text-9xl font-black uppercase text-black leading-none tracking-tighter`}>
          YOUR <br />
          <span className="text-white bg-black px-4 inline-block transform -rotate-1">SELECTION</span>
        </h1>
      </div>

      <div className="container mx-auto px-4 md:px-0">
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">

          {/* Vertical Divider Logic (Visual only) */}
          <div className="hidden lg:block absolute left-[60%] top-0 bottom-0 w-px bg-gray-200" />

          {/* Left Column: Cart Items & Address */}
          <div className="w-full lg:w-3/5 space-y-16">

            {/* Cart Items */}
            <section aria-label="Shopping Cart">
              <CartProductList onCartChange={handleCartChange} />
            </section>

            {/* Address Selection */}
            <section aria-label="Shipping Address" className="border-t-4 border-black pt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-black text-white font-bold text-xl">
                  02
                </div>
                <h2 className={`text-4xl font-bold uppercase tracking-tight text-black ${oswald.className}`}>
                  Shipping Details
                </h2>
              </div>
              <div className="pl-0 md:pl-16">
                <AddressChoice onAddressSelect={handleAddressSelect} />
              </div>
            </section>

          </div>

          {/* Right Column: Summary */}
          <Summary
            totalPrice={totalPrice}
            selectedAddress={selectedAddress}
            setSelectedAddress={handleAddressSelect}
            onCartChange={handleCartChange}
          />

        </div>
      </div>

      {/* Decorative Footer Element */}
      <div className="fixed bottom-4 left-4 font-mono text-[10px] text-gray-400 opacity-50 pointer-events-none hidden md:block">
        SECURE_CONNECTION :: ENCRYPTED
        <br />
        ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
      </div>
    </div>
  )
}