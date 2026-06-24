-- هدية حب — Supabase schema
-- شغّل هذا الملف من: SQL Editor في مشروع Supabase الجديد

-- جدول المحتوى (صف واحد)
CREATE TABLE IF NOT EXISTS public.site_content (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.site_content (id, data)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_content_public_read" ON public.site_content;
CREATE POLICY "site_content_public_read"
  ON public.site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- قراءة المحتوى
CREATE OR REPLACE FUNCTION public.get_site_content()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT data FROM site_content WHERE id = 1),
    '{}'::jsonb
  );
$$;

-- حفظ المحتوى (محمي بكلمة المرور)
CREATE OR REPLACE FUNCTION public.save_site_content(
  p_password TEXT,
  p_content JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_password TEXT;
BEGIN
  SELECT data->>'password' INTO current_password
  FROM site_content
  WHERE id = 1;

  IF current_password IS NOT NULL AND p_password IS DISTINCT FROM current_password THEN
    RAISE EXCEPTION 'invalid_password';
  END IF;

  UPDATE site_content
  SET data = p_content, updated_at = now()
  WHERE id = 1;

  RETURN p_content;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_site_content() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_site_content(TEXT, JSONB) TO anon, authenticated;

-- تخزين الصور والموسيقى
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'romantic-assets',
  'romantic-assets',
  true,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/wav',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "romantic_assets_public_read" ON storage.objects;
CREATE POLICY "romantic_assets_public_read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'romantic-assets');

DROP POLICY IF EXISTS "romantic_assets_public_insert" ON storage.objects;
CREATE POLICY "romantic_assets_public_insert"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'romantic-assets');

DROP POLICY IF EXISTS "romantic_assets_public_update" ON storage.objects;
CREATE POLICY "romantic_assets_public_update"
  ON storage.objects
  FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'romantic-assets');

DROP POLICY IF EXISTS "romantic_assets_public_delete" ON storage.objects;
CREATE POLICY "romantic_assets_public_delete"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'romantic-assets');
