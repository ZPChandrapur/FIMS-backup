/*
  # Create Sub Centre Monitoring Checklist Table

  1. New Tables
    - `sub_centre_monitoring_checklist`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to fims_categories)
      - `user_id` (uuid, foreign key to auth.users)
      - `district` (text)
      - `block_name` (text)
      - `sc_name` (text)
      - `facility_name` (text)
      - `catchment_population` (text)
      - `total_villages` (text)
      - `distance_from_phc` (text)
      - `last_visit` (date)
      - `date` (date)
      - `monitor_name` (text)
      - `staff_available` (text)
      - `staff_not_available` (text)
      - `infrastructure` (jsonb) - Section 1 data
      - `human_resources` (jsonb) - Section 2 data
      - `equipment` (jsonb) - Section 3 data
      - `essential_drugs` (jsonb) - Section 4 data
      - `essential_supplies` (jsonb) - Section 5 data
      - `service_delivery` (jsonb) - Section 6 data
      - `essential_skills` (jsonb) - Section 7 data
      - `record_maintenance` (jsonb) - Section 8 data
      - `referral_linkages` (jsonb) - Section 9 data
      - `iec_display` (jsonb) - Section 10 data
      - `monitoring_supervisors` (jsonb) - Section 11 data
      - `key_findings` (jsonb) - Section 12 data
      - `general_comments` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `sub_centre_monitoring_checklist` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
    - Add policy for authenticated users to delete their own data
*/

-- Create the sub_centre_monitoring_checklist table
CREATE TABLE IF NOT EXISTS sub_centre_monitoring_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES fims_categories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  district text DEFAULT '',
  block_name text DEFAULT '',
  sc_name text DEFAULT '',
  facility_name text DEFAULT '',
  catchment_population text DEFAULT '',
  total_villages text DEFAULT '',
  distance_from_phc text DEFAULT '',
  last_visit date,
  date date DEFAULT CURRENT_DATE,
  monitor_name text DEFAULT '',
  staff_available text DEFAULT '',
  staff_not_available text DEFAULT '',
  infrastructure jsonb DEFAULT '[]'::jsonb,
  human_resources jsonb DEFAULT '[]'::jsonb,
  equipment jsonb DEFAULT '[]'::jsonb,
  essential_drugs jsonb DEFAULT '[]'::jsonb,
  essential_supplies jsonb DEFAULT '[]'::jsonb,
  service_delivery jsonb DEFAULT '[]'::jsonb,
  essential_skills jsonb DEFAULT '[]'::jsonb,
  record_maintenance jsonb DEFAULT '[]'::jsonb,
  referral_linkages jsonb DEFAULT '[]'::jsonb,
  iec_display jsonb DEFAULT '[]'::jsonb,
  monitoring_supervisors jsonb DEFAULT '[]'::jsonb,
  key_findings jsonb DEFAULT '[]'::jsonb,
  general_comments text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sub_centre_monitoring_checklist ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read their own data
CREATE POLICY "Users can read own sub centre monitoring data"
  ON sub_centre_monitoring_checklist
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for authenticated users to insert their own data
CREATE POLICY "Users can insert own sub centre monitoring data"
  ON sub_centre_monitoring_checklist
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to update their own data
CREATE POLICY "Users can update own sub centre monitoring data"
  ON sub_centre_monitoring_checklist
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to delete their own data
CREATE POLICY "Users can delete own sub centre monitoring data"
  ON sub_centre_monitoring_checklist
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sub_centre_monitoring_user_id ON sub_centre_monitoring_checklist(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_centre_monitoring_category_id ON sub_centre_monitoring_checklist(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_centre_monitoring_created_at ON sub_centre_monitoring_checklist(created_at DESC);