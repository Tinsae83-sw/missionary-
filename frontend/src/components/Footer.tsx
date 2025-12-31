'use client';

import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Sermons', path: '/sermons' },
      { name: 'Events', path: '/events' },
    ],
  },
  {
    title: 'Ministries',
    links: [
      { name: 'Children', path: '/ministries/children' },
      { name: 'Youth', path: '/ministries/youth' },
      { name: 'Women', path: '/ministries/women' },
      { name: 'Men', path: '/ministries/men' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'Give Online', path: '/give' },
      { name: 'Prayer Request', path: '/prayer-request' },
      { name: 'Visit Us', path: '/visit' },
    ],
  },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ 
      bgcolor: 'primary.dark', 
      color: 'white',
      py: 6, 
      mt: 'auto',
      borderTop: '4px solid',
      borderColor: 'secondary.main',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="white" fontWeight={600} gutterBottom>
              Church Name
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
              123 Church Street<br />
              City, State 12345<br />
              Phone: (123) 456-7890
            </Typography>
          </Grid>
          
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={4} md={2.6} key={section.title}>
              <Typography variant="subtitle1" color="white" fontWeight={600} gutterBottom>
                {section.title}
              </Typography>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link) => (
                  <li key={link.name} style={{ marginBottom: 8 }}>
                    <MuiLink
                      component={Link}
                      href={link.path}
                      color="rgba(255, 255, 255, 0.8)"
                      sx={{
                        display: 'block',
                        mb: 1.5,
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: 'secondary.main',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      {link.name}
                    </MuiLink>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)" align="center">
            &copy; {new Date().getFullYear()} Church Name. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
