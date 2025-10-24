/*
  # Fix FIMS RLS Policies for Inspector Data Isolation

  1. Security Changes
    - Remove the insecure "Policy with security definer functions" policy
    - Tighten RLS policies to ensure inspectors only see their own data
    - Ensure super_admin and developer can see all data
    - Fix update policies to be more restrictive

  2. Changes Made
    - Drop the overly permissive policy that allows all operations
    - Update policies to properly check user roles
    - Ensure inspectors can only read/update their own inspections
    - Allow super_admin/developer full access for management

  3. Important Notes
    - Inspectors will only see inspections where inspector_id = their user_id
    - Super_admin and developer roles maintain full visibility
    - This ensures proper data isolation per requirements
*/

-- Drop the insecure policy that bypasses all security
DROP POLICY IF EXISTS "Policy with security definer functions" ON fims_inspections;

-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "Users can update own inspections" ON fims_inspections;

-- Recreate a proper update policy for inspectors
CREATE POLICY "Inspectors can update own inspections"
  ON fims_inspections
  FOR UPDATE
  TO authenticated
  USING (inspector_id = auth.uid())
  WITH CHECK (inspector_id = auth.uid());

-- Update the read policy to be more explicit
DROP POLICY IF EXISTS "Users can read own inspections" ON fims_inspections;

CREATE POLICY "Inspectors can read own inspections"
  ON fims_inspections
  FOR SELECT
  TO authenticated
  USING (inspector_id = auth.uid());

-- Ensure admins policy is properly restricted to super_admin and developer only
DROP POLICY IF EXISTS "Admins can read all inspections" ON fims_inspections;

CREATE POLICY "Super admin and developer can read all inspections"
  ON fims_inspections
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'developer')
    )
  );

-- Ensure admins can update all inspections
DROP POLICY IF EXISTS "Admins can update all inspections" ON fims_inspections;

CREATE POLICY "Super admin and developer can update all inspections"
  ON fims_inspections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'developer')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'developer')
    )
  );

-- Add delete policy for admins only
CREATE POLICY "Super admin and developer can delete inspections"
  ON fims_inspections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'developer')
    )
  );
