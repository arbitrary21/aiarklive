-- Migration #9: videos 테이블에 ai_tool + ai_disclosed 컬럼 추가
-- Purpose: Affiliate CTA 정확도 향상 + 업로드 시 AI 생성 여부 영속화
-- Applied: (pending)

-- ai_tool: 주 사용 AI 도구 (단일 값, ai_tools[] 배열의 primary key)
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS ai_tool TEXT
    CHECK (ai_tool IN ('kling', 'runway', 'pika', 'suno', 'grok', 'veo', 'hailuo', 'ltx-video', 'wan', 'pixverse', 'other'));

-- ai_disclosed: 업로더가 AI 생성 여부를 공개적으로 인정했는지 여부
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS ai_disclosed BOOLEAN NOT NULL DEFAULT false;

-- 기존 데이터 백필: ai_tools 배열의 첫 번째 값을 ai_tool에 복사
UPDATE public.videos
SET ai_tool = ai_tools[1]
WHERE ai_tool IS NULL
  AND ai_tools IS NOT NULL
  AND array_length(ai_tools, 1) > 0
  AND ai_tools[1] IN ('kling', 'runway', 'pika', 'suno', 'grok', 'veo', 'hailuo', 'ltx-video', 'wan', 'pixverse', 'other');

-- 인덱스: ai_tool 필터링 쿼리 성능
CREATE INDEX IF NOT EXISTS idx_videos_ai_tool ON public.videos(ai_tool);
