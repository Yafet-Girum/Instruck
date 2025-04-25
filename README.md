# Instruck - B2B Digital Truck-Hailing Platform Prototype

Instruck is a digital truck-hailing platform designed specifically for Rwandan FMCG and agricultural businesses and independent truckers. This repository contains a working interactive prototype with a modern tech stack.

## Overview

This prototype simulates the full customer journey for both businesses and truckers:

- **For Businesses**: Post and manage shipments, receive tax-compliant digital receipts, and pay monthly invoices.
- **For Truckers**: Receive job offers, accept trips, complete deliveries, and track earnings.

## Features

- **Dual Interface**: Separate dashboards for businesses and truckers
- **End-to-End Shipment Booking**: Complete workflow from posting to delivery
- **Tax-Compliant Receipts**: Simulation of Rwanda Revenue Authority (RRA) compliant receipts
- **Monthly Invoicing**: Consolidated billing for businesses
- **Mobile-First Design**: Optimized for both desktop and mobile devices
- **Mock Data**: Realistic simulation of all platform functionality

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Routing**: React Router
- **State Management**: React Context API and Zustand
- **PDF Generation**: jsPDF
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Yafet-Girum/Instruck.git
cd instruck
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/          # Context providers
├── layouts/           # Page layout components
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── business/      # Business-specific pages
│   └── trucker/       # Trucker-specific pages
├── services/          # API service functions
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Authentication Flow

For this prototype, you can use the following credentials:

**Business Account**:
- Email: any email
- Password: any password
- Select "Business" user type

**Trucker Account**:
- Email: any email
- Password: any password
- Select "Trucker" user type

## Development Notes

- This is a prototype with simulated backend functionality
- All API calls are mocked in the `services` directory
- The prototype uses a simplified authentication system

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Prototype designed for a pitch demonstration
- Uses stock photos from Pexels
- Icons from Lucide React