// pages/api/customers.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { mockCustomers, getCustomerSummary, updateCustomerStatus } from '../../lib/mockData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`${req.method} /api/customers - Query:`, req.query);
  
  if (req.method === 'GET') {
    try {
      const {
        page = '1',
        limit = '10',
        sortBy = 'name',
        order = 'asc',
        search = ''
      } = req.query;

      let filteredCustomers = [...mockCustomers];

      // Apply search filter
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(customer =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (typeof sortBy === 'string') {
        filteredCustomers.sort((a, b) => {
          let aValue = a[sortBy as keyof typeof a];
          let bValue = b[sortBy as keyof typeof b];

          // Handle null values
          if (aValue === null && bValue === null) return 0;
          if (aValue === null) return 1;
          if (bValue === null) return -1;

          // Convert to comparable values
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = (bValue as string).toLowerCase();
          }

          let result = 0;
          if (aValue < bValue) result = -1;
          else if (aValue > bValue) result = 1;

          return order === 'desc' ? -result : result;
        });
      }

      // Apply pagination
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
      const customerSummaries = paginatedCustomers.map(getCustomerSummary);

      console.log(`Returning ${customerSummaries.length} customers (page ${pageNum})`);

      return res.status(200).json({
        customers: customerSummaries,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredCustomers.length / limitNum),
          totalItems: filteredCustomers.length,
          itemsPerPage: limitNum
        }
      });
    } catch (error) {
      console.error('Error in GET /api/customers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    try {
      console.log('PATCH /api/customers - Body:', req.body);
      
      const { customerId, status } = req.body;
      
      if (!customerId || !status) {
        return res.status(400).json({ error: 'Missing customerId or status' });
      }

      // Validate status value
      const validStatuses = ['active', 'churned', 'prospect'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
      }

      const success = updateCustomerStatus(customerId, status);
      
      if (success) {
        console.log(`Updated customer ${customerId} status to ${status}`);
        return res.status(200).json({ 
          message: 'Customer status updated successfully',
          customerId,
          newStatus: status
        });
      } else {
        return res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      console.error('Error in PATCH /api/customers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}