-- ============================================
-- 完整匯入舊資料 Seed Script
-- 先清除舊資料再重新匯入
-- ============================================

DO $$
DECLARE
  v_staff_id UUID;
  v_pid_projector UUID;   -- 投影機
  v_pid_earphone UUID;    -- 耳機殼
  v_pid_curler UUID;      -- 捲髮棒
  v_pid_leggings UUID;    -- 光腿神器
  v_pid_straightener UUID;-- 直髮梳
  v_kol_id UUID;
BEGIN
  -- ====== 找 staff ======
  SELECT id INTO v_staff_id FROM public.profiles WHERE email = 'staff@test.com';
  IF v_staff_id IS NULL THEN
    RAISE EXCEPTION 'staff@test.com not found in profiles';
  END IF;

  -- ====== 清除舊資料 ======
  DELETE FROM public.kol_products;
  DELETE FROM public.kols;

  -- ====== 取得所有商品 ID ======
  SELECT id INTO v_pid_projector FROM public.products WHERE name = '投影機' LIMIT 1;
  SELECT id INTO v_pid_earphone FROM public.products WHERE name = '耳機殼' LIMIT 1;
  SELECT id INTO v_pid_curler FROM public.products WHERE name = '捲髮棒' LIMIT 1;
  SELECT id INTO v_pid_leggings FROM public.products WHERE name = '光腿神器' LIMIT 1;
  SELECT id INTO v_pid_straightener FROM public.products WHERE name = '直髮梳' LIMIT 1;

  -- ====== 匯入網紅 ======

  -- 1. yu_en1107 | 投影機 | active | 2025/5/1 | 3台投影機，5台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yu_en1107', 'active', '2025-05-01', '2025-06-01', true, 'direct', 20, 5, v_staff_id, '3台投影機，5台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 2. yu.___15 | 投影機 | active | 2025/5/1 | 3台投影機，5台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yu.___15', 'active', '2025-05-01', '2025-06-01', true, 'direct', 20, 5, v_staff_id, '3台投影機，5台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 3. _bxbo._ | 投影機 | active | 2025/5/1 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('_bxbo._', 'active', '2025-05-01', '2025-06-01', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 4. sulll.12 | 投影機 | active | 2025/5/1 | 3台投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('sulll.12', 'active', '2025-05-01', '2025-06-01', true, 'direct', 20, 1, v_staff_id, '3台投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 5. morosa.lin | 投影機 | active | 2025/7/27 | 3台投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('morosa.lin', 'active', '2025-07-27', '2025-08-27', true, 'direct', 20, 1, v_staff_id, '3台投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 6. na_yi_158 | 投影機 | active | 2025/7/27 | 3台投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('na_yi_158', 'active', '2025-07-27', '2025-08-27', true, 'direct', 20, 1, v_staff_id, '3台投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 7. Irac5431Irac | 投影機 | active | 2025/10/31 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('Irac5431Irac', 'active', '2025-10-31', '2025-11-30', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 8. __yu.o9_ | 耳機殼 | active | 2025/9/29 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('__yu.o9_', 'active', '2025-09-29', '2025-10-29', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 9. ru_.525 | 耳機殼 | active | 2025/10/8 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('ru_.525', 'active', '2025-10-08', '2025-11-08', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 10. egg.319 | 耳機殼 | active | 2025/10/10 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('egg.319', 'active', '2025-10-10', '2025-11-10', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 11. yi_16y_ | 耳機殼 | active | 2025/10/15 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yi_16y_', 'active', '2025-10-15', '2025-11-15', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 12. lznnyuz | 投影機、耳機殼 | active | 2025/10/15 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('lznnyuz', 'active', '2025-10-15', '2025-11-15', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 13. diana226_ | 耳機殼 | active | 2025/10/28 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('diana226_', 'active', '2025-10-28', '2025-11-28', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 14. meow_storm93 | 投影機、耳機殼 | active | 2025/10/10 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('meow_storm93', 'active', '2025-10-10', '2025-11-10', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 15. yzcn_1127 | 投影機 | active | 2025/10/8 | 送耳機殼，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yzcn_1127', 'active', '2025-10-08', '2025-11-08', true, 'direct', 20, 1, v_staff_id, '送耳機殼，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 16. __ucf.187 | 投影機、耳機殼 | active | 2025/10/8 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('__ucf.187', 'active', '2025-10-08', '2025-11-08', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 17. l.hhas | 投影機 | active | 2025/11/24 | 送投影機，第2台開始分潤20%
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('l.hhas', 'active', '2025-11-24', '2025-12-24', true, 'direct', 20, 2, v_staff_id, '送投影機，第2台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 18. 77iu_t | 投影機 | active | 2025/10/10 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('77iu_t', 'active', '2025-10-10', '2025-11-10', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 19. clari_4.2.5 | 投影機、耳機殼 | active | 2025/10/10 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('clari_4.2.5', 'active', '2025-10-10', '2025-11-10', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 20. cy_7003 | 投影機 | potential (等待回覆) | 無日期 | 送投影機，20%分潤+短影片合作
  INSERT INTO public.kols (ig_handle, status, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('cy_7003', 'potential', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤+短影片合作')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 21. _158.chuu | 投影機 | active | 2025/10/17 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('_158.chuu', 'active', '2025-10-17', '2025-11-17', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 22. cib.whc._.76 | 投影機、耳機殼 | active | 2025/10/20 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('cib.whc._.76', 'active', '2025-10-20', '2025-11-20', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 23. jinn_628 | 投影機 | active | 2025/11/27 | 送投影機，第2台開始分潤20%
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('jinn_628', 'active', '2025-11-27', '2025-12-27', true, 'direct', 20, 2, v_staff_id, '送投影機，第2台開始分潤20%')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 24. jiaaa._1027 | 投影機 | active | 2025/11/18 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('jiaaa._1027', 'active', '2025-11-18', '2025-12-18', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 25. xbdu.3 | 投影機、耳機殼 | active | 2025/11/22 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('xbdu.3', 'active', '2025-11-22', '2025-12-22', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_earphone);

  -- 26. rucy_0121 | 投影機 | active | 2025/11/15 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('rucy_0121', 'active', '2025-11-15', '2025-12-15', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 27. zixi.1107 | 投影機 | active | 2025/11/11 | 第六台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('zixi.1107', 'active', '2025-11-11', '2025-12-11', false, 20, 6, v_staff_id, '第六台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 28. 少年沉 | 投影機 | active | 2025/11/19 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('少年沉', 'active', '2025-11-19', '2025-12-19', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 29. smallwei0406 | 投影機 | active | 2025/12/1 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('smallwei0406', 'active', '2025-12-01', '2026-01-01', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 30. lb_o7_ | 投影機 | active | 2025/11/19 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('lb_o7_', 'active', '2025-11-19', '2025-12-19', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 31. melody._.1031 | 投影機 | active | 2025/11/18 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('melody._.1031', 'active', '2025-11-18', '2025-12-18', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 32. yun._724 | 投影機 | active | 2025/11/20 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yun._724', 'active', '2025-11-20', '2025-12-20', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 33. kkkuei._ | 無商品 | potential (待定)
  INSERT INTO public.kols (ig_handle, status, staff_id)
  VALUES ('kkkuei._', 'potential', v_staff_id);

  -- 34. ____.x_u7_ | 投影機 | active | 2025/11/22 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('____.x_u7_', 'active', '2025-11-22', '2025-12-22', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 35. hai1218__(海寬） | 投影機 | active | 2025/11/22 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('hai1218__(海寬）', 'active', '2025-11-22', '2025-12-22', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 36. imrongrong._ | 投影機 | potential (待定) | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('imrongrong._', 'potential', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 37. qabi_xiaomin | 無商品 | potential (待定)
  INSERT INTO public.kols (ig_handle, status, staff_id)
  VALUES ('qabi_xiaomin', 'potential', v_staff_id);

  -- 38. cutechu__0222 | 投影機 | active | 無日期 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('cutechu__0222', 'active', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 39. bzyyo__ | 捲髮棒 | active | 無日期 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('bzyyo__', 'active', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 40. cy_0328 | 捲髮棒 | active | 2025/12/23 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('cy_0328', 'active', '2025-12-23', '2026-01-23', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 41. fangxl.51 | 光腿神器 | active | 無日期 | 送光腿，20%分潤
  INSERT INTO public.kols (ig_handle, status, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('fangxl.51', 'active', true, 'direct', 20, 1, v_staff_id, '送光腿，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 42. 5.27bb | 投影機 | active | 2026/1/19 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('5.27bb', 'active', '2026-01-19', '2026-02-19', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 43. jia_xuan_0923 | 投影機 | active | 2026/2/14 | 送投影機，20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('jia_xuan_0923', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 1, v_staff_id, '送投影機，20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 44. imzunl | 耳機殼 | active | 2026/1/5 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('imzunl', 'active', '2026-01-05', '2026-02-05', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 45. yscc._ | 捲髮棒 | active | 2026/1/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yscc._', 'active', '2026-01-14', '2026-02-14', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_curler);

  -- 46. yuan11.14 | 光腿神器 | active | 2026/2/14 | 送公關，第二個開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yuan11.14', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二個開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 47. yubbh0728 | 投影機, 直髮梳 | active | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yubbh0728', 'active', '2026-02-14', '2026-03-14', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_straightener);

  -- 48. sulll.12 (第二次) | 投影機 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('sulll.12', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 49. yu._.0530 | 投影機, 捲髮棒 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yu._.0530', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector), (v_kol_id, v_pid_curler);

  -- 50. luij424_97 | 投影機 | active | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('luij424_97', 'active', '2026-02-14', '2026-03-14', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 51. ir_twoyy | 直髮梳 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('ir_twoyy', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 52. yzxi.n | 投影機 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yzxi.n', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 53. puppy._.yuan89 | 投影機 | active | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('puppy._.yuan89', 'active', '2026-02-14', '2026-03-14', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 54. xnnita._ | 耳機殼 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('xnnita._', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 55. elvoj__l | 直髮梳 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('elvoj__l', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 56. ed21.__ | 直髮梳 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('ed21.__', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 57. ld.1003_ | 光腿神器 | ended (已拒絕) | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('ld.1003_', 'ended', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '已拒絕；送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 58. roure.yun | 直髮梳 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('roure.yun', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_straightener);

  -- 59. chiao_02.03 | 無商品 | potential (待定)
  INSERT INTO public.kols (ig_handle, status, staff_id)
  VALUES ('chiao_02.03', 'potential', v_staff_id);

  -- 60. yun._724 (第二次) | 光腿神器 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('yun._724', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_leggings);

  -- 61. tearsgirl_0811 | 耳機殼 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('tearsgirl_0811', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 62. sh_8878 | 投影機 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('sh_8878', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 63. 166.0215_ | 耳機殼 | active | 2026/2/14 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('166.0215_', 'active', '2026-02-14', '2026-03-14', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  -- 64. jiaaa._1027 (第二次) | 投影機 | active | 2026/2/14 | 20%分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('jiaaa._1027', 'active', '2026-02-14', '2026-03-14', false, 20, 1, v_staff_id, '20%分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_projector);

  -- 65. eshao_830 | 耳機殼 | active | 2026/3/1 | 送公關，第二台開始分潤
  INSERT INTO public.kols (ig_handle, status, group_buy_start_date, group_buy_end_date, has_pr_products, pr_ship_mode, revenue_share_pct, revenue_share_start_unit, staff_id, notes)
  VALUES ('eshao_830', 'active', '2026-03-01', '2026-04-01', true, 'direct', 20, 2, v_staff_id, '送公關，第二台開始分潤')
  RETURNING id INTO v_kol_id;
  INSERT INTO public.kol_products (kol_id, product_id) VALUES (v_kol_id, v_pid_earphone);

  RAISE NOTICE 'Done! Inserted 65 KOLs with product links.';
END $$;
