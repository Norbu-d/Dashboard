import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Welcome() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
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
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {/* Animated gradient background elements */}
          <Box
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            sx={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #7dd3fc 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <Box
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            sx={{
              position: 'absolute',
              bottom: '-20%',
              right: '-10%',
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Logo with sophisticated animation */}
          <Box
            component={motion.div}
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            sx={{
              position: 'relative',
              mb: 4,
              width: 180,
              height: 180,
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -5,
                borderRadius: '50%',
                padding: 2,
                background: 'linear-gradient(45deg, #7dd3fc, #4f46e5)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                animation: 'spin 3s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              },
            }}
          >
            <Image
              src="https://cdn.vectorstock.com/i/500p/11/31/cute-panda-face-cartoon-vector-40201131.jpg"
              alt="Panda Logo"
              width={180}
              height={180}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(255, 255, 255, 0.1)',
              }}
            />
          </Box>

          {/* Text with staggered animation */}
          <Box sx={{ textAlign: 'center', overflow: 'hidden' }}>
            <Typography
              component={motion.div}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                fontWeight: 800,
                letterSpacing: '0.05em',
                color: 'white',
                mb: 1,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                background: 'linear-gradient(90deg, #ffffff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Collaro Clothing
            </Typography>
            
            <Typography
              component={motion.div}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5.5rem' },
                fontWeight: 900,
                color: 'transparent',
                letterSpacing: '0.05em',
                mb: 4,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                background: 'linear-gradient(90deg, #7dd3fc, #4f46e5)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              Dashboard
            </Typography>
          </Box>

          {/* Loading indicator with animation */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            sx={{
              width: '100%',
              maxWidth: 200,
              height: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden',
              mt: 2,
            }}
          >
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'linear' }}
              sx={{
                height: '100%',
                background: 'linear-gradient(90deg, #7dd3fc, #4f46e5)',
                borderRadius: 2,
              }}
            />
          </Box>

          <Typography
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.6 }}
            variant="subtitle1"
            sx={{
              mt: 3,
              color: '#94a3b8',
              letterSpacing: '0.1em',
              fontSize: '0.9rem',
            }}
          >
            Loading your dashboard...
          </Typography>
        </Box>
      )}
    </AnimatePresence>
  );
}