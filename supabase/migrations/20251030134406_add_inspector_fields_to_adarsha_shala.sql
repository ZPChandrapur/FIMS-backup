/*
  # Add Inspector Fields to Adarsha Shala Table

  1. Changes
    - Add `inspector_name` column to store the inspector's name
    - Add `inspector_designation` column to store the inspector's designation
    - Add `visit_date_inspector` column to store the inspector's visit date
  
  2. Notes
    - These fields are optional and can be null
    - They store information about the inspector who conducted the school inspection
*/

-- Add inspector fields to adarsha_shala table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'adarsha_shala' AND column_name = 'inspector_name'
  ) THEN
    ALTER TABLE adarsha_shala ADD COLUMN inspector_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'adarsha_shala' AND column_name = 'inspector_designation'
  ) THEN
    ALTER TABLE adarsha_shala ADD COLUMN inspector_designation text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'adarsha_shala' AND column_name = 'visit_date_inspector'
  ) THEN
    ALTER TABLE adarsha_shala ADD COLUMN visit_date_inspector text;
  END IF;
END $$;