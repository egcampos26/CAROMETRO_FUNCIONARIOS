
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qeilkmtwttuaeutkzsuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaWxrbXR3dHR1YWV1dGt6c3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTg2NjYsImV4cCI6MjA4NTEzNDY2Nn0.ddf8TNqHh_mpm0_mXLxLT35RHaQ6LAvrWOmbsvODeRE';

export const supabase = createClient(supabaseUrl, supabaseKey);
