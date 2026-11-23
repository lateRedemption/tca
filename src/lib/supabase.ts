
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ysoeodqpeljfyylsdvla.supabase.co";
const supabasePublishableKey = "sb_publishable_cblN8MtzVlZCTFMsX2LW9A_X5YHPCki";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
