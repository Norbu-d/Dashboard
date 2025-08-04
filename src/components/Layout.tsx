// src/components/Layout.tsx
import { CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Collaro Bespoke Tailoring Dashboard</title>
        <meta name="description" content="Dashboard for bespoke tailoring business" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Collaro
          </Typography>
          <Typography variant="subtitle1">
            Bespoke Tailoring Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </>
  );
}