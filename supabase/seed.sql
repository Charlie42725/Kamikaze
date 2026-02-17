-- ============================================
-- 匯入舊資料 Seed Script
-- ============================================

DO $$
DECLARE
  v_staff_id UUID;
  v_projector_id UUID;
  v_earphone_id UUID;
  v_kol_id UUID;
BEGIN
  -- 找 staff
  SELECT id INTO v_staff_id FROM public.profiles WHERE email = 'staff@test.com';
  IF v_staff_id IS NULL THEN
    RAISE EXCEPTION 'staff@test.com not found in profiles';
  END IF;

  -- 找商品
  SELECT id INTO v_projector_id FROM public.products WHERE name = '投影機' LIMIT 1;
  SELECT id INTO v_earphone_id FROM public.products WHERE name = '耳機殼' LIMIT 1;

  IF v_projector_id IS NULL THEN RAISE EXCEPTION '找不到商品: 投影機'; END IF;
  IF v_earphone_id IS NULL THEN RAISE EXCEPTION '找不到商品: 耳機殼'; END IF;

  -- ========== 1. Irac5431Irac ==========
  -- 投影機 | 開團 2025/10/31 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('Irac5431Irac', 'active', '2025-10-31', '2025-11-30', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_projector_id);

  -- ========== 2. __yu.o9_ ==========
  -- 耳機殼 | 開團 2025/9/29 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('__yu.o9_', 'active', '2025-09-29', '2025-10-29', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_earphone_id);

  -- ========== 3. ru_.525 ==========
  -- 耳機殼 | 開團 2025/10/8 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('ru_.525', 'active', '2025-10-08', '2025-11-08', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_earphone_id);

  -- ========== 4. egg.319 ==========
  -- 耳機殼 | 開團 2025/10/10 | 20%分潤（無公關品）
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('egg.319', 'active', '2025-10-10', '2025-11-10', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_earphone_id);

  -- ========== 5. yi_16y_ ==========
  -- 耳機殼 | 開團 2025/10/15 | 20%分潤（無公關品）
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yi_16y_', 'active', '2025-10-15', '2025-11-15', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_earphone_id);

  -- ========== 6. lznnyuz ==========
  -- 投影機、耳機殼 | 開團 2025/10/15 | 20%分潤（無公關品）
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('lznnyuz', 'active', '2025-10-15', '2025-11-15', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES
    (v_kol_id, v_projector_id),
    (v_kol_id, v_earphone_id);

  -- ========== 7. diana226_ ==========
  -- 耳機殼 | 開團 2025/10/28 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('diana226_', 'active', '2025-10-28', '2025-11-28', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_earphone_id);

  -- ========== 8. meow_storm93 ==========
  -- 投影機、耳機殼 | 開團 2025/10/10 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('meow_storm93', 'active', '2025-10-10', '2025-11-10', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES
    (v_kol_id, v_projector_id),
    (v_kol_id, v_earphone_id);

  -- ========== 9. yzcn_1127 ==========
  -- 投影機 | 開團 2025/10/8 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yzcn_1127', 'active', '2025-10-08', '2025-11-08', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_projector_id);

  -- ========== 10. __ucf.187 ==========
  -- 投影機、耳機殼 | 開團 2025/10/8 | 20%分潤（無公關品）
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('__ucf.187', 'active', '2025-10-08', '2025-11-08', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES
    (v_kol_id, v_projector_id),
    (v_kol_id, v_earphone_id);

  RAISE NOTICE 'Done! Inserted 10 KOLs with product links.';
END $$;
