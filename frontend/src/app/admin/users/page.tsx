'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  IconButton, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography,
  Box,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components for dark mode
const DarkPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D47A1', // Dark Blue
  color: '#E3F2FD', // Light Blue text
  borderRadius: '8px',
  overflow: 'hidden',
}));

const DarkTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: '#E3F2FD', // Light Blue text
  },
  '& .MuiOutlinedInput-root': {
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
  '& .MuiInput-underline:before': {
    borderBottomColor: '#BBDEFB', // Light Blue Accent
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: '#E3F2FD', // Light Blue
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#BBDEFB', // Light Blue Accent
  },
}));

const DarkTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#1565C0', // Slightly lighter Dark Blue
  '& .MuiTableCell-head': {
    color: '#E3F2FD', // Light Blue text
    fontWeight: 'bold',
    borderBottom: '2px solid #BBDEFB', // Light Blue Accent
  },
}));

const DarkTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#0D47A1', // Dark Blue
  color: '#E3F2FD', // Light Blue text
  '&:hover': {
    backgroundColor: '#1565C0', // Slightly lighter Dark Blue on hover
  },
  '& .MuiTableCell-body': {
    color: '#E3F2FD', // Light Blue text
    borderBottom: '1px solid #1976D2', // Medium blue for cell borders
  },
}));

const RoleBadge = styled('span')<{ role: string }>(({ role }) => ({
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  backgroundColor: 
    role === 'Admin' ? 'rgba(187, 222, 251, 0.2)' : // Light Blue Accent with opacity
    role === 'Pastor' ? 'rgba(121, 134, 203, 0.2)' : // Purple with opacity
    'rgba(129, 199, 132, 0.2)', // Green with opacity
  color: 
    role === 'Admin' ? '#BBDEFB' : // Light Blue Accent
    role === 'Pastor' ? '#7986CB' : // Purple
    '#81C784', // Green
  border: 
    role === 'Admin' ? '1px solid rgba(187, 222, 251, 0.5)' :
    role === 'Pastor' ? '1px solid rgba(121, 134, 203, 0.5)' :
    '1px solid rgba(129, 199, 132, 0.5)',
}));

const DarkDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#0D47A1', // Dark Blue
    color: '#E3F2FD', // Light Blue text
    border: '1px solid #BBDEFB', // Light Blue Accent border
  },
}));

// Mock data - replace with actual API calls
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Member', joinDate: '2023-02-20' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Pastor', joinDate: '2023-03-10' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box 
      sx={{ 
        backgroundColor: '#0D47A1', // Dark Blue background
        minHeight: '100vh',
        p: 3
      }}
    >
      <Box className="container mx-auto">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography 
            variant="h5"
            sx={{ 
              color: '#E3F2FD', // Light Blue text
              fontWeight: 'bold'
            }}
          >
            User Management
          </Typography>
          <Button 
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
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
            Add User
          </Button>
        </Box>

        <DarkPaper className="mb-4 p-2">
          <Box display="flex" alignItems="center" sx={{ p: 1 }}>
            <SearchIcon sx={{ color: '#BBDEFB', mr: 2 }} /> {/* Light Blue Accent */}
            <DarkTextField
              fullWidth
              variant="standard"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{ 
                '& .MuiInput-root': {
                  color: '#E3F2FD', // Light Blue text
                }
              }}
            />
          </Box>
        </DarkPaper>

        <TableContainer component={DarkPaper}>
          <Table>
            <DarkTableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </DarkTableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <DarkTableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role}>
                      {user.role}
                    </RoleBadge>
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditUser(user)}
                      sx={{ 
                        color: '#BBDEFB', // Light Blue Accent
                        '&:hover': {
                          backgroundColor: 'rgba(187, 222, 251, 0.1)',
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      sx={{ 
                        color: '#EF9A9A', // Light Red for delete
                        '&:hover': {
                          backgroundColor: 'rgba(239, 154, 154, 0.1)',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </DarkTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <DarkDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#E3F2FD' }}> {/* Light Blue text */}
            {selectedUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent>
            <Box className="space-y-4 mt-2">
              <DarkTextField
                fullWidth
                label="Full Name"
                variant="outlined"
                defaultValue={selectedUser?.name || ''}
                sx={{ mt: 2 }}
              />
              <DarkTextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                defaultValue={selectedUser?.email || ''}
              />
              <DarkTextField
                fullWidth
                label="Role"
                select
                variant="outlined"
                defaultValue={selectedUser?.role || 'Member'}
                SelectProps={{
                  native: false,
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: '#0D47A1', // Dark Blue
                        color: '#E3F2FD', // Light Blue text
                        border: '1px solid #BBDEFB', // Light Blue Accent border
                      }
                    }
                  }
                }}
              >
                <MenuItem value="Member" sx={{ color: '#E3F2FD' }}>Member</MenuItem>
                <MenuItem value="Pastor" sx={{ color: '#E3F2FD' }}>Pastor</MenuItem>
                <MenuItem value="Admin" sx={{ color: '#E3F2FD' }}>Admin</MenuItem>
              </DarkTextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                color: '#BBDEFB', // Light Blue Accent
                border: '1px solid #BBDEFB', // Light Blue Accent border
                '&:hover': {
                  backgroundColor: 'rgba(187, 222, 251, 0.1)',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              sx={{
                backgroundColor: '#BBDEFB', // Light Blue Accent
                color: '#0D47A1', // Dark Blue text
                '&:hover': {
                  backgroundColor: '#90CAF9', // Slightly darker on hover
                },
                fontWeight: 'bold',
              }}
            >
              {selectedUser ? 'Update' : 'Create'} User
            </Button>
          </DialogActions>
        </DarkDialog>
      </Box>
    </Box>
  );
}