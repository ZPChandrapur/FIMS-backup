/*
  # Add inspection_id to sub_centre_monitoring_checklist

  1. Changes
    - Add `inspection_id` column as foreign key to fims_inspections
    - Create index on inspection_id for faster queries
  
  2. Notes
    - Existing records will have NULL inspection_id
    - New records will properly link to fims_inspections table
*/

-- Add inspection_id column
ALTER TABLE sub_centre_monitoring_checklist 
ADD COLUMN IF NOT EXISTS inspection_id uuid REFERENCES fims_inspections(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sub_centre_monitoring_inspection_id 
ON sub_centre_monitoring_checklist(inspection_id);
