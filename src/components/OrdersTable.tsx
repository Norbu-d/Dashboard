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
  Alert
} from "@mui/material";
import { AttachMoney, DateRange, Straighten, Edit, Save, Cancel } from "@mui/icons-material";

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

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching orders for customer: ${customerId}`);
        const response = await fetch(`/api/customers/${customerId}/orders`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          
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
      console.log('Order item updated successfully:', responseData);

      // Required by assignment: Log the update
      console.log('Order item updated:', {
        orderId,
        orderItemId,
        newSize: {
          chest: editingItem.chest,
          waist: editingItem.waist,
          hips: editingItem.hips
        }
      });

      // Update local state
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
        {error}
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Typography sx={{ color: '#94a3b8', textAlign: 'center', py: 4 }}>
        No orders found for this customer.
      </Typography>
    );
  }

  return (
    <Paper sx={{
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(51, 65, 85, 0.8)' }}>
              <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>Order ID</TableCell>
              <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>Date</TableCell>
              <TableCell align="right" sx={{ color: '#f8fafc', fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>Items</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
              <TableRow key={order.orderId} hover sx={{ '&:hover': { background: 'rgba(59, 130, 246, 0.1)' } }}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#f8fafc' }}>
                    {order.orderId.slice(-8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <DateRange sx={{ fontSize: 16, mr: 1, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                      {formatDate(order.orderDate)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600} color="#10b981">
                    {formatCurrency(order.totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack spacing={2}>
                    {order.items.map((item) => (
                      <Card key={item.orderItemId} sx={{
                        p: 2,
                        background: 'rgba(51, 65, 85, 0.5)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '12px'
                      }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box flex={1}>
                            <Typography fontWeight={600} sx={{ color: '#f8fafc', mb: 1 }}>
                              {item.itemName}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={1}>
                              <Box display="flex" alignItems="center">
                                <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: '#64748b' }} />
                                <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                                  {formatCurrency(item.price)}
                                </Typography>
                              </Box>
                              <Chip
                                label={item.category}
                                size="small"
                                sx={{
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  border: '1px solid rgba(59, 130, 246, 0.3)'
                                }}
                              />
                            </Box>

                            {/* Custom Size Section */}
                            <Box display="flex" alignItems="center" mt={1}>
                              <Straighten sx={{ fontSize: 16, mr: 1, color: '#64748b' }} />
                              {editingItem?.orderItemId === item.orderItemId ? (
                                <Box display="flex" gap={1} flexWrap="wrap">
                                  <TextField
                                    label="Chest"
                                    size="small"
                                    type="number"
                                    value={editingItem.chest}
                                    onChange={(e) => handleInputChange('chest', e.target.value)}
                                    inputProps={{ min: 0, step: 0.5 }}
                                    sx={{
                                      width: '80px',
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                                        '&:hover fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                      },
                                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                                      '& .MuiOutlinedInput-input': { color: '#f8fafc' }
                                    }}
                                  />
                                  <TextField
                                    label="Waist"
                                    size="small"
                                    type="number"
                                    value={editingItem.waist}
                                    onChange={(e) => handleInputChange('waist', e.target.value)}
                                    inputProps={{ min: 0, step: 0.5 }}
                                    sx={{
                                      width: '80px',
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                                        '&:hover fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                      },
                                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                                      '& .MuiOutlinedInput-input': { color: '#f8fafc' }
                                    }}
                                  />
                                  <TextField
                                    label="Hips"
                                    size="small"
                                    type="number"
                                    value={editingItem.hips}
                                    onChange={(e) => handleInputChange('hips', e.target.value)}
                                    inputProps={{ min: 0, step: 0.5 }}
                                    sx={{
                                      width: '80px',
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.5)' },
                                        '&:hover fieldset': { borderColor: 'rgba(59, 130, 246, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                      },
                                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                                      '& .MuiOutlinedInput-input': { color: '#f8fafc' }
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                                  {item.customSize.chest > 0 || item.customSize.waist > 0 || item.customSize.hips > 0
                                    ? `Size (C/W/H): ${item.customSize.chest}/${item.customSize.waist}/${item.customSize.hips}`
                                    : 'No custom sizing'
                                  }
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {/* Action Buttons */}
                          <Box ml={2}>
                            {editingItem?.orderItemId === item.orderItemId ? (
                              <Box display="flex" flexDirection="column" gap={1}>
                                <IconButton 
                                  onClick={() => handleSave(order.orderId, item.orderItemId)}
                                  size="small"
                                  disabled={saving}
                                  sx={{ color: '#10b981' }}
                                  title="Save changes"
                                >
                                  {saving ? <CircularProgress size={20} sx={{ color: '#10b981' }} /> : <Save />}
                                </IconButton>
                                <IconButton 
                                  onClick={handleCancel}
                                  size="small"
                                  disabled={saving}
                                  sx={{ color: '#ef4444' }}
                                  title="Cancel editing"
                                >
                                  <Cancel />
                                </IconButton>
                              </Box>
                            ) : (
                              <IconButton 
                                onClick={() => handleEdit(item)}
                                size="small"
                                sx={{ color: '#3b82f6' }}
                                title="Edit measurements"
                              >
                                <Edit />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
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