-- Migration #13: merge videos when same YouTube channel reconnects on another login
-- Applied: (pending)

CREATE OR REPLACE FUNCTION public.transfer_videos_for_youtube_channel(
  p_channel_id text,
  p_new_user_id uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  moved_count integer := 0;
  old_user_id uuid;
BEGIN
  IF p_new_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  IF p_channel_id IS NULL OR length(trim(p_channel_id)) = 0 THEN
    RETURN 0;
  END IF;

  SELECT id INTO old_user_id
  FROM public.users
  WHERE youtube_channel_id = p_channel_id
    AND id <> p_new_user_id
  LIMIT 1;

  IF old_user_id IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.videos
  SET user_id = p_new_user_id
  WHERE user_id = old_user_id;

  GET DIAGNOSTICS moved_count = ROW_COUNT;

  UPDATE public.users
  SET
    youtube_channel_id = NULL,
    youtube_channel_title = NULL,
    youtube_verified_at = NULL
  WHERE id = old_user_id;

  RETURN moved_count;
END;
$$;

REVOKE ALL ON FUNCTION public.transfer_videos_for_youtube_channel(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transfer_videos_for_youtube_channel(text, uuid) TO authenticated;
