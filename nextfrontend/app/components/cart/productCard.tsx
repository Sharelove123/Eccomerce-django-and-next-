'use client'

import { CartItem, Product } from '@/app/utils/types';
import { Delete } from '@mui/icons-material';
import { Box, Button, Icon, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Bungee, Lilita_One } from "next/font/google";

const bunjee = Bungee({ weight: '400', subsets: ['latin'] });
const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });


interface cartItemProps {
    cartItem: CartItem;
    removeFromCart: (productId: number) => void;
    updateCart: (productId: number, incdecinfo: String) => void;
}

const ProductCard: React.FC<cartItemProps> = ({ cartItem, removeFromCart, updateCart }) => {
    const [productQuantity, setproductQuantity] = React.useState<number>(1);

    useEffect(() => {
        setproductQuantity(Number(cartItem.quantity));
    }, [])

    const image = cartItem.product.imagelist.img1;


    return (
        <div className='flex flex-row h[35px] items-center justify-between'>
            <div className='flex flex-row h-full space-x-1 justify-center items-center'>
                <img className='h-[35px] rounded-md' src={image}></img>
                <Typography className={`${lilita_One.className} underline text-rose-500`}>{cartItem.product.title}</Typography>
            </div>
            <Box
                sx={{
                    display: 'flex',
                    padding: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    '& > *': {
                        m: 0,
                    },
                }}
            >
                <Button variant='text' onClick={() => {
                    if (productQuantity != 1) {
                        setproductQuantity(productQuantity - 1);
                        updateCart(cartItem.product.id, 'decrement');
                    }
                }}>
                    -
                </Button>
                <Typography>
                    {productQuantity}
                </Typography>
                <Button variant='text' onClick={() => {
                    setproductQuantity(productQuantity + 1);
                    updateCart(cartItem.product.id, 'increment');
                }}>
                    +
                </Button>
            </Box>
            <Typography className='ml-20'>${cartItem.product.discountedPrice}</Typography>
            <Typography className='ml-8'>${cartItem.product.discountedPrice ? cartItem.product.discountedPrice * productQuantity : 0}</Typography>
            <IconButton className='ml-10' onClick={() => { removeFromCart(cartItem.product.id) }}>
                <Icon className='flex items-center justify-center'>
                    <Delete color='warning' />
                </Icon>
            </IconButton>
        </div>

    )
}

export default ProductCard;
