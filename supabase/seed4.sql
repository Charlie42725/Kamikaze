-- ============================================
-- 追加匯入 staff2@gmail.com 的資料
-- ============================================

DO $$
DECLARE
  v_staff_id UUID;
  v_pid_projector UUID;
  v_pid_earphone UUID;
  v_pid_curler UUID;
  v_pid_leggings UUID;
  v_pid_straightener UUID;
  v_pid_atmosphere UUID;  -- 氣氛燈
  v_pid_heart_ear UUID;   -- 心臟耳機殼
  v_kol_id UUID;
BEGIN
  -- ====== 找 staff ======
  SELECT id INTO v_staff_id FROM public.profiles WHERE email = 'staff2@gmail.com';
  IF v_staff_id IS NULL THEN RAISE EXCEPTION 'staff2@gmail.com not found'; END IF;

  -- ====== 找商品 ======
  SELECT id INTO v_pid_projector FROM public.products WHERE name = '投影機' LIMIT 1;
  SELECT id INTO v_pid_earphone FROM public.products WHERE name = '耳機殼' LIMIT 1;
  SELECT id INTO v_pid_curler FROM public.products WHERE name = '捲髮棒' LIMIT 1;
  SELECT id INTO v_pid_leggings FROM public.products WHERE name = '光腿神器' LIMIT 1;
  SELECT id INTO v_pid_straightener FROM public.products WHERE name = '直髮梳' LIMIT 1;
  SELECT id INTO v_pid_atmosphere FROM public.products WHERE name = '氣氛燈' LIMIT 1;
  SELECT id INTO v_pid_heart_ear FROM public.products WHERE name = '心臟耳機殼' LIMIT 1;

  -- ====== 匯入網紅 ======

  -- 1. __yyn.29_ | 投影機 | active | 3台送 | 2025/11/7
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('__yyn.29_', 'active', '2025-11-07', '2025-12-07', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 2. n00_d1e__ | 耳機殼 | active | 3台送 | 2025/11/10
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('n00_d1e__', 'active', '2025-11-10', '2025-12-10', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 3. liliibby_ | 投影機 | active | 3台送 | 2025/12/1
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('liliibby_', 'active', '2025-12-01', '2026-01-01', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 4. gerbino_anita | 投影機、耳機殼 | active | 特別情況 | 2025/12/10
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('gerbino_anita', 'active', '2025-12-10', '2026-01-10', true, 20, 1, v_staff_id, '特別情況')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 5. kui.u_2 | 投影機 | active | 3台送 | 2025/12/23
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('kui.u_2', 'active', '2025-12-23', '2026-01-23', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 6. yvonne.iu | 光腿神器 | active | 直接送 | 2025/12/30
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('yvonne.iu', 'active', '2025-12-30', '2026-01-30', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 7. yvonne.iu ( ni_0622_ | 光腿神器 | active | 直接送 | 2025/12/30 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yvonne.iu ( ni_0622_', 'active', '2025-12-30', '2026-01-30', true, 'direct', 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 8. h____an__94 | 投影機 | active | 直接送 | 2026/1/1
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('h____an__94', 'active', '2026-01-01', '2026-02-01', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 9. raye_0_9_1_6_ | 投影機、直髮梳、光腿神器 | active | 3台送 | 2026/1/13 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('raye_0_9_1_6_', 'active', '2026-01-13', '2026-02-13', true, 'after_3_sales', 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_straightener), (v_kol_id, v_pid_leggings);

  -- 10. xx.si85 | 直髮梳 | active | 直接送 | 2026/1/14 | 送直髮梳，第2台開始分潤20%
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('xx.si85', 'active', '2026-01-14', '2026-02-14', true, 'direct', 20, 2, v_staff_id, '送直髮梳，第2台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 11. liang_11_29_woo.k | 耳機殼、心臟耳機殼 | active | 3台送 | 2026/1/15 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('liang_11_29_woo.k', 'active', '2026-01-15', '2026-02-15', true, 'after_3_sales', 20, 1, v_staff_id, '耳機殼 心臟耳機殼 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);
  IF v_pid_heart_ear IS NOT NULL THEN
    INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_heart_ear);
  END IF;

  -- 12. little_snail_688 | 捲髮棒、光腿神器 | active | 直接送 | 2026/1/17
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('little_snail_688', 'active', '2026-01-17', '2026-02-17', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler), (v_kol_id, v_pid_leggings);

  -- 13. Njou | 投影機 | active | 3台送 | 2026/2/1
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('Njou', 'active', '2026-02-01', '2026-03-01', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 14. xx.si95 | 投影機 | active | 直接送 | 2026/2/14 | 送投影機，第2台開始分潤20%
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('xx.si95', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送投影機，第2台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 15. igjkloolol | 捲髮棒 | active | 3台送 | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('igjkloolol', 'active', '2026-02-14', '2026-03-14', true, 'after_3_sales', 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 16. _51chen_ | 光腿神器 | active | 直接送 | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('_51chen_', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 17. __yyy.un_ | 捲髮棒 | active | 直接送 | 2026/2/14 | 送捲髮棒，第2台開始分潤20%
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('__yyy.un_', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送捲髮棒，第2台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 18. yuhnkx_ | 捲髮棒 | active | 3台送 | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yuhnkx_', 'active', '2026-02-14', '2026-03-14', true, 'after_3_sales', 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 19. 08.20.94 | 投影機 | active | 直接送 | 2026/2/14 | 送投影機，第2台開始分潤20%
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('08.20.94', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送投影機，第2台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 20. _149girl_ | 光腿神器 | active | 直接送 | 2026/2/14 | 送光腿神器，第2台開始分潤20%
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('_149girl_', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送光腿神器，第2台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 21. nayi__158 | 直髮梳 | active | 3台送 | 2026/3/1
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('nayi__158', 'active', '2026-03-01', '2026-04-01', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 22. 5krista27 | 投影機 | potential (等待回覆) | 3台送 | 無日期
  INSERT INTO public.kols (ig_handle, status, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('5krista27', 'potential', true, 'after_3_sales', 20, 1, v_staff_id, '待定')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 23. y_zo0e | 捲髮棒、直髮梳 | potential (等待回覆) | 直接送 | 2026/2/14 | 送直髮梳 捲髮棒試用，未確認開團時間
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('y_zo0e', 'potential', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff_id, '送直髮梳 捲髮棒試用，未確認開團時間')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler), (v_kol_id, v_pid_straightener);

  -- 24. _149girl_ (第二次) | 投影機、氣氛燈 | active | 直接送 | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('_149girl_', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);
  IF v_pid_atmosphere IS NOT NULL THEN
    INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_atmosphere);
  END IF;

  RAISE NOTICE 'Done! Inserted 24 KOLs for staff2@gmail.com.';
END $$;
