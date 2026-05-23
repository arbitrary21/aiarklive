-- Sprint 4: anchor video metadata (cozyambience candlelight loop)
-- Run in Supabase SQL Editor. Video must exist.

UPDATE public.videos
SET
  title = 'Candlelight Cozy Ambience — Warm AI Loop',
  description = 'Soft candlelight and warm ambient mood — perfect for study, sleep, or background. Made with Kling AI. Tags: #ambient #cozy #loop #candlelight #kling',
  prompt = 'Warm cozy room, soft candlelight flicker, gentle ambient atmosphere, cinematic loop, 4K mood',
  genre = 'loop',
  ai_tools = ARRAY['kling']::text[],
  ai_tool = 'kling',
  ai_disclosed = true
WHERE id = '5ba1af16-7ab1-4605-b66b-fbc3f9607e5a';
