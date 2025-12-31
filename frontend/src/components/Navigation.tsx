'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Button, Container, Box, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Sermons', path: '/sermons' },
  { name: 'Events', path: '/events' },
  { name: 'Ministries', path: '/ministries' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
  { name: 'Give', path: '/give' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={1} sx={{ bgcolor: 'primary.main', py: 1 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Church Name
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                href={item.path}
                color="inherit"
                sx={{
                  mx: 1,
                  fontWeight: pathname === item.path ? 600 : 400,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  ...(pathname === item.path && {
                    color: 'secondary.main',
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: '100%',
                      height: '2px',
                      bgcolor: 'secondary.main',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                    },
                  }),
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 2,
                  py: 1.5,
                  position: 'relative',
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
