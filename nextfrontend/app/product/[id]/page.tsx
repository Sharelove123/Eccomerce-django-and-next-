'use client'

import SimpleSnackbar from '@/app/components/snackbar';
import apiService from '@/app/services/apiService';
import { Product } from '@/app/utils/types';
import { Button, Rating, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setselectedImage] = useState<string>('');
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = useState('');

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClick = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await apiService.getWithoutToken(`/api/core/getproduct/${id}`);
                    setProduct(response);
                    setselectedImage(response.imagelist.img1)
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };

            fetchProduct();
        }
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }


    const addToCart = (product: Product) => {
        const serializableProduct = {
            product: {
                id: product.id,
                category: product.category,
                title: product.title,
                rateing: product.rateing,
                price: product.orginalPrice,
                discountedPrice: product.discountedPrice,
                discount: product.get_discount_percentage,
                discription: product.discription,
                imagelist: product.imagelist,
            },
            quantity: 1
        };
        // Get the existing cart from local storage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        console.log(`cart items are this ${existingCart}`)
        // Check if the product is already in the cart
        const productIndex = existingCart.findIndex((item: any) => item.product.id === serializableProduct.product.id);
        console.log(`productIndex:${productIndex}`);
        if (productIndex !== -1) {
            // If the product is already in the cart, increment its quantity
            existingCart[productIndex].quantity += 1;
            setMsg('Product already in cart, quantity incremented');
        } else {
            // If the product is not in the cart, add it with an initial quantity of 1
            existingCart.push({ ...serializableProduct });
            setMsg('Product added to cart');
        }

        const cart = JSON.stringify(existingCart);
        console.log(cart);
        // Save the updated cart to local storage
        localStorage.setItem('cart', cart);
        handleClick();
        console.log('Product added to cart:', serializableProduct);
    };

    return (
        <div className='flex flex-col w-full mt-20 md:flex-row justify-start items-stretch p-0 gap-0'>
            <div className='hidden md:flex flex-col w-1/12 h-[360px] mr-0 ml-4 space-y-4' >
                {
                    Array.from({ length: 4 }).map((_, index: number) => (
                        <div key={index} className='mr-0 mb-0 outline-4 rounded-lg outline-cyan-400 bg-neutral-200 w-[80px] h-full p-1 cursor-pointer '>
                            {index === 0 ? (
                                <img className='w-full h-full' src={product.imagelist.img1} alt='product_img' onClick={()=>{setselectedImage(product.imagelist.img1)}} />
                            ) : index === 1 ? (
                                <img className='w-full h-full' src={product.imagelist.img2} alt='product_img' onClick={()=>{setselectedImage(product.imagelist.img2)}}/>
                            ) : index === 2 ? (
                                <img className='w-full h-full' src={product.imagelist.img3} alt='product_img' onClick={()=>{setselectedImage(product.imagelist.img3)}}/>
                            ) : (
                                <img className='w-full h-full' src={product.imagelist.img4} alt='product_img' onClick={()=>{setselectedImage(product.imagelist.img4)}}/>
                            )}
                        </div>
                    ))
                }
            </div>
            <div className='flex ml-4 mt-3 w-11/12 h-[320px]  md:w-4/12 md:h-[360px] md:ml-4 md:mt-0 mb-2 outline-4 rounded-lg bg-neutral-200 justify-center items-center'>
                <img className='w-full  ml-0' src={selectedImage}></img>
            </div>
            <div className='flex flex-row justify-center items-center w-full h-[90px] mr-0 ml-0 space-x-2 md:hidden' >
                {
                    Array.from({ length: 4 }).map((_, index: number) => (
                        <div key={index} className='mr-0 mb-0 outline-4 rounded-lg outline-cyan-400 bg-neutral-200 w-[80px] h-full p-1 cursor-pointer'>

                            {index === 0 ? (
                                <img className='w-full h-full' src={product.imagelist.img1} alt='product_img' />
                            ) : index === 1 ? (
                                <img className='w-full h-full' src={product.imagelist.img2} alt='product_img' />
                            ) : index === 2 ? (
                                <img className='w-full h-full' src={product.imagelist.img3} alt='product_img' />
                            ) : (
                                <img className='w-full h-full' src={product.imagelist.img4} alt='product_img' />
                            )}
                        </div>
                    ))
                }
            </div>
            <div className='flex flex-col space-y-2 ml-3 mt-4 w-full md:mt-0  md:ml-6 md:w-5/12 '>
                <Typography fontSize={14} color='brown'>{product.category.name}</Typography>
                <Typography fontSize={20} color='black'>{product.title}</Typography>
                <div className='flex flex-row space-x-4 h-[40px]'>
                    <h4 style={{ fontSize: 18, color: 'brown' }} className='flex items-end line-through decoration-3 decoration-black text-orange-950 '>${product.orginalPrice}00.00</h4>
                    <div className='flex flex-row'>
                        <h2 style={{ fontSize: 27, color: 'black', fontWeight: 25 }} className='flex items-start '>${product.discountedPrice}00.00</h2>
                        <div className='flex justify-center  items-center  rounded-xl w-10 h-[22px] bg-black text-white'>{product.get_discount_percentage}%</div>
                    </div>
                </div>
                <Rating style={{ color: 'black' }} name="half-rating-read" defaultValue={2.5} precision={0.5} value={product.rateing} readOnly />
                <div className='flex flex-col space-y-1'>
                    <Typography fontSize={15} color='black'>Description</Typography>
                    <div className='col'>
                        <p className={`m-0 p-0 text-pretty leading-normal text-gray-800 ${isExpanded ? "line-clamp-none" : "overflow-hidden line-clamp-5"
                            }`} style={{ color: 'brown' }}>
                            {product.discription}
                        </p>
                        <button
                            onClick={toggleExpand}
                            className="mt-0 text-blue-500 "
                        >
                            {isExpanded ? "Less" : "More"}
                        </button>
                    </div>
                </div>
                <div className='flex justify-evenly'>
                    <Button onClick={() => addToCart(product)} sx={{ bCartRadius: 5, width: 150 }} className='bg-neutral-200'>
                        Add To Cart
                    </Button>
                    <Button sx={{ bCartRadius: 5, width: 150 }} className='bg-black text-white'>
                        Checkout Now
                    </Button>
                </div>
            </div>
            <SimpleSnackbar open={open} setOpen={setOpen} msg = {msg}/>
        </div>
    )
}
