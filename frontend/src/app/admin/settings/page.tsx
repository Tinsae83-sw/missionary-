'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components for dark mode
const DarkPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D47A1', // Dark Blue
  color: '#E3F2FD', // Light Blue text
  borderRadius: '8px',
  overflow: 'hidden',
}));

const DarkTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#BBDEFB', // Light Blue Accent
  },
}));

const DarkTab = styled(Tab)(({ theme }) => ({
  color: '#BBDEFB', // Light Blue Accent
  '&.Mui-selected': {
    color: '#E3F2FD', // Light Blue
    fontWeight: 'bold',
  },
  '&:hover': {
    backgroundColor: 'rgba(187, 222, 251, 0.1)', // Light Blue Accent with opacity
  },
}));

const DarkTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#E3F2FD', // Light Blue text
    '& fieldset': {
      borderColor: '#BBDEFB', // Light Blue Accent
    },
    '&:hover fieldset': {
      borderColor: '#E3F2FD', // Light Blue
      borderWidth: '2px',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#BBDEFB', // Light Blue Accent
    },
  },
  '& .MuiInputLabel-root': {
    color: '#BBDEFB', // Light Blue Accent
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#BBDEFB', // Light Blue Accent
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#90CAF9', // Lighter blue
    opacity: 0.7,
  },
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1565C0', // Slightly lighter Dark Blue
  border: '1px solid #BBDEFB', // Light Blue Accent border
  color: '#E3F2FD', // Light Blue text
  borderRadius: '8px',
  padding: '16px',
  '&:hover': {
    backgroundColor: '#1976D2', // Hover state
  },
}));

const DarkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#BBDEFB', // Light Blue Accent when checked
    '&:hover': {
      backgroundColor: 'rgba(187, 222, 251, 0.1)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#BBDEFB', // Light Blue Accent track
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#90CAF9', // Lighter blue for uncheck
  },
}));

