// components/OrdersTable.tsx
"use client"
import { useState, useEffect } from "react";
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
  Stack,
  Card,
  TextField,
  TablePagination,
  CircularProgress,
  Alert,
  Tooltip,
  Collapse,
  Divider,
  Skeleton,
  Grid
} from "@mui/material";
import { 
  AttachMoney, 
  DateRange, 
  Straighten, 
  Edit, 
  Save, 
  Cancel,
  InfoOutlined,
  ExpandMore,
  ExpandLess
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

type Order = {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  items: {
    orderItemId: string;
    itemName: string;
    category: string;
    price: number;
    customSize: {
      chest: number;
      waist: number;
      hips: number;
    };
  }[];
};

interface OrdersTableProps {
  customerId: string;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  '&.MuiTableRow-root': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none',
  padding: theme.spacing(2.5),
  fontSize: '1rem',
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  padding: theme.spacing(3),
  height: '100%',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
  },
}));

const AnimatedIconButton = motion(IconButton);

export default function OrdersTable({ customerId }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingItem, setEditingItem] = useState<{
    orderItemId: string;
    chest: number;
    waist: number;
    hips: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/customers/${customerId}/orders`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 404) {
            throw new Error(`Customer not found. The customer ID "${customerId}" may have been regenerated after a server restart.`);
          } else {
            throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
          }
        }
        
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(`Failed to load orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  const handleEdit = (item: Order['items'][0]) => {
    setEditingItem({
      orderItemId: item.orderItemId,
      chest: item.customSize.chest,
      waist: item.customSize.waist,
      hips: item.customSize.hips
    });
  };

  const handleSave = async (orderId: string, orderItemId: string) => {
    if (!editingItem) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${customerId}/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderItemId,
          customSize: {
            chest: editingItem.chest,
            waist: editingItem.waist,
            hips: editingItem.hips
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update order item');
      }

      const responseData = await response.json();

      console.log('Order item updated:', {
        orderId,
        orderItemId,
        newSize: {
          chest: editingItem.chest,
          waist: editingItem.waist,
          hips: editingItem.hips
        }
      });

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? {
                ...order,
                items: order.items.map(item => 
                  item.orderItemId === orderItemId
                    ? {
                        ...item,
                        customSize: {
                          chest: editingItem.chest,
                          waist: editingItem.waist,
                          hips: editingItem.hips
                        }
                      }
                    : item
                )
              }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order item:', error);
      setError(`Failed to update order item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleInputChange = (field: 'chest' | 'waist' | 'hips', value: string) => {
    if (!editingItem) return;
    
    const numValue = parseFloat(value) || 0;
    setEditingItem({
      ...editingItem,
      [field]: numValue
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        {[...Array(3)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rounded" 
            width="100%" 
            height={120} 
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }} 
          />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(10px)',
          my: 2
        }}
        icon={<InfoOutlined />}
      >
        <Typography variant="body1" fontWeight={600}>{error}</Typography>
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.3)',
          borderRadius: '12px',
          border: '1px dashed rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
          No orders found
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          This customer hasn't placed any orders yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
      p: 3,
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto'
    }}>
      <TableContainer>
        <Table sx={{ minWidth: '100%' }} aria-label="orders table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell sx={{ 
                color: '#e2e8f0', 
                fontWeight: 700, 
                fontSize: '1.1rem',
                width: '45%',
                minWidth: '350px'
              }}>
                Order Summary
              </StyledTableCell>
              <StyledTableCell sx={{ 
                color: '#e2e8f0', 
                fontWeight: 700, 
                fontSize: '1.1rem',
                width: '30%',
                minWidth: '250px'
              }}>
                Date
              </StyledTableCell>
              <StyledTableCell align="right" sx={{ 
                color: '#e2e8f0', 
                fontWeight: 700, 
                fontSize: '1.1rem',
                width: '15%',
                minWidth: '150px'
              }}>
                Total
              </StyledTableCell>
              <StyledTableCell sx={{ width: '10%' }}></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
              <motion.div 
                key={order.orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StyledTableRow>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight={600} sx={{ color: '#f8fafc' }}>
                          Order #{order.orderId.slice(-8).toUpperCase()}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#94a3b8', mt: 1 }}>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center" minWidth="250px">
                      <DateRange sx={{ fontSize: 20, mr: 2, color: '#94a3b8' }} />
                      <Typography variant="body1" sx={{ color: '#e2e8f0', fontSize: '1.05rem' }}>
                        {formatDate(order.orderDate)}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" minWidth="150px">
                      <Typography variant="h6" fontWeight={600} color="#10b981">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Tooltip title={expandedOrder === order.orderId ? "Collapse order" : "Expand order"}>
                      <AnimatedIconButton
                        onClick={() => toggleOrderExpansion(order.orderId)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        size="large"
                        sx={{ color: '#94a3b8' }}
                      >
                        {expandedOrder === order.orderId ? <ExpandLess /> : <ExpandMore />}
                      </AnimatedIconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
                
                <StyledTableRow>
                  <StyledTableCell colSpan={4} sx={{ p: 0 }}>
                    <Collapse in={expandedOrder === order.orderId} timeout={300} unmountOnExit>
                      <Box sx={{ px: 4, pb: 3 }}>
                        <Grid container spacing={3}>
                          {order.items.map((item) => (
                            <Grid item xs={12} md={6} lg={4} key={item.orderItemId}>
                              <GradientCard>
                                <Box display="flex" flexDirection="column" height="100%">
                                  <Box flex={1}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          color: '#f8fafc', 
                                          fontSize: '1.2rem'
                                        }}
                                      >
                                        {item.itemName}
                                      </Typography>
                                      
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          color: '#f8fafc',
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}
                                      >
                                        <AttachMoney sx={{ fontSize: 20, mr: 1, color: '#10b981' }} />
                                        {formatCurrency(item.price)}
                                      </Typography>
                                    </Box>
                                    
                                    <Box mb={3}>
                                      <Chip
                                        label={item.category}
                                        size="medium"
                                        sx={{
                                          background: 'rgba(99, 102, 241, 0.2)',
                                          color: '#818cf8',
                                          border: '1px solid rgba(99, 102, 241, 0.3)',
                                          fontSize: '0.9rem',
                                          height: '28px',
                                          padding: '0 12px'
                                        }}
                                      />
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

                                    <Box>
                                      <Box display="flex" alignItems="center" mb={3}>
                                        <Straighten sx={{ fontSize: 20, mr: 2, color: '#94a3b8' }} />
                                        <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '1.05rem' }}>
                                          CUSTOM MEASUREMENTS
                                        </Typography>
                                      </Box>
                                      
                                      {editingItem?.orderItemId === item.orderItemId ? (
                                        <Grid container spacing={2}>
                                          <Grid item xs={4}>
                                            <TextField
                                              label="Chest (in)"
                                              size="medium"
                                              type="number"
                                              fullWidth
                                              value={editingItem.chest}
                                              onChange={(e) => handleInputChange('chest', e.target.value)}
                                              inputProps={{ min: 0, step: 0.5 }}
                                              sx={{
                                                '& .MuiOutlinedInput-root': {
                                                  '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                                                  '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                                                  '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                                                },
                                                '& .MuiInputLabel-root': { 
                                                  color: '#94a3b8', 
                                                  fontSize: '1rem' 
                                                },
                                                '& .MuiOutlinedInput-input': { 
                                                  color: '#f8fafc',
                                                  fontSize: '1.1rem',
                                                  py: 1.75
                                                }
                                              }}
                                              variant="outlined"
                                            />
                                          </Grid>
                                          <Grid item xs={4}>
                                            <TextField
                                              label="Waist (in)"
                                              size="medium"
                                              type="number"
                                              fullWidth
                                              value={editingItem.waist}
                                              onChange={(e) => handleInputChange('waist', e.target.value)}
                                              inputProps={{ min: 0, step: 0.5 }}
                                              sx={{
                                                '& .MuiOutlinedInput-root': {
                                                  '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                                                  '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                                                  '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                                                },
                                                '& .MuiInputLabel-root': { 
                                                  color: '#94a3b8', 
                                                  fontSize: '1rem' 
                                                },
                                                '& .MuiOutlinedInput-input': { 
                                                  color: '#f8fafc',
                                                  fontSize: '1.1rem',
                                                  py: 1.75
                                                }
                                              }}
                                              variant="outlined"
                                            />
                                          </Grid>
                                          <Grid item xs={4}>
                                            <TextField
                                              label="Hips (in)"
                                              size="medium"
                                              type="number"
                                              fullWidth
                                              value={editingItem.hips}
                                              onChange={(e) => handleInputChange('hips', e.target.value)}
                                              inputProps={{ min: 0, step: 0.5 }}
                                              sx={{
                                                '& .MuiOutlinedInput-root': {
                                                  '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                                                  '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.5)' },
                                                  '&.Mui-focused fieldset': { borderColor: '#6366f1' }
                                                },
                                                '& .MuiInputLabel-root': { 
                                                  color: '#94a3b8', 
                                                  fontSize: '1rem' 
                                                },
                                                '& .MuiOutlinedInput-input': { 
                                                  color: '#f8fafc',
                                                  fontSize: '1.1rem',
                                                  py: 1.75
                                                }
                                              }}
                                              variant="outlined"
                                            />
                                          </Grid>
                                        </Grid>
                                      ) : (
                                        <Typography variant="body1" sx={{ color: '#e2e8f0', fontSize: '1.05rem' }}>
                                          {item.customSize.chest > 0 || item.customSize.waist > 0 || item.customSize.hips > 0
                                            ? `${item.customSize.chest}in (chest) • ${item.customSize.waist}in (waist) • ${item.customSize.hips}in (hips)`
                                            : 'No custom measurements provided'
                                          }
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>

                                  <Box mt={3} display="flex" justifyContent="flex-end">
                                    {editingItem?.orderItemId === item.orderItemId ? (
                                      <Box display="flex" gap={2}>
                                        <Tooltip title="Save changes">
                                          <AnimatedIconButton 
                                            onClick={() => handleSave(order.orderId, item.orderItemId)}
                                            size="large"
                                            disabled={saving}
                                            sx={{ 
                                              color: '#10b981',
                                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                              '&:hover': {
                                                backgroundColor: 'rgba(16, 185, 129, 0.25)'
                                              }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            {saving ? <CircularProgress size={26} sx={{ color: '#10b981' }} /> : <Save />}
                                          </AnimatedIconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel">
                                          <AnimatedIconButton 
                                            onClick={handleCancel}
                                            size="large"
                                            disabled={saving}
                                            sx={{ 
                                              color: '#ef4444',
                                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                              '&:hover': {
                                                backgroundColor: 'rgba(239, 68, 68, 0.25)'
                                              }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            <Cancel />
                                          </AnimatedIconButton>
                                        </Tooltip>
                                      </Box>
                                    ) : (
                                      <Tooltip title="Edit measurements">
                                        <AnimatedIconButton 
                                          onClick={() => handleEdit(item)}
                                          size="large"
                                          sx={{ 
                                            color: '#6366f1',
                                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                            '&:hover': {
                                              backgroundColor: 'rgba(99, 102, 241, 0.25)'
                                            }
                                          }}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <Edit />
                                        </AnimatedIconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Box>
                              </GradientCard>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Collapse>
                  </StyledTableCell>
                </StyledTableRow>
              </motion.div>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {orders.length > 5 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            '& .MuiTablePagination-toolbar': {
              color: '#e2e8f0',
              fontSize: '1rem'
            },
            '& .MuiTablePagination-select': {
              color: '#e2e8f0'
            },
            '& .MuiTablePagination-selectIcon': {
              color: '#e2e8f0'
            },
            '& .MuiButtonBase-root': {
              color: '#e2e8f0',
              '&.Mui-disabled': {
                color: '#64748b'
              }
            }
          }}
        />
      )}
    </Paper>
  );
}