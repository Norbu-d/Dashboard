// pages/index.tsx
"use client"
import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import CustomerTable from '@/components/CustomerTable';
import Welcome from '@/components/Welcome';
import DashboardStats from '@/components/DashboardStats';

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDashboard(true);
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomer(selectedCustomer === customerId ? null : customerId);
  };

  return (
    <Container maxWidth="xl" sx={{ 
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      py: 4
    }}>
      <Welcome />
      
      {showDashboard && (
        <>
          <DashboardStats />

          <Box sx={{ mt: 6 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress sx={{ color: '#3b82f6' }} />
              </Box>
            ) : (
              <CustomerTable 
                onCustomerSelect={handleCustomerSelect} 
                selectedCustomer={selectedCustomer}
              />
            )}
          </Box>
        </>
      )}
    </Container>
  );
}