import { Box, Typography, Container } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHeader({ title, subtitle, backgroundImage }: PageHeaderProps) {
  return (
    <Box 
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{
            fontWeight: 700,
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="h6" 
            component="p" 
            sx={{
              maxWidth: '800px',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
