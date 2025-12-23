'use client';

import { Address, CartItem } from "@/app/utils/types";
import { SouthAmericaOutlined } from "@mui/icons-material";
import { Accordion, accordionClasses, AccordionDetails, accordionDetailsClasses, AccordionSlots, AccordionSummary, Button, Fade, Radio, Typography } from "@mui/material"
import { Bungee, Lilita_One } from "next/font/google";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import ProductCard from "./productCard";
import React from "react";
import apiService from "@/app/services/apiService";
import { useRouter } from "next/navigation";
import { getUserId } from "@/app/lib/actions";
import SimpleSnackbar from "../snackbar";
import PayPalButton from "../payment/paypalbutton";

const bunjee = Bungee({ weight: '400', subsets: ['latin'] });
const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });

interface totalPriceProp {
    totalPrice: number,
    selectedAddress: number | null;
    setSelectedAddress: (id: number) => void;
    onCartChange: () => void;
}
const Summary: React.FC<totalPriceProp> = ({ totalPrice, selectedAddress, setSelectedAddress,onCartChange }) => {
    const [expanded, setExpanded] = React.useState(false);
    const handleExpansion = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };
    const [expanded1, setExpanded1] = React.useState(false);
    const handleExpansion1 = () => {
        setExpanded1((prevExpanded) => !prevExpanded);
    };
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [msg, setMsg] = useState('order created sucessfully');
    const [open, setOpen] = React.useState(false);
    const [orderId, setOrderId] = React.useState(36);

    useEffect(() => {
        handleClick();
    })

    const handleClick = () => {
        setOpen(true);
    };
    const router = useRouter();

    const [errors, setErrors]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);

    const logFormData = (formData: FormData) => {
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
    };

    const submitOrder = async (details: any) => {
        const formData = new FormData();
        const userId = await getUserId();
        if (!userId) {
            setErrors((prevErrors) => [...prevErrors, 'User ID is null']);
            return;
        }

        formData.append('user', userId.toString());

        if (!selectedAddress) {
            setErrors((prevErrors) => [...prevErrors, 'Select Shipping Address']);
            return;
        }

        formData.append('address', selectedAddress.toString());
        formData.append('paid', 'True');

        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const orderItems = cartItems.map((item: CartItem) => ({
            product: item.product.id,
            quantity: item.quantity,
        }));

        formData.append('order_items', JSON.stringify(orderItems));

        try {
            const response = await apiService.post('/api/cart/createorder/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.message);
            if (response.status === 'success') {
                localStorage.removeItem('cart');
                setMsg(response.message);
                handleClick();
                onCartChange();
                setOrderId(response.order_id);
            }
            if (response.status === 'failed') {
                setMsg(response.message);
                handleClick();
                router.refresh();
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handlePaymentSuccess = async (details: any) => {
        console.log('Payment successful:', details);
        await submitOrder(details);
        setMsg('Payment Successful');
        localStorage.removeItem('cart');
        handleClick();
        onCartChange();
    };



    const getAddressDetail = async (addressId: number) => {
        if (!isNaN(addressId)) {
            const result = await apiService.get(`/api/cart/addresses/${addressId}/`);
            return result;
        } else {
            return 0
        }
    }

    useEffect(() => {
        const fetchAddressDetail = async () => {
            const addressId = parseInt(localStorage.getItem('selectedAddress') || 'null');
            const addressDetail: Address = await getAddressDetail(addressId);
            setApartmentNumber(addressDetail.apartment_number);
            setStreetAddress(addressDetail.street_name);
            setCity(addressDetail.city);
            setState(addressDetail.state);
            setPostalCode(addressDetail.postal_code);
            setCountry(addressDetail.country);
        };
        fetchAddressDetail();
    }, [selectedAddress])



    return (
        
        <div className="flex flex-col justify-start shadow-md rounded-md bg-white md:w-1/6">
            {errors.length > 0 && (
                <div>
                    {errors.map((error, index) => (
                        <p key={index} style={{ color: 'red' }}>{error}</p>
                    ))}
                </div>
            )}
            <Typography className={`${bunjee.className} text-black`}>Cart Summary</Typography>
            <div className="flex flex-row items-center justify-around">
                <Typography className={`${lilita_One.className} text-black`}>Total</Typography>
                <Typography className={`${lilita_One.className} text-black`}>{totalPrice}</Typography>
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
                    className='bg-blue-100 mt-6'
                >
                    <div className='flex row bg-transparent space-x-1 h-[5px] justify-self-start justify-start items-center'>
                        <Typography className={lilita_One.className}>Shipping Address</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center">
                            <Typography>
                                ApartmentNumber:
                            </Typography>
                            <Typography>
                                {apartmentNumber}
                            </Typography>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <Typography>
                                Street Name:
                            </Typography>
                            <Typography>
                                {streetAddress}
                            </Typography>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <Typography>
                                City:
                            </Typography>
                            <Typography>
                                {city}
                            </Typography>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <Typography>
                                state:
                            </Typography>
                            <Typography>
                                {state}
                            </Typography>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <Typography>
                                postal code:
                            </Typography>
                            <Typography>
                                {postalCode}
                            </Typography>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <Typography>
                                country:
                            </Typography>
                            <Typography>
                                {country}
                            </Typography>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expanded1}
                onChange={handleExpansion1}
                slots={{ transition: Fade as AccordionSlots['transition'] }}
                slotProps={{ transition: { timeout: 400 } }}
                sx={[
                    expanded1
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
                    className='bg-blue-100 mt-6'
                >
                    <div className='flex row bg-transparent space-x-1 h-[5px] justify-self-start justify-start items-center'>
                        <Typography className={lilita_One.className}>Payment Method</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="flex flex-col">
                        <div>
                            <PayPalButton totalPrice={totalPrice} onSuccess={handlePaymentSuccess}/>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
            <SimpleSnackbar open={open} setOpen={setOpen} msg = {msg}/>
        </div>
    )
}

export default Summary;