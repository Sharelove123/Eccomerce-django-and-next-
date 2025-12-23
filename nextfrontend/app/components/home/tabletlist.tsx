'use client'

import apiService from "@/app/services/apiService";
import { Typography, Button } from "@mui/material";
import { Lilita_One } from "next/font/google";
import { useEffect, useState } from "react";
import { Product } from "@/app/utils/types";
import { useRouter } from 'next/navigation';

const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });

const TabletList = () => {
    const [tablets, settablets] = useState([]);
    const category = 'Tablet';
    const page = 1;
    const router = useRouter();

    useEffect(() => {
        const fetchTabletList = () => {
            apiService.getWithoutToken(`/api/core/category/${category}/?page=${page}`)
                .then(response => {
                    console.log(response);
                    settablets(response.results);
                })
                .catch(error => {
                    console.log('Error fetching tablet list:', error);
                });
        };

        fetchTabletList();
        console.log(tablets);
    }, []);
    return (
        <div className="flex flex-col mt-2 m-2 ">
            <div className="flex flex-row justify-between">
                <Typography color='info' fontSize={20} className={lilita_One.className}>tablets</Typography>
                <Button variant="outlined">see all</Button>
            </div>
            <div dir="ltr" className="w-full h-44 mt-2">
                <div className="space-x-4 overflow-x-scroll overflow-y-hidden snap-x snap-mandatory flex flex-row  w-full h-44">
                    {
                        tablets.map((product: Product, index: number) => {
                            return (
                                <div key={index} className="flex-shrink-0 snap-start w-84 h-46">
                                    <img src={product.imagelist.img1} className=" h-full object-contain cursor-pointer" onClick={()=>{
                                        router.push(`/product/${product.id}`);
                                    }} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default TabletList;