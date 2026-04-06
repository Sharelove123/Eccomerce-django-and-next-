'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { IconButton, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { resetAuthCookies } from '../lib/actions';

const headingFontClass = 'font-semibold';
const itemFontClass = 'font-medium';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface props {
  userId: String | null;
}

export default function SwipeableTemporaryDrawer(props: props) {
  const userId = props.userId;
  const router = useRouter();
  const [isLoggedIn, setisLoggedIn] = React.useState<boolean>(false);
  const [state, setState] = React.useState({
    left: false,
  });

  const navigateTo = (text: string) => {
    console.log(text);
    switch (text) {
      case 'category':
        router.push('/categories/?name=All');
        break;
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

    router.refresh();
  }

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Typography textAlign={'center'} color='brown' fontSize={20} className={headingFontClass}>OverView</Typography>
        {['products', 'category', 'Contact Us'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => { navigateTo(text); }}>
              <ListItemText className={itemFontClass} primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {
        userId ?
          <List>
            <Typography color='brown' className={headingFontClass}>Dashboard</Typography>
            {['profile', 'cart','Orders'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => { navigateTo(text); }}>
                  <ListItemText className={itemFontClass} primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem key={'logout'} disablePadding>
              <ListItemButton onClick={submitLogout} className={itemFontClass}>
                <ListItemText className={itemFontClass} primary={'logout'} />
              </ListItemButton>
            </ListItem>
          </List> :
          <List>
            <Typography textAlign={'center'} color='brown' fontSize={20} className={headingFontClass}>Authentication</Typography>
            {['signin', 'signup'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => { navigateTo(text); }} className={itemFontClass}>
                  <ListItemText className={itemFontClass} primary={text} />
                </ListItemButton>
              </ListItem>
            ))}

          </List>

      }
    </Box>
  );

  return (
    <div>
      <React.Fragment key={'left'}>
        <IconButton onClick={toggleDrawer('left', true)}>
          <Menu sx={{ 'color': 'black' }} />
        </IconButton>
        <SwipeableDrawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
        >
          {list('left')}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
