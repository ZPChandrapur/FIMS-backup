/*
  # Fix RLS Policy for Office Inspection Forms
  
  1. Changes
    - Drop existing "Users can manage own office inspection form data" policy
    - Recreate the policy with proper WITH CHECK clause for INSERT/UPDATE operations
    - This ensures users can insert and update their own office inspection forms
  
  2. Security
    - Users can only manage office inspection forms for inspections they created or were assigned
    - Maintains existing access control based on inspector_id and assigned_by
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can manage own office inspection form data" ON fims_office_inspection_forms;

-- Recreate the policy with WITH CHECK clause
CREATE POLICY "Users can manage own office inspection form data"
  ON fims_office_inspection_forms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM fims_inspections fi
      WHERE fi.id = fims_office_inspection_forms.inspection_id
      AND (fi.inspector_id = auth.uid() OR fi.assigned_by = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM fims_inspections fi
      WHERE fi.id = fims_office_inspection_forms.inspection_id
      AND (fi.inspector_id = auth.uid() OR fi.assigned_by = auth.uid())
    )
  );
