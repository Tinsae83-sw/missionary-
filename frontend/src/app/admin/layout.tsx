"use client";

import { AppBar, Box, CssBaseline, Drawer, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Collapse } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Dashboard, 
  People, 
  Event, 
  Settings, 
  Menu as MenuIcon, 
  Church, 
  History, 
  MenuBook, 
  Image, 
  Mic, 
  LibraryBooks,
  Group,
  AccountBalance,
  Description,
  ExpandLess,
  ExpandMore,
  Star
} from '@mui/icons-material';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

const drawerWidth = 240;

type AdminLayoutProps = {
  children: ReactNode;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [openContent, setOpenContent] = useState(true);
  const [openMinistries, setOpenMinistries] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);

  const handleContentClick = () => {
    setOpenContent(!openContent);
  };

  const handleMinistriesClick = () => {
    setOpenMinistries(!openMinistries);
  };

  const handleMediaClick = () => {
    setOpenMedia(!openMedia);
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/admin',
      children: null
    },
    { 
      text: 'Content', 
      icon: <MenuBook />, 
      path: '#',
      children: [
        { text: 'Church Info', icon: <Church />, path: '/admin/church-info' },
        { text: 'Pastor Info', icon: <People />, path: '/admin/pastor-info' },
        { text: 'Mission & Vision', icon: <Star />, path: '/admin/mission-vision' },
        { text: 'Church History', icon: <History />, path: '/admin/church-history' },
        { text: 'Beliefs & Values', icon: <MenuBook />, path: '/admin/beliefs-core-values' },
      ]
    },
    { 
      text: 'Ministries', 
      icon: <Group />, 
      path: '#',
      children: [
        { text: 'All Ministries', icon: <Group />, path: '/admin/ministries' },
        { text: 'Add New', icon: <Group />, path: '/admin/ministries/new' },
      ]
    },
    { 
      text: 'Events', 
      icon: <Event />, 
      path: '/admin/events',
      children: null
    },
    { 
      text: 'Sermons', 
      icon: <Mic />, 
      path: '/admin/sermons',
      children: null
    },
    { 
      text: 'Blog', 
      icon: <Description />, 
      path: '/admin/blog',
      children: null
    },
    { 
      text: 'Media', 
      icon: <Image />, 
      path: '#',
      children: [
        { text: 'Gallery', icon: <Image />, path: '/admin/media/gallery' },
        { text: 'Videos', icon: <Image />, path: '/admin/media/videos' },
      ]
    },
    { 
      text: 'Members', 
      icon: <People />, 
      path: '/admin/members',
      children: null
    },
    { 
      text: 'Donations', 
      icon: <AccountBalance />, 
      path: '/admin/donations',
      children: null
    },
    { 
      text: 'Users', 
      icon: <People />, 
      path: '/admin/users',
      children: null
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/admin/settings',
      children: null
    },
  ];

  const drawer = (
    <div className="h-full" style={{ backgroundColor: 'var(--brand-bg)' }}>
      <Toolbar style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-text)' }}>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <div key={item.text}>
            {item.children ? (
              <>
                <ListItemButton
                  onClick={() => {
                    if (item.text === 'Content') handleContentClick();
                    else if (item.text === 'Ministries') handleMinistriesClick();
                    else if (item.text === 'Media') handleMediaClick();
                  }}
                >
                  <ListItemIcon style={{ color: 'var(--brand-text)' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.text === 'Content' ? (openContent ? <ExpandLess /> : <ExpandMore />) : 
                   item.text === 'Ministries' ? (openMinistries ? <ExpandLess /> : <ExpandMore />) :
                   item.text === 'Media' ? (openMedia ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
                <Collapse 
                  in={
                    (item.text === 'Content' && openContent) || 
                    (item.text === 'Ministries' && openMinistries) ||
                    (item.text === 'Media' && openMedia)
                  } 
                  timeout="auto" 
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children?.map((child) => (
                      <Link href={child.path} key={child.text} className="no-underline" style={{ color: 'var(--brand-text)' }}>
                        <ListItemButton sx={{ pl: 4 }}>
                          <ListItemIcon style={{ color: 'var(--brand-text)' }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <Link href={item.path} className="no-underline" style={{ color: 'var(--brand-text)' }}>
                <ListItemButton>
                  <ListItemIcon style={{ color: 'var(--brand-text)' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            )}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
          style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-text)' }}
        >
          <Toolbar>
            <div className="sm:hidden">
              <MenuIcon 
                style={{ color: 'var(--brand-text)', marginRight: 12, cursor: 'pointer' }} 
                onClick={handleDrawerToggle}
              />
            </div>
            <Typography variant="h6" noWrap component="div">
              Church Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
          className="min-h-screen"
          style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-text)' }}
        >
          <Toolbar />
          <div className="p-4">
            {children}
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
