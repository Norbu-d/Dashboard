// src/components/DashboardStats.tsx
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  People as CustomersIcon,
  ShoppingBag as OrdersIcon,
  TrendingUp as GrowthIcon,
  ManageAccounts as ManagementIcon
} from '@mui/icons-material';

const StatCard = ({ 
  icon, 
  value, 
  title, 
  change, 
  iconColor 
}: {
  icon: React.ReactNode,
  value: string,
  title: string,
  change: string,
  iconColor: string
}) => (
  <Paper sx={{ 
    p: 3, 
    borderRadius: 3,
    backgroundColor: '#1e293b',
    color: 'white',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: `linear-gradient(90deg, ${iconColor}, ${iconColor}40)`,
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      transition: 'all 0.3s ease',
      boxShadow: `0 8px 25px ${iconColor}20`,
    },
    transition: 'all 0.3s ease',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Box sx={{ 
        background: `linear-gradient(135deg, ${iconColor}, ${iconColor}80)`,
        width: 48,
        height: 48,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2,
        boxShadow: `0 4px 12px ${iconColor}30`,
      }}>
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          fontFamily: '"Inter", "Roboto", sans-serif',
          fontSize: '0.95rem',
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography 
      variant="h4" 
      sx={{ 
        fontWeight: 700, 
        mb: 2,
        fontFamily: '"Poppins", "Inter", sans-serif',
        fontSize: '2.2rem',
        background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {value}
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        color: '#94a3b8',
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        fontSize: '0.85rem'
      }}
    >
      {change}
    </Typography>
  </Paper>
);

export default function DashboardStats() {
  return (
    <Box sx={{ mt: 2 }}>
      {/* Header Section with Logo */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        pb: 3,
        borderBottom: '1px solid #334155'
      }}>
        <Box sx={{ 
          width: 60, 
          height: 60, 
          mr: 3,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          border: '2px solid #475569'
        }}>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbwjIrH1LL3yaU7OBG48yc4EFaOMRZZzVvVQ&s" 
            alt="Company Logo"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </Box>
        <Box>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: 'white',
              fontWeight: 800,
              fontFamily: '"Poppins", "Inter", sans-serif',
              fontSize: '2.5rem',
              background: 'linear-gradient(135deg, #ffffff, #cbd5e1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
              letterSpacing: '-0.5px'
            }}
          >
𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓫𝓪𝓬𝓴, 𝓝𝓸𝓻𝓫𝓾
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#94a3b8',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: '1.1rem',
              letterSpacing: '0.2px'
            }}
          >
            Here's what's happening with your business today.
          </Typography>
        </Box>
      </Box>
      
      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<RevenueIcon sx={{ color: 'white', fontSize: 24 }} />}
            value="$284,750"
            title="Total Revenue"
            change="12.5% vs last month"
            iconColor="#4f46e5"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<CustomersIcon sx={{ color: 'white', fontSize: 24 }} />}
            value="1,247"
            title="Active Customers"
            change="+2.7% vs last month"
            iconColor="#10b981"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<OrdersIcon sx={{ color: 'white', fontSize: 24 }} />}
            value="3,891"
            title="Total Orders"
            change="+23.1% vs last month"
            iconColor="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<GrowthIcon sx={{ color: 'white', fontSize: 24 }} />}
            value="15.3%"
            title="Growth Rate"
            change="+2.4% vs last month"
            iconColor="#3b82f6"
          />
        </Grid>
      </Grid>
      
      {/* Customer Management Section */}
      <Paper sx={{ 
        p: 4, 
        borderRadius: 3,
        backgroundColor: '#1e293b',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #8b5cf6, #a855f7, #c084fc)',
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 32px rgba(139, 92, 246, 0.15)',
        },
        transition: 'all 0.3s ease',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            width: 56,
            height: 56,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 3,
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
          }}>
            <ManagementIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              fontFamily: '"Poppins", "Inter", sans-serif',
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.2px'
            }}
          >
            Customer Management
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#cbd5e1',
            fontFamily: '"Inter", sans-serif',
            fontSize: '1rem',
            lineHeight: 1.6,
            letterSpacing: '0.1px'
          }}
        >
          Manage your customers, orders, and custom measurements with advanced filtering and editing capabilities.
        </Typography>
      </Paper>
    </Box>
  );
}