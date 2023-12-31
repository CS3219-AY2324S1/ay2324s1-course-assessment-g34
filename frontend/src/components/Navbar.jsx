import React, { useState } from 'react';
import {
  AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Skeleton, Toolbar, Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { NAVBAR_HEIGHT_PX, Role } from '@/utils/constants';
import { stringToAvatar, stringToColor } from '@/utils/utils';
import Logo from './Logo';
import ComponentGuard from './ComponentGuard';
import SolidButton from './commons/SolidButton';

const pages = [
  {
    label: 'Find a Match',
    path: '/match',
  },
  {
    label: 'Questions',
    path: '/questions',
  },
];

const menuPages = [
  {
    label: 'Profile',
    path: '/profile',
  }
];

function LoginButton() {
  return (
    <Link href="/login">
      <SolidButton
        variant="contained"
        size="medium"
        color="success"
        type="button"
        sx={{ textTransform: 'none', fontWeight: 600 }}
      >
        Log In
      </SolidButton>
    </Link>
  );
}

function LoadingPlaceholder() {
  return (
    <Skeleton variant="circular" width={40} height={40} />
  );
}

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { logout, user } = useAuthContext();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ minHeight: NAVBAR_HEIGHT_PX }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: NAVBAR_HEIGHT_PX }}>
          <Logo display={{ xs: 'none', md: 'flex' }} />
          <ComponentGuard allowedRoles={[Role.USER, Role.ADMIN]}>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: 'center' }}>
                      <Link href={page.path}>
                        {page.label}
                      </Link>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </ComponentGuard>
          <Logo display={{ xs: 'flex', md: 'none' }} flexGrow={1} />
          <ComponentGuard allowedRoles={[Role.USER, Role.ADMIN]}>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.label}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: (theme) => theme.palette.primary.contrastText, display: 'block' }}
                >
                  <Link href={page.path}>
                    {page.label}
                  </Link>
                </Button>
              ))}
            </Box>
          </ComponentGuard>
          <Box sx={{ flexGrow: 0, ml: 'auto' }}>
            <ComponentGuard
              allowedRoles={[Role.USER, Role.ADMIN]}
              altComponent={<LoginButton />}
              loadingComponent={<LoadingPlaceholder />}
            >
              <Tooltip title="Open user menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: user ? stringToColor(user.username) : 'grey' }}>
                    {user ? stringToAvatar(user.username) : ''}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {menuPages.map((page) => (
                  <MenuItem key={page.label} onClick={handleCloseUserMenu}>
                    <Link href={page.path}>
                      {page.label}
                    </Link>
                  </MenuItem>
                ))}
                <MenuItem onClick={logout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </ComponentGuard>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
