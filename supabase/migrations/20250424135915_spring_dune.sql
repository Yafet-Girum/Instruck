/*
  # Initial Schema for Instruck

  1. New Tables
    - `businesses` - Business profiles
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `location` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `truckers` - Trucker profiles
      - `id` (uuid, primary key) 
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `vehicle_type` (text)
      - `vehicle_capacity` (numeric)
      - `license_number` (text)
      - `location` (text)
      - `available` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `shipments` - Shipment records
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `trucker_id` (uuid, references truckers, nullable)
      - `pickup_location` (text)
      - `delivery_location` (text)
      - `load_type` (text)
      - `weight` (numeric)
      - `volume` (numeric)
      - `status` (text)
      - `price` (numeric)
      - `pickup_date` (timestamptz)
      - `delivery_date` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `invoices` - Monthly invoices
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `month` (date)
      - `total_amount` (numeric)
      - `status` (text)
      - `due_date` (date)
      - `paid_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate policies for businesses and truckers

  3. Indexes
    - Add indexes for frequently queried columns
*/

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create truckers table
CREATE TABLE IF NOT EXISTS truckers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  vehicle_type text NOT NULL,
  vehicle_capacity numeric NOT NULL,
  license_number text NOT NULL,
  location text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) NOT NULL,
  trucker_id uuid REFERENCES truckers(id),
  pickup_location text NOT NULL,
  delivery_location text NOT NULL,
  load_type text NOT NULL,
  weight numeric NOT NULL,
  volume numeric,
  status text NOT NULL DEFAULT 'pending',
  price numeric,
  pickup_date timestamptz NOT NULL,
  delivery_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) NOT NULL,
  month date NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  due_date date NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE truckers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses
CREATE POLICY "Businesses can read own data"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for truckers
CREATE POLICY "Truckers can read own data"
  ON truckers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for shipments
CREATE POLICY "Businesses can read own shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (business_id = auth.uid() OR trucker_id = auth.uid());

CREATE POLICY "Businesses can create shipments"
  ON shipments
  FOR INSERT
  TO authenticated
  WITH CHECK (business_id = auth.uid());

-- Create policies for invoices
CREATE POLICY "Businesses can read own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (business_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shipments_business_id ON shipments(business_id);
CREATE INDEX IF NOT EXISTS idx_shipments_trucker_id ON shipments(trucker_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_invoices_business_id ON invoices(business_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);