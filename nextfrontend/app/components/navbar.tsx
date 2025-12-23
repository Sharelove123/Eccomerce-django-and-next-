'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Button, Menu, MenuItem, MenuItemProps, Stack, styled } from '@mui/material';
import SwipeableTemporaryDrawer from './drawermoble';
import { useRouter } from 'next/navigation';
import { Bungee } from 'next/font/google';
import { resetAuthCookies } from '../lib/actions';

const bunjee = Bungee({ weight: '400', subsets: ['latin'] });

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement<{ elevation?: number }>;
  userId: string | null;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return children
    ? React.cloneElement(children, {
      elevation: trigger ? 1 : 0,
    })
    : null;
}

const OwnMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  color: 'brown'
}));

export default function ElevateAppBar(props: Props) {
  const { userId } = props;
  console.log(userId);
  const router = useRouter();
  const [isLoggedIn, setisLoggedIn] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = (path: string) => {
    switch (path) {
      case "signup":
        router.push('/signup');
        break;
      case "signin":
        router.push('/signin');
        break;
      case "cart":
        router.push('/cart');
        break;
      case "Orders":
        router.push('/orderList');
        break;
      default:
        router.push('/');
    }
  }

  const submitLogout = async () => {
    resetAuthCookies();

    router.push('/')
  }


  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar color="transparent" sx={{ backdropFilter: "blur(10px)" }}>
          <Toolbar sx={{ color: 'InfoText', justifyContent: 'space-between', }}>
            <div className='sm:hidden'>
              <SwipeableTemporaryDrawer userId={userId} />
            </div>
            <Typography variant="h6" component="div" color='blue-500' className={bunjee.className}>
              Eccomerce
            </Typography>
            <Stack justifyContent={'flex-start'} direction={'row'} display={{ xs: 'none', sm: 'inline-block' }}>

              <Button variant='text' disableRipple style={{ color: 'brown' }}>
                products
              </Button>
              <Button
                variant='text'
                disableRipple
                style={{ color: 'brown' }}
                onClick={() => router.push('categories/')}
              >
                category
              </Button>
              <Button variant='text' disableRipple style={{ color: 'brown' }}>
                Contact Us
              </Button>
              {userId ?
                (<>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    variant='text'
                    disableRipple
                    style={{ color: 'brown' }}
                  >
                    Dashboard
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <OwnMenuItem color='brown' onClick={handleClose}>Profile</OwnMenuItem>
                    <OwnMenuItem onClick={() => { navigate('cart'); }}>Cart</OwnMenuItem>
                    <OwnMenuItem onClick={() => { navigate('Orders'); }}>Orders</OwnMenuItem>
                    <OwnMenuItem onClick={submitLogout}>Logout</OwnMenuItem>
                  </Menu>
                </>)
                :
                (<>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    variant='text'
                    disableRipple
                    style={{ color: 'brown' }}
                  >
                    Authenticate
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{ color: 'green' }}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <OwnMenuItem style={{ color: 'brown' }} onClick={() => { navigate('signup') }}>SignUp</OwnMenuItem>
                    <OwnMenuItem onClick={() => { navigate('signin') }}>LogIn</OwnMenuItem>
                  </Menu>
                </>)
              }
            </Stack>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  );
}
