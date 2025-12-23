import { Facebook, Instagram, Twitter, WhatsApp, X } from '@mui/icons-material';
import { Button, Typography } from '@mui/material'
import { Bungee,Lilita_One } from 'next/font/google';
import React from 'react'

const bunjee = Bungee({ weight: '400', subsets: ['latin'] });
const lilita_One = Lilita_One({ weight: '400', subsets: ['latin'] });

export default function Fotter() {
  return (
    <footer className='grid grid-cols-1 mt-5  sm:grid-cols-3 justify-items-center md:grid-cols-4 '>
        <div className='mt-5 sm:mt-0'>
          <ol className={bunjee.className}>Contact Information</ol>
            <li style={{color:'red'}}  className={lilita_One.className}>+91111111111</li>
            <li style={{color:'red'}} className={lilita_One.className}>123@gmail.com</li>
            <li style={{color:'red'}} className={lilita_One.className}>new delhi India abcd</li>
        </div>
        <div className='flex flex-col justify-start items-start mt-5 sm:mt-0'>
          <Typography  className={bunjee.className}>Website detail</Typography>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            About Us
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            Contact Us
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            Career
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            Blog
          </Button>
        </div>
        <div className='flex flex-col justify-start items-start mt-5 sm:mt-0'>
          <Typography  className={bunjee.className}>Legal Links</Typography>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            Privacy Policy
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            Terms & Conditions
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            Cookie Policy
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple>
            Help Center / FAQs
          </Button>
        </div>
        <div className='flex flex-col justify-start items-start mt-5 sm:mt-0'>
          <Typography  className={bunjee.className}>Legal Links</Typography>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple endIcon={<Facebook/>}>
            Facebook
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple endIcon={<X/>}>
            X
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple endIcon={<Instagram/>} >
            Instagram
          </Button>
          <Button color='success' className={lilita_One.className} variant='text' disableRipple disableFocusRipple disableTouchRipple endIcon={<WhatsApp/>} >
            WhatsApp
          </Button>
        </div>
    </footer>
  )
}
