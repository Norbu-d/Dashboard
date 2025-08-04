// src/components/Welcome.tsx
import { useEffect, useState } from 'react';
import { Box, Typography, Grow, Fade, Slide } from '@mui/material';
import Image from 'next/image';

export default function Welcome() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => {
      // Start exit animation after 3 seconds
      setExitAnimation(true);
      // Completely remove after animation finishes
      setTimeout(() => setShowWelcome(false), 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showWelcome && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0f172a', // Updated to match dashboard
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {/* Image with grow animation */}
          <Grow in={!exitAnimation} timeout={1000}>
            <Box sx={{ 
              transform: exitAnimation ? 'translateY(-100px) scale(0.8)' : 'translateY(0) scale(1)',
              opacity: exitAnimation ? 0 : 1,
              transition: 'all 1s ease-out',
              mb: 4
            }}>
              <Image 
                src="https://cdn.vectorstock.com/i/500p/11/31/cute-panda-face-cartoon-vector-40201131.jpg" 
                alt="Panda Logo"
                width={200}
                height={200}
                style={{ 
                  borderRadius: '50%',
                  border: '4px solid #7dd3fc' // Updated border color for better contrast
                }}
              />
            </Box>
          </Grow>

          {/* Text with slide down animation */}
          <Slide 
            in={!exitAnimation} 
            direction="down" 
            timeout={800}
            mountOnEnter
            unmountOnExit
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{
                  fontSize: { xs: '3rem', md: '6rem' },
                  fontWeight: 'bold',
                  letterSpacing: '0.5rem',
                  textTransform: 'uppercase',
                  color: '#e2e8f0', // Lighter text for better contrast
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                Welcome back,
              </Typography>
              <Typography 
                variant="h1" 
                component="h1"
                sx={{
                  fontSize: { xs: '4rem', md: '8rem' },
                  fontWeight: 'bold',
                  color: '#7dd3fc', // Brighter accent color
                  letterSpacing: '0.5rem',
                  textTransform: 'uppercase',
                  mb: 4,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                NORBU
              </Typography>
            </Box>
          </Slide>

          {/* Subtitle with fade animation */}
          <Fade in={!exitAnimation} timeout={1200}>
            <Typography 
              variant="h5" 
              component="p"
              sx={{
                letterSpacing: '0.2rem',
                color: '#bae6fd', // Lighter blue for subtitle
                opacity: exitAnimation ? 0 : 0.8,
                transition: 'opacity 1s ease-out'
              }}
            >
              Loading your dashboard...
            </Typography>
          </Fade>
        </Box>
      )}
    </>
  );
}