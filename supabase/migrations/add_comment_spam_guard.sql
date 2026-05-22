-- Migration #10: 댓글 스팸 방지 trigger + is_flagged 컬럼
-- Purpose: 60초 내 동일 content 재작성 방지 + admin 검토 큐 플래그
-- Applied: (pending)

-- is_flagged: admin 검토 큐용 플래그
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN NOT NULL DEFAULT false;

-- 인덱스: flagged 댓글 조회 성능 (admin 큐)
CREATE INDEX IF NOT EXISTS idx_comments_flagged ON public.comments(is_flagged)
  WHERE is_flagged = true;

-- 스팸 방지 함수: 동일 사용자가 60초 내 동일 content를 재작성하면 에러
CREATE OR REPLACE FUNCTION public.check_comment_spam()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.comments
    WHERE user_id = NEW.user_id
      AND video_id = NEW.video_id
      AND content = NEW.content
      AND created_at > NOW() - INTERVAL '60 seconds'
  ) THEN
    RAISE EXCEPTION 'Duplicate comment detected. Please wait before posting the same comment again.'
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger 등록
DROP TRIGGER IF EXISTS trg_comment_spam_check ON public.comments;
CREATE TRIGGER trg_comment_spam_check
  BEFORE INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.check_comment_spam();
