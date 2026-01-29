'use client';
import apiService from "@/app/services/apiService";
import { Address } from "@/app/utils/types";
import { useEffect, useState } from "react";
import React from "react";
import SimpleSnackbar from "../snackbar";
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ['latin'] });

interface AddressChoiceProps {
    onAddressSelect: (id: number) => void;
}

const AddressChoice: React.FC<AddressChoiceProps> = ({ onAddressSelect }) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form States
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [msg, setMsg] = useState('');

    const handleSnackbarClick = () => {
        setOpenSnackbar(true);
    };

    const fetchAddresses = async () => {
        try {
            const response = await apiService.get('/api/cart/addresses/');
            const addressList = Array.isArray(response) ? response : response.results || [];

            setAddresses(addressList);

            // Check for saved selection
            const savedAddressId = parseInt(localStorage.getItem('selectedAddress') || '0');
            if (savedAddressId && addressList.some((addr: Address) => addr.id === savedAddressId)) {
                setSelectedAddressId(savedAddressId);
                onAddressSelect(savedAddressId);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setAddresses([]);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSelect = (id: number) => {
        setSelectedAddressId(id);
        onAddressSelect(id);
        localStorage.setItem('selectedAddress', id.toString());
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('apartment_number', apartmentNumber);
        formData.append('street_name', streetAddress);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('postal_code', postalCode);
        formData.append('country', country);

        try {
            const response = await apiService.post('/api/cart/addresses/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response && !response.error) {
                setMsg("ADDRESS RECORDED");
                handleSnackbarClick();
                setIsModalOpen(false);
                fetchAddresses(); // Refresh list

                // Clear form
                setApartmentNumber('');
                setStreetAddress('');
                setCity('');
                setState('');
                setPostalCode('');
                setCountry('');
            } else {
                setMsg(response.error || "RECORDING FAILED");
                handleSnackbarClick();
            }
        } catch (error) {
            console.error('Error adding address:', error);
            setMsg("SYSTEM ERROR");
            handleSnackbarClick();
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-end justify-between mb-8 border-b-2 border-dashed border-gray-300 pb-2">
                <h3 className="text-xl font-bold uppercase tracking-widest text-black">Available Locations</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white px-3 py-1 border border-black transition-colors"
                >
                    + New Entry
                </button>
            </div>

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        onClick={() => handleSelect(address.id)}
                        className={`cursor-pointer p-6 border-2 transition-all relative group ${selectedAddressId === address.id
                            ? 'border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]'
                            : 'border-black bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                    >
                        {selectedAddressId === address.id && (
                            <div className="absolute top-0 right-0 bg-white text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                                Selected
                            </div>
                        )}

                        <div className={`space-y-1 font-mono text-sm ${selectedAddressId === address.id ? 'text-gray-300' : 'text-gray-600'}`}>
                            <p className={`font-bold uppercase tracking-wider text-base mb-2 ${selectedAddressId === address.id ? 'text-white' : 'text-black'}`}>
                                {address.apartment_number} {address.street_name}
                            </p>
                            <p>
                                {address.city}, {address.state}
                            </p>
                            <p>
                                {address.postal_code}
                            </p>
                            <p className="uppercase text-xs font-bold pt-2 tracking-widest opacity-70">
                                {address.country}
                            </p>
                        </div>
                    </div>
                ))}

                {addresses.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-300 text-gray-400 font-mono text-sm uppercase">
                        // No locations found in database
                    </div>
                )}
            </div>

            {/* Modal - Brutalist */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-grayscale">
                    <div className="bg-white w-full max-w-lg border-2 border-black shadow-[16px_16px_0px_0px_rgba(50,50,50,1)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b-2 border-black flex justify-between items-center bg-gray-50">
                            <h2 className={`text-2xl font-black uppercase tracking-tight ${mono.className}`}>New Entry</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-black hover:bg-black hover:text-white border border-black w-8 h-8 flex items-center justify-center font-bold"
                            >
                                X
                            </button>
                        </div>

                        <form onSubmit={handleAddAddress} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Apt / Unit</label>
                                        <input
                                            type="text"
                                            value={apartmentNumber}
                                            onChange={(e) => setApartmentNumber(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-black outline-none font-mono text-sm transition-colors rounded-none"
                                            placeholder="101"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Street</label>
                                        <input
                                            type="text"
                                            value={streetAddress}
                                            onChange={(e) => setStreetAddress(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-black outline-none font-mono text-sm transition-colors rounded-none"
                                            placeholder="Main St"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-black outline-none font-mono text-sm transition-colors rounded-none"
                                            placeholder="NY"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">State</label>
                                        <input
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-black outline-none font-mono text-sm transition-colors rounded-none"
                                            placeholder="NY"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Zip Code</label>
                                        <input
                                            type="text"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-black outline-none font-mono text-sm transition-colors rounded-none"
                                            placeholder="10001"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Country</label>
                                        <input
                                            type="text"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-black outline-none font-mono text-sm transition-colors rounded-none"
                                            placeholder="USA"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                Confirm_Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <SimpleSnackbar open={openSnackbar} setOpen={setOpenSnackbar} msg={msg} />
        </div>
    );
}

export default AddressChoice;