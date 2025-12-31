'use client';

import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { People, Event, AttachMoney, Group } from '@mui/icons-material';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card className="h-full">
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="h2">
            {value}
          </Typography>
        </div>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color.includes('bg-') ? color.split('-')[1] + '.main' : 'primary.main',
            color: 'white'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  // Mock data - replace with actual data from your API
  const stats = [
    {
      title: 'Total Members',
      value: '1,254',
      icon: <People fontSize="large" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Upcoming Events',
      value: '12',
      icon: <Event fontSize="large" />,
      color: 'bg-green-500',
    },
    {
      title: 'Donations (This Month)',
      value: '$8,540',
      icon: <AttachMoney fontSize="large" />,
      color: 'bg-amber-500',
    },
    {
      title: 'Small Groups',
      value: '8',
      icon: <Group fontSize="large" />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <Grid container spacing={3} className="mb-8">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Card className="mb-8">
        <CardContent>
          <Typography variant="h6" className="mb-4">Recent Activity</Typography>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">New member registered</p>
                    <p className="text-sm text-gray-500">John Doe joined the church</p>
                  </div>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">Quick Actions</Typography>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <People className="mx-auto mb-2" />
                  <span>Add Member</span>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Event className="mx-auto mb-2" />
                  <span>Create Event</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">Recent Messages</Typography>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Can we schedule a meeting about the upcoming event?</p>
                      <span className="text-xs text-gray-400">30 minutes ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
