-- ============================================
-- 追加匯入 staff1@gmail.com 的資料
-- ============================================

DO $$
DECLARE
  v_staff_id UUID;
  v_pid_projector UUID;
  v_pid_earphone UUID;
  v_pid_curler UUID;
  v_pid_leggings UUID;
  v_pid_straightener UUID;
  v_kol_id UUID;
BEGIN
  -- ====== 找 staff ======
  SELECT id INTO v_staff_id FROM public.profiles WHERE email = 'staff1@gmail.com';
  IF v_staff_id IS NULL THEN RAISE EXCEPTION 'staff1@gmail.com not found'; END IF;

  -- ====== 找商品 ======
  SELECT id INTO v_pid_projector FROM public.products WHERE name = '投影機' LIMIT 1;
  SELECT id INTO v_pid_earphone FROM public.products WHERE name = '耳機殼' LIMIT 1;
  SELECT id INTO v_pid_curler FROM public.products WHERE name = '捲髮棒' LIMIT 1;
  SELECT id INTO v_pid_leggings FROM public.products WHERE name = '光腿神器' LIMIT 1;
  SELECT id INTO v_pid_straightener FROM public.products WHERE name = '直髮梳' LIMIT 1;

  -- ====== 匯入網紅 ======

  -- 1. dooobi_lee | 耳機殼 | active | 2025/12/10 | 3台送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('dooobi_lee', 'active', '2025-12-10', '2026-01-10', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 2. cheng_lin6721 | 投影機、耳機殼 | active | 2025/12/20 | 3台送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('cheng_lin6721', 'active', '2025-12-20', '2026-01-20', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 3. 2000_ fang | 投影機 | active | 2025/12/21 | 直接送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('2000_ fang', 'active', '2025-12-21', '2026-01-21', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 4. yaoizurgurl | 投影機 | active | 2026/1/1 | 直接送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('yaoizurgurl', 'active', '2026-01-01', '2026-02-01', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 5. 7b1iz | 捲髮棒、光腿神器 | active | 2026/1/10 | 3台送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('7b1iz', 'active', '2026-01-10', '2026-02-10', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler), (v_kol_id, v_pid_leggings);

  -- 6. _lizisai | 耳機殼 | active | 2026/1/22 | 直接送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('_lizisai', 'active', '2026-01-22', '2026-02-22', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 7. diana226_ | 光腿神器 | active | 2026/1/30 | 直接送 | 第一台不做分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('diana226_', 'active', '2026-01-30', '2026-03-01', true, 'direct', 20, 2, v_staff_id, '第一台不做分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 8. woo.k_xuannnn | 投影機、捲髮棒 | active | 2026/2/1 | 3台送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('woo.k_xuannnn', 'active', '2026-02-01', '2026-03-01', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_curler);

  -- 9. smile._.10_23 | 光腿神器 | active | 2026/2/2 | 直接送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('smile._.10_23', 'active', '2026-02-02', '2026-03-02', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 10. smile._.10_23 | 投影機 | active | 2026/2/16 | 直接送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('smile._.10_23', 'active', '2026-02-16', '2026-03-16', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 11. mu_y.love_ | 直髮梳 | potential (待定) | 2026/3/1
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('mu_y.love_', 'potential', '2026-03-01', '2026-04-01', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 12. pei_1007 | 投影機、耳機殼 | active | 2025/12/23 | 3台送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('pei_1007', 'active', '2025-12-23', '2026-01-23', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 13. skull_henzy | 投影機 | active | 2026/2/18 | 直接送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('skull_henzy', 'active', '2026-02-18', '2026-03-18', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 14. syz._o3_11 | 耳機殼 | active | 2026/3/15 | 3台送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('syz._o3_11', 'active', '2026-03-15', '2026-04-15', true, 'after_3_sales', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 15. nitawang0716 | 投影機 | active | 2026/3/5 | 直接送
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('nitawang0716', 'active', '2026-03-05', '2026-04-05', true, 'direct', 20, 1, v_staff_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  RAISE NOTICE 'Done! Inserted 15 KOLs for staff1@gmail.com.';
END $$;
