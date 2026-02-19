-- ============================================
-- 修正 seed2：刪除錯誤資料，重新匯入給 staff3@gmail.com
-- ============================================

DO $$
DECLARE
  v_staff3_id UUID;
  v_staff_id UUID;
  v_pid_projector UUID;
  v_pid_earphone UUID;
  v_pid_curler UUID;
  v_pid_leggings UUID;
  v_pid_straightener UUID;
  v_kol_id UUID;
  v_deleted INTEGER;
BEGIN
  -- ====== 找 staff ======
  SELECT id INTO v_staff3_id FROM public.profiles WHERE email = 'staff3@gmail.com';
  IF v_staff3_id IS NULL THEN RAISE EXCEPTION 'staff3@gmail.com not found'; END IF;

  SELECT id INTO v_staff_id FROM public.profiles WHERE email = 'staff@test.com';

  -- ====== 刪除 seed2 錯誤匯入的資料（跑了兩次，staff@test.com 和 staff3 各有重複）======
  -- 用 ig_handle + group_buy_start_date 精準比對 seed2 的資料
  DELETE FROM public.kols
  WHERE (ig_handle, group_buy_start_date::text) IN (
    ('chien_andrew816', '2025-11-15'),
    ('abby__0924', '2025-11-22'),
    ('weiweieatsnew(達斐濟)', '2025-11-30'),
    ('xiangting_06', '2025-12-01'),
    ('xweichen._', '2025-12-20'),
    ('yu_ru12.19', '2026-01-06'),
    ('tu.125_', '2026-01-12'),
    ('ru_.525', '2026-01-14'),
    ('z_mou_18', '2026-01-15'),
    ('yiyu1207_', '2026-01-26'),
    ('lin_jing_yi_0716', '2026-02-01'),
    ('zixi.1107', '2026-01-13'),
    ('weii.ai', '2026-02-14'),
    ('nora___12____', '2026-02-14'),
    ('12wyn12', '2026-02-14'),
    ('_.tt45', '2026-02-14'),
    ('yu_ru12.19', '2026-02-14'),
    ('yaan_.08', '2026-02-14'),
    ('hignzu', '2026-02-14'),
    ('njou_loa', '2026-02-14')
  );
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RAISE NOTICE 'Deleted % incorrect KOL records from seed2', v_deleted;

  -- ====== 找商品 ======
  SELECT id INTO v_pid_projector FROM public.products WHERE name = '投影機' LIMIT 1;
  SELECT id INTO v_pid_earphone FROM public.products WHERE name = '耳機殼' LIMIT 1;
  SELECT id INTO v_pid_curler FROM public.products WHERE name = '捲髮棒' LIMIT 1;
  SELECT id INTO v_pid_leggings FROM public.products WHERE name = '光腿神器' LIMIT 1;
  SELECT id INTO v_pid_straightener FROM public.products WHERE name = '直髮梳' LIMIT 1;

  -- ====== 重新匯入，全部給 staff3@gmail.com ======

  -- 1. chien_andrew816 | 投影機 | ended | 3台送 | 2025/11/15
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('chien_andrew816', 'ended', '2025-11-15', '2025-12-15', true, 'after_3_sales', 20, 1, v_staff3_id, '3台送，已結束')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 2. abby__0924 | 投影機 | active | 3台送 | 2025/11/22
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('abby__0924', 'active', '2025-11-22', '2025-12-22', true, 'after_3_sales', 20, 1, v_staff3_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 3. weiweieatsnew(達斐濟) | 投影機 | active | 直接送 | 2025/11/30
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('weiweieatsnew(達斐濟)', 'active', '2025-11-30', '2025-12-30', true, 'direct', 20, 1, v_staff3_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 4. xiangting_06 | 投影機 | active | 3台送 | 2025/12/1
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('xiangting_06', 'active', '2025-12-01', '2026-01-01', true, 'after_3_sales', 20, 1, v_staff3_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 5. xweichen._ | 投影機 | active | 3台送 | 2025/12/20
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id)
  VALUES ('xweichen._', 'active', '2025-12-20', '2026-01-20', true, 'after_3_sales', 20, 1, v_staff3_id)
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 6. yu_ru12.19 | 投影機 | active | 直接送 | 2026/1/6
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yu_ru12.19', 'active', '2026-01-06', '2026-02-06', true, 'direct', 20, 1, v_staff3_id, '送投影機 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 7. yu_ru12.19 | 捲髮棒 | active | 直接送 | 2026/1/6
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yu_ru12.19', 'active', '2026-01-06', '2026-02-06', true, 'direct', 20, 1, v_staff3_id, '送捲髮棒 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 8. tu.125_ | 光腿神器 | active | 3台送 | 2026/1/12
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('tu.125_', 'active', '2026-01-12', '2026-02-12', true, 'after_3_sales', 20, 1, v_staff3_id, '第三筆訂單送光腿神器 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 9. ru_.525 | 捲髮棒 | active | 直接送 | 2026/1/14
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('ru_.525', 'active', '2026-01-14', '2026-02-14', true, 'direct', 20, 1, v_staff3_id, '送捲髮棒 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 10. z_mou_18 | 投影機 | active | 3台送 | 2026/1/15 | 第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('z_mou_18', 'active', '2026-01-15', '2026-02-15', true, 'after_3_sales', 20, 2, v_staff3_id, '送投影機 第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 11. yiyu1207_ | 投影機 | active | 直接送 | 2026/1/26
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yiyu1207_', 'active', '2026-01-26', '2026-02-26', true, 'direct', 20, 1, v_staff3_id, '第三筆訂單送投影機 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 12. lin_jing_yi_0716 | 捲髮棒 | ended (已取消) | 3台送 | 2026/2/1
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('lin_jing_yi_0716', 'ended', '2026-02-01', '2026-03-01', true, 'after_3_sales', 20, 1, v_staff3_id, '已取消')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 13. zixi.1107 | 直髮梳 | active | 直接送 | 2026/1/13
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('zixi.1107', 'active', '2026-01-13', '2026-02-13', true, 'direct', 20, 1, v_staff3_id, '送直髮梳 20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 14. zixi.1107 | 光腿神器 | active | 直接送 | 2026/1/13
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('zixi.1107', 'active', '2026-01-13', '2026-02-13', true, 'direct', 20, 1, v_staff3_id, '送光腿神器 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 15. weii.ai | 捲髮棒 | active | 3台送 | 2026/2/14
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('weii.ai', 'active', '2026-02-14', '2026-03-14', true, 'after_3_sales', 20, 1, v_staff3_id, '送光腿神器 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 16. nora___12____ | 光腿神器 | active | 直接送 | 2026/2/14
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('nora___12____', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff3_id, '送光腿神器 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 17. 12wyn12 | 投影機 | active | 直接送 | 2026/2/14 | 第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('12wyn12', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff3_id, '送投影機 第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 18. _.tt45 | 投影機 | active | 直接送 | 2026/2/14
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('_.tt45', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff3_id, '送投影機 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 19. yu_ru12.19 | 光腿神器 | active | 直接送 | 2026/2/14
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yu_ru12.19', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff3_id, '送光腿神器 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 20. yaan_.08 | 捲髮棒 | active | 直接送 | 2026/2/14 | 第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yaan_.08', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff3_id, '送捲髮棒 第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 21. hignzu | 光腿神器 | active | 直接送 | 2026/2/14
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('hignzu', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff3_id, '送光腿神器 20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 22. njou_loa | 投影機 | active | 直接送 | 2026/2/14 | 第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('njou_loa', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff3_id, '送投影機 第二台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  RAISE NOTICE 'Done! Deleted old records and inserted 22 KOLs for staff3@gmail.com.';
END $$;
