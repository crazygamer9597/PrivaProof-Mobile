-- Create scan history table
CREATE TABLE IF NOT EXISTS scan_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to read items by ID"
  ON scan_history FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to read their scan history"
  ON scan_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow public to insert scan history"
  ON scan_history FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert scan history"
  ON scan_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically set user_id
CREATE OR REPLACE FUNCTION public.handle_new_scan()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set user_id
CREATE TRIGGER on_new_scan
  BEFORE INSERT ON scan_history
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_scan(); 