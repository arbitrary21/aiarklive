-- aiarklive 초기 시드 데이터
-- schema.sql 실행 후 SQL Editor에서 실행하세요
-- auth.users INSERT → trigger가 public.users 자동 생성

create extension if not exists pgcrypto;

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) values
  (
    '11111111-1111-1111-1111-111111111101',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'creator@aiarklive.com',
    crypt('aiarklive-demo-1', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"Aphesis21"}',
    false
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'nova@aiarklive.com',
    crypt('aiarklive-demo-2', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"NovaFrames"}',
    false
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'loop@aiarklive.com',
    crypt('aiarklive-demo-3', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"LoopLab"}',
    false
  )
on conflict (id) do nothing;

update public.users set bio = 'Suno + Kling으로 수면음악 AI 영상을 만듭니다.' where id = '11111111-1111-1111-1111-111111111101';
update public.users set bio = 'Runway Gen-3 실험영상 크리에이터' where id = '11111111-1111-1111-1111-111111111102';
update public.users set bio = '루프 영상 · ambient AI 비주얼' where id = '11111111-1111-1111-1111-111111111103';

insert into public.videos (id, user_id, title, description, embed_url, platform, thumbnail_url, ai_tools, genre, prompt, likes_count, views_count, created_at) values
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Midnight Rain — AI Lo-fi Sleep Visual', 'Suno로 만든 수면음악과 Kling 비주얼의 조합', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'youtube', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', array['suno','kling'], 'music-video', 'rainy window at night, soft neon glow, lo-fi aesthetic', 1284, 8420, '2026-05-01T10:00:00Z'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 'Neon Alley — Cyberpunk Short Film', 'Runway Gen-3로 제작한 30초 단편', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'youtube', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', array['runway'], 'short-film', 'cyberpunk alley, rain reflections, cinematic tracking shot', 956, 5210, '2026-05-10T14:30:00Z'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111103', 'Infinite Ocean Loop', 'Pika + LTX-Video 루프 애니메이션', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'youtube', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', array['pika','ltx-video'], 'loop', null, 742, 3890, '2026-05-15T09:00:00Z')
on conflict (id) do nothing;
