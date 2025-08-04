import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  People as CustomersIcon,
  ShoppingBag as OrdersIcon,
  TrendingUp as GrowthIcon,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animated icon wrapper
const AnimatedIcon = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <motion.div
    whileHover={{ 
      scale: 1.2,
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 }
    }}
    animate={{
      y: [0, -5, 0],
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
    style={{
      background: `linear-gradient(135deg, ${color}, ${color}80)`,
      width: 48,
      height: 48,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 6px 16px ${color}40`,
    }}
  >
    {children}
  </motion.div>
);

const StatCard = ({ 
  icon, 
  value, 
  title, 
  change, 
  changePositive,
  iconColor 
}: {
  icon: React.ReactNode,
  value: string,
  title: string,
  change: string,
  changePositive: boolean,
  iconColor: string
}) => (
  <Paper 
    component={motion.div}
    whileHover={{ y: -5, boxShadow: `0 10px 30px ${iconColor}30` }}
    sx={{ 
      p: 3, 
      borderRadius: 3,
      background: 'linear-gradient(145deg, #1e293b, #1a2332)',
      color: 'white',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${iconColor}, ${iconColor}80)`,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <AnimatedIcon color={iconColor}>
        {icon}
      </AnimatedIcon>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.95rem',
          letterSpacing: '0.5px',
          color: '#e2e8f0',
          ml: 2
        }}
      >
        {title}
      </Typography>
    </Box>
    <Typography 
      variant="h4" 
      sx={{ 
        fontWeight: 800, 
        mb: 1,
        fontFamily: '"Poppins", sans-serif',
        fontSize: '2.2rem',
        background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px',
      }}
    >
      {value}
    </Typography>
    <Box 
      component={motion.div}
      animate={{
        x: [0, 2, -2, 0],
        transition: { duration: 2, repeat: Infinity }
      }}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      {changePositive ? (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            transition: { duration: 2, repeat: Infinity }
          }}
        >
          <ArrowUpward sx={{ color: '#10b981', fontSize: '1rem', mr: 0.5 }} />
        </motion.div>
      ) : (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            transition: { duration: 2, repeat: Infinity }
          }}
        >
          <ArrowDownward sx={{ color: '#ef4444', fontSize: '1rem', mr: 0.5 }} />
        </motion.div>
      )}
      <Typography 
        variant="body2" 
        sx={{ 
          color: changePositive ? '#10b981' : '#ef4444',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}
      >
        {change}
      </Typography>
    </Box>
  </Paper>
);

export default function DashboardStats() {
  return (
    <Box sx={{ mt: 2 }}>
      {/* Modern Header Section */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          pb: 3,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box 
          component={motion.div}
          whileHover={{ rotate: 5 }}
          sx={{ 
            width: 60, 
            height: 60, 
            mr: 3,
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(145deg, #1e293b, #1a2332)',
          }}
        >
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
            component={motion.h1}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            sx={{ 
              fontWeight: 800,
              fontFamily: '"Poppins", sans-serif',
              fontSize: '2.5rem',
              background: 'linear-gradient(90deg, #ffffff, #cbd5e1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            Welcome back, Norbu
          </Typography>
          <Typography 
            variant="h6" 
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{ 
              color: '#94a3b8',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: '1.1rem',
              letterSpacing: '0.2px'
            }}
          >
            Here's your business overview for today
          </Typography>
        </Box>
      </Box>
      
      {/* Stats Grid with lively animated icons */}
      <Grid container spacing={3}>
        {[
          {
            icon: <RevenueIcon sx={{ color: 'white', fontSize: 24 }} />,
            value: "$284,750",
            title: "Total Revenue",
            change: "12.5% vs last month",
            changePositive: true,
            iconColor: "#4f46e5"
          },
          {
            icon: <CustomersIcon sx={{ color: 'white', fontSize: 24 }} />,
            value: "1,247",
            title: "Active Customers",
            change: "+2.7% vs last month",
            changePositive: true,
            iconColor: "#10b981"
          },
          {
            icon: <OrdersIcon sx={{ color: 'white', fontSize: 24 }} />,
            value: "3,891",
            title: "Total Orders",
            change: "+23.1% vs last month",
            changePositive: true,
            iconColor: "#f59e0b"
          },
          {
            icon: <GrowthIcon sx={{ color: 'white', fontSize: 24 }} />,
            value: "15.3%",
            title: "Growth Rate",
            change: "+2.4% vs last month",
            changePositive: true,
            iconColor: "#3b82f6"
          }
        ].map((stat, index) => (
          <Grid item xs={12} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <StatCard {...stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}