// Mock data - replace with actual API calls
const mockSettings = {
  general: {
    churchName: 'Grace Community Church',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA',
    phone: '(555) 123-4567',
    email: 'info@gracechurch.org',
    website: 'www.gracechurch.org',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  social: {
    facebook: 'https://facebook.com/gracechurch',
    twitter: 'https://twitter.com/gracechurch',
    instagram: 'https://instagram.com/gracechurch',
    youtube: 'https://youtube.com/gracechurch',
  },
  features: {
    onlineGiving: true,
    eventRegistration: true,
    memberDirectory: true,
    sermonArchive: true,
    prayerRequests: true,
  }
};

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function SettingsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState(mockSettings);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleToggle = (section: string, field: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: !prev[section as keyof typeof prev][field]
      }
    }));
  };

  const handleSave = () => {
    // In a real app, you would make an API call here
    console.log('Saving settings:', settings);
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: '#0D47A1', // Dark Blue background
        minHeight: '100vh',
        p: 3
      }}
    >
      <Box 
        className="container mx-auto p-4"
        sx={{ 
          backgroundColor: '#0D47A1', // Dark Blue
          color: '#E3F2FD', // Light Blue text
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#E3F2FD', // Light Blue text
              fontWeight: 'bold'
            }}
          >
            Settings
          </Typography>
          <Button 
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              backgroundColor: '#BBDEFB', // Light Blue Accent
              color: '#0D47A1', // Dark Blue text
              '&:hover': {
                backgroundColor: '#90CAF9', // Slightly darker on hover
              },
              fontWeight: 'bold',
              textTransform: 'none',
              px: 3,
              py: 1,
            }}
          >
            Save Changes
          </Button>
        </Box>

        <DarkPaper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: '#BBDEFB' }}> {/* Light Blue Accent border */}
            <DarkTabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="settings tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <DarkTab label="General" {...a11yProps(0)} />
              <DarkTab label="Social Media" {...a11yProps(1)} />
              <DarkTab label="Features" {...a11yProps(2)} />
            </DarkTabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ color: '#E3F2FD' }} // Light Blue text
            >
              General Settings
            </Typography>
            <Divider sx={{ mb: 3, borderColor: '#BBDEFB' }} /> {/* Light Blue Accent */}
            
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={3}>
              <DarkTextField
                label="Church Name"
                value={settings.general.churchName}
                onChange={(e) => handleInputChange('general', 'churchName', e.target.value)}
                fullWidth
                margin="normal"
              />
              <DarkTextField
                label="Email"
                type="email"
                value={settings.general.email}
                onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={3}>
              <DarkTextField
                label="Address"
                value={settings.general.address}
                onChange={(e) => handleInputChange('general', 'address', e.target.value)}
                fullWidth
                margin="normal"
              />
              <DarkTextField
                label="City"
                value={settings.general.city}
                onChange={(e) => handleInputChange('general', 'city', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3} mb={3}>
              <DarkTextField
                label="State/Province"
                value={settings.general.state}
                onChange={(e) => handleInputChange('general', 'state', e.target.value)}
                fullWidth
                margin="normal"
              />
              <DarkTextField
                label="ZIP/Postal Code"
                value={settings.general.zipCode}
                onChange={(e) => handleInputChange('general', 'zipCode', e.target.value)}
                fullWidth
                margin="normal"
              />
              <DarkTextField
                label="Country"
                value={settings.general.country}
                onChange={(e) => handleInputChange('general', 'country', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={3}>
              <DarkTextField
                label="Phone Number"
                value={settings.general.phone}
                onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                fullWidth
                margin="normal"
              />
              <DarkTextField
                label="Website"
                value={settings.general.website}
                onChange={(e) => handleInputChange('general', 'website', e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ color: '#E3F2FD' }} // Light Blue text
            >
              Social Media Links
            </Typography>
            <Divider sx={{ mb: 3, borderColor: '#BBDEFB' }} /> {/* Light Blue Accent */}
            
            <Box display="grid" gridTemplateColumns={{ xs: '1fr' }} gap={3} mb={3}>
              <DarkTextField
                label="Facebook URL"
                value={settings.social.facebook}
                onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                fullWidth
                margin="normal"
                placeholder="https://facebook.com/yourpage"
              />
              <DarkTextField
                label="Twitter URL"
                value={settings.social.twitter}
                onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                fullWidth
                margin="normal"
                placeholder="https://twitter.com/yourhandle"
              />
              <DarkTextField
                label="Instagram URL"
                value={settings.social.instagram}
                onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                fullWidth
                margin="normal"
                placeholder="https://instagram.com/yourprofile"
              />
              <DarkTextField
                label="YouTube URL"
                value={settings.social.youtube}
                onChange={(e) => handleInputChange('social', 'youtube', e.target.value)}
                fullWidth
                margin="normal"
                placeholder="https://youtube.com/yourchannel"
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ color: '#E3F2FD' }} // Light Blue text
            >
              Feature Toggles
            </Typography>
            <Typography 
              variant="body2" 
              gutterBottom
              sx={{ color: '#BBDEFB' }} // Light Blue Accent
            >
              Enable or disable various features of the website
            </Typography>
            <Divider sx={{ mb: 3, borderColor: '#BBDEFB' }} /> {/* Light Blue Accent */}
            
            <Box display="grid" gridTemplateColumns={{ xs: '1fr' }} gap={2}>
              <FeaturePaper elevation={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography 
                      variant="subtitle1"
                      sx={{ color: '#E3F2FD' }} // Light Blue text
                    >
                      Online Giving
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ color: '#BBDEFB' }} // Light Blue Accent
                    >
                      Allow members to give online through the website
                    </Typography>
                  </div>
                  <DarkSwitch
                    checked={settings.features.onlineGiving}
                    onChange={() => handleToggle('features', 'onlineGiving')}
                  />
                </Box>
              </FeaturePaper>

              <FeaturePaper elevation={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography 
                      variant="subtitle1"
                      sx={{ color: '#E3F2FD' }} // Light Blue text
                    >
                      Event Registration
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ color: '#BBDEFB' }} // Light Blue Accent
                    >
                      Allow members to register for events online
                    </Typography>
                  </div>
                  <DarkSwitch
                    checked={settings.features.eventRegistration}
                    onChange={() => handleToggle('features', 'eventRegistration')}
                  />
                </Box>
              </FeaturePaper>

              <FeaturePaper elevation={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography 
                      variant="subtitle1"
                      sx={{ color: '#E3F2FD' }} // Light Blue text
                    >
                      Member Directory
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ color: '#BBDEFB' }} // Light Blue Accent
                    >
                      Show member directory to logged-in users
                    </Typography>
                  </div>
                  <DarkSwitch
                    checked={settings.features.memberDirectory}
                    onChange={() => handleToggle('features', 'memberDirectory')}
                  />
                </Box>
              </FeaturePaper>

              <FeaturePaper elevation={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography 
                      variant="subtitle1"
                      sx={{ color: '#E3F2FD' }} // Light Blue text
                    >
                      Sermon Archive
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ color: '#BBDEFB' }} // Light Blue Accent
                    >
                      Show sermon archive and media library
                    </Typography>
                  </div>
                  <DarkSwitch
                    checked={settings.features.sermonArchive}
                    onChange={() => handleToggle('features', 'sermonArchive')}
                  />
                </Box>
              </FeaturePaper>

              <FeaturePaper elevation={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography 
                      variant="subtitle1"
                      sx={{ color: '#E3F2FD' }} // Light Blue text
                    >
                      Prayer Requests
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ color: '#BBDEFB' }} // Light Blue Accent
                    >
                      Allow members to submit prayer requests
                    </Typography>
                  </div>
                  <DarkSwitch
                    checked={settings.features.prayerRequests}
                    onChange={() => handleToggle('features', 'prayerRequests')}
                  />
                </Box>
              </FeaturePaper>
            </Box>
          </TabPanel>
        </DarkPaper>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              backgroundColor: snackbar.severity === 'success' ? '#E3F2FD' : '#FFEBEE', // Light Blue for success, Light Red for error
              color: '#0D47A1', // Dark Blue text
              '& .MuiAlert-icon': {
                color: '#0D47A1', // Dark Blue icon
              },
              border: '1px solid #0D47A1', // Dark Blue border
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}