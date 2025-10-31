/*
  # Add filled_by_name column to inspection form tables

  ## Overview
  This migration adds a `filled_by_name` column to all inspection form tables 
  to track who filled each form. The name is fetched from the user_roles table
  based on the inspector_id from the fims_inspections table.

  ## Changes Made

  ### 1. Tables Modified
  The following tables will get a new `filled_by_name` column:
  - `health_inspection_form`
  - `grampanchayat_inspection_form`
  - `mumbai_high_court_school_inspection_form`
  - `subcentre_level_monitoring_checklist_form`
  - `veterinary_inspection_report_form`
  - `fims_anganwadi_forms`
  - `fims_office_inspection_forms`

  ### 2. New Column
  - `filled_by_name` (text): Stores the name of the person who filled the form
    - Fetched from user_roles table using the inspector_id from fims_inspections
    - Default value is empty string

  ### 3. Trigger Function
  - Creates a function `populate_filled_by_name()` that automatically:
    - Fetches the inspector name from user_roles when a form is inserted/updated
    - Links through fims_inspections.inspector_id to user_roles.user_id
    - Populates the filled_by_name field

  ### 4. Triggers
  - Creates BEFORE INSERT OR UPDATE triggers on all form tables
  - Automatically populates filled_by_name before saving the record

  ## Security
  - No RLS changes needed as this is a data field only
  - Existing RLS policies continue to protect the tables
*/

-- Create function to populate filled_by_name
CREATE OR REPLACE FUNCTION populate_filled_by_name()
RETURNS TRIGGER AS $$
BEGIN
  -- Fetch the name from user_roles based on the inspector_id from fims_inspections
  SELECT ur.name INTO NEW.filled_by_name
  FROM fims_inspections fi
  JOIN user_roles ur ON fi.inspector_id = ur.user_id
  WHERE fi.id = NEW.inspection_id;
  
  -- If no name found, set to empty string
  IF NEW.filled_by_name IS NULL THEN
    NEW.filled_by_name := '';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add filled_by_name column to health_inspection_form
ALTER TABLE health_inspection_form 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create trigger for health_inspection_form
DROP TRIGGER IF EXISTS populate_filled_by_name_trigger ON health_inspection_form;
CREATE TRIGGER populate_filled_by_name_trigger
  BEFORE INSERT OR UPDATE ON health_inspection_form
  FOR EACH ROW
  EXECUTE FUNCTION populate_filled_by_name();

-- Add filled_by_name column to grampanchayat_inspection_form
ALTER TABLE grampanchayat_inspection_form 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create trigger for grampanchayat_inspection_form
DROP TRIGGER IF EXISTS populate_filled_by_name_trigger ON grampanchayat_inspection_form;
CREATE TRIGGER populate_filled_by_name_trigger
  BEFORE INSERT OR UPDATE ON grampanchayat_inspection_form
  FOR EACH ROW
  EXECUTE FUNCTION populate_filled_by_name();

-- Add filled_by_name column to mumbai_high_court_school_inspection_form
ALTER TABLE mumbai_high_court_school_inspection_form 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create trigger for mumbai_high_court_school_inspection_form
DROP TRIGGER IF EXISTS populate_filled_by_name_trigger ON mumbai_high_court_school_inspection_form;
CREATE TRIGGER populate_filled_by_name_trigger
  BEFORE INSERT OR UPDATE ON mumbai_high_court_school_inspection_form
  FOR EACH ROW
  EXECUTE FUNCTION populate_filled_by_name();

-- Add filled_by_name column to subcentre_level_monitoring_checklist_form
ALTER TABLE subcentre_level_monitoring_checklist_form 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create trigger for subcentre_level_monitoring_checklist_form
DROP TRIGGER IF EXISTS populate_filled_by_name_trigger ON subcentre_level_monitoring_checklist_form;
CREATE TRIGGER populate_filled_by_name_trigger
  BEFORE INSERT OR UPDATE ON subcentre_level_monitoring_checklist_form
  FOR EACH ROW
  EXECUTE FUNCTION populate_filled_by_name();

