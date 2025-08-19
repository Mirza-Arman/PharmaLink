# Bill Generation Feature Documentation

## Overview
This feature allows pharmacies to accept medicine requests from customers and generate detailed bills with pricing information, delivery charges, and delivery time.

## Features Implemented

### 1. Backend Changes

#### New Models
- **Bill Model** (`pharmacy-backend/models/Bill.js`): Stores bill information including:
  - Medicine details with individual prices
  - Subtotal calculation
  - Delivery charges
  - Total amount
  - Delivery time
  - Bill status

#### Updated Models
- **Request Model** (`pharmacy-backend/models/Request.js`): Added:
  - Status field (pending, accepted, rejected, completed)
  - AcceptedBy field (pharmacy reference)
  - Bill field (bill reference)

#### New API Endpoints

**Pharmacy Routes** (`pharmacy-backend/routes/authPharmacy.js`):
- `POST /api/pharmacy/accept-request/:requestId` - Accept request and generate bill
- `POST /api/pharmacy/reject-request/:requestId` - Reject request
- `GET /api/pharmacy/bills` - Get all bills for pharmacy

**Customer Routes** (`pharmacy-backend/routes/authCustomer.js`):
- `GET /api/customer/bills` - Get all bills for customer

### 2. Frontend Changes

#### Pharmacy Dashboard (`pharmacy-frontend/src/pages/PharmacyDashboard.jsx`)
- **Medicine List Popup**: Shows customer information and requested medicines
- **Accept/Reject Buttons**: Allow pharmacy to accept or reject requests
- **Bill Generation Form**: When accepting a request, shows:
  - Price input fields for each medicine
  - Automatic total calculation
  - Delivery charges input
  - Delivery time input
  - Bill summary with subtotal and total
- **Status Display**: Shows request status (pending, accepted, rejected)

#### User Requests Page (`pharmacy-frontend/src/pages/UserRequests.jsx`)
- **Requests Section**: Shows all customer requests with status
- **Bills Section**: Shows all bills received from pharmacies
- **Bill Details Popup**: Detailed view of bill including:
  - Pharmacy information
  - Medicine details with prices
  - Bill summary
  - Delivery information

#### Styling (`pharmacy-frontend/src/pages/BuyMedicine.css`)
- Added styles for bill generation form
- Added styles for request and bill cards
- Added responsive design for mobile devices

## Workflow

### 1. Customer Creates Request
1. Customer submits medicine request
2. Request is sent to selected pharmacies
3. Request status: `pending`

### 2. Pharmacy Reviews Request
1. Pharmacy views medicine list in dashboard
2. Pharmacy can see customer details and requested medicines
3. Pharmacy chooses to accept or reject

### 3. Pharmacy Generates Bill (if accepting)
1. Pharmacy enters price for each medicine
2. System automatically calculates subtotal
3. Pharmacy enters delivery charges and delivery time
4. System calculates total amount
5. Bill is generated and saved
6. Request status changes to `accepted`

### 4. Customer Views Bills
1. Customer can view all their requests and bills
2. Customer can see detailed bill information
3. Customer can see pharmacy details and delivery information

## Database Schema

### Bill Collection
```javascript
{
  request: ObjectId,           // Reference to Request
  pharmacy: ObjectId,          // Reference to Pharmacy
  customer: ObjectId,          // Reference to Customer
  medicines: [{
    name: String,
    type: String,
    strength: String,
    quantity: Number,
    pricePerUnit: Number,
    totalPrice: Number
  }],
  subtotal: Number,
  deliveryCharges: Number,
  totalAmount: Number,
  deliveryTime: String,
  status: String,              // pending, accepted, rejected, completed
  createdAt: Date
}
```

### Updated Request Collection
```javascript
{
  // ... existing fields ...
  status: String,              // pending, accepted, rejected, completed
  acceptedBy: ObjectId,        // Reference to Pharmacy
  bill: ObjectId               // Reference to Bill
}
```

## API Usage Examples

### Accept Request and Generate Bill
```javascript
POST /api/pharmacy/accept-request/:requestId
Authorization: Bearer <pharmacy_token>
Content-Type: application/json

{
  "medicines": [
    {
      "name": "Paracetamol",
      "type": "Tablet",
      "strength": "500mg",
      "quantity": 10,
      "pricePerUnit": 2.50
    }
  ],
  "deliveryCharges": 50.00,
  "deliveryTime": "2-3 hours"
}
```

### Get Customer Bills
```javascript
GET /api/customer/bills
Authorization: Bearer <customer_token>
```

### Get Pharmacy Bills
```javascript
GET /api/pharmacy/bills
Authorization: Bearer <pharmacy_token>
```

## Error Handling
- Validates medicine prices (must be > 0)
- Validates delivery charges (must be >= 0)
- Validates delivery time (required)
- Prevents accepting already processed requests
- Proper error messages for all scenarios

## Security Features
- Authentication required for all bill operations
- Pharmacy can only accept/reject requests sent to them
- Customers can only view their own bills
- Pharmacies can only view their own generated bills
