'use client'
import { Autocomplete, IconButton, ImageList, ImageListItem, ImageListItemBar, ListSubheader, TextField, Typography } from '@mui/material';
import { Bungee, Jaro, Lilita_One } from 'next/font/google';
import { useRouter, useSearchParams } from 'next/navigation';
import InfoIcon from '@mui/icons-material/Info';
import React, { useEffect, useState } from 'react'
import apiService from '../services/apiService';
import { Product } from '../utils/types';

const bunjee = Bungee({ weight: '400', subsets: ['latin'] });
const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });

export default function Category() {
    const categoryNameParam = useSearchParams();
    const categoyNameParam = categoryNameParam.get('name');
    const [categoryName, setCategoryName] = React.useState<string | null>('All');
    const [listData, setListData] = React.useState<Product[]|[]>([]);

    const page = 1;
    const router = useRouter();

    useEffect(() => {
        const fetchWatchList = () => {
            apiService.getWithoutToken(`/api/core/category/${categoryName}/?page=${page}`)
                .then(response => {
                    console.log(response);
                    setListData(response.results);
                })
                .catch(error => {
                    console.error('Error fetching watch list:', error);
                });
        };

        fetchWatchList();
        console.log(listData);
    }, [categoryName]);



    const items = [
        "All",
        "watch",
        "Laptop",
        "Desktop Computer",
        "Tablet",
        "Television",
        "Headphones",
        "Shirts",
        "Jeans",
        "Suits",
        "Leggings",
        "Sandals",
        "Shoes",
        "High Heels"
    ];


    return (
        <div className='flex flex-row w-full mt-20 bg-grey'>
            <div className='w-1/6 col ml-8 gap-3 mt-20 hidden md:block'>
                <ol className={`${bunjee.className}`}> Category
                    {
                        items.map((item, index) => {
                            return (
                                categoryName == item ?
                                    <li key={index} className={`${lilita_One.className} mt-1 text-black-500 cursor-pointer hover:text-black`} onClick={() => setCategoryName(item)}>{item}</li> :
                                    <li key={index} className={`${lilita_One.className} mt-1 text-red-500 cursor-pointer hover:text-black`} onClick={() => setCategoryName(item)}>{item}</li>
                            );
                        })
                    }
                </ol>
            </div>
            <div className='w-full col bg-green md:w-5/6'>
                <div className='w-full h-12 m-4 justify-center items-center md:hidden'>
                    <Autocomplete
                        disablePortal
                        options={items}
                        sx={{ width: '90%', height:40,}}
                        onChange={(event: any, newValue: string | null) => {
                            setCategoryName(newValue);
                          }}
                        value={'All'}
                        renderInput={(params) => <TextField {...params}/>}
                    />
                </div>
                <Typography marginTop={4} marginLeft={2} marginRight={2} className={`${bunjee.className}`}>{categoryName}</Typography>
                <ImageList sx={{ width: '90%', height: 450 ,marginTop:1,marginLeft:2,marginRight:2,}} variant="woven" cols={3} gap={8}>
                    {listData.map((item) => (
                        <ImageListItem key={item.id} onClick={()=>{
                            router.push(`product/${item.id}`);
                        }}>
                            <img
                                srcSet={`${item.imagelist.img1}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.imagelist.img2}?w=248&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                subtitle={item.category.name}
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                        aria-label={`info about ${item.title}`}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
        </div>
    )
}
