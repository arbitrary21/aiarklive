-- source_url 컬럼 추가 (기존 DB에 한 번 실행)
alter table public.videos add column if not exists source_url text;
