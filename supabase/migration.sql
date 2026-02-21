-- ============================================
-- 神風系統 Database Migration
-- ============================================

-- profiles (使用者)
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('staff', 'admin')) DEFAULT 'staff',
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- products (商品)
CREATE TABLE public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2),
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- kols (網紅)
CREATE TABLE public.kols (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_handle             TEXT NOT NULL,
  status                TEXT NOT NULL CHECK (status IN ('potential','active','ended')) DEFAULT 'potential',
  group_buy_start_date  DATE,
  group_buy_end_date    DATE,
  has_pr_products       BOOLEAN DEFAULT FALSE,
  pr_ship_mode          TEXT CHECK (pr_ship_mode IN ('direct', 'after_3_sales')),
  pr_shipped            BOOLEAN DEFAULT FALSE,
  pr_ship_reminded      BOOLEAN DEFAULT FALSE,
  pr_products_received  BOOLEAN DEFAULT FALSE,
  revenue_share_pct     NUMERIC(5, 2),
  revenue_share_start_unit INTEGER,
  has_exclusive_store   BOOLEAN DEFAULT FALSE,
  notes                 TEXT,
  staff_id              UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- kol_products (網紅-商品 多對多)
CREATE TABLE public.kol_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kol_id      UUID NOT NULL REFERENCES public.kols(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(kol_id, product_id)
);

-- checkins (打卡)
CREATE TABLE public.checkins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  notes       TEXT,
  checked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- settlements (結算)
CREATE TABLE public.settlements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kol_id            UUID NOT NULL REFERENCES public.kols(id) ON DELETE CASCADE,
  sales_rating      INTEGER CHECK (sales_rating BETWEEN 1 AND 5),
  kol_amount        NUMERIC(12, 2),
  marketing_amount  NUMERIC(12, 2),
  is_settled        BOOLEAN NOT NULL DEFAULT FALSE,
  settled_at        TIMESTAMPTZ,
  period_start      DATE,
  period_end        DATE,
  notes             TEXT,
  created_by        UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Views
-- ============================================

-- 7天內到期的開團
CREATE OR REPLACE VIEW public.upcoming_group_buy_endings AS
SELECT
  k.id,
  k.ig_handle,
  k.group_buy_end_date,
  k.staff_id,
  (k.group_buy_end_date - CURRENT_DATE) AS days_remaining
FROM public.kols k
WHERE k.status = 'active'
  AND k.group_buy_end_date IS NOT NULL
  AND k.group_buy_end_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days');

-- 尚未收到公關品的網紅
CREATE OR REPLACE VIEW public.pending_pr_products AS
SELECT
  k.id,
  k.ig_handle,
  k.staff_id,
  k.has_pr_products,
  k.pr_ship_reminded,
  k.pr_shipped,
  k.pr_products_received
FROM public.kols k
WHERE k.has_pr_products = TRUE
  AND k.pr_products_received = FALSE
  AND k.status IN ('potential', 'active');

-- 開團結束但尚未結算的網紅
CREATE OR REPLACE VIEW public.pending_settlements AS
SELECT
  k.id,
  k.ig_handle,
  k.group_buy_end_date,
  k.staff_id
FROM public.kols k
WHERE k.status = 'ended'
  AND k.group_buy_end_date IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.settlements s
    WHERE s.kol_id = k.id AND s.is_settled = TRUE
  );

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kol_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products: everyone can read, admin can insert/update
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_admin" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "products_update_admin" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- KOLs: staff can see own, admin can see all
CREATE POLICY "kols_select_staff" ON public.kols FOR SELECT USING (
  staff_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "kols_insert" ON public.kols FOR INSERT WITH CHECK (true);
CREATE POLICY "kols_update" ON public.kols FOR UPDATE USING (
  staff_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "kols_delete" ON public.kols FOR DELETE USING (
  staff_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- KOL Products: follow kols access
CREATE POLICY "kol_products_select" ON public.kol_products FOR SELECT USING (true);
CREATE POLICY "kol_products_insert" ON public.kol_products FOR INSERT WITH CHECK (true);
CREATE POLICY "kol_products_delete" ON public.kol_products FOR DELETE USING (true);

-- Checkins: staff see own, admin see all
CREATE POLICY "checkins_select" ON public.checkins FOR SELECT USING (
  staff_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "checkins_insert" ON public.checkins FOR INSERT WITH CHECK (staff_id = auth.uid());

-- Settlements: admin can see all, staff can see their own KOLs' settlements
CREATE POLICY "settlements_select" ON public.settlements FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM public.kols WHERE kols.id = settlements.kol_id AND kols.staff_id = auth.uid())
);
CREATE POLICY "settlements_insert" ON public.settlements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "settlements_update" ON public.settlements FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- Storage Bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'checkin-photos',
  'checkin-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage policies
CREATE POLICY "checkin_photos_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'checkin-photos');
CREATE POLICY "checkin_photos_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'checkin-photos' AND auth.uid() IS NOT NULL);

-- ============================================
-- Auto-create profile on signup trigger
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER kols_updated_at BEFORE UPDATE ON public.kols
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER settlements_updated_at BEFORE UPDATE ON public.settlements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- Indexes (效能優化)
-- ============================================

CREATE INDEX idx_kols_staff_id ON public.kols(staff_id);
CREATE INDEX idx_kols_status ON public.kols(status);
CREATE INDEX idx_kols_group_buy_end_date ON public.kols(group_buy_end_date);
CREATE INDEX idx_kols_pr_products ON public.kols(has_pr_products, pr_products_received) WHERE has_pr_products = TRUE;
CREATE INDEX idx_checkins_staff_id ON public.checkins(staff_id);
CREATE INDEX idx_settlements_kol_id ON public.settlements(kol_id);
CREATE INDEX idx_settlements_is_settled ON public.settlements(is_settled);

-- ============================================
-- Auto-end expired KOLs
-- ============================================

CREATE OR REPLACE FUNCTION public.auto_end_expired_kols()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE public.kols
  SET status = 'ended'
  WHERE status = 'active'
    AND group_buy_end_date IS NOT NULL
    AND group_buy_end_date < CURRENT_DATE;
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
