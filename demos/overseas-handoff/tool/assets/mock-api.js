(function () {
  "use strict";

  localStorage.removeItem("ohc_user");

  const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };
  const BATCH_ID = "DEMO-20260618";
  const SNAPSHOT_AT = "2026-06-18T09:30:00";

  const roles = [
    {
      role_code: "global_coordinator",
      role_name_cn: "全局统筹者",
      role_name_short: "统筹",
      default_home_grain: "brand_group",
      export_row_limit: 0,
      sort_order: 1,
      remark: "观察整体风险集中在哪些业务范围、哪类角色承压，并进入人员视角只读核实现场。",
    },
    {
      role_code: "subject_owner",
      role_name_cn: "主体负责人",
      role_name_short: "主体负责人",
      default_home_grain: "subject_no",
      export_row_limit: 5000,
      sort_order: 2,
      remark: "判断负责主体的风险集中在哪些店铺、品类或国家，并复核物流和运营两侧最需要关注的对象。",
    },
    {
      role_code: "supply_planner",
      role_name_cn: "计划",
      role_name_short: "计划",
      default_home_grain: "sales_link",
      export_row_limit: 10000,
      sort_order: 3,
      remark: "从逾期销售链接角度观察风险，判断哪些链接、店铺或货件需要优先关注。",
    },
    {
      role_code: "first_leg_logistics",
      role_name_cn: "物流",
      role_name_short: "物流",
      default_home_grain: "shipment_no",
      export_row_limit: 10000,
      sort_order: 4,
      remark: "在货件级判断最多可提前几天上架，并优先处理金额较高、仍待判断的货件。",
    },
    {
      role_code: "business_ops",
      role_name_cn: "运营",
      role_name_short: "运营",
      default_home_grain: "sales_link",
      export_row_limit: 5000,
      sort_order: 5,
      remark: "定位自己负责销售链接的风险，判断哪些链接和货件需要优先处理、观察或请物流协同。",
    },
  ];

  const users = [
    makeUser("USR-7K3QF", "统筹-7K3QF", ["global_coordinator"], "global_coordinator"),
    makeUser("USR-4M8P2", "主体-4M8P2", ["subject_owner"], "subject_owner"),
    makeUser("USR-P6M3T", "计划员-P6M3T", ["supply_planner"], "supply_planner"),
    makeUser("USR-H6T9N", "物流-H6T9N", ["first_leg_logistics"], "first_leg_logistics"),
    makeUser("USR-Q4D8R", "运营-Q4D8R", ["business_ops"], "business_ops"),
    makeUser("USR-X8R2N", "运营-X8R2N", ["business_ops"], "business_ops"),
    makeUser("USR-L5Q8R", "物流-L5Q8R", ["first_leg_logistics"], "first_leg_logistics"),
    makeUser("USR-K7D3Q", "主体-K7D3Q", ["subject_owner"], "subject_owner"),
  ];

  const granularityOptions = [
    { value: "brand_group", label: "品牌集合" },
    { value: "subject_no", label: "主体" },
    { value: "account_name", label: "店铺名称" },
    { value: "category1", label: "一级品类" },
    { value: "category2", label: "二级品类" },
    { value: "category3", label: "三级品类" },
    { value: "country", label: "国家" },
  ];

  const roleUser = {
    global_coordinator: users[0],
    subject_owner: users[1],
    supply_planner: users[2],
    first_leg_logistics: users[3],
    business_ops: users[4],
  };

  const linkRows = [
    {
      key: "LNK-4R8QP",
      product: "产品-6T9XR",
      subject: "ENT-4M8P2",
      brand: "BRD-9X2A6",
      shop: "SHOP-K7D3Q",
      platformSku: "PSK-8D2MQ",
      systemSku: "SKU-3F7NQ",
      country: "美国",
      freight: "普船",
      channel3: "渠道-K7D3Q",
      ops: "运营-Q4D8R",
      planner: "计划员-P6M3T",
      category1: "CAT1-L5Q8R",
      category2: "CAT2-P6M3T",
      category3: "CAT3-Q8R2N",
      stockStatus: "常规",
      rawLoss: 842000,
      weightedLoss: 673600,
      inTransitGmv: 1684000,
      shipments: ["SHIP-7K3QM", "SHIP-2M8PX", "SHIP-9X2A6"],
      firstGap: "2026-06-29",
      commentCount: 2,
    },
    {
      key: "LNK-8D2MQ",
      product: "产品-5Q8LP",
      subject: "ENT-K7D3Q",
      brand: "BRD-6T9XR",
      shop: "SHOP-3F7NQ",
      platformSku: "PSK-Q8R2N",
      systemSku: "SKU-L5Q8R",
      country: "加拿大",
      freight: "快船",
      channel3: "渠道-P6M3T",
      ops: "运营-X8R2N",
      planner: "计划员-P6M3T",
      category1: "CAT1-9X2A6",
      category2: "CAT2-7K3QM",
      category3: "CAT3-4R8QP",
      stockStatus: "补货关注",
      rawLoss: 538000,
      weightedLoss: 430400,
      inTransitGmv: 1196000,
      shipments: ["SHIP-4R8QP", "SHIP-Q8R2N"],
      firstGap: "2026-07-06",
      commentCount: 1,
    },
    {
      key: "LNK-P6M3T",
      product: "产品-K7D3Q",
      subject: "ENT-4M8P2",
      brand: "BRD-9X2A6",
      shop: "SHOP-L5Q8R",
      platformSku: "PSK-7K3QM",
      systemSku: "SKU-4R8QP",
      country: "德国",
      freight: "空运",
      channel3: "渠道-5Q8LP",
      ops: "运营-Q4D8R",
      planner: "计划员-P6M3T",
      category1: "CAT1-L5Q8R",
      category2: "CAT2-5Q8LP",
      category3: "CAT3-K7D3Q",
      stockStatus: "新品",
      rawLoss: 326000,
      weightedLoss: 260800,
      inTransitGmv: 812000,
      shipments: ["SHIP-L5Q8R", "SHIP-5Q8LP"],
      firstGap: "2026-07-13",
      commentCount: 3,
    },
    {
      key: "LNK-5Q8LP",
      product: "产品-2M8PX",
      subject: "ENT-4M8P2",
      brand: "BRD-9X2A6",
      shop: "SHOP-8D2MQ",
      platformSku: "PSK-K7D3Q",
      systemSku: "SKU-9X2A6",
      country: "美国",
      freight: "快船",
      channel3: "渠道-3F7NQ",
      ops: "运营-Q4D8R",
      planner: "计划员-P6M3T",
      category1: "CAT1-4R8QP",
      category2: "CAT2-Q8R2N",
      category3: "CAT3-L5Q8R",
      stockStatus: "常规",
      rawLoss: 284000,
      weightedLoss: 227200,
      inTransitGmv: 684000,
      shipments: ["SHIP-6T9XR", "SHIP-8D2MQ"],
      firstGap: "2026-07-20",
      commentCount: 1,
    },
    {
      key: "LNK-K7D3Q",
      product: "产品-Q8R2N",
      subject: "ENT-8D2MQ",
      brand: "BRD-2M8PX",
      shop: "SHOP-9X2A6",
      platformSku: "PSK-3F7NQ",
      systemSku: "SKU-Q8R2N",
      country: "加拿大",
      freight: "普船",
      channel3: "渠道-L5Q8R",
      ops: "运营-Q4D8R",
      planner: "计划员-P6M3T",
      category1: "CAT1-4R8QP",
      category2: "CAT2-8D2MQ",
      category3: "CAT3-6T9XR",
      stockStatus: "补货关注",
      rawLoss: 216000,
      weightedLoss: 172800,
      inTransitGmv: 538000,
      shipments: ["SHIP-3F7NQ"],
      firstGap: "2026-07-27",
      commentCount: 0,
    },
    {
      key: "LNK-3F7NQ",
      product: "产品-9X2A6",
      subject: "ENT-K7D3Q",
      brand: "BRD-6T9XR",
      shop: "SHOP-P6M3T",
      platformSku: "PSK-5Q8LP",
      systemSku: "SKU-8D2MQ",
      country: "德国",
      freight: "空运",
      channel3: "渠道-Q8R2N",
      ops: "运营-Q4D8R",
      planner: "计划员-P6M3T",
      category1: "CAT1-9X2A6",
      category2: "CAT2-5Q8LP",
      category3: "CAT3-P6M3T",
      stockStatus: "新品",
      rawLoss: 176000,
      weightedLoss: 140800,
      inTransitGmv: 462000,
      shipments: ["SHIP-P6M3T"],
      firstGap: "2026-08-03",
      commentCount: 2,
    },
    {
      key: "LNK-9X2A6",
      product: "产品-4R8QP",
      subject: "ENT-8D2MQ",
      brand: "BRD-2M8PX",
      shop: "SHOP-Q8R2N",
      platformSku: "PSK-L5Q8R",
      systemSku: "SKU-K7D3Q",
      country: "美国",
      freight: "普船",
      channel3: "渠道-8D2MQ",
      ops: "运营-Q4D8R",
      planner: "计划员-P6M3T",
      category1: "CAT1-4R8QP",
      category2: "CAT2-Q8R2N",
      category3: "CAT3-2M8PX",
      stockStatus: "常规",
      rawLoss: 142000,
      weightedLoss: 113600,
      inTransitGmv: 356000,
      shipments: ["SHIP-K7D3Q"],
      firstGap: "2026-08-10",
      commentCount: 1,
    },
    {
      key: "LNK-L5Q8R",
      product: "产品-8D2MQ",
      subject: "ENT-4M8P2",
      brand: "BRD-9X2A6",
      shop: "SHOP-5Q8LP",
      platformSku: "PSK-9X2A6",
      systemSku: "SKU-P6M3T",
      country: "加拿大",
      freight: "快船",
      channel3: "渠道-6T9XR",
      ops: "运营-Q4D8R",
      planner: "计划员-P6M3T",
      category1: "CAT1-L5Q8R",
      category2: "CAT2-7K3QM",
      category3: "CAT3-8D2MQ",
      stockStatus: "常规",
      rawLoss: 98000,
      weightedLoss: 78400,
      inTransitGmv: 244000,
      shipments: ["SHIP-8D2PX"],
      firstGap: "2026-08-17",
      commentCount: 0,
    },
  ];

  const shipments = [
    makeShipment({
      shipment: "SHIP-7K3QM",
      link: linkRows[0],
      logistics: "物流-H6T9N",
      logisticsUser: "USR-H6T9N",
      qty: 420,
      unitPrice: 820,
      rawLoss: 352000,
      weightedLoss: 281600,
      recoverable: 236000,
      eta: "2026-07-15",
      requested: "2026-07-01",
      recommended: "2026-07-02",
      overdueDays: 12,
      advance: null,
      bucket: "strong_intervention",
      node: "国外清关放行",
      feedback: "节点已重新确认，等待下一轮反馈。",
      dates: ["2026-05-30", "2026-06-02", "2026-06-06", "2026-06-21", "2026-06-26", "", "", "2026-07-15"],
    }),
    makeShipment({
      shipment: "SHIP-2M8PX",
      link: linkRows[0],
      logistics: "物流-H6T9N",
      logisticsUser: "USR-H6T9N",
      qty: 260,
      unitPrice: 820,
      rawLoss: 268000,
      weightedLoss: 214400,
      recoverable: 184000,
      eta: "2026-07-21",
      requested: "2026-07-08",
      recommended: "2026-07-09",
      overdueDays: 9,
      advance: 5,
      bucket: "signed_not_putaway_3pl",
      node: "签收",
      feedback: "海外仓已收到催办，预计窗口内完成反馈。",
      dates: ["2026-06-02", "2026-06-05", "2026-06-09", "2026-06-23", "2026-06-28", "2026-07-02", "2026-07-04", "2026-07-21"],
    }),
    makeShipment({
      shipment: "SHIP-9X2A6",
      link: linkRows[0],
      logistics: "物流-L5Q8R",
      logisticsUser: "USR-L5Q8R",
      qty: 180,
      unitPrice: 820,
      rawLoss: 222000,
      weightedLoss: 177600,
      recoverable: 126000,
      eta: "2026-07-24",
      requested: "2026-07-10",
      recommended: "2026-07-12",
      overdueDays: 16,
      advance: null,
      bucket: "signed_not_putaway_platform",
      node: "签收",
      feedback: "平台仓上架需运营侧继续确认。",
      dates: ["2026-06-04", "2026-06-07", "2026-06-10", "2026-06-26", "2026-06-30", "2026-07-03", "2026-07-06", "2026-07-24"],
    }),
    makeShipment({
      shipment: "SHIP-4R8QP",
      link: linkRows[1],
      logistics: "物流-H6T9N",
      logisticsUser: "USR-H6T9N",
      qty: 310,
      unitPrice: 760,
      rawLoss: 296000,
      weightedLoss: 236800,
      recoverable: 162000,
      eta: "2026-07-18",
      requested: "2026-07-05",
      recommended: "2026-07-07",
      overdueDays: 7,
      advance: null,
      bucket: "strong_intervention",
      node: "到港",
      feedback: "已通知服务商复核清关资料。",
      dates: ["2026-06-01", "2026-06-03", "2026-06-07", "2026-06-25", "", "", "", "2026-07-18"],
    }),
    makeShipment({
      shipment: "SHIP-Q8R2N",
      link: linkRows[1],
      logistics: "物流-L5Q8R",
      logisticsUser: "USR-L5Q8R",
      qty: 225,
      unitPrice: 760,
      rawLoss: 242000,
      weightedLoss: 193600,
      recoverable: 118000,
      eta: "2026-07-26",
      requested: "2026-07-12",
      recommended: "2026-07-14",
      overdueDays: 11,
      advance: 3,
      bucket: "signed_not_putaway_3pl",
      node: "提取",
      feedback: "末端派送已预约，等待服务商回传签收节点。",
      dates: ["2026-06-05", "2026-06-08", "2026-06-12", "2026-06-29", "2026-07-02", "2026-07-05", "", "2026-07-26"],
    }),
    makeShipment({
      shipment: "SHIP-L5Q8R",
      link: linkRows[2],
      logistics: "物流-H6T9N",
      logisticsUser: "USR-H6T9N",
      qty: 145,
      unitPrice: 930,
      rawLoss: 188000,
      weightedLoss: 150400,
      recoverable: 96000,
      eta: "2026-07-11",
      requested: "2026-07-04",
      recommended: "2026-07-05",
      overdueDays: 5,
      advance: null,
      bucket: "strong_intervention",
      node: "离港",
      feedback: "舱位节点已核对，预计到港时间待复核。",
      dates: ["2026-06-10", "2026-06-11", "2026-06-14", "", "", "", "", "2026-07-11"],
    }),
    makeShipment({
      shipment: "SHIP-5Q8LP",
      link: linkRows[2],
      logistics: "物流-L5Q8R",
      logisticsUser: "USR-L5Q8R",
      qty: 122,
      unitPrice: 930,
      rawLoss: 138000,
      weightedLoss: 110400,
      recoverable: 74000,
      eta: "2026-07-19",
      requested: "2026-07-09",
      recommended: "2026-07-10",
      overdueDays: 6,
      advance: 2,
      bucket: "signed_not_putaway_platform",
      node: "签收",
      feedback: "已转运营侧跟进平台仓上架。",
      dates: ["2026-06-09", "2026-06-12", "2026-06-15", "2026-06-27", "2026-07-01", "2026-07-03", "2026-07-05", "2026-07-19"],
    }),
    makeShipment({
      shipment: "SHIP-6T9XR",
      link: linkRows[3],
      logistics: "物流-H6T9N",
      logisticsUser: "USR-H6T9N",
      qty: 168,
      unitPrice: 870,
      rawLoss: 156000,
      weightedLoss: 124800,
      recoverable: 84000,
      eta: "2026-07-28",
      requested: "2026-07-18",
      recommended: "2026-07-20",
      overdueDays: 8,
      advance: null,
      bucket: "strong_intervention",
      node: "国外清关放行",
      feedback: "清关资料已复核，等待服务商确认放行窗口。",
      dates: ["2026-06-12", "2026-06-15", "2026-06-18", "2026-07-02", "2026-07-06", "", "", "2026-07-28"],
    }),
    makeShipment({
      shipment: "SHIP-8D2MQ",
      link: linkRows[3],
      logistics: "物流-L5Q8R",
      logisticsUser: "USR-L5Q8R",
      qty: 134,
      unitPrice: 870,
      rawLoss: 128000,
      weightedLoss: 102400,
      recoverable: 72000,
      eta: "2026-08-02",
      requested: "2026-07-22",
      recommended: "2026-07-24",
      overdueDays: 10,
      advance: 4,
      bucket: "signed_not_putaway_3pl",
      node: "签收",
      feedback: "海外仓已确认排期，等待系统回传入库节点。",
      dates: ["2026-06-14", "2026-06-17", "2026-06-20", "2026-07-04", "2026-07-08", "2026-07-11", "2026-07-13", "2026-08-02"],
    }),
    makeShipment({
      shipment: "SHIP-3F7NQ",
      link: linkRows[4],
      logistics: "物流-H6T9N",
      logisticsUser: "USR-H6T9N",
      qty: 116,
      unitPrice: 790,
      rawLoss: 216000,
      weightedLoss: 172800,
      recoverable: 104000,
      eta: "2026-08-05",
      requested: "2026-07-26",
      recommended: "2026-07-28",
      overdueDays: 9,
      advance: null,
      bucket: "strong_intervention",
      node: "到港",
      feedback: "已到港，等待货代补充清关进度。",
      dates: ["2026-06-16", "2026-06-19", "2026-06-22", "2026-07-07", "", "", "", "2026-08-05"],
    }),
    makeShipment({
      shipment: "SHIP-P6M3T",
      link: linkRows[5],
      logistics: "物流-L5Q8R",
      logisticsUser: "USR-L5Q8R",
      qty: 94,
      unitPrice: 910,
      rawLoss: 176000,
      weightedLoss: 140800,
      recoverable: 82000,
      eta: "2026-08-08",
      requested: "2026-07-30",
      recommended: "2026-08-01",
      overdueDays: 7,
      advance: null,
      bucket: "signed_not_putaway_platform",
      node: "签收",
      feedback: "平台仓上架节奏需运营侧继续跟进。",
      dates: ["2026-06-18", "2026-06-20", "2026-06-23", "2026-07-08", "2026-07-12", "2026-07-15", "2026-07-17", "2026-08-08"],
    }),
    makeShipment({
      shipment: "SHIP-K7D3Q",
      link: linkRows[6],
      logistics: "物流-H6T9N",
      logisticsUser: "USR-H6T9N",
      qty: 88,
      unitPrice: 760,
      rawLoss: 142000,
      weightedLoss: 113600,
      recoverable: 66000,
      eta: "2026-08-13",
      requested: "2026-08-04",
      recommended: "2026-08-06",
      overdueDays: 6,
      advance: 2,
      bucket: "signed_not_putaway_3pl",
      node: "提取",
      feedback: "末端提取已预约，等待签收节点。",
      dates: ["2026-06-20", "2026-06-23", "2026-06-26", "2026-07-11", "2026-07-15", "2026-07-18", "", "2026-08-13"],
    }),
    makeShipment({
      shipment: "SHIP-8D2PX",
      link: linkRows[7],
      logistics: "物流-L5Q8R",
      logisticsUser: "USR-L5Q8R",
      qty: 72,
      unitPrice: 680,
      rawLoss: 98000,
      weightedLoss: 78400,
      recoverable: 42000,
      eta: "2026-08-20",
      requested: "2026-08-12",
      recommended: "2026-08-14",
      overdueDays: 5,
      advance: 1,
      bucket: "signed_not_putaway_3pl",
      node: "签收",
      feedback: "已签收，海外仓预计在新窗口内完成上架。",
      dates: ["2026-06-22", "2026-06-24", "2026-06-27", "2026-07-13", "2026-07-17", "2026-07-20", "2026-07-22", "2026-08-20"],
    }),
  ];

  const weeklyByLink = new Map(linkRows.map((link, index) => [link.key, makeWeeklyRows(index)]));

  function makeUser(id, displayName, roleCodes, lastRole) {
    return {
      id,
      user_id: id,
      username: id,
      cn_name: displayName,
      en_name: displayName,
      display_name: displayName,
      role_codes: roleCodes,
      last_selected_role_code: lastRole,
    };
  }

  function makeShipment(input) {
    const link = input.link;
    const dates = input.dates;
    const isLogistics = input.bucket !== "signed_not_putaway_platform";
    return {
      snapshot_id: `SNP-${input.shipment}`,
      risk_card_id: `CARD-${input.shipment}`,
      subject_no: link.subject,
      subject_name: link.subject,
      brand_group: link.brand,
      sales_link: link.key,
      replenishment_merge_key: link.key,
      shipment_no: input.shipment,
      account_name: link.shop,
      platform_sku: link.platformSku,
      product_no: link.systemSku,
      system_sku: link.systemSku,
      product_chinese_name: link.product,
      stock_status_name: link.stockStatus,
      in_transit_qty: input.qty,
      shipment_created_date: dates[0],
      eta_putaway_date: input.eta,
      eta_shipment_status: "在途",
      logistics_country_cn: link.country,
      freight_type_name: link.freight,
      head_channel_type_name: link.freight,
      three_level_channel_name: link.channel3,
      default_window_cover_status: "待观察",
      default_shipping_method_name: link.freight,
      default_shipping_window_start_date: input.requested,
      default_shipping_window_end_date: input.eta,
      dest_warehouse_name: "仓库-8D2MQ",
      default_window_warehouse_name: "仓库-8D2MQ",
      warehouse_type: input.bucket === "signed_not_putaway_platform" ? "平台仓" : "第三方仓",
      contact_match_status: "已匹配",
      active_contact_user_id: input.logisticsUser,
      contact_display_name: input.logistics,
      business_ops_people: link.ops,
      supply_planner_people: link.planner,
      first_leg_logistics_people: input.logistics,
      first_gap_date: link.firstGap,
      days_to_first_gap: 11,
      lost_qty_total_12w: Math.round(input.rawLoss / input.unitPrice),
      allocated_lost_qty_total_12w: Math.round(input.rawLoss / input.unitPrice),
      gmv_unit_price_rmb: input.unitPrice,
      price_status: "已匹配售价",
      allocated_raw_expected_gmv_loss: input.rawLoss,
      allocated_weighted_expected_gmv_loss: input.weightedLoss,
      composite_weight: 0.8,
      logistics_urgency_weight: input.overdueDays >= 10 ? 0.92 : 0.78,
      demand_confidence: 0.86,
      price_confidence: 0.9,
      data_quality_confidence: 0.88,
      confidence_weight: 0.86,
      actionability_weight: isLogistics ? 0.82 : 0.46,
      cost_feasibility_weight: 1,
      status_weight: 0.74,
      max_event_weight: 0.92,
      data_quality_label: input.overdueDays >= 10 ? "物流节点需确认" : "数据齐全",
      logistics_intervention_bucket: input.bucket,
      logistics_intervention_reason: input.feedback,
      current_node_stage: input.node,
      current_node_stage_label: input.node,
      action_owner: isLogistics ? "first_leg_logistics" : "business_ops",
      is_logistics_owned_action: isLogistics ? 1 : 0,
      is_ops_owned_action: isLogistics ? 0 : 1,
      shipment_total_expected_recoverable_gmv: input.recoverable,
      shipment_max_expected_recoverable_gmv: input.recoverable,
      earliest_requested_putaway_date: input.requested,
      shipment_earliest_requested_putaway_date: input.requested,
      max_recommended_advance_days: input.overdueDays,
      shipment_max_recommended_advance_days: input.overdueDays,
      recovery_request_count: 2,
      shipment_recovery_request_count: 2,
      earliest_uncovered_window_start_date: input.requested,
      expected_recoverable_gmv: input.recoverable,
      max_recoverable_gmv: input.recoverable,
      recommended_advance_days: input.overdueDays,
      recommended_putaway_date: input.recommended,
      total_expected_recoverable_gmv: input.recoverable,
      total_raw_expected_gmv_loss: input.rawLoss,
      feedback_max_feasible_advance_days: input.advance,
      manual_feedback_type: input.advance === null ? null : "尽量推进但不保证",
      effective_feedback_type: input.advance === null ? "待确认" : "尽量推进但不保证",
      feedback_content: input.feedback,
      latest_tracking_remark: input.feedback,
      tracking_remark: input.feedback,
      tracking_updated_at: "2026-06-18T09:30:00",
      has_attention: 1,
      has_subject_owner_focus: input.rawLoss >= 180000 ? 1 : 0,
      attention_sort_group: input.advance === null ? 1 : 0,
      involved_ops_count: 1,
      sales_link_count: 1,
      card_row_count: 1,
      advance_request_count: 2,
      advance_group_count: 2,
      advance_capacity_filled: input.advance === null ? 0 : 1,
      unfilled_recoverable_gmv: input.advance === null ? input.recoverable : 0,
      filled_recoverable_gmv: input.advance === null ? 0 : input.recoverable,
      comment_count: link.commentCount,
      unread_comment_count: input.advance === null ? 1 : 0,
      latest_comment_at: "2026-06-18T09:05:00",
      comment_latest_at: "2026-06-18T09:05:00",
      reference_putaway_date: addDays(input.eta, -input.overdueDays),
      latest_expected_putaway_date: input.eta,
      overdue_days: input.overdueDays,
      primary_overdue_type: input.overdueDays >= 15 ? "serious" : link.freight === "空运" ? "air" : "freight_land",
      overdue_types: input.overdueDays >= 15 ? "serious,freight_land" : link.freight === "空运" ? "air" : "freight_land",
      issue_type: input.advance === null ? "物流反馈未闭环" : "高损失链接重点抽检",
      action_hint: input.advance === null ? "请补充 ETA 是否稳定、最早可上架时间和是否仍需继续跟进。" : "风险已解释，保留后续节点观察。",
      collection_actual_date: dates[0],
      collection_forecast_date: dates[0],
      target_domestic_clearance_date: addDays(dates[0], 3),
      forecast_domestic_clearance_date: dates[1],
      actual_domestic_clearance_date: dates[1],
      target_departure_date: addDays(dates[0], 7),
      forecast_departure_date: dates[2],
      actual_departure_date: dates[2],
      target_arrival_port_date: addDays(dates[2], 15),
      forecast_arrival_port_date: dates[3] || addDays(dates[2], 15),
      actual_arrival_port_date: dates[3],
      expected_arrival_port_date: dates[3] || addDays(dates[2], 15),
      target_foreign_clearance_date: dates[3] ? addDays(dates[3], 4) : addDays(dates[2], 18),
      forecast_foreign_clearance_date: dates[4] || addDays(dates[2], 18),
      actual_foreign_clearance_date: dates[4],
      target_pickup_date: dates[4] ? addDays(dates[4], 3) : addDays(dates[2], 21),
      forecast_pickup_date: dates[5] || addDays(dates[2], 21),
      actual_pickup_date: dates[5],
      expected_pickup_date: dates[5] || addDays(dates[2], 21),
      target_signed_date: dates[5] ? addDays(dates[5], 2) : addDays(dates[2], 24),
      forecast_signed_date: dates[6] || addDays(dates[2], 24),
      actual_signed_date: dates[6],
      expected_signed_date: dates[6] || addDays(dates[2], 24),
      target_putaway_date: input.recommended,
      forecast_putaway_date: input.eta,
      actual_putaway_date: "",
      latest_snapshot_putaway_date: input.eta,
      earliest_snapshot_putaway_date: input.recommended,
      reference_lead_days: 42,
      tracking_reference_days: 42,
      reference_prescription: 42,
      reference_putaway_date: addDays(dates[0], 42),
    };
  }

  function addDays(value, days) {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function inclusiveDays(startValue, endValue) {
    const start = new Date(`${startValue}T00:00:00`).getTime();
    const end = new Date(`${endValue}T00:00:00`).getTime();
    if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
    return Math.round((end - start) / 86400000) + 1;
  }

  function makeWeeklyRows(offset) {
    const start = new Date("2026-06-22T00:00:00");
    const rows = [];
    for (let index = 0; index < 12; index += 1) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + index * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const gap = Math.max(0, (index - 1 + offset) * 22 - (index > 6 ? 35 : 0));
      rows.push({
        week_start: weekStart.toISOString().slice(0, 10),
        week_end: weekEnd.toISOString().slice(0, 10),
        week_label: `${String(weekStart.getFullYear()).slice(2)}-${String(index + 26).padStart(2, "0")}周`,
        week_end_inventory_qty: Math.max(0, 360 - index * 38 - offset * 25),
        gap_qty: gap,
        inbound_qty: index === 3 || index === 6 ? 180 - offset * 20 : 0,
        demand_qty: 120 + index * 8 + offset * 6,
      });
    }
    return {
      rows,
      gap_segments: [
        {
          start_date: rows[2].week_start,
          end_date: rows[4].week_end,
          duration_days: inclusiveDays(rows[2].week_start, rows[4].week_end),
          gap_qty: rows.slice(2, 5).reduce((sum, row) => sum + row.gap_qty, 0),
          raw_expected_gmv_loss: 186000 - offset * 12000,
        },
        {
          start_date: rows[6].week_start,
          end_date: rows[8].week_end,
          duration_days: inclusiveDays(rows[6].week_start, rows[8].week_end),
          gap_qty: rows.slice(6, 9).reduce((sum, row) => sum + row.gap_qty, 0),
          raw_expected_gmv_loss: 134000 - offset * 9000,
        },
      ],
    };
  }

  function totalsFor(rows) {
    const salesLinks = new Set(rows.map((row) => row.sales_link).filter(Boolean));
    const shipmentsSet = new Set(rows.map((row) => row.shipment_no).filter(Boolean));
    const raw = sum(rows, "allocated_raw_expected_gmv_loss");
    const weighted = sum(rows, "allocated_weighted_expected_gmv_loss");
    const recoverable = sum(rows, "expected_recoverable_gmv");
    const filled = sum(rows, "filled_recoverable_gmv");
    const unfilled = sum(rows, "unfilled_recoverable_gmv");
    return {
      row_count: rows.length,
      card_row_count: rows.length,
      shipment_count: shipmentsSet.size,
      visible_shipment_count: shipmentsSet.size,
      sales_link_count: salesLinks.size,
      visible_sales_link_count: salesLinks.size,
      platform_sku_count: new Set(rows.map((row) => row.platform_sku)).size,
      in_transit_qty: sum(rows, "in_transit_qty"),
      in_transit_expected_gmv: rows.reduce((total, row) => total + Number(row.in_transit_qty || 0) * Number(row.gmv_unit_price_rmb || 0), 0),
      lost_qty_total_12w: sum(rows, "allocated_lost_qty_total_12w"),
      raw_expected_gmv_loss: raw,
      weighted_expected_gmv_loss: weighted,
      composite_weight: raw ? weighted / raw : 0,
      logistics_urgency_weight: 0.82,
      demand_confidence: 0.86,
      price_confidence: 0.9,
      data_quality_confidence: 0.88,
      confidence_weight: 0.86,
      actionability_weight: 0.74,
      cost_feasibility_weight: 1,
      status_weight: 0.76,
      max_event_weight: 0.92,
      data_issue_rows: rows.filter((row) => row.data_quality_label !== "数据齐全").length,
      first_gap_date: rows.map((row) => row.first_gap_date).filter(Boolean).sort()[0] || "",
      loss_80_link_count: 2,
      loss_80_shipment_count: 4,
      loss_80_raw_expected_gmv_loss: Math.round(raw * 0.8),
      expected_recoverable_gmv: recoverable,
      recoverable_gmv: recoverable,
      recoverable_loss_gmv: Math.round(recoverable * 0.86),
      filled_recoverable_gmv: filled,
      filled_recoverable_loss_gmv: Math.round(filled * 0.86),
      unfilled_recoverable_gmv: unfilled,
      unfilled_recoverable_loss_gmv: Math.round(unfilled * 0.86),
      total_expected_recoverable_gmv: recoverable,
      top_expected_recoverable_gmv: Math.max(...rows.map((row) => Number(row.expected_recoverable_gmv || 0))),
      pending_feedback_count: rows.filter((row) => row.feedback_max_feasible_advance_days === null).length,
      attention_count: rows.length,
      subject_owner_focus_count: rows.filter((row) => Number(row.has_subject_owner_focus || 0) === 1).length,
      priority_group_count: rows.filter((row) => Number(row.attention_sort_group || 0) === 1).length,
      recoverable_shipment_count: rows.filter((row) => Number(row.expected_recoverable_gmv || 0) > 0).length,
      unread_shipment_count: rows.filter((row) => Number(row.unread_comment_count || 0) > 0).length,
      read_shipment_count: rows.filter((row) => Number(row.unread_comment_count || 0) <= 0).length,
      recovery_request_count: sum(rows, "recovery_request_count"),
      involved_ops_count: new Set(rows.map((row) => row.business_ops_people)).size,
      strong_intervention_count: rows.filter((row) => row.logistics_intervention_bucket === "strong_intervention").length,
      signed_not_putaway_platform_count: rows.filter((row) => row.logistics_intervention_bucket === "signed_not_putaway_platform").length,
      signed_not_putaway_3pl_count: rows.filter((row) => row.logistics_intervention_bucket === "signed_not_putaway_3pl").length,
      logistics_owned_action_count: rows.filter((row) => Number(row.is_logistics_owned_action || 0) === 1).length,
      ops_owned_action_count: rows.filter((row) => Number(row.is_ops_owned_action || 0) === 1).length,
    };
  }

  function sum(rows, field) {
    return rows.reduce((total, row) => total + Number(row[field] || 0), 0);
  }

  function groupRows(rows, keyFn, fields) {
    const map = new Map();
    rows.forEach((row) => {
      const key = keyFn(row);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return Array.from(map.entries()).map(([key, grouped], index) => {
      const totals = totalsFor(grouped);
      return {
        summary_hash: `HASH-${key}`,
        summary_key: key,
        summary_label: fields.label ? fields.label(grouped[0], key) : key,
        home_grain: fields.home_grain || "sales_link",
        subject_no: grouped[0].subject_no,
        subject_name: grouped[0].subject_name,
        brand_group: grouped[0].brand_group,
        country_cn: grouped[0].logistics_country_cn,
        freight_type_name: grouped[0].freight_type_name,
        contact_display_name: grouped[0].contact_display_name,
        product_chinese_name: grouped[0].product_chinese_name,
        card_row_count: grouped.length,
        ...totals,
        ops_cumulative_loss_pct: Math.min(100, (index + 1) * 34),
      };
    }).sort((a, b) => Number(b.raw_expected_gmv_loss || 0) - Number(a.raw_expected_gmv_loss || 0));
  }

  function filterRows(url) {
    const params = url.searchParams;
    let rows = shipments.slice();
    const userId = params.get("user_id") || "";
    const role = params.get("role_code") || "business_ops";
    if (role === "business_ops" && userId === "USR-X8R2N") rows = rows.filter((row) => row.business_ops_people === "运营-X8R2N");
    if (role === "business_ops" && userId !== "USR-X8R2N") rows = rows.filter((row) => row.business_ops_people === "运营-Q4D8R");
    if (role === "first_leg_logistics" && userId === "USR-L5Q8R") rows = rows.filter((row) => row.first_leg_logistics_people === "物流-L5Q8R");
    if (role === "first_leg_logistics" && userId !== "USR-L5Q8R") rows = rows.filter((row) => row.first_leg_logistics_people === "物流-H6T9N");
    if (params.get("summary_key")) {
      rows = rows.filter((row) => row.sales_link === params.get("summary_key") || row.subject_no === params.get("summary_key"));
    }
    const countryFilters = params.getAll("country");
    if (countryFilters.length) rows = rows.filter((row) => countryFilters.includes(row.logistics_country_cn));
    const freightFilters = params.getAll("freight_type");
    if (freightFilters.length) rows = rows.filter((row) => freightFilters.includes(row.freight_type_name));
    const channelFilters = params.getAll("channel3");
    if (channelFilters.length) rows = rows.filter((row) => channelFilters.includes(row.three_level_channel_name));
    return rows;
  }

  function scopeFor(roleCode) {
    const labels = {
      global_coordinator: "全局统筹范围",
      subject_owner: "主体负责人范围",
      supply_planner: "计划观察范围",
      first_leg_logistics: "物流响应范围",
      business_ops: "运营负责链接",
    };
    return {
      mode: roleCode === "supply_planner" ? "planner_group_leader" : "demo_scope",
      scope_count: roleCode === "business_ops" ? 3 : 5,
      short_name: labels[roleCode] || "Demo 范围",
      group_name: labels[roleCode] || "Demo 范围",
      leader_name: "计划员-P6M3T",
      planner_name: "计划员-P6M3T",
    };
  }

  function summaryPayload(url) {
    const role = url.searchParams.get("role_code") || "business_ops";
    let rows;
    if (role === "subject_owner") {
      rows = groupRows(shipments, (row) => row.subject_no, {
        home_grain: "subject_no",
        label: (row) => row.subject_no,
      });
    } else {
      rows = groupRows(filterRows(url), (row) => row.sales_link, {
        home_grain: "sales_link",
        label: (row) => row.sales_link,
      });
    }
    return { ok: true, batch_id: BATCH_ID, scope: scopeFor(role), rows, totals: totalsFor(filterRows(url)) };
  }

  function cardsPayload(url) {
    const rows = filterRows(url);
    return {
      ok: true,
      batch_id: BATCH_ID,
      scope: scopeFor(url.searchParams.get("role_code") || "business_ops"),
      rows,
      totals: totalsFor(rows),
      logistics_options: groupForOptions(rows, "first_leg_logistics_people", "contact_display_name"),
      quality_options: groupForOptions(rows, "data_quality_label", "data_quality_label"),
      issue_insights: [
        {
          issue_type: "物流反馈未闭环",
          weight_dimension: "物流节点",
          action_hint: "优先复核 ETA 稳定性",
          row_count: 3,
          raw_expected_gmv_loss: 684000,
          weighted_expected_gmv_loss: 547200,
          composite_weight: 0.8,
          first_gap_date: "2026-06-29",
        },
      ],
    };
  }

  function groupForOptions(rows, field, labelField) {
    const map = new Map();
    rows.forEach((row) => {
      const key = row[field] || "空值";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([key, count]) => ({
      [labelField]: key,
      row_count: count,
      effective_feedback_type: key,
      data_quality_label: key,
    }));
  }

  function filterOptionsPayload() {
    const option = (type, value, extra = {}) => ({ option_type: type, option_value: value, row_count: 3, sort_order: 1, ...extra });
    return {
      ok: true,
      batch_id: BATCH_ID,
      options: {
        brand_group: ["BRD-9X2A6", "BRD-6T9XR"].map((value) => option("brand_group", value, { brand_group: value })),
        subject_no: ["ENT-4M8P2", "ENT-K7D3Q"].map((value, index) => option("subject_no", value, { brand_group: index ? "BRD-6T9XR" : "BRD-9X2A6", subject_no: value })),
        country: ["美国", "加拿大", "德国"].map((value) => option("country", value)),
        account_name: ["SHOP-K7D3Q", "SHOP-3F7NQ", "SHOP-L5Q8R"].map((value) => option("account_name", value)),
        freight_type: ["普船", "快船", "空运"].map((value) => option("freight_type", value, { freight_type: value })),
        channel3: ["渠道-K7D3Q", "渠道-P6M3T", "渠道-5Q8LP"].map((value, index) => option("channel3", value, { freight_type: ["普船", "快船", "空运"][index], channel3: value })),
        category1: ["CAT1-L5Q8R", "CAT1-9X2A6"].map((value) => option("category1", value, { category1: value })),
        category2: ["CAT2-P6M3T", "CAT2-7K3QM", "CAT2-5Q8LP"].map((value, index) => option("category2", value, { category1: index === 1 ? "CAT1-9X2A6" : "CAT1-L5Q8R", category2: value })),
        category3: ["CAT3-Q8R2N", "CAT3-4R8QP", "CAT3-K7D3Q"].map((value, index) => option("category3", value, { category1: index === 1 ? "CAT1-9X2A6" : "CAT1-L5Q8R", category2: index === 1 ? "CAT2-7K3QM" : "CAT2-P6M3T", category3: value })),
        sku_grade: ["A", "B", "C"].map((value) => option("sku_grade", value)),
        custom_label: ["新品", "补货关注", "常规"].map((value) => option("custom_label", value)),
      },
    };
  }

  function globalCoordinatorPayload(url) {
    const selectedRole = url.searchParams.get("selected_role_code") || "subject_owner";
    const scopeType = url.searchParams.get("scope_type") || "brand_group";
    const scopeRows = groupRows(shipments, (row) => {
      if (scopeType === "subject_no" || scopeType === "subject") return row.subject_no;
      if (scopeType === "account_name") return row.account_name;
      if (scopeType === "country") return row.logistics_country_cn;
      if (scopeType === "category1") return linkRows.find((link) => link.key === row.sales_link)?.category1 || "CAT1-L5Q8R";
      if (scopeType === "category2") return linkRows.find((link) => link.key === row.sales_link)?.category2 || "CAT2-P6M3T";
      if (scopeType === "category3") return linkRows.find((link) => link.key === row.sales_link)?.category3 || "CAT3-Q8R2N";
      return row.brand_group;
    }, { home_grain: scopeType, label: (_row, key) => key }).map((row) => ({
      scope_key: row.summary_key,
      scope_label: row.summary_label,
      subject_count: new Set(shipments.filter((item) => item.brand_group === row.summary_key || item.subject_no === row.summary_key || item.account_name === row.summary_key || item.logistics_country_cn === row.summary_key).map((item) => item.subject_no)).size || 1,
      ...row,
      recoverable_gmv: row.expected_recoverable_gmv,
      filled_recoverable_gmv: row.filled_recoverable_gmv,
      unfilled_recoverable_gmv: row.unfilled_recoverable_gmv,
    }));
    const roleRows = [
      { role_code: "subject_owner", role_label: "主体负责人", person_count: 2 },
      { role_code: "supply_planner", role_label: "计划", person_count: 1 },
      { role_code: "first_leg_logistics", role_label: "物流", person_count: 2 },
      { role_code: "business_ops", role_label: "运营", person_count: 2 },
    ];
    const employeeRows = employeesForRole(selectedRole);
    return {
      ok: true,
      batch_id: BATCH_ID,
      scope: scopeFor("global_coordinator"),
      scope_type: scopeType,
      scope_label: granularityOptions.find((item) => item.value === scopeType)?.label || "品牌集合",
      granularity_options: granularityOptions,
      selected_scope_key: url.searchParams.get("scope_key") || "",
      selected_scope: null,
      selected_role_code: selectedRole,
      scope_rows: scopeRows,
      totals: totalsFor(shipments),
      role_rows: roleRows,
      employee_rows: employeeRows,
      ...currencyContext(),
    };
  }

  function employeesForRole(roleCode) {
    const rowsByRole = {
      subject_owner: [
        { person: "主体-4M8P2", target_user_id: "USR-4M8P2", target_role_code: "subject_owner" },
        { person: "主体-K7D3Q", target_user_id: "USR-K7D3Q", target_role_code: "subject_owner" },
      ],
      supply_planner: [
        { person: "计划员-P6M3T", target_user_id: "USR-P6M3T", target_role_code: "supply_planner" },
      ],
      first_leg_logistics: [
        { person: "物流-H6T9N", target_user_id: "USR-H6T9N", target_role_code: "first_leg_logistics" },
        { person: "物流-L5Q8R", target_user_id: "USR-L5Q8R", target_role_code: "first_leg_logistics" },
      ],
      business_ops: [
        { person: "运营-Q4D8R", target_user_id: "USR-Q4D8R", target_role_code: "business_ops" },
        { person: "运营-X8R2N", target_user_id: "USR-X8R2N", target_role_code: "business_ops" },
      ],
    }[roleCode] || [];
    return rowsByRole.map((row) => {
      const related = shipments.filter((item) => {
        if (roleCode === "first_leg_logistics") return item.first_leg_logistics_people === row.person;
        if (roleCode === "business_ops") return item.business_ops_people === row.person;
        return true;
      });
      const totals = totalsFor(related.length ? related : shipments);
      return {
        ...row,
        value_gmv: totals.raw_expected_gmv_loss,
        raw_expected_gmv_loss: totals.raw_expected_gmv_loss,
        recoverable_gmv: totals.expected_recoverable_gmv,
        unfilled_recoverable_gmv: totals.unfilled_recoverable_gmv,
        shipment_count: totals.shipment_count,
        link_count: totals.sales_link_count,
      };
    });
  }

  function logisticsPayload(url) {
    const rows = filterRows(url);
    const channelTreeRows = groupLogistics(rows, ["logistics_country_cn", "freight_type_name", "three_level_channel_name"]);
    return {
      ok: true,
      scope: scopeFor("first_leg_logistics"),
      rows,
      totals: totalsFor(rows),
      distribution_rows: groupLogistics(rows, ["logistics_country_cn", "freight_type_name"]),
      channel_rows: groupLogistics(rows, ["three_level_channel_name"]),
      channel_tree_rows: channelTreeRows,
      bucket_summary_rows: groupBuckets(rows),
      feedback_options: groupForOptions(rows, "effective_feedback_type", "effective_feedback_type"),
      feedback_summary_rows: groupForOptions(rows, "effective_feedback_type", "effective_feedback_type").map((row) => ({
        ...row,
        shipment_count: row.row_count,
        total_expected_recoverable_gmv: sum(rows.filter((item) => item.effective_feedback_type === row.effective_feedback_type), "expected_recoverable_gmv"),
      })),
      limit: 500,
      offset: 0,
    };
  }

  function groupLogistics(rows, fields) {
    const map = new Map();
    rows.forEach((row) => {
      const key = fields.map((field) => row[field] || "").join("||");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return Array.from(map.entries()).map(([_key, grouped]) => {
      const first = grouped[0];
      return {
        logistics_country_cn: first.logistics_country_cn,
        freight_type_name: first.freight_type_name,
        three_level_channel_name: first.three_level_channel_name,
        shipment_count: grouped.length,
        pending_feedback_count: grouped.filter((row) => row.feedback_max_feasible_advance_days === null).length,
        attention_count: grouped.length,
        subject_owner_focus_count: grouped.filter((row) => Number(row.has_subject_owner_focus || 0) === 1).length,
        priority_group_count: grouped.filter((row) => Number(row.attention_sort_group || 0) === 1).length,
        total_expected_recoverable_gmv: sum(grouped, "expected_recoverable_gmv"),
        earliest_requested_putaway_date: grouped.map((row) => row.earliest_requested_putaway_date).sort()[0],
        unread_count: grouped.filter((row) => Number(row.unread_comment_count || 0) > 0).length,
        unread_shipment_count: grouped.filter((row) => Number(row.unread_comment_count || 0) > 0).length,
        read_shipment_count: grouped.filter((row) => Number(row.unread_comment_count || 0) <= 0).length,
        request_count: sum(grouped, "recovery_request_count"),
      };
    }).sort((a, b) => Number(b.total_expected_recoverable_gmv || 0) - Number(a.total_expected_recoverable_gmv || 0));
  }

  function groupBuckets(rows) {
    return ["strong_intervention", "signed_not_putaway_3pl", "signed_not_putaway_platform"].map((bucket) => {
      const grouped = rows.filter((row) => row.logistics_intervention_bucket === bucket);
      const first = grouped[0] || {};
      return {
        logistics_intervention_bucket: bucket,
        action_owner: bucket === "signed_not_putaway_platform" ? "business_ops" : "first_leg_logistics",
        current_node_stage_label: first.current_node_stage_label || "待判断",
        shipment_count: grouped.length,
        logistics_owned_action_count: grouped.filter((row) => Number(row.is_logistics_owned_action || 0) === 1).length,
        ops_owned_action_count: grouped.filter((row) => Number(row.is_ops_owned_action || 0) === 1).length,
        recoverable_shipment_count: grouped.length,
        total_expected_recoverable_gmv: sum(grouped, "expected_recoverable_gmv"),
        raw_expected_gmv_loss: sum(grouped, "allocated_raw_expected_gmv_loss"),
      };
    });
  }

  function logisticsDetailPayload(shipmentNo) {
    const row = shipments.find((item) => item.shipment_no === shipmentNo) || shipments[0];
    const advanceGroups = [0, 3, 7].map((days) => ({
      recommended_advance_days: days,
      earliest_requested_putaway_date: addDays(row.eta_putaway_date, -days),
      request_count: 1 + days,
      sales_link_count: 1,
      sku_count: 1,
      expected_recoverable_gmv: Math.max(32000, Number(row.expected_recoverable_gmv || 0) - days * 9000),
      is_satisfied: row.feedback_max_feasible_advance_days === null ? null : days <= Number(row.feedback_max_feasible_advance_days || 0),
    }));
    return {
      ok: true,
      scope: scopeFor("first_leg_logistics"),
      shipment: row,
      request_rows: advanceGroups.map((group) => ({
        ...group,
        shipment_no: row.shipment_no,
        sales_link: row.sales_link,
        system_sku: row.system_sku,
        platform_sku: row.platform_sku,
        expected_recoverable_gmv: group.expected_recoverable_gmv,
      })),
      advance_groups: advanceGroups,
      tracking_remarks: [
        { remark_created_at: "2026-06-18T09:20:00", remark: row.latest_tracking_remark },
        { remark_created_at: "2026-06-17T15:40:00", remark: "服务商已补充节点资料，等待系统刷新。" },
      ],
    };
  }

  function subjectOwnerPayload(url) {
    const rows = shipments.slice();
    const businessRows = businessDistribution(rows, url.searchParams.get("granularity") || "account_name");
    const opsRows = employeeDistribution(rows, "business_ops_people", "business_ops", "business_ops_people");
    const logisticsRows = employeeDistribution(rows, "first_leg_logistics_people", "first_leg_logistics", "logistics_people");
    return {
      ok: true,
      scope: scopeFor("subject_owner"),
      subject_rows: groupRows(rows, (row) => row.subject_no, { home_grain: "subject_no", label: (row) => row.subject_no }),
      business_rows: businessRows,
      logistics_rows: logisticsRows,
      ops_rows: opsRows,
      granularity: url.searchParams.get("granularity") || "account_name",
      granularity_options: granularityOptions,
      issue_rows: [
        { issue_type: "物流反馈未闭环", row_count: 3, weighted_expected_gmv_loss: 547200 },
        { issue_type: "高损失链接重点抽检", row_count: 2, weighted_expected_gmv_loss: 408000 },
      ],
      action_rows: rows.slice(0, 4),
      totals: totalsFor(rows),
      scope_exception_totals: totalsFor(rows.filter((row) => row.issue_type)),
      ...currencyContext(),
    };
  }

  function businessDistribution(rows, granularity) {
    const fieldByGranularity = {
      brand_group: "brand_group",
      subject_no: "subject_no",
      account_name: "account_name",
      country: "logistics_country_cn",
    };
    const field = fieldByGranularity[granularity] || "account_name";
    return groupRows(rows, (row) => {
      if (granularity === "category1") return linkRows.find((link) => link.key === row.sales_link)?.category1 || "CAT1-L5Q8R";
      if (granularity === "category2") return linkRows.find((link) => link.key === row.sales_link)?.category2 || "CAT2-P6M3T";
      if (granularity === "category3") return linkRows.find((link) => link.key === row.sales_link)?.category3 || "CAT3-Q8R2N";
      return row[field] || "--";
    }, { home_grain: granularity, label: (_row, key) => key }).map((row) => ({
      dimension_key: row.summary_key,
      dimension_label: row.summary_label,
      scope_key: row.summary_key,
      scope_label: row.summary_label,
      raw_expected_gmv_loss: row.raw_expected_gmv_loss,
      recoverable_gmv: row.expected_recoverable_gmv,
      unfilled_recoverable_gmv: row.unfilled_recoverable_gmv,
      shipment_count: row.shipment_count,
      sales_link_count: row.sales_link_count,
    }));
  }

  function employeeDistribution(rows, personField, roleCode, outputField) {
    const userByName = {
      "运营-Q4D8R": "USR-Q4D8R",
      "运营-X8R2N": "USR-X8R2N",
      "物流-H6T9N": "USR-H6T9N",
      "物流-L5Q8R": "USR-L5Q8R",
    };
    return groupRows(rows, (row) => row[personField], { label: (_row, key) => key }).map((row) => ({
      [outputField]: row.summary_label,
      target_user_id: userByName[row.summary_label] || "",
      target_role_code: roleCode,
      raw_expected_gmv_loss: row.raw_expected_gmv_loss,
      recoverable_gmv: row.expected_recoverable_gmv,
      expected_recoverable_gmv: row.expected_recoverable_gmv,
      filled_recoverable_gmv: row.filled_recoverable_gmv,
      unfilled_recoverable_gmv: row.unfilled_recoverable_gmv,
      recoverable_loss_gmv: row.recoverable_loss_gmv,
      filled_recoverable_loss_gmv: row.filled_recoverable_loss_gmv,
      unfilled_recoverable_loss_gmv: row.unfilled_recoverable_loss_gmv,
      shipment_count: row.shipment_count,
      sales_link_count: row.sales_link_count,
    }));
  }

  function plannerPayload(url) {
    const type = url.searchParams.get("overdue_type") || "";
    const linkRowsPayload = linkRows.map((link) => {
      const related = shipments.filter((row) => row.sales_link === link.key);
      const maxOverdue = Math.max(...related.map((row) => Number(row.overdue_days || 0)));
      const primary = maxOverdue >= 15 ? "serious" : link.freight === "空运" ? "air" : "freight_land";
      return {
        link_key: link.key,
        sales_link: link.key,
        replenishment_merge_key: link.key,
        subject_no: link.subject,
        business_ops_people: link.ops,
        supply_planner_people: link.planner,
        primary_overdue_type: primary,
        overdue_types: primary === "serious" ? "serious,freight_land" : primary,
        overdue_expected_loss: sum(related, "allocated_raw_expected_gmv_loss"),
        overdue_shipment_count: related.length,
      };
    }).filter((row) => !type || String(row.overdue_types || "").includes(type));
    const selectedKey = url.searchParams.get("link_key") || linkRowsPayload[0]?.link_key || "";
    const selected = linkRowsPayload.find((row) => row.link_key === selectedKey) || linkRowsPayload[0] || null;
    const selectedShipments = selected ? shipments.filter((row) => row.sales_link === selected.link_key) : [];
    return {
      ok: true,
      batch_id: BATCH_ID,
      scope: scopeFor("supply_planner"),
      selected_overdue_type: type,
      selected_link_key: selected?.link_key || "",
      totals: {
        overdue_link_count: linkRowsPayload.length,
        overdue_shipment_count: linkRowsPayload.reduce((total, row) => total + Number(row.overdue_shipment_count || 0), 0),
        overdue_expected_loss: linkRowsPayload.reduce((total, row) => total + Number(row.overdue_expected_loss || 0), 0),
      },
      type_rows: [
        { overdue_type: "serious", label: "严重逾期", definition: "当前在途货件最新预计上架时间比参考时间晚 15 天或以上。", shipment_count: 1, link_count: 1, overdue_expected_loss: 222000 },
        { overdue_type: "freight_land", label: "海运陆运逾期", definition: "海运陆运类货件晚于参考时间。", shipment_count: 5, link_count: 2, overdue_expected_loss: 1160000 },
        { overdue_type: "air", label: "空运逾期", definition: "空运类货件晚于参考时间。", shipment_count: 2, link_count: 1, overdue_expected_loss: 326000 },
      ],
      link_rows: linkRowsPayload,
      link_page: { page: 1, page_size: 100, total: linkRowsPayload.length },
      selected_link: selected,
      shipment_rows: selectedShipments,
      shipment_page: { page: 1, page_size: 100, total: selectedShipments.length },
    };
  }

  function plannerDetailPayload(url) {
    const payload = plannerPayload(url);
    return {
      ok: true,
      batch_id: BATCH_ID,
      scope: payload.scope,
      selected_overdue_type: payload.selected_overdue_type,
      selected_link_key: payload.selected_link_key,
      selected_link: payload.selected_link,
      shipment_rows: payload.shipment_rows,
      shipment_page: payload.shipment_page,
    };
  }

  function linkWeeklyPayload(url) {
    const key = url.searchParams.get("summary_key") || url.searchParams.get("link_key") || linkRows[0].key;
    return { ok: true, batch_id: BATCH_ID, scope: scopeFor(url.searchParams.get("role_code") || "business_ops"), ...(weeklyByLink.get(key) || weeklyByLink.get(linkRows[0].key)) };
  }

  function commentsPayload(shipmentNo) {
    return {
      ok: true,
      shipment_no: shipmentNo,
      comments: [
        {
          comment_id: 101,
          role_code: "first_leg_logistics",
          user_id: "USR-H6T9N",
          username: "USR-H6T9N",
          display_name: "物流-H6T9N",
          cn_name: "物流-H6T9N",
          en_name: "USR-H6T9N",
          shipment_no: shipmentNo,
          comment_content: "节点已重新确认，等待下一轮反馈。",
          is_withdrawn: 0,
          is_pinned: 1,
          can_withdraw: 0,
          created_at: "2026-06-18T08:40:00",
          updated_at: "2026-06-18T08:40:00",
        },
        {
          comment_id: 102,
          role_code: "business_ops",
          user_id: "USR-Q4D8R",
          username: "USR-Q4D8R",
          display_name: "运营-Q4D8R",
          cn_name: "运营-Q4D8R",
          en_name: "USR-Q4D8R",
          shipment_no: shipmentNo,
          comment_content: "当前链接仍需关注缺口窗口，已记录后续回看节点。",
          is_withdrawn: 0,
          is_pinned: 0,
          can_withdraw: 0,
          created_at: "2026-06-18T09:05:00",
          updated_at: "2026-06-18T09:05:00",
        },
      ],
      read_state: { last_confirmed_comment_id: 101, last_confirmed_at: "2026-06-18T09:10:00" },
      pinned: { pinned_comment_id: 101, pinned_by_user_id: "USR-H6T9N", pinned_by_role_code: "first_leg_logistics", pinned_at: "2026-06-18T08:45:00", is_active: 1 },
    };
  }

  function currencyContext() {
    return {
      selected_currency: "AMT",
      selected_exchange_rate: 1,
      selected_option_label: "AMT 金额",
      currency_options: [{ currency: "AMT", exchange_rate: 1, option_label: "AMT 金额" }],
    };
  }

  function ok(payload = {}) {
    return { ok: true, ...payload };
  }

  function json(payload, status = 200) {
    return Promise.resolve(new Response(JSON.stringify(payload), { status, headers: jsonHeaders }));
  }

  function route(input, options = {}) {
    const rawUrl = typeof input === "string" ? input : input.url;
    const url = new URL(rawUrl, window.location.origin);
    const pathname = url.pathname;
    if (pathname === "/health") return json(ok({ batch_id: BATCH_ID, snapshot: { card_rows: shipments.length, shipment_count: shipments.length, sales_link_count: linkRows.length, refreshed_at: SNAPSHOT_AT } }));
    if (pathname === "/api/currencies") return json(ok(currencyContext()));
    if (pathname === "/api/filter-options") return json(filterOptionsPayload());
    if (pathname === "/api/roles") return json(ok({ roles }));
    if (pathname === "/api/users") {
      const q = (url.searchParams.get("q") || "").toLowerCase();
      const roleCode = url.searchParams.get("role_code") || "";
      const preferredDemoRole = new URL(window.location.href).searchParams.get("demo_role") || "";
      let found = users.filter((user) => {
        const roleMatch = !roleCode || user.role_codes.includes(roleCode);
        const text = `${user.display_name} ${user.username} ${user.role_codes.join(" ")}`.toLowerCase();
        return roleMatch && (!q || text.includes(q));
      });
      if (!q && preferredDemoRole && roleUser[preferredDemoRole]) {
        found = [roleUser[preferredDemoRole], ...found.filter((user) => user.id !== roleUser[preferredDemoRole].id)];
      }
      if (!q && !preferredDemoRole && roleCode === "business_ops") {
        found = [roleUser.global_coordinator, ...found.filter((user) => user.id !== roleUser.global_coordinator.id)];
      }
      return json(ok({ users: found.length ? found : users.slice(0, 5) }));
    }
    if (pathname === "/api/session") {
      const body = safeJson(options.body);
      const user = users.find((item) => item.id === body.user_id || item.user_id === body.user_id) || roleUser[body.role_code] || users[0];
      return json(ok({ user }));
    }
    if (pathname === "/api/summary") return json(summaryPayload(url));
    if (pathname === "/api/cards") return json(cardsPayload(url));
    if (pathname === "/api/global-coordinator/workbench") return json(globalCoordinatorPayload(url));
    if (pathname === "/api/logistics/response") return json(logisticsPayload(url));
    if (pathname.startsWith("/api/logistics/shipments/") && pathname.endsWith("/detail")) {
      const shipmentNo = decodeURIComponent(pathname.replace("/api/logistics/shipments/", "").replace("/detail", ""));
      return json(logisticsDetailPayload(shipmentNo));
    }
    if (pathname.startsWith("/api/logistics/shipments/") && pathname.endsWith("/feedback")) return json(ok({ feedback: { saved_at: SNAPSHOT_AT } }));
    if (pathname === "/api/subject-owner/workbench") return json(subjectOwnerPayload(url));
    if (pathname === "/api/planner/overdue-links") return json(plannerPayload(url));
    if (pathname === "/api/planner/link-detail") return json(plannerDetailPayload(url));
    if (pathname === "/api/link-weekly") return json(linkWeeklyPayload(url));
    if (pathname === "/api/cards/export-tasks") return json(ok({ rows: [{ export_id: 260618, status: "success", status_label: "已完成", file_name: "OHC_DEMO_EXPORT.csv", created_at: SNAPSHOT_AT, finished_at: SNAPSHOT_AT, row_count: 36 }] }));
    const commentsMatch = pathname.match(/^\/api\/shipments\/(.+)\/comments$/);
    if (commentsMatch) return json(commentsPayload(decodeURIComponent(commentsMatch[1])));
    const readMatch = pathname.match(/^\/api\/shipments\/(.+)\/read$/);
    if (readMatch) return json(ok({ shipment_no: decodeURIComponent(readMatch[1]) }));
    if (pathname.startsWith("/api/comments/") && pathname.endsWith("/withdraw")) return json(ok({}));
    if (pathname.match(/^\/api\/shipments\/(.+)\/pin$/)) return json(ok({}));
    return null;
  }

  function safeJson(body) {
    if (!body) return {};
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  const realFetch = window.fetch.bind(window);
  window.fetch = function mockFetch(input, options = {}) {
    const mocked = route(input, options);
    if (mocked) return mocked;
    return realFetch(input, options);
  };
}());
