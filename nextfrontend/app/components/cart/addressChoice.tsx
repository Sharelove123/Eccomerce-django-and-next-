'use client';
import { getUserId } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";
import { Address } from "@/app/utils/types";
import { Delete, Edit } from "@mui/icons-material";
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, TextField, Typography } from "@mui/material";
import { Bungee, Lilita_One } from "next/font/google";
import React, { useEffect, useState } from "react";
import SimpleSnackbar from "../snackbar";

const bunjee = Bungee({ weight: '400', subsets: ['latin'] });
const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });


interface AddressChoiceProps {
    selectedAddress: number | null;
    setSelectedAddress: (id: number) => void;
}

const AddressChoice: React.FC<AddressChoiceProps> = ({ selectedAddress, setSelectedAddress }) => {
    const [open, setOpen] = React.useState(false);
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showAddressDeletionAlert, setShowAddressDeletionAlert] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);


    const fetchAddresses = async () => {
        try {
            const result = await apiService.get('/api/cart/addresses/');
            setAddresses(result);
        } catch (error) {
            console.log('Error fetching addresses:', error);
        }
    };

    const deleteAddress = async (id: Number) => {
        try {
            const result = await apiService.delete(`/api/cart/addresses/${id}/`);
            setShowAddressDeletionAlert(true);
        } catch (error) {
            console.log('Error fetching addresses:', error);
        }
    };


    useEffect(() => {
        fetchAddresses();
        const selectedAddress = parseInt(localStorage.getItem('selectedAddress') || '0');
        setSelectedAddress(selectedAddress);
    }, []);

    useEffect(() => {
        if (showSuccessAlert) {
            fetchAddresses();
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    useEffect(() => {
        if (showAddressDeletionAlert) {
            fetchAddresses();
            const timer = setTimeout(() => {
                setShowAddressDeletionAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showAddressDeletionAlert]);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = await getUserId();
        console.log(userId);

        const formdata = new FormData();
        if (userId) {
            formdata.append('user', userId);
        } else {
            console.error('User ID is null');
        }
        formdata.append('country', country);
        formdata.append('state', state);
        formdata.append('city', city);
        formdata.append('street_name', streetAddress);
        formdata.append('apartment_number', apartmentNumber);
        formdata.append('postal_code', postalCode);
        formdata.append('country', country);

        try {
            const response = await apiService.post('/api/cart/addresses/', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
            console.log('Address created:', response);
            setShowSuccessAlert(true);
            // Add any additional logic here, such as updating the UI or state
        } catch (error) {
            console.log('Error creating address:', error);
        }
        // Add your form submission logic here
        handleClose();
    };

    return (
        <div className="flex flex-col w-5/6 mt-1">
            <div className='flex flex-row space-x-6 justify-normal'>
                <div className='flex flex-row space-x-6'>
                    <Typography className={`${bunjee.className} border-2 rounded-lg w-8 flex justify-center items-center `}>2</Typography>
                    <Typography className={`${lilita_One.className} flex justify-center items-center `}>Select Shipping Address</Typography>
                </div>
                <Button variant="text" color="warning" startIcon={<Edit />} onClick={handleClickOpen}>
                    Add Address
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: handleSubmit
                    }}
                >
                    <DialogTitle>Add Address</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter your shipping address below. This information will be used to deliver your Cart.
                        </DialogContentText>
                        <div className="flex flex-col mt-6 space-y-6">

                            <TextField
                                label="Apartment Number"
                                name="apartment_number"
                                value={apartmentNumber}
                                onChange={(e) => setApartmentNumber(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Street Address"
                                name="street_address"
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="City"
                                name="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="State"
                                name="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Postal Code"
                                name="postal_code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Country"
                                name="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                fullWidth
                            />
                        </div>
                    </DialogContent>
                    <DialogActions sx={{ justifyItems: 'center', justifyContent: 'space-around' }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </Dialog>
            </div>

            {showSuccessAlert && (
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Address created successfully!!!!
                </Alert>
            )}

            {showAddressDeletionAlert && (
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Address deleted successfully!!!!
                </Alert>
            )}

            <div className="flex  items-center justify-center md:flex flex-wrap space-x-2 space-y-2">


                {addresses.map((address, index) => (
                    <div
                        key={index}
                        className={`h-fit w-[220px] cursor-pointer rounded-2xl p-2 ${selectedAddress === address.id ? 'border-4 border-black' : 'opacity-0.1'}`} onClick={()=>{
                            localStorage.setItem('selectedAddress',String(address.id));
                            setSelectedAddress(address.id);
                        }}
                    >
                        <center>
                            <p className="break-words text-center">
                                {address.apartment_number}, {address.street_name}, {address.city}, {address.state}, {address.postal_code}, {address.country}
                            </p>
                        </center>
                        <center>
                            <IconButton aria-label="delete" color="warning" onClick={() => deleteAddress(address.id)}>
                                <Delete />
                            </IconButton>
                        </center>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddressChoice;