/*
  # Health Inspection Form Table (Zilhastariya-Adhikari-Tapasani-Suchi)
  
  Creates table for storing health inspection form data with:
  - 27 questions with yes/no answers
  - 120+ national program records with target/achieved/percentage data
  - Links to main fims_inspections table via inspection_id
  
  ## Fields
  - Basic inspection info (inspection_id foreign key)
  - 27 question fields (q1 to q27) for yes/no answers
  - Program fields for all national health programs
  - Timestamps for created_at and updated_at
  
  ## Security
  - Enable RLS
  - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS health_inspection_form (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid REFERENCES fims_inspections(id) ON DELETE CASCADE,
  
  -- Questions (27 yes/no questions)
  q1 text NOT NULL DEFAULT '',
  q2 text NOT NULL DEFAULT '',
  q3 text NOT NULL DEFAULT '',
  q4 text NOT NULL DEFAULT '',
  q5 text NOT NULL DEFAULT '',
  q6 text NOT NULL DEFAULT '',
  q7 text NOT NULL DEFAULT '',
  q8 text NOT NULL DEFAULT '',
  q9 text NOT NULL DEFAULT '',
  q10 text NOT NULL DEFAULT '',
  q11 text NOT NULL DEFAULT '',
  q12 text NOT NULL DEFAULT '',
  q13 text NOT NULL DEFAULT '',
  q14 text NOT NULL DEFAULT '',
  q15 text NOT NULL DEFAULT '',
  q16 text NOT NULL DEFAULT '',
  q17 text NOT NULL DEFAULT '',
  q18 text NOT NULL DEFAULT '',
  q19 text NOT NULL DEFAULT '',
  q20 text NOT NULL DEFAULT '',
  q21 text NOT NULL DEFAULT '',
  q22 text NOT NULL DEFAULT '',
  q23 text NOT NULL DEFAULT '',
  q24 text NOT NULL DEFAULT '',
  q25 text NOT NULL DEFAULT '',
  q26 text NOT NULL DEFAULT '',
  q27 text NOT NULL DEFAULT '',
  
  -- National Programs Data (storing as JSONB for flexibility)
  programs_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE health_inspection_form ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read their own inspections
CREATE POLICY "Users can read own health inspections"
  ON health_inspection_form
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fims_inspections
      WHERE fims_inspections.id = health_inspection_form.inspection_id
      AND fims_inspections.inspector_id = auth.uid()
    )
  );

-- Policy for authenticated users to insert their own inspections
CREATE POLICY "Users can insert own health inspections"
  ON health_inspection_form
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM fims_inspections
      WHERE fims_inspections.id = health_inspection_form.inspection_id
      AND fims_inspections.inspector_id = auth.uid()
    )
  );

-- Policy for authenticated users to update their own inspections
CREATE POLICY "Users can update own health inspections"
  ON health_inspection_form
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fims_inspections
      WHERE fims_inspections.id = health_inspection_form.inspection_id
      AND fims_inspections.inspector_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM fims_inspections
      WHERE fims_inspections.id = health_inspection_form.inspection_id
      AND fims_inspections.inspector_id = auth.uid()
    )
  );

-- Policy for authenticated users to delete their own inspections
CREATE POLICY "Users can delete own health inspections"
  ON health_inspection_form
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fims_inspections
      WHERE fims_inspections.id = health_inspection_form.inspection_id
      AND fims_inspections.inspector_id = auth.uid()
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_health_inspection_form_inspection_id 
  ON health_inspection_form(inspection_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_health_inspection_form_updated_at
  BEFORE UPDATE ON health_inspection_form
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();