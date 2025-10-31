/*
  # Add filled_by_name column to fims_inspections table

  ## Overview
  This migration adds a `filled_by_name` column to the main fims_inspections table
  to display the inspector's name in the inspections list view.

  ## Changes Made

  ### 1. New Column
  - `filled_by_name` (text): Stores the name of the person who is assigned the inspection
    - Fetched from user_roles table using the inspector_id
    - Default value is empty string

  ### 2. Trigger Function
  - Creates a function `populate_inspector_name()` that automatically:
    - Fetches the inspector name from user_roles when an inspection is inserted/updated
    - Links through fims_inspections.inspector_id to user_roles.user_id
    - Populates the filled_by_name field

  ### 3. Trigger
  - Creates BEFORE INSERT OR UPDATE trigger on fims_inspections
  - Automatically populates filled_by_name before saving the record

  ### 4. Backfill
  - Updates all existing records with the inspector names

  ## Security
  - No RLS changes needed as this is a data field only
  - Existing RLS policies continue to protect the table
*/

-- Add filled_by_name column to fims_inspections
ALTER TABLE fims_inspections 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create function to populate filled_by_name for fims_inspections
CREATE OR REPLACE FUNCTION populate_inspector_name()
RETURNS TRIGGER AS $$
BEGIN
  -- Fetch the name from user_roles based on the inspector_id
  SELECT ur.name INTO NEW.filled_by_name
  FROM user_roles ur
  WHERE ur.user_id = NEW.inspector_id;
  
  -- If no name found, set to empty string
  IF NEW.filled_by_name IS NULL THEN
    NEW.filled_by_name := '';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for fims_inspections
DROP TRIGGER IF EXISTS populate_inspector_name_trigger ON fims_inspections;
CREATE TRIGGER populate_inspector_name_trigger
  BEFORE INSERT OR UPDATE ON fims_inspections
  FOR EACH ROW
  EXECUTE FUNCTION populate_inspector_name();

-- Backfill existing records with names
UPDATE fims_inspections fi
SET filled_by_name = ur.name
FROM user_roles ur
WHERE fi.inspector_id = ur.user_id
AND (fi.filled_by_name IS NULL OR fi.filled_by_name = '');