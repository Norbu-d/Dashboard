// pages/api/customers/[id]/orders.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getCustomerById, updateOrderItemSize } from '../../../../lib/mockData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log(`${req.method} /api/customers/${id}/orders`);

  if (req.method === 'GET') {
    try {
      const customer = getCustomerById(id as string);
      
      if (!customer) {
        console.log(`Customer ${id} not found`);
        return res.status(404).json({ error: 'Customer not found' });
      }

      console.log(`Found customer ${customer.name} with ${customer._orders.length} orders`);

      return res.status(200).json({
        orders: customer._orders
      });

    } catch (error) {
      console.error('Error in GET orders:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    try {
      console.log('PATCH orders - Body:', req.body);
      
      const { orderId, orderItemId, customSize } = req.body;
      
      if (!orderId || !orderItemId || !customSize) {
        return res.status(400).json({ error: 'Missing required fields: orderId, orderItemId, customSize' });
      }

      // Validate customSize structure
      if (typeof customSize.chest !== 'number' || 
          typeof customSize.waist !== 'number' || 
          typeof customSize.hips !== 'number') {
        return res.status(400).json({ error: 'Invalid customSize format. Expected numbers for chest, waist, and hips.' });
      }

      const success = updateOrderItemSize(
        id as string,
        orderId,
        orderItemId,
        customSize
      );

      if (success) {
        console.log(`Updated order item ${orderItemId} with new measurements:`, customSize);
        
        // Return the updated customer data for consistency
        const updatedCustomer = getCustomerById(id as string);
        const updatedOrder = updatedCustomer?._orders.find(o => o.orderId === orderId);
        const updatedItem = updatedOrder?.items.find(item => item.orderItemId === orderItemId);
        
        return res.status(200).json({ 
          message: 'Order item updated successfully',
          updatedItem: updatedItem
        });
      } else {
        return res.status(404).json({ error: 'Customer, order, or order item not found' });
      }

    } catch (error) {
      console.error('Error in PATCH orders:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}