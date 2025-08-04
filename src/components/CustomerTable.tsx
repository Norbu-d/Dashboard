// components/CustomerTable.tsx
"use client"
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Typography,
  Avatar,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Collapse,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Cancel, 
  KeyboardArrowDown, 
  KeyboardArrowRight,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import OrdersTable from './OrdersTable';

type Customer = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'churned' | 'prospect';
  revenue: number;
  orderCount: number;
  lastOrderDate: string | null;
};

interface CustomerTableProps {
  onCustomerSelect: (customerId: string) => void;
  selectedCustomer: string | null;
}

export default function CustomerTable({ onCustomerSelect, selectedCustomer }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<keyof Customer>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [editedStatus, setEditedStatus] = useState<'active' | 'churned' | 'prospect'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for cleanup and request management
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search term with cleanup
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (page !== 0) setPage(0); // Reset to first page when searching
    }, 300); // Reduced from 500ms to 300ms for better UX

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, page]);

  const fetchCustomers = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        sortBy: sortBy,
        order: sortOrder,
        search: debouncedSearchTerm
      });

      const response = await fetch(`/api/customers?${params}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      setCustomers(data.customers);
      setTotalItems(data.pagination.totalItems);
    } catch (error: any) {
      // Don't show error for aborted requests
      if (error.name !== 'AbortError') {
        console.error('Error fetching customers:', error);
        setError('Failed to load customers. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, sortBy, sortOrder, debouncedSearchTerm]);

  useEffect(() => {
    fetchCustomers();
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchCustomers]);

  const handleEdit = useCallback((customerId: string, currentStatus: typeof editedStatus) => {
    setEditingCustomer(customerId);
    setEditedStatus(currentStatus);
  }, []);

  const handleSave = useCallback(async (customerId: string) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, status: editedStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }
      
      // Optimistic update
      setCustomers(prevCustomers => 
        prevCustomers.map(c => 
          c.id === customerId ? { ...c, status: editedStatus } : c
        )
      );
    } catch (error) {
      console.error('Error updating customer:', error);
      setError('Failed to update customer status. Please try again.');
    } finally {
      setEditingCustomer(null);
    }
  }, [editedStatus]);

  const handleSort = useCallback((property: keyof Customer) => {
    setSortOrder(prev => sortBy === property && prev === 'asc' ? 'desc' : 'asc');
    setSortBy(property);
    setPage(0);
  }, [sortBy]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleRowClick = useCallback((customerId: string) => {
    onCustomerSelect(customerId);
  }, [onCustomerSelect]);

  // Memoized functions for better performance
  const getStatusColor = useMemo(() => (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'churned': return '#ef4444';
      case 'prospect': return '#3b82f6';
      default: return '#64748b';
    }
  }, []);

  const formatCurrency = useMemo(() => (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }, []);

  const formatDate = useMemo(() => (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  }, []);

  // Memoized table rows for better performance
  const tableRows = useMemo(() => {
    return customers.map((customer) => (
      <React.Fragment key={customer.id}>
        <TableRow 
          hover 
          sx={{ 
            '&:hover': { background: 'rgba(59, 130, 246, 0.1)' },
            backgroundColor: selectedCustomer === customer.id ? 'rgba(59, 130, 246, 0.2)' : 'inherit'
          }}
        >
          <TableCell>
            <IconButton 
              size="small" 
              onClick={() => handleRowClick(customer.id)}
              sx={{ color: '#f8fafc' }}
            >
              {selectedCustomer === customer.id ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
            </IconButton>
          </TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: '#3b82f6', mr: 2, width: 48, height: 48 }}>
                {customer.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography fontWeight={600} sx={{ color: '#f8fafc', fontSize: '1.1rem' }}>
                  {customer.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                  ID: {customer.id.slice(-8)}
                </Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell>
            {editingCustomer === customer.id ? (
              <FormControl size="small">
                <Select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as typeof editedStatus)}
                  sx={{ 
                    minWidth: 120,
                    color: '#f8fafc',
                    '& .MuiSelect-icon': {
                      color: '#94a3b8'
                    }
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="churned">Churned</MenuItem>
                  <MenuItem value="prospect">Prospect</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={customer.status}
                size="small"
                sx={{ 
                  backgroundColor: getStatusColor(customer.status),
                  color: 'white',
                  textTransform: 'capitalize'
                }}
              />
            )}
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="#0ea5e9">
              {customer.email}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Last order: {formatDate(customer.lastOrderDate)}
            </Typography>
          </TableCell>
          <TableCell align="right" sx={{ color: '#f8fafc' }}>
            {customer.orderCount}
          </TableCell>
          <TableCell align="right" sx={{ color: '#f8fafc' }}>
            {formatCurrency(customer.revenue)}
          </TableCell>
          <TableCell>
            {editingCustomer === customer.id ? (
              <>
                <IconButton onClick={() => handleSave(customer.id)} sx={{ color: '#10b981' }}>
                  <Save />
                </IconButton>
                <IconButton onClick={() => setEditingCustomer(null)} sx={{ color: '#ef4444' }}>
                  <Cancel />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={() => handleEdit(customer.id, customer.status)} sx={{ color: '#3b82f6' }}>
                <Edit />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
        
        {/* Expandable row for orders */}
        <TableRow>
          <TableCell 
            colSpan={7} 
            sx={{ 
              p: 0, 
              border: 0,
              backgroundColor: selectedCustomer === customer.id ? 'rgba(59, 130, 246, 0.05)' : 'inherit'
            }}
          >
            <Collapse in={selectedCustomer === customer.id} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: '#f8fafc',
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: '1rem'
                }}>
                  Order Details for {customer.name}
                </Typography>
                <Box sx={{ '& .MuiPaper-root': { transform: 'scale(0.9)', transformOrigin: 'top left' } }}>
                  <OrdersTable customerId={customer.id} />
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    ));
  }, [customers, selectedCustomer, editingCustomer, editedStatus, handleRowClick, handleEdit, handleSave, getStatusColor, formatCurrency, formatDate]);

  return (
    <Paper sx={{
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '20px',
      mb: 4,
      overflow: 'hidden',
      fontSize: '1.1rem'
    }}>
      {/* Search Bar */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <TextField
          fullWidth
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={handleSearchClear} size="small">
                  <ClearIcon sx={{ color: '#94a3b8' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(51, 65, 85, 0.5)',
              '& fieldset': {
                borderColor: 'rgba(71, 85, 105, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(59, 130, 246, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
              },
            },
            '& .MuiInputBase-input': {
              color: '#f8fafc',
              '&::placeholder': {
                color: '#94a3b8',
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            {error}
          </Alert>
        </Box>
      )}

      <TableContainer>
        <Table size="medium" sx={{ '& .MuiTableCell-root': { fontSize: '1.1rem', py: 2 } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(51, 65, 85, 0.8)' }}>
              <TableCell sx={{ width: 50 }}></TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                  sx={{ color: '#f8fafc !important' }}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'orderCount'}
                  direction={sortBy === 'orderCount' ? sortOrder : 'asc'}
                  onClick={() => handleSort('orderCount')}
                  sx={{ color: '#f8fafc !important' }}
                >
                  Orders
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'revenue'}
                  direction={sortBy === 'revenue' ? sortOrder : 'asc'}
                  onClick={() => handleSort('revenue')}
                  sx={{ color: '#f8fafc !important' }}
                >
                  Revenue
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress sx={{ color: '#3b82f6' }} />
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ color: '#94a3b8', py: 4 }}>
                    {debouncedSearchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tableRows
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          borderTop: '1px solid rgba(51, 65, 85, 0.5)',
          backgroundColor: 'rgba(51, 65, 85, 0.3)',
          '& .MuiTablePagination-toolbar': {
            color: '#f8fafc'
          },
          '& .MuiTablePagination-select': {
            color: '#f8fafc'
          },
          '& .MuiTablePagination-selectIcon': {
            color: '#f8fafc'
          }
        }}
      />
    </Paper>
  );
}