-- Add filled_by_name column to veterinary_inspection_report_form
ALTER TABLE veterinary_inspection_report_form 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create trigger for veterinary_inspection_report_form
DROP TRIGGER IF EXISTS populate_filled_by_name_trigger ON veterinary_inspection_report_form;
CREATE TRIGGER populate_filled_by_name_trigger
  BEFORE INSERT OR UPDATE ON veterinary_inspection_report_form
  FOR EACH ROW
  EXECUTE FUNCTION populate_filled_by_name();

-- Add filled_by_name column to fims_anganwadi_forms
ALTER TABLE fims_anganwadi_forms 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create trigger for fims_anganwadi_forms
DROP TRIGGER IF EXISTS populate_filled_by_name_trigger ON fims_anganwadi_forms;
CREATE TRIGGER populate_filled_by_name_trigger
  BEFORE INSERT OR UPDATE ON fims_anganwadi_forms
  FOR EACH ROW
  EXECUTE FUNCTION populate_filled_by_name();

-- Add filled_by_name column to fims_office_inspection_forms
ALTER TABLE fims_office_inspection_forms 
ADD COLUMN IF NOT EXISTS filled_by_name text NOT NULL DEFAULT '';

-- Create trigger for fims_office_inspection_forms
DROP TRIGGER IF EXISTS populate_filled_by_name_trigger ON fims_office_inspection_forms;
CREATE TRIGGER populate_filled_by_name_trigger
  BEFORE INSERT OR UPDATE ON fims_office_inspection_forms
  FOR EACH ROW
  EXECUTE FUNCTION populate_filled_by_name();

-- Backfill existing records with names
UPDATE health_inspection_form hif
SET filled_by_name = ur.name
FROM fims_inspections fi
JOIN user_roles ur ON fi.inspector_id = ur.user_id
WHERE hif.inspection_id = fi.id
AND (hif.filled_by_name IS NULL OR hif.filled_by_name = '');

UPDATE grampanchayat_inspection_form gif
SET filled_by_name = ur.name
FROM fims_inspections fi
JOIN user_roles ur ON fi.inspector_id = ur.user_id
WHERE gif.inspection_id = fi.id
AND (gif.filled_by_name IS NULL OR gif.filled_by_name = '');

UPDATE mumbai_high_court_school_inspection_form mhf
SET filled_by_name = ur.name
FROM fims_inspections fi
JOIN user_roles ur ON fi.inspector_id = ur.user_id
WHERE mhf.inspection_id = fi.id
AND (mhf.filled_by_name IS NULL OR mhf.filled_by_name = '');

UPDATE subcentre_level_monitoring_checklist_form slf
SET filled_by_name = ur.name
FROM fims_inspections fi
JOIN user_roles ur ON fi.inspector_id = ur.user_id
WHERE slf.inspection_id = fi.id
AND (slf.filled_by_name IS NULL OR slf.filled_by_name = '');

UPDATE veterinary_inspection_report_form vrf
SET filled_by_name = ur.name
FROM fims_inspections fi
JOIN user_roles ur ON fi.inspector_id = ur.user_id
WHERE vrf.inspection_id = fi.id
AND (vrf.filled_by_name IS NULL OR vrf.filled_by_name = '');

UPDATE fims_anganwadi_forms faf
SET filled_by_name = ur.name
FROM fims_inspections fi
JOIN user_roles ur ON fi.inspector_id = ur.user_id
WHERE faf.inspection_id = fi.id
AND (faf.filled_by_name IS NULL OR faf.filled_by_name = '');

UPDATE fims_office_inspection_forms fof
SET filled_by_name = ur.name
FROM fims_inspections fi
JOIN user_roles ur ON fi.inspector_id = ur.user_id
WHERE fof.inspection_id = fi.id
AND (fof.filled_by_name IS NULL OR fof.filled_by_name = '');