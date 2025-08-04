# Design Choices for Collaro Dashboard

This document outlines the key design and architectural decisions made during the implementation of the Collaro Dashboard, addressing the specific questions posed in the assignment requirements.

## 1. State Management Architecture

### How did you manage the application's state, particularly the complex state for the main table (filters, sorting) and the individual row states (expanded, loading, editing)?

**Main Table State Management:**
I utilized React's `useState` hooks with strategic state organization:

```typescript
// Table-level state
const [customers, setCustomers] = useState<Customer[]>([]);
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [sortBy, setSortBy] = useState<keyof Customer>('name');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
const [searchTerm, setSearchTerm] = useState('');

// Individual row states
const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
const [editedStatus, setEditedStatus] = useState<CustomerStatus>('active');
```

**Key Design Decisions:**
- **Single Source of Truth**: Each piece of state has one clear owner and location
- **Controlled Components**: All form inputs are controlled by React state, ensuring predictable behavior
- **State Isolation**: Editing states are kept separate from display states to prevent UI conflicts
- **Memoized Callbacks**: Used `useCallback` for `fetchCustomers` to prevent unnecessary re-renders when dependencies change

**Complex Nested State (OrdersTable):**
```typescript
const [editingItem, setEditingItem] = useState<{
  orderItemId: string;
  chest: number;
  waist: number;
  hips: number;
} | null>(null);
```

This approach allows for:
- Independent editing of individual order items
- Temporary state storage without affecting the original data
- Clean cancellation logic that simply resets the editing state

## 2. API Design Philosophy

### Explain your API design. Why did you choose to separate the customer and order endpoints? What are the benefits of this approach?

**Endpoint Separation Strategy:**

1. **`GET /api/customers`** - Returns customer summaries only
2. **`GET /api/customers/[id]/orders`** - Returns detailed order data for specific customer

**Benefits of This Approach:**

**Performance Optimization:**
- **Reduced Initial Payload**: The main table only loads essential customer data (name, status, revenue, order count) without the heavy order details
- **Lazy Loading**: Order details are only fetched when a user expands a specific customer row
- **Bandwidth Efficiency**: Prevents loading potentially hundreds of orders for all customers when most users only view a few

**Scalability:**
- **Database Query Optimization**: Allows for different indexing strategies and query optimizations for customer summaries vs. detailed order data
- **Caching Strategy**: Customer summaries can be cached more aggressively than detailed order data
- **Future-Proof**: Easy to add additional endpoints like `/api/customers/[id]/analytics` without affecting existing APIs

**User Experience:**
- **Fast Initial Load**: Users see the customer list immediately
- **Progressive Loading**: Order details appear on-demand with clear loading indicators
- **Reduced Cognitive Load**: Users aren't overwhelmed with data they haven't requested

**Technical Benefits:**
- **Clean Separation of Concerns**: Each endpoint has a single, clear responsibility
- **Independent Evolution**: Order data structure can change without affecting the customer list API
- **Error Isolation**: Issues with order data don't prevent the customer table from loading

## 3. Biggest Technical Challenge - Nested Inline Editing

### Describe the biggest technical challenge you faced while implementing the nested inline editing feature and how you solved it.

**The Challenge:**
The most complex aspect was implementing inline editing for order item measurements within an already nested table structure. This required managing editing state three levels deep: Customer → Order → OrderItem → CustomSize fields.

**Specific Technical Hurdles:**

1. **State Management Complexity**: Tracking which specific order item (among potentially hundreds) is being edited
2. **UI State Synchronization**: Ensuring the editing UI appears/disappears correctly without affecting other items
3. **Data Validation**: Handling invalid inputs and providing immediate feedback
4. **Optimistic Updates**: Updating the UI immediately while handling potential API failures

**My Solution:**

**1. Focused State Design:**
```typescript
const [editingItem, setEditingItem] = useState<{
  orderItemId: string;  // Unique identifier
  chest: number;
  waist: number;
  hips: number;
} | null>(null);
```
This design stores only the necessary data and uses the unique `orderItemId` to identify which item is being edited.

**2. Controlled Input Pattern:**
```typescript
const handleInputChange = (field: 'chest' | 'waist' | 'hips', value: string) => {
  if (!editingItem) return;
  const numValue = parseFloat(value) || 0;
  setEditingItem({
    ...editingItem,
    [field]: numValue
  });
};
```
This ensures all changes are immediately reflected in the UI while maintaining type safety.

**3. Optimistic Updates with Rollback:**
```typescript
// Update local state immediately
setOrders(prevOrders => 
  prevOrders.map(order => 
    order.orderId === orderId 
      ? {
          ...order,
          items: order.items.map(item => 
            item.orderItemId === orderItemId
              ? { ...item, customSize: newSize }
              : item
          )
        }
      : order
  )
);

// Handle API failure case in catch block
catch (error) {
  // Could implement rollback here if needed
  setError('Failed to update order item');
}
```

**4. Loading State Management:**
```typescript
const [saving, setSaving] = useState(false);

// In the save handler
setSaving(true);
// ... API call
setSaving(false);
```
This provides clear visual feedback during the update process.

**Why This Solution Works:**
- **Single Responsibility**: Each piece of state has one clear purpose
- **Predictable Updates**: The component re-renders only when necessary
- **Error Resilience**: Failed updates don't leave the UI in an inconsistent state
- **User Experience**: Immediate feedback with proper loading states

## 4. Future Development Priority

### If you had another day, what single feature or refactor would you prioritize and why?

**Priority: Advanced Error Handling and Data Synchronization**

**What I Would Implement:**

1. **Optimistic Updates with Automatic Rollback**
   - Implement proper rollback mechanisms for failed API calls
   - Add conflict resolution for simultaneous edits
   - Queue multiple edits and batch API calls

2. **Enhanced Real-time Data Sync**
   - WebSocket integration for real-time updates
   - Automatic refresh when data changes server-side
   - Conflict detection and resolution

3. **Advanced Loading States**
   - Skeleton loading components instead of simple spinners
   - Progressive data loading with placeholder content
   - Better error boundaries with recovery actions

**Why This Priority:**

**User Experience Impact:**
- Users would never lose their work due to network issues
- Multiple users could collaborate without conflicts
- Much more professional and polished feel

**Technical Debt Reduction:**
- Current error handling is basic and could leave users confused
- No handling of edge cases like network timeouts or simultaneous edits
- Limited feedback for complex operations

**Business Value:**
- Reduces support requests from confused users
- Enables team collaboration features
- Makes the application feel production-ready

**Implementation Approach:**
```typescript
// Enhanced state management with rollback capability
const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, any>>(new Map());
const [pendingOperations, setPendingOperations] = useState<Set<string>>(new Set());

// Conflict resolution
const handleConflictResolution = (localData: any, serverData: any) => {
  // Smart merging logic based on timestamps and user priority
};
```

This refactor would transform the application from a demo-quality interface into a production-ready business tool that users would trust with their important data.

## 5. Additional Technical Decisions

### Component Architecture
- **Composition over Inheritance**: Used small, focused components that compose well together
- **Props Interface Design**: Clear, typed interfaces for all component communication
- **Error Boundaries**: Strategic placement to prevent cascade failures

### Performance Optimizations
- **Memoization**: `useCallback` for expensive operations
- **Conditional Rendering**: Avoiding unnecessary DOM manipulation
- **Efficient Re-renders**: State updates designed to minimize component re-renders

### Accessibility Considerations
- **Semantic HTML**: Proper use of table elements and ARIA labels
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Meaningful labels and descriptions

This architecture provides a solid foundation for scaling the application while maintaining excellent user experience and developer productivity.