import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dbrcmdthctuiiwgnbjnx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kQGlDxdnlt7-ckRfGaG_dA_4mLqJk7d';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);