
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vodvdbzdxflajyydxgmi.supabase.co';
const supabaseAnonKey = 'sb_publishable_qn3K8nRM67YdVYXC_QvfKg_Y64_vtNm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
