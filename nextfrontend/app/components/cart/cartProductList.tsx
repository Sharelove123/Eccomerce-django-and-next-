'use client'
import * as React from 'react';
import Accordion, {
    AccordionSlots,
    accordionClasses,
} from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, {
    accordionDetailsClasses,
} from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import { Bungee, Lilita_One } from 'next/font/google';
import { Radio } from '@mui/material';
import { SouthAmericaOutlined } from '@mui/icons-material';
import ProductCard from './productCard';
import { CartItem, Product } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import SimpleSnackbar from '../snackbar';


const bunjee = Bungee({ weight: '400', subsets: ['latin'] });
const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });

interface CartProductListProps {
    onCartChange: () => void;
}

const CartProductList: React.FC<CartProductListProps> = ({ onCartChange }) => {
    const [expanded, setExpanded] = React.useState(false);
    const handleExpansion = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = useState('');
    const handleClick = () => {
        setOpen(true);
    };


    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(storedCartItems);
    }, []);

    const removeFromCart = (productId: number) => {
        // Get the existing cart from local storage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        // Filter out the item with the matching product ID
        const updatedCart = existingCart.filter((item: any) => item.product.id !== productId);
        // Save the updated cart to local storage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log('Product removed from cart:', productId);
        setCartItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
        onCartChange();
        setMsg('Product removed from cart');
        handleClick();
    };

    const updateCart = (productId: number, incdecinfo: String) => {
        // Get the existing cart from local storage
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        // Find the index of the product in the cart
        const productIndex = existingCart.findIndex((item: any) => item.product.id === productId);

        if (productIndex !== -1) {
            if (incdecinfo == 'increment') {
                // Update the quantity of the product
                existingCart[productIndex].quantity = existingCart[productIndex].quantity+1;
            }else{
                existingCart[productIndex].quantity = existingCart[productIndex].quantity - 1;
            }
            // Save the updated cart to local storage
            localStorage.setItem('cart', JSON.stringify(existingCart));
            console.log('Cart updated:', existingCart);
        }
        onCartChange();
        setMsg('Cart updated');
        handleClick();
    };


    return (
        <div className='w-5/6 mr-4'>
            <div className='flex flex-row space-x-6 justify-between'>
                <div className='flex flex-row space-x-6'>
                    <Typography className={`${bunjee.className} bCart-2 rounded-lg w-8 flex justify-center items-center `}>1</Typography>
                    <Typography className={`${lilita_One.className} flex justify-center items-center `}>Review product 's set</Typography>
                </div>
                <Typography className={`${lilita_One.className} flex justify-center items-center justify-self-end text-red-500`}>message seller</Typography>
            </div>
            <Accordion
                expanded={expanded}
                onChange={handleExpansion}
                slots={{ transition: Fade as AccordionSlots['transition'] }}
                slotProps={{ transition: { timeout: 400 } }}
                sx={[
                    expanded
                        ? {
                            [`& .${accordionClasses.region}`]: {
                                height: 'auto',
                            },
                            [`& .${accordionDetailsClasses.root}`]: {
                                display: 'block',
                            },
                        }
                        : {
                            [`& .${accordionClasses.region}`]: {
                                height: 0,
                            },
                            [`& .${accordionDetailsClasses.root}`]: {
                                display: 'none',
                            },
                        },
                ]}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    style={{ minHeight: '6px' }}
                    className='bg-blue-100'
                >
                    <div className='flex row bg-transparent space-x-1 h-[5px] justify-self-center justify-center items-center'>
                        <Radio defaultChecked style={{ height: '2px', minHeight: '4px' }} />
                        <Typography className={lilita_One.className}> Ashutosh jarelia</Typography>
                        <SouthAmericaOutlined />
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        cartItems.map((item: CartItem, index: number) => {
                            
                            return <ProductCard key={index} cartItem={item} removeFromCart={removeFromCart} updateCart={updateCart} />
                        })
                    }
                </AccordionDetails>
            </Accordion>
            <SimpleSnackbar open={open} setOpen={setOpen} msg = {msg}/>
        </div>
    );
}

export default CartProductList;