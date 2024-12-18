# Pharmacy Management System

A comprehensive project designed for managing medicines, stock, student records, and transaction details in a pharmacy setting.

## Project Overview

The Pharmacy Management System provides a seamless way to manage essential pharmacy operations. It has been designed with two primary user roles:

### 1. Admin Features

- **CRUD Operations**: Admins can perform Create, Read, Update, and Delete operations on medicines, students, and stock data.
- **Bulk Operations**: 
  - Bulk addition of students, medicines, and stock.
  - Bulk deletion of students and their associated transactions.
- **Dashboard Access**: 
  - Shortage medicine list.
  - Expiring medicine list.
  - Monthly transactions graph.
  - Medicine usage statistics.
  - Pie chart visualization:
    - Medicines out of stock.
    - Total products.
    - Expired products.
- **Password Reset**: Admins can reset their passwords.

### 2. Extra Features

- **Public Medicine Data**: Anyone can view the list of medicines, including:
  - Availability.
  - Quantity.
  - Usage information.

## Tech Stack Used

### Frontend
- [React.js](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com/)

### Backend
- [Express.js](https://expressjs.com/)

### Database
- [MongoDB](https://www.mongodb.com/)

## Sample Credentials

- **Admin Email**: `skskjani7@gmail.com`
- **Password**: `skjani314@A`

## Deployment Links

- **Frontend**: [Pharmacy Frontend](https://pharmacy-xi-one.vercel.app/)
- **Backend**: [Pharmacy Backend](https://pharmacy-production-6114.up.railway.app)

## Features Overview

### Admin Dashboard
The dashboard provides essential insights to manage the pharmacy effectively:
- **Shortage List**: Identify medicines running low on stock.
- **Expiring Medicines**: List of medicines nearing expiry.
- **Monthly Statistics**: Visual representation of:
  - Transactions.
  - Medicine usage.
- **Pie Chart**:
  - Out-of-stock medicines.
  - Total products.
  - Expired products.

### Bulk Operations
Simplify the management of large datasets with:
- Bulk addition of records.
- Bulk deletion of students along with their transaction history.

### Password Reset
Admins can reset their passwords securely.

### Public Medicine Data
Allow any user to:
- Browse available medicines.
- Check stock quantities.
- Understand medicine usage.

## Setup and Installation

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo-url/pharmacy-management.git
   cd pharmacy-management
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a `.env` file and add the following environment variables:
   # MONGO_URI=your_mongodb_connection_string
   # PORT=5000
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## Folder Structure

```plaintext
pharmacy-management/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
```

## Future Enhancements

- Add user roles (e.g., Pharmacists, Managers) for granular control.
- Implement advanced analytics for better decision-making.
- Integrate notifications for stock shortages and expirations.
- Support for mobile applications.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributors

- [Shaik Mahammad Jani](https://github.com/skjani314)

## Contact

- For queries,
- contact: `skskjani7@gmail.com`
- mobile:`9381116577`
---

Thank you for using the Pharmacy Management System!
