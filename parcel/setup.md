# Courier Service Management System - Setup Guide

This guide will help you set up and run the Courier Service Management System with Angular 19.2.0 frontend and Spring Boot backend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Java 17** (JDK)
- **Maven** (v3.6 or higher)
- **Angular CLI** (v19.2.0)

## Installation Steps

### 1. Install Angular CLI (if not already installed)
```bash
npm install -g @angular/cli@19.2.0
```

### 2. Backend Setup

#### Navigate to the backend directory:
```bash
cd backend
```

#### Install dependencies and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### Verify backend is running:
- Open `http://localhost:8080/h2-console` in your browser
- Use the following connection details:
  - JDBC URL: `jdbc:h2:mem:courierdb`
  - Username: `sa`
  - Password: `password`

### 3. Frontend Setup

#### Navigate to the frontend directory:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Run the development server:
```bash
ng serve
```

The frontend will start on `http://localhost:4200`

## Application Features

### Customer Features
- **Registration & Login**: Secure customer registration with email validation
- **Booking Service**: Create parcel bookings with automatic cost calculation
- **Tracking**: Track parcel status using booking ID
- **Previous Bookings**: View booking history with filtering and pagination
- **Payment**: Secure online payment with card validation
- **Invoice Generation**: Download invoices for completed bookings
- **Booking Cancellation**: Cancel bookings with status management
- **Feedback**: Provide feedback for delivered parcels

### Officer Features
- **Officer Login**: Secure officer authentication
- **Booking Management**: Create bookings on behalf of customers
- **Tracking**: Track all parcels in the system
- **Delivery Status Updates**: Update parcel delivery status
- **Pickup Scheduling**: Schedule pickup and drop-off times
- **View All Bookings**: Comprehensive booking management with filters
- **Feedback Management**: View customer feedback for delivered parcels

## API Endpoints

### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - User login
- `POST /api/auth/officer-login` - Officer login

### Booking Management
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/customer/{customerId}` - Get customer bookings
- `GET /api/bookings/all` - Get all bookings (Officer)
- `PUT /api/bookings/{id}/status` - Update booking status
- `DELETE /api/bookings/{id}` - Cancel booking

### Tracking
- `GET /api/bookings/track/{bookingId}` - Track parcel

## Database Schema

The application uses H2 in-memory database with the following main entities:

- **Customer**: User information and preferences
- **Officer**: Officer account management
- **Booking**: Parcel booking details
- **Payment**: Payment transaction details
- **Feedback**: Customer feedback system
- **Tracking**: Parcel status tracking

## Cost Calculation Formula

The service cost is calculated using the following formula:

```
Service Cost = (Base Rate + Weight Charge + Delivery Charge + Packing Charge) × (1 + Tax Rate)
```

Where:
- **Base Rate**: ₹50 (fixed starting cost)
- **Weight Charge**: ₹0.02 × parcel weight in grams
- **Delivery Charge**: 
  - Standard Delivery: ₹30
  - Express Delivery: ₹80
  - Same-Day Delivery: ₹150
- **Packing Charge**:
  - Basic Packing: ₹10
  - Premium Packing: ₹30
- **Tax Rate**: 5%
- **Admin Fee**: ₹50 (for officer bookings only)

## Security Features

- **Password Encryption**: BCrypt encryption for all passwords
- **JWT Authentication**: Token-based authentication
- **Role-based Access**: Customer and Officer role management
- **Input Validation**: Comprehensive frontend and backend validation
- **CORS Configuration**: Proper CORS setup for frontend-backend communication

## UI/UX Features

- **Responsive Design**: Mobile-friendly interface
- **Material Design**: Modern and consistent UI components
- **Colorful Theme**: User-friendly, minimal, and colorful design
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Success Messages**: Clear success confirmations

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Backend: Change port in `application.properties`
   - Frontend: Use `ng serve --port 4201`

2. **CORS issues**:
   - Ensure backend is running on `http://localhost:8080`
   - Check CORS configuration in `SecurityConfig.java`

3. **Database connection issues**:
   - Verify H2 console is accessible at `http://localhost:8080/h2-console`
   - Check database configuration in `application.properties`

4. **Angular build issues**:
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Angular cache: `ng cache clean`

### Development Tips

1. **Backend Development**:
   - Use H2 console for database inspection
   - Check logs in console for debugging
   - Use Postman for API testing

2. **Frontend Development**:
   - Use browser developer tools for debugging
   - Check Angular console for errors
   - Use Angular Material documentation for components

## Testing the Application

1. **Register a new customer account**
2. **Login with the created account**
3. **Create a booking**
4. **Track the booking**
5. **Test payment functionality**
6. **Generate invoice**

## Deployment

### Backend Deployment
- Package as JAR: `mvn clean package`
- Run JAR: `java -jar target/courier-service-0.0.1-SNAPSHOT.jar`

### Frontend Deployment
- Build for production: `ng build --configuration production`
- Deploy the `dist/courier-frontend` folder to your web server

## Support

For any issues or questions:
1. Check the console logs for error messages
2. Verify all prerequisites are installed correctly
3. Ensure both backend and frontend are running
4. Check network connectivity between frontend and backend

## License

This project is licensed under the MIT License. 