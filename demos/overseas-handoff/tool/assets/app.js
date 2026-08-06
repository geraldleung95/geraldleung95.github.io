const LOGISTICS_SHIPMENT_PAGE_SIZE = 20;

const state = {
  roles: [],
  roleCode: "business_ops",
  user: null,
  allSummaryRows: [],
  summaryRows: [],
  summaryTotals: {},
  summaryScope: null,
  selectedSummary: null,
  cards: [],
  cardTotals: {},
  weeklyRows: [],
  weeklyAllRows: [],
  gapSegments: [],
  logisticsOptions: [],
  qualityOptions: [],
  filterOptions: {},
  fieldFilters: {},
  openFilterMenu: null,
  filterSearch: {},
  weekRange: {
    startIndex: 0,
    endIndex: 11,
  },
  issueInsights: [],
  filtersCollapsed: true,
  opsTimelineShipmentNo: "",
  subjectOwner: {
    businessRows: [],
    logisticsRows: [],
    opsRows: [],
    issueRows: [],
    actionRows: [],
    totals: {},
    scopeExceptionTotals: {},
    selectedSubjectNos: [],
    selectedOpsPerson: "",
    selectedIssueType: "",
    batchDraftText: "",
    batchEditorOpen: false,
    excludedKeys: [],
    customDrafts: {},
    linkDetail: null,
    exceptionOnly: true,
    selectedGranularity: "account_name",
    granularityOptions: [],
    subjectMenuOpen: false,
    loadError: "",
  },
  planner: {
    payload: null,
    selectedOverdueType: "",
    selectedLinkKey: "",
    linkPage: 1,
    linkPageSize: 100,
    shipmentPage: 1,
    shipmentPageSize: 100,
    filterOpen: false,
    feedbackDetail: null,
    loadError: "",
  },
  logistics: {
    rows: [],
    totals: {},
    distributionRows: [],
    channelRows: [],
    feedbackOptions: [],
    feedbackSummaryRows: [],
    bucketSummaryRows: [],
    channelTreeRows: [],
    channelTreeCollapsed: {},
    channelTreeAllCollapsed: false,
    selectedCountry: "",
    selectedFreightType: "",
    selectedChannel3: "",
    selectedActionScope: "logistics_owned",
    selectedShipmentNo: "",
    shipmentPage: 1,
    detail: null,
    requestDetailsOpen: false,
  },
  globalCoordinator: {
    payload: null,
    selectedScopeType: "brand_group",
    selectedScopeKey: "",
    selectedRoleCode: "subject_owner",
    granularityOptions: [],
    loadError: "",
    mirror: null,
  },
  currencies: [],
  selectedCurrency: "AMT",
  selectedExchangeRate: 1,
  selectedCurrencyLabel: "AMT 金额",
  activeShipment: null,
  draftUser: null,
  draftRoleCode: "business_ops",
  isIdentityApplying: false,
  showOnlyLossSummaryLinks: true,
  summaryRequestId: 0,
  cardsRequestId: 0,
  logisticsDetailRequestId: 0,
  userSearchRequestId: 0,
  userSearchQuery: "",
  health: null,
  exportTasks: [],
  exportPanelOpen: false,
  exportTaskTimer: null,
};

const els = {};
const filterHome = {
  parent: null,
  nextSibling: null,
};

const filterLiftHome = {
  parent: null,
  nextSibling: null,
};

const ROLE_SHORT_NAMES = {
  business_ops: "运营",
  subject_owner: "主体负责人",
  global_coordinator: "统筹",
  supply_planner: "计划",
  first_leg_logistics: "物流",
};

const ROLE_PRIORITY_ORDER = [
  "global_coordinator",
  "subject_owner",
  "supply_planner",
  "first_leg_logistics",
  "business_ops",
];

const ROLE_PRIORITY_RANK = new Map(ROLE_PRIORITY_ORDER.map((roleCode, index) => [roleCode, index]));

const ROLE_SEARCH_ALIASES = {
  business_ops: ["运营", "事业部运营", "业务运营", "business", "ops", "business ops"],
  subject_owner: ["主体", "主体负责人", "负责人", "subject", "owner", "subject owner"],
  global_coordinator: ["统筹", "全局统筹", "全局统筹者", "协调", "global", "coordinator"],
  supply_planner: ["计划", "计划员", "供应链计划", "supply", "planner", "supply planner"],
  first_leg_logistics: ["物流", "头程", "头程物流", "供应链物流", "first leg", "logistics"],
};

const ROLE_MANUALS = {
  business_ops: {
    grain: "销售链接",
    scope: "自己负责的销售链接",
    drill: "销售链接 -> 货件号 -> 处理建议",
    exportLimit: "5000 行",
    summary: "运营页用于定位自己负责销售链接的风险，判断哪些链接和货件需要优先处理、观察或请物流协同。",
    steps: [
      "先看「① 我的链接风险总览」，确认在途预计 GMV、预计 GMV 损失和 80% 损失集中度。",
      "在「销售链接清单」里优先打开预期 GMV 损失靠前、累计损失贡献高的链接。",
      "进入「② 链接整体衔接」后，先看风险结论，再看风险集中在哪些周。",
      "继续看「按周风险概览」和「衔接结论」，确认缺口发生时间、缺口数量和预计损失。",
      "最后看「③ 货件行动清单」，按预计可挽回 GMV 和预计上架节奏决定先处理哪些货件。",
    ],
    notes: [
      "有预计可挽回 GMV，不等于一定要催物流；先判断当前物流状态是否还有动作空间。",
      "需要物流协同时，留言重点写清货件号、目标上架日期、最早可上架时间和阻塞点。",
      "标记为「平台仓上架分流」时，由运营侧跟进店铺上架，不作为普通物流催办。",
      "标记为「默认物流可覆盖」或「建议运营调整销售节奏」时，保留观察和业务判断，不转成物流强干预任务。",
      "明细导出用于会后跟进，不替代页面内的优先级判断。",
    ],
  },
  subject_owner: {
    grain: "店铺名称 / 品类 / 国家等业务颗粒度",
    scope: "自己管理的一个或多个主体",
    drill: "主体总览 -> 按颗粒度汇总 -> TOP 清单 -> 重点核查明细",
    exportLimit: "5000 行",
    summary: "主体负责人页用于判断负责主体的风险集中在哪些店铺、品类或国家，并复核物流和运营两侧最需要关注的对象。",
    steps: [
      "先看「① 主体风险总览」，确认预计 GMV 损失、填写覆盖占比、可能可挽回、整体可推进占比和待物流填写。",
      "在「统计颗粒度」选择品牌集合、主体、店铺名称、一级品类、二级品类、三级品类或国家；模块标题会切换为当前汇总口径。",
      "在当前汇总表里，先看风险金额、可推进挽回、待物流填写，再结合货件数和链接数判断风险集中点。",
      "再看「物流 TOP 清单」和「运营 TOP 清单」，确认风险主要卡在物流判断覆盖，还是运营链接风险集中。",
      "进入「③ 重点核查事项」和「④ 重点核查明细」，必要时打开「查看链接衔接」，并在「核查备注」记录复核结论。",
    ],
    notes: [
      "统计颗粒度用于看业务范围分布；人员相关情况看对应 TOP 清单，不放进颗粒度切换里理解。",
      "主体负责人不逐票替运营或物流处理，重点是抽检、复核和记录判断依据。",
      "待物流填写表示货件级提前能力还未覆盖，不代表物流一定可以挽回。",
      "核查备注建议写清：风险已解释、仍需继续跟进或暂不处理，并写明依据。",
      "需要会后复盘时再导出明细，页面内仍按重点核查顺序阅读。",
    ],
  },
  global_coordinator: {
    grain: "品牌集合 / 主体 / 店铺名称 / 品类 / 国家",
    scope: "自己管理的一个或多个品牌集合",
    drill: "全局统筹总览 -> 业务颗粒度分布 -> 角色视角",
    exportLimit: "只读",
    summary: "全局统筹者页用于观察整体风险集中在哪些业务范围、哪类角色承压，并进入人员视角只读核实现场。",
    steps: [
      "先看「① 全局统筹总览」，确认当前范围内的预计 GMV 损失、可推进挽回和物流填写覆盖。",
      "在「统计颗粒度」切换品牌集合、主体、店铺名称、一级品类、二级品类、三级品类或国家，判断风险集中在哪个经营范围。",
      "进入「② 角色视角」，选择页面已有角色卡，查看对应人员列表和风险分布。",
      "点击「查看视角」进入员工原角色页面，只读查看该人员面对的链接、货件或汇总情况。",
      "看完人员视角后回到全局视图，继续按经营范围和角色分布判断后续协调重点。",
    ],
    notes: [
      "全局统筹者只读观察，不在该身份下提交留言、核查备注、物流反馈、已读确认或导出。",
      "人员视角用于核实问题落点，不代表统筹者直接承接该角色任务。",
      "统计颗粒度用于看经营范围分布；物流渠道等处理细节留给物流视角判断。",
      "发现风险集中后，按线下管理动作推动对应负责人处理，不在页面内代操作。",
    ],
  },
  supply_planner: {
    grain: "逾期销售链接",
    scope: "自己或计划小组负责的主体范围",
    drill: "逾期结构 -> 销售链接 -> 货件跟进情况",
    exportLimit: "10000 行",
    summary: "计划页用于从逾期销售链接角度观察风险，帮助判断哪些链接、店铺或货件需要优先关注计划侧资料和节奏。",
    steps: [
      "先看「计划观察」中的范围、筛选条件和核心指标，确认逾期链接、逾期货件和逾期预计损失规模。",
      "在「逾期结构」中按严重逾期、快递逾期、空运逾期、海运陆运逾期切换，优先查看货件数和链接数较高、预计损失较大的类型。",
      "在「链接清单」中点击销售链接，右侧联动查看该链接的「基础信息」。",
      "继续看「按周风险概览」和「衔接结论」，判断缺口集中在哪些周、持续多久、预计损失集中在哪几段。",
      "最后看「货件跟进情况」，了解相关货件的预计上架日期、物流节点、物流反馈和详情。",
    ],
    notes: [
      "计划页是只读观察台，不在页面内提交留言、物流反馈或流程状态。",
      "逾期预计损失用于排查优先级，不等同于财务确认损失。",
      "如果发现基础信息缺失，按原计划资料维护链路补齐，不把页面当作跨角色催办入口。",
      "需要和运营或物流沟通时，回到原业务沟通渠道处理。",
    ],
  },
  first_leg_logistics: {
    grain: "国家 + 一级渠道 / 货件",
    scope: "参考时效表中有效分配给自己的货件风险",
    drill: "总览 -> 渠道清单 -> 货件清单 -> 货件详情",
    exportLimit: "10000 行",
    summary: "物流响应台用于在货件级判断最多可提前几天上架，并优先处理金额较高、仍待判断的货件。",
    steps: [
      "先看「① 总览」，确认待判断、已判断的预计可挽回 GMV 和整体判断进度。",
      "在「② 渠道清单」中按国家、一级渠道、三级渠道收敛范围，定位优先处理区域。",
      "在「③ 货件清单」中优先选择金额较高且标记为待判断的货件。",
      "进入「④ 货件详情」后，先看货件时间轴和跟踪备注，再看「提前能力判断」。",
      "填写整数形式的「最多可提前」天数并提交；下方卡片会展示对应的期望上架日期、预计可挽回 GMV 和判断结果。",
    ],
    notes: [
      "物流只填写货件级「最多可提前」天数，不逐条销售链接做人工判断。",
      "没有提前空间时填写 0；不确定时先核对货件时间轴、跟踪备注和渠道信息。",
      "待判断 / 已判断只表示该货件是否已填写提前能力，不代表货件已完成或问题已关闭。",
      "渠道清单用于定位处理范围，实际判断以货件详情为准。",
      "预计可挽回 GMV 用于判断处理优先级，不等同于财务确认损失。",
    ],
  },
};

function $(id) {
  return document.getElementById(id);
}

function fmtNumber(value, digits = 0) {
  const num = Number(value || 0);
  return num.toLocaleString("zh-CN", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function currentExchangeRate() {
  const rate = Number(state.selectedExchangeRate || 1);
  return rate > 0 ? rate : 1;
}

function moneyValue(value) {
  return Number(value || 0) / currentExchangeRate();
}

function fmtMoney(value) {
  const num = moneyValue(value);
  return fmtNumber(num, 0);
}

function fmtMoneyWan(value) {
  return `${fmtNumber(moneyValue(value) / 10000, 1)}万`;
}

function fmtPercent(part, total, digits = 1) {
  const denominator = Number(total || 0);
  if (!denominator) return "--";
  return `${((Number(part || 0) / denominator) * 100).toFixed(digits)}%`;
}

function fmtWeight(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toFixed(2);
}

function weightLevel(value) {
  const weight = Number(value || 0);
  if (weight >= 0.85) return "极紧急";
  if (weight >= 0.65) return "高";
  if (weight >= 0.40) return "中";
  if (weight >= 0.20) return "低";
  return "观察";
}

function fmtDate(value) {
  if (!value) return "--";
  return String(value).slice(0, 10);
}

function fmtDateTimeCn(value) {
  if (!value) return "--";
  const text = String(value).replace(" ", "T");
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, "0")}月${String(date.getDate()).padStart(2, "0")}日 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function fmtWeek(value) {
  const dateText = fmtDate(value);
  if (dateText === "--") return "--";
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateText;
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOffset = Math.floor((date - firstDay) / 86400000);
  const week = Math.ceil((dayOffset + firstDay.getDay() + 1) / 7);
  return `${String(date.getFullYear()).slice(2)}-${String(week).padStart(2, "0")}周`;
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(String(value));
  return String(value).replace(/["\\]/g, "\\$&");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || `请求失败 ${response.status}`);
  }
  return payload;
}

function applyCurrencyContext(payload = {}) {
  if (Array.isArray(payload.currency_options)) {
    state.currencies = payload.currency_options;
  }
  if (payload.selected_currency) {
    state.selectedCurrency = String(payload.selected_currency || "AMT").toUpperCase();
  }
  if (payload.selected_exchange_rate) {
    state.selectedExchangeRate = Number(payload.selected_exchange_rate || 1) || 1;
  } else {
    const selected = state.currencies.find((row) => String(row.currency || "").toUpperCase() === state.selectedCurrency);
    if (selected) state.selectedExchangeRate = Number(selected.exchange_rate || 1) || 1;
  }
  const current = state.currencies.find((row) => String(row.currency || "").toUpperCase() === state.selectedCurrency);
  state.selectedCurrencyLabel = current?.option_label || payload.selected_option_label || `${state.selectedCurrency} ${fmtNumber(state.selectedExchangeRate, 4)}`;
  renderCurrencySelector();
}

function appendCurrencyParam(params) {
  params.set("currency", state.selectedCurrency || "AMT");
  return params;
}

async function loadCurrencies() {
  const payload = await api(`/api/currencies?currency=${encodeURIComponent(state.selectedCurrency || "AMT")}`);
  applyCurrencyContext(payload);
}

function renderCurrencySelector() {
  const host = els.currencySelect;
  if (!host) return;
  const dropdown = els.currencyDropdown;
  const options = state.currencies.length
    ? state.currencies
    : [{ currency: "AMT", option_label: "AMT 金额" }];
  host.innerHTML = options.map((row) => {
    const code = String(row.currency || "").toUpperCase();
    return `<option value="${htmlEscape(code)}" ${code === state.selectedCurrency ? "selected" : ""}>${htmlEscape(row.option_label || code)}</option>`;
  }).join("");
  if (!dropdown) return;
  const selectedCode = String(state.selectedCurrency || "AMT").toUpperCase();
  dropdown.innerHTML = `
    <button class="compact-filter-btn currency-filter-btn" type="button" data-currency-toggle aria-expanded="false">
      ${htmlEscape(selectedCode)}
    </button>
    <div class="compact-filter-menu currency-filter-menu" data-currency-menu hidden>
      ${options.map((row) => {
    const code = String(row.currency || "").toUpperCase();
    const active = code === selectedCode ? " active" : "";
    return `<button class="compact-filter-option${active}" type="button" data-currency-option="${htmlEscape(code)}">${htmlEscape(row.option_label || code)}</button>`;
  }).join("")}
    </div>
  `;
}

async function handleCurrencyChange() {
  const value = String(els.currencySelect?.value || "AMT").toUpperCase();
  if (!value || value === state.selectedCurrency) return;
  state.selectedCurrency = value;
  const selected = state.currencies.find((row) => String(row.currency || "").toUpperCase() === value);
  if (selected) {
    state.selectedExchangeRate = Number(selected.exchange_rate || 1) || 1;
    state.selectedCurrencyLabel = selected.option_label || value;
  }
  renderCurrencySelector();
  if (isGlobalCoordinator()) {
    renderSummary();
    renderGlobalCoordinatorWorkbench();
    return;
  }
  if (isLogistics()) {
    renderKpis(state.logistics.totals || {});
    renderSummary();
    renderLogisticsChannelTreePane();
    renderLogisticsWorkbench();
    return;
  }
  renderKpis(state.cardTotals || state.summaryTotals || {});
  renderSummary();
  renderCards(state.cardTotals || {});
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.hidden = true;
  }, 2600);
}

async function copyTextToClipboard(text) {
  const value = String(text || "").trim();
  if (!value) return;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "readonly");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

function currentRole() {
  return state.roles.find((role) => role.role_code === state.roleCode) || state.roles[0] || {};
}

function isBusinessOps() {
  return state.roleCode === "business_ops";
}

function isSubjectOwner() {
  return state.roleCode === "subject_owner";
}

function isSupplyPlanner() {
  return state.roleCode === "supply_planner";
}

function isLogistics() {
  return state.roleCode === "first_leg_logistics";
}

function isGlobalCoordinator() {
  return state.roleCode === "global_coordinator";
}

function isReadonlyMirror() {
  return Boolean(state.globalCoordinator?.mirror);
}

function manualForRoleCode(roleCode) {
  const role = state.roles.find((item) => item.role_code === roleCode) || currentRole();
  return ROLE_MANUALS[role.role_code] || {
    grain: role.default_home_grain || "--",
    scope: "按当前角色权限范围过滤",
    drill: "摘要 -> 风险卡片 -> 货件留言",
    exportLimit: role.export_row_limit ? `${fmtNumber(role.export_row_limit)} 行` : "--",
    summary: role.remark || "按当前角色用加权 GMV 损失识别重点问题，并推动具体处理动作。",
    steps: [
      "先看加权 GMV 损失，再对比原始 GMV 损失和综合权重。",
      "用主要问题分布定位异常类型和受影响的权重。",
      "下钻货件后沉淀责任方、处理动作和预计反馈时间。",
    ],
    notes: ["实际可见范围以服务端权限过滤结果为准。"],
  };
}

function currentManual() {
  return manualForRoleCode(state.roleCode);
}

function userDisplayName(user) {
  if (!user) return "未选择用户";
  const cnName = user.cn_name || "";
  const enName = user.en_name || (cnName ? user.username || "" : "");
  if (cnName && enName && cnName !== enName) return `${cnName}-${enName}`;
  if (user.display_name) return user.display_name;
  return cnName || enName || user.username || "未命名用户";
}

function userInputLabel(user) {
  return user ? userDisplayName(user) : "";
}

function roleName(roleCode) {
  const role = state.roles.find((item) => item.role_code === roleCode);
  return role?.role_name_short || ROLE_SHORT_NAMES[roleCode] || role?.role_name_cn || roleCode || "未选择角色";
}

function roleFullName(roleCode) {
  const role = state.roles.find((item) => item.role_code === roleCode);
  return role?.role_name_cn || roleName(roleCode);
}

function searchTokens(raw) {
  return String(raw || "")
    .replace(/[，,；;、\s]+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
}

function roleSearchText(role) {
  const roleCode = role?.role_code || "";
  return [
    roleCode,
    role?.role_name_cn || "",
    role?.role_name_short || "",
    ROLE_SHORT_NAMES[roleCode] || "",
    ...(ROLE_SEARCH_ALIASES[roleCode] || []),
  ].join(" ").toLowerCase();
}

function roleCodesMatchingSearch(raw) {
  const tokens = searchTokens(raw);
  if (!tokens.length) return [];
  return state.roles
    .filter((role) => {
      const text = roleSearchText(role);
      return tokens.some((token) => text.includes(token));
    })
    .map((role) => role.role_code)
    .filter(Boolean);
}

function preferredSearchRoleForUser(user, raw) {
  const userCodes = new Set(userRoleCodes(user));
  const matchedCodes = roleCodesMatchingSearch(raw).filter((code) => userCodes.has(code));
  return matchedCodes.length === 1 ? matchedCodes[0] : "";
}

function userSearchRoleCode(raw) {
  const matchedCodes = roleCodesMatchingSearch(raw);
  if (matchedCodes.length === 1) return matchedCodes[0];
  return searchTokens(raw).length ? "" : (state.draftRoleCode || state.roleCode || "");
}

function userRoleCodes(user) {
  if (Array.isArray(user?.role_codes)) return user.role_codes.filter(Boolean);
  if (typeof user?.role_codes === "string") return user.role_codes.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function rolePriority(roleCode) {
  return ROLE_PRIORITY_RANK.has(roleCode) ? ROLE_PRIORITY_RANK.get(roleCode) : 999;
}

function availableRolesForUser(user) {
  const codes = userRoleCodes(user);
  const sortRoles = (roles) => [...roles].sort((a, b) => (
    rolePriority(a.role_code) - rolePriority(b.role_code)
      || String(a.role_code || "").localeCompare(String(b.role_code || ""))
  ));
  if (!codes.length) return sortRoles(state.roles);
  const allowed = new Set(codes);
  return sortRoles(state.roles.filter((role) => allowed.has(role.role_code)));
}

function preferredRoleForUser(user) {
  const roles = availableRolesForUser(user);
  const availableCodes = new Set(roles.map((role) => role.role_code));
  const preferred = user?.last_selected_role_code;
  if (preferred && availableCodes.has(preferred)) {
    return preferred;
  }
  return roles[0]?.role_code || state.roles[0]?.role_code || "business_ops";
}

function userParams() {
  const params = new URLSearchParams();
  if (state.user?.id) params.set("user_id", state.user.id);
  params.set("role_code", state.roleCode);
  appendCurrencyParam(params);
  if (isReadonlyMirror()) {
    const mirror = state.globalCoordinator.mirror;
    if (mirror.viewerUserId) params.set("viewer_user_id", mirror.viewerUserId);
    params.set("viewer_role_code", mirror.viewerRoleCode || "global_coordinator");
    params.set("mode", "readonly_mirror");
  }
  return params;
}

function setUser(user) {
  state.user = user;
  localStorage.setItem("ohc_user", JSON.stringify(user));
  renderCurrentIdentity();
}

function resetSubjectOwnerFlow({ keepSubjectSelection = true } = {}) {
  state.subjectOwner.businessRows = [];
  state.subjectOwner.logisticsRows = [];
  state.subjectOwner.subjectRows = [];
  state.subjectOwner.opsRows = [];
  state.subjectOwner.issueRows = [];
  state.subjectOwner.actionRows = [];
  state.subjectOwner.totals = {};
  state.subjectOwner.scopeExceptionTotals = {};
  state.subjectOwner.loadError = "";
  if (!keepSubjectSelection) state.subjectOwner.selectedSubjectNos = [];
  state.subjectOwner.selectedIssueType = "";
  state.subjectOwner.batchDraftText = "";
  state.subjectOwner.batchEditorOpen = false;
  state.subjectOwner.excludedKeys = [];
  state.subjectOwner.customDrafts = {};
  state.subjectOwner.linkDetail = null;
}

function resetPlannerFlow({ keepSelections = false } = {}) {
  state.planner.payload = null;
  state.planner.loadError = "";
  state.planner.feedbackDetail = null;
  if (!keepSelections) {
    state.planner.selectedOverdueType = "";
    state.planner.selectedLinkKey = "";
    state.planner.linkPage = 1;
    state.planner.shipmentPage = 1;
    state.planner.filterOpen = false;
  }
}

function resetLogisticsFlow({ keepGroupSelection = false } = {}) {
  state.logistics.rows = [];
  state.logistics.totals = {};
  state.logistics.distributionRows = [];
  state.logistics.channelRows = [];
  state.logistics.feedbackOptions = [];
  state.logistics.feedbackSummaryRows = [];
  state.logistics.bucketSummaryRows = [];
  state.logistics.channelTreeRows = [];
  state.logistics.channelTreeCollapsed = {};
  state.logistics.channelTreeAllCollapsed = false;
  state.logistics.detail = null;
  state.logistics.selectedShipmentNo = "";
  state.logistics.shipmentPage = 1;
  if (!keepGroupSelection) {
    state.logistics.selectedCountry = "";
    state.logistics.selectedFreightType = "";
    state.logistics.selectedChannel3 = "";
    state.logistics.selectedActionScope = "logistics_owned";
  }
}

function resetGlobalCoordinatorFlow({ keepSelection = false } = {}) {
  state.globalCoordinator.payload = null;
  state.globalCoordinator.loadError = "";
  state.globalCoordinator.granularityOptions = [];
  if (!keepSelection) {
    state.globalCoordinator.selectedScopeType = "brand_group";
    state.globalCoordinator.selectedScopeKey = "";
    state.globalCoordinator.selectedRoleCode = "subject_owner";
  }
}

function clearReadonlyMirror() {
  state.globalCoordinator.mirror = null;
}

function readonlyViewerRoleCode() {
  return state.globalCoordinator?.mirror?.viewerRoleCode || "";
}

async function syncSession() {
  if (!state.user?.id) return;
  const payload = await api("/api/session", {
    method: "POST",
    body: JSON.stringify({ user_id: state.user.id, role_code: state.roleCode }),
  });
  if (payload.user) {
    setUser({ ...state.user, ...payload.user, id: payload.user.user_id || state.user.id });
  }
}

async function loadHealth() {
  const payload = await api("/health");
  state.health = payload;
  renderSnapshotTime();
  return payload;
}

function renderSnapshotTime() {
  if (!els.snapshotTime) return;
  const refreshedAt = state.health?.snapshot?.refreshed_at;
  els.snapshotTime.textContent = `最近更新 ${fmtDateTimeCn(refreshedAt)}`;
}

async function loadFilterOptions() {
  try {
    const payload = await api("/api/filter-options");
    state.filterOptions = payload.options || {};
    renderFieldFilterOptions();
    return payload;
  } catch (error) {
    state.filterOptions = {};
    renderFieldFilterOptions();
    console.warn("Filter option snapshot is unavailable; continuing without preset filter options.", error);
    return { ok: false, options: {} };
  }
}

async function loadRoles() {
  const payload = await api("/api/roles");
  state.roles = payload.roles || [];
  if (!state.roles.some((role) => role.role_code === state.roleCode)) {
    state.roleCode = state.roles[0]?.role_code || "business_ops";
  }
  renderRoles();
}

function renderRoles() {
  const roles = availableRolesForUser(state.draftUser);
  if (!roles.some((role) => role.role_code === state.draftRoleCode)) {
    state.draftRoleCode = roles[0]?.role_code || "";
  }
  const activeRoleCode = state.draftRoleCode || state.roleCode;
  els.roleSwitch.innerHTML = roles.length
    ? roles
    .map((role) => {
      const active = role.role_code === activeRoleCode ? " active" : "";
      const disabled = state.isIdentityApplying ? " disabled" : "";
      return `<button class="role-btn${active}" type="button" data-role="${htmlEscape(role.role_code)}" title="${htmlEscape(roleFullName(role.role_code))}"${disabled}>${htmlEscape(roleName(role.role_code))}</button>`;
    })
    .join("")
    : `<div class="empty-state compact">该用户暂无可用角色</div>`;
  els.roleSwitch.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.draftRoleCode = button.dataset.role;
      renderRoles();
      renderIdentityDraft();
    });
  });
  renderIdentityRoleInfo();
  renderManualIfOpen();
}

function setIdentityDraftMessage(message = "") {
  const draftText = els.identityDraftText || $("identity-draft-text");
  if (!draftText) return;
  els.identityDraftText = draftText;
  draftText.hidden = !message;
  draftText.textContent = message;
}

function setIdentityApplying(isApplying) {
  state.isIdentityApplying = isApplying;
  els.identityPanel.classList.toggle("is-loading", isApplying);
  els.roleSwitch.querySelectorAll("button").forEach((button) => {
    button.disabled = isApplying;
  });
  els.userSearch.disabled = isApplying;
  if (els.identityConfirm) {
    els.identityConfirm.disabled = isApplying;
    els.identityConfirm.textContent = isApplying ? "正在配置..." : "确认变更";
  }
  if (els.identityCancel) els.identityCancel.disabled = isApplying;
  if (els.identityClose) els.identityClose.disabled = isApplying;
  if (isApplying) {
    setIdentityDraftMessage("正在重新配置，请稍待片刻，完成后会自动提示你。");
  } else {
    renderIdentityDraft();
  }
}

function renderCurrentIdentity() {
  if (!els.identityCurrent) return;
  const label = els.identityTrigger?.querySelector("span");
  if (label) label.textContent = isReadonlyMirror() ? "返回全局统筹" : "当前用户";
  els.identityCurrent.textContent = `${userDisplayName(state.user)} / ${roleName(state.roleCode)}`;
  updateReadonlyControls();
}

function renderIdentityDraft() {
  setIdentityDraftMessage("");
}

function renderIdentityRoleInfo() {
  if (!els.identityGrain || !els.identityScope || !els.identityDrill || !els.identityExport) return;
  const manual = manualForRoleCode(state.draftRoleCode || state.roleCode);
  els.identityGrain.textContent = manual.grain;
  els.identityScope.textContent = manual.scope;
  els.identityDrill.textContent = manual.drill;
  els.identityExport.textContent = manual.exportLimit;
}

function setGlobalCoordinatorLayoutMode(active) {
  placeFiltersForMode(false);
  els.filters?.classList.remove("planner-filter-popover", "summary-filter-popover", "logistics-filter-popover");
  els.workspace?.classList.toggle("global-coordinator-mode", Boolean(active));
  els.detailPane?.classList.toggle("global-coordinator-mode", Boolean(active));
  els.detailBody?.classList.toggle("global-coordinator-layout", Boolean(active));
  if (active) {
    els.workspace?.classList.remove("owner-mode", "planner-mode", "owner-link-detail-mode", "logistics-mode");
    els.detailPane?.classList.remove("ops-mode", "owner-mode", "planner-mode", "logistics-mode");
    els.detailBody?.classList.remove("ops-layout", "owner-layout", "planner-layout", "logistics-layout");
    if (els.logisticsChannelPane) els.logisticsChannelPane.hidden = true;
    if (els.filters) els.filters.hidden = true;
  } else if (els.filters) {
    els.filters.hidden = false;
  }
}

async function enterReadonlyMirror(row) {
  const targetUserId = String(row.target_user_id || "").trim();
  const targetRoleCode = String(row.target_role_code || "").trim();
  if (!targetUserId || !targetRoleCode) {
    showToast("该人员暂不能打开视角");
    return;
  }
  const viewerUser = state.user;
  const viewerRoleCode = state.roleCode;
  state.globalCoordinator.mirror = {
    viewerUser,
    viewerUserId: viewerUser?.id || "",
    viewerRoleCode,
    targetUserId,
    targetRoleCode,
    person: row.person || "",
  };
  state.user = { id: targetUserId, user_id: targetUserId, display_name: row.person || targetUserId };
  state.roleCode = targetRoleCode;
  state.selectedSummary = null;
  resetSubjectOwnerFlow({ keepSubjectSelection: false });
  resetPlannerFlow();
  resetLogisticsFlow();
  state.activeShipment = null;
  els.commentPanel.hidden = true;
  renderCurrentIdentity();
  await loadSummary();
  await loadCards();
  showToast("已进入只读视角");
}

async function exitReadonlyMirror() {
  const mirror = state.globalCoordinator.mirror;
  if (!mirror) return;
  state.user = mirror.viewerUser;
  state.roleCode = mirror.viewerRoleCode || "global_coordinator";
  clearReadonlyMirror();
  state.selectedSummary = null;
  resetSubjectOwnerFlow({ keepSubjectSelection: false });
  resetPlannerFlow();
  resetLogisticsFlow();
  state.activeShipment = null;
  els.commentPanel.hidden = true;
  renderCurrentIdentity();
  await loadSummary();
  await loadCards();
}

function openIdentityPanel() {
  if (isReadonlyMirror()) {
    exitReadonlyMirror().catch((error) => showToast(error.message));
    return;
  }
  state.draftUser = state.user;
  state.draftRoleCode = state.roleCode;
  state.userSearchRequestId += 1;
  els.userSearch.value = userInputLabel(state.draftUser);
  els.userResults.hidden = true;
  renderRoles();
  renderIdentityDraft();
  document.body.classList.add("identity-modal-open");
  els.identityBackdrop.hidden = false;
  els.identityPanel.hidden = false;
  els.identityTrigger.setAttribute("aria-expanded", "true");
  window.setTimeout(() => {
    els.userSearch.focus();
    showUserOptionsFromInput().catch((error) => showToast(error.message));
  }, 0);
}

function closeIdentityPanel(force = false) {
  if (state.isIdentityApplying && !force) return;
  els.identityPanel.hidden = true;
  els.identityBackdrop.hidden = true;
  document.body.classList.remove("identity-modal-open");
  els.identityTrigger.setAttribute("aria-expanded", "false");
  els.userResults.hidden = true;
}

function setDraftUser(user, preferredRoleCode = "") {
  state.draftUser = user;
  const roles = availableRolesForUser(user);
  const availableCodes = new Set(roles.map((role) => role.role_code));
  state.draftRoleCode = preferredRoleCode && availableCodes.has(preferredRoleCode)
    ? preferredRoleCode
    : preferredRoleForUser(user);
  els.userSearch.value = userInputLabel(user);
  els.userResults.hidden = true;
  renderRoles();
  renderIdentityDraft();
}

async function applyIdentityChange() {
  if (!state.draftUser?.id) {
    showToast("请先选择用户");
    return;
  }
  if (!state.draftRoleCode) {
    showToast("请先选择角色");
    return;
  }
  if (!availableRolesForUser(state.draftUser).some((role) => role.role_code === state.draftRoleCode)) {
    showToast("该用户没有所选角色权限");
    return;
  }
  const userChanged = state.draftUser.id !== state.user?.id;
  const roleChanged = state.draftRoleCode !== state.roleCode;
  if (!userChanged && !roleChanged) {
    closeIdentityPanel(true);
    return;
  }
  const nextUser = state.draftUser;
  const nextRoleCode = state.draftRoleCode;
  const nextRoleName = roleName(nextRoleCode);
  const confirmed = window.confirm(`确认切换到「${userDisplayName(nextUser)} / ${nextRoleName}」吗？\n\n确认后会按该用户和角色重新加载首页、权限范围和风险卡片。`);
  if (!confirmed) return;

  const previousUser = state.user;
  const previousRoleCode = state.roleCode;
  setIdentityApplying(true);
  showToast("正在重新配置，请稍待片刻，完成后会自动提示你。");
  state.roleCode = nextRoleCode;
  setUser(nextUser);
  state.selectedSummary = null;
  resetSubjectOwnerFlow({ keepSubjectSelection: false });
  resetPlannerFlow();
  resetLogisticsFlow();
  resetGlobalCoordinatorFlow();
  clearReadonlyMirror();
  state.subjectOwner.selectedOpsPerson = "";
  state.subjectOwner.exceptionOnly = true;
  state.subjectOwner.subjectMenuOpen = false;
  state.activeShipment = null;
  els.commentPanel.hidden = true;
  renderCurrentIdentity();
  try {
    await syncSession();
    await loadSummary();
    await loadCards();
    closeIdentityPanel(true);
    showToast(`已切换到「${userDisplayName(state.user)} / ${nextRoleName}」`);
  } catch (error) {
    state.roleCode = previousRoleCode;
    setUser(previousUser);
    state.selectedSummary = null;
    renderCurrentIdentity();
    showToast(error.message);
  } finally {
    setIdentityApplying(false);
  }
}

async function searchUsers(q = "", options = {}) {
  const requestId = ++state.userSearchRequestId;
  state.userSearchQuery = q;
  renderUserSearchStatus("正在搜索用户...");
  const roleCode = options.allRoles ? "" : userSearchRoleCode(q);
  const params = new URLSearchParams({ q, limit: roleCode === "subject_owner" ? "200" : "20" });
  if (roleCode) params.set("role_code", roleCode);
  try {
    const payload = await api(`/api/users?${params.toString()}`);
    if (requestId !== state.userSearchRequestId) return [];
    renderUserResults(payload.users || []);
    return payload.users || [];
  } catch (error) {
    if (requestId === state.userSearchRequestId) {
      renderUserSearchStatus("用户搜索失败，请稍后重试。");
    }
    throw error;
  }
}

async function showUserOptionsFromInput() {
  const q = els.userSearch.value.trim();
  const isCurrentLabel = q === userInputLabel(state.draftUser);
  await searchUsers(isCurrentLabel ? "" : q, { allRoles: !q || isCurrentLabel });
}

function renderUserSearchStatus(message) {
  els.userResults.innerHTML = `<div class="user-search-status">${htmlEscape(message)}</div>`;
  els.userResults.hidden = false;
}

function renderUserResults(users) {
  if (!users.length) {
    renderUserSearchStatus("未找到匹配用户");
    return;
  }
  els.userResults.innerHTML = users
    .map((user) => {
      const label = userDisplayName(user);
      const codes = userRoleCodes(user);
      const roleChips = codes.length
        ? codes.map((code) => `<span class="user-role-chip">${htmlEscape(roleName(code))}</span>`).join("")
        : `<span class="user-role-chip muted">暂无可用角色</span>`;
      return `<button class="user-option" type="button" data-id="${htmlEscape(user.id)}">
        <span class="user-option-head">
          <strong>${htmlEscape(label)}</strong>
          <span class="user-role-chips">${roleChips}</span>
        </span>
      </button>`;
    })
    .join("");
  els.userResults.hidden = false;
  els.userResults.querySelectorAll("button").forEach((button, index) => {
    button.addEventListener("click", () => {
      const user = users[index];
      setDraftUser(user, preferredSearchRoleForUser(user, state.userSearchQuery));
    });
  });
}

function scopeText(scope) {
  const mode = scope?.mode || "trial_fallback";
  if (mode === "scope_table") return `权限范围 ${scope.scope_count} 条`;
  if (mode === "current_subject_owner") return `当前明细主体 ${scope.scope_count} 个`;
  if (mode === "role_default_contact") return "按当前物流对接人过滤";
  if (mode === "admin_all") return "管理员范围";
  return "FBA正式范围";
}

function personText(value) {
  const text = String(value || "").trim();
  return text || "暂未分配";
}

function splitPeople(value) {
  return String(value || "")
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueJoined(rows, field, fallback = "暂未分配", maxItems = 3) {
  const values = [];
  (rows || []).forEach((row) => {
    splitPeople(row[field]).forEach((person) => {
      if (person && !values.includes(person)) values.push(person);
    });
  });
  if (!values.length) return fallback;
  const visible = values.slice(0, maxItems).join("、");
  return values.length > maxItems ? `${visible} 等${fmtNumber(values.length)}人` : visible;
}

function uniqueValues(rows, field, fallback = "--", maxItems = 3) {
  const values = [];
  (rows || []).forEach((row) => {
    const value = String(row[field] || "").trim();
    if (value && !values.includes(value)) values.push(value);
  });
  if (!values.length) return fallback;
  const visible = values.slice(0, maxItems).join("、");
  return values.length > maxItems ? `${visible} 等${fmtNumber(values.length)}项` : visible;
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function dateMs(value) {
  const dateText = fmtDate(value);
  if (dateText === "--") return null;
  const ms = Date.parse(`${dateText}T00:00:00`);
  return Number.isNaN(ms) ? null : ms;
}

function daysBetween(startValue, endValue) {
  const start = dateMs(startValue);
  const end = dateMs(endValue);
  if (start === null || end === null) return null;
  return Math.floor((end - start) / 86400000);
}

function snapshotDateFromCards(country) {
  const dates = (state.cards || [])
    .filter((row) => !country || row.logistics_country_cn === country)
    .map((row) => {
      const gapMs = dateMs(row.first_gap_date);
      const days = finiteNumber(row.days_to_first_gap);
      if (gapMs === null || days === null) return null;
      return new Date(gapMs - days * 86400000).toISOString().slice(0, 10);
    })
    .filter(Boolean)
    .sort();
  return dates[0] || null;
}

function dominantFreightFromCards() {
  const totals = new Map();
  (state.cards || []).forEach((row) => {
    const freight = String(row.freight_type_name || "").trim();
    if (!freight) return;
    const loss = Number(row.allocated_raw_expected_gmv_loss || 0);
    totals.set(freight, (totals.get(freight) || 0) + loss);
  });
  return Array.from(totals.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))[0]?.[0] || "";
}

function currentFreightsForCountry(country) {
  const totals = new Map();
  (state.cards || [])
    .filter((row) => !country || row.logistics_country_cn === country)
    .forEach((row) => {
      const freight = String(row.freight_type_name || "").trim();
      if (!freight) return;
      const loss = Number(row.allocated_raw_expected_gmv_loss || 0);
      totals.set(freight, (totals.get(freight) || 0) + loss);
    });
  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .map(([freight]) => freight);
}

function freightMatchesReference(currentFreight, referenceFreight) {
  if (!currentFreight || !referenceFreight) return false;
  return currentFreight === referenceFreight || referenceFreight.includes(currentFreight) || currentFreight.includes(referenceFreight);
}

function fallbackBridgeText() {
  const freight = dominantFreightFromCards();
  const isAlreadyUrgent = (state.cards || []).some((row) => {
    const days = finiteNumber(row.days_to_first_gap);
    return (days !== null && days <= 0) || Number(row.logistics_urgency_weight || 0) >= 1;
  });
  if (!freight || isAlreadyUrgent) return "无法通过紧急发货衔接上。";
  return `${freight}发货可衔接上。`;
}

function bridgeTextForRiskDate(riskDate) {
  const grouped = new Map();
  (state.logisticsOptions || []).forEach((option) => {
    const country = String(option.country_cn || "").trim();
    const freight = String(option.freight_type_name || "").trim();
    const leadDays = finiteNumber(option.reference_lead_days);
    if (!country || !freight || leadDays === null) return;
    if (!grouped.has(country)) grouped.set(country, []);
    grouped.get(country).push({ ...option, country_cn: country, freight_type_name: freight, reference_lead_days: leadDays });
  });
  const countries = Array.from(grouped.entries()).sort((a, b) => {
    const aLoss = Number(a[1][0]?.raw_expected_gmv_loss || 0);
    const bLoss = Number(b[1][0]?.raw_expected_gmv_loss || 0);
    return bLoss - aLoss || a[0].localeCompare(b[0], "zh-CN");
  });
  if (!countries.length) return fallbackBridgeText();

  const [country, options] = countries[0];
  const snapshotDate = options.find((option) => option.snapshot_date)?.snapshot_date || snapshotDateFromCards(country);
  const daysToRisk = daysBetween(snapshotDate, riskDate);
  if (daysToRisk === null) return fallbackBridgeText();

  const feasible = options
    .filter((option) => option.reference_lead_days <= daysToRisk)
    .sort((a, b) => b.reference_lead_days - a.reference_lead_days || a.freight_type_name.localeCompare(b.freight_type_name, "zh-CN"));
  if (!feasible.length) return "无法通过紧急发货衔接上。";
  const currentFreight = currentFreightsForCountry(country).find((freight) =>
    feasible.some((option) => freightMatchesReference(freight, option.freight_type_name))
  );
  if (currentFreight) return `${currentFreight}发货可衔接上。`;
  return `${feasible[0].freight_type_name}发货可衔接上。`;
}

function renderPeopleRows(row) {
  const people = [
    ["运营", row.business_ops_people],
    ["计划", row.supply_planner_people],
    ["物流", row.first_leg_logistics_people || row.contact_display_name],
  ];
  return people
    .map(([label, value]) => `<div class="person-line"><span>${label}</span><strong>${htmlEscape(personText(value))}</strong></div>`)
    .join("");
}

function hasExpectedLoss(row) {
  return Number(row?.raw_expected_gmv_loss || 0) > 0;
}

function compareSummaryRows(a, b) {
  const rawDiff = Number(b.raw_expected_gmv_loss || 0) - Number(a.raw_expected_gmv_loss || 0);
  if (rawDiff) return rawDiff;
  const weightedDiff = Number(b.weighted_expected_gmv_loss || 0) - Number(a.weighted_expected_gmv_loss || 0);
  if (weightedDiff) return weightedDiff;
  const shipmentDiff = Number(b.shipment_count || 0) - Number(a.shipment_count || 0);
  if (shipmentDiff) return shipmentDiff;
  const dateA = a.first_gap_date || "9999-12-31";
  const dateB = b.first_gap_date || "9999-12-31";
  if (dateA !== dateB) return dateA.localeCompare(dateB);
  return String(a.summary_label || a.summary_key || "").localeCompare(String(b.summary_label || b.summary_key || ""));
}

function normalizedOpsSummaryRows() {
  const byKey = new Map();
  (state.allSummaryRows || []).forEach((row) => {
    if (Number(row.sales_link_count || 0) <= 0) return;
    const key = row.summary_key || row.summary_label || row.summary_hash;
    if (!key) return;
    const existing = byKey.get(key);
    if (!existing || compareSummaryRows(row, existing) < 0) {
      byKey.set(key, row);
    }
  });
  return Array.from(byKey.values()).sort(compareSummaryRows);
}

function subjectKey(row) {
  return String(row?.subject_no || row?.summary_key || row?.summary_label || "").trim();
}

function subjectCodeFromText(value, fallback = "主体缺失") {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  const slashParts = raw.split("/").map((part) => part.trim()).filter(Boolean);
  const candidate = slashParts.length >= 2 && /^[A-Z]{2,4}$/i.test(slashParts[0])
    ? slashParts[1]
    : (slashParts[0] || raw);
  const beforeBracket = candidate.split(/[【\[\uff08(]/)[0].trim();
  return beforeBracket || candidate || raw || fallback;
}

function subjectCodeDisplay(rowOrValue, fallback = "主体缺失") {
  if (rowOrValue && typeof rowOrValue === "object") {
    return subjectCodeFromText(
      rowOrValue.subject_no
      || rowOrValue.scope_key
      || rowOrValue.summary_key
      || rowOrValue.dimension_key
      || rowOrValue.subject_label
      || rowOrValue.subject_name
      || rowOrValue.scope_label
      || rowOrValue.summary_label
      || fallback,
      fallback
    );
  }
  return subjectCodeFromText(rowOrValue, fallback);
}

function subjectLabel(row) {
  return subjectCodeDisplay(row, "未命名主体");
}

function subjectFilterOptions() {
  const byKey = new Map();
  (state.allSummaryRows || []).forEach((row) => {
    const key = subjectKey(row);
    if (!key) return;
    const existing = byKey.get(key);
    if (!existing || compareSummaryRows(row, existing) < 0) {
      byKey.set(key, row);
    }
  });
  return Array.from(byKey.values()).sort(compareSummaryRows);
}

function sanitizeSubjectSelection() {
  const validKeys = new Set(subjectFilterOptions().map(subjectKey));
  state.subjectOwner.selectedSubjectNos = (state.subjectOwner.selectedSubjectNos || []).filter((key) => validKeys.has(key));
}

function selectedSubjectRows() {
  const options = subjectFilterOptions();
  const selectedKeys = state.subjectOwner.selectedSubjectNos || [];
  if (!selectedKeys.length) return options;
  const selectedSet = new Set(selectedKeys);
  return options.filter((row) => selectedSet.has(subjectKey(row)));
}

function subjectSelectionText() {
  const selectedKeys = state.subjectOwner.selectedSubjectNos || [];
  if (!selectedKeys.length) return "全部主体";
  const labels = selectedSubjectRows().map(subjectLabel);
  return labels.length ? labels.join("、") : "全部主体";
}

function subjectOwnerKpiTotals(fallbackTotals = {}) {
  if (!isSubjectOwner()) return fallbackTotals;
  const selectedKeys = state.subjectOwner.selectedSubjectNos || [];
  if (!selectedKeys.length) return fallbackTotals;
  const totals = selectedSubjectRows().reduce((acc, row) => {
    acc.row_count += 1;
    acc.card_row_count += Number(row.card_row_count || 0);
    acc.shipment_count += Number(row.shipment_count || 0);
    acc.sales_link_count += Number(row.sales_link_count || 0);
    acc.in_transit_qty += Number(row.in_transit_qty || 0);
    acc.in_transit_expected_gmv += Number(row.in_transit_expected_gmv || 0);
    acc.raw_expected_gmv_loss += Number(row.raw_expected_gmv_loss || 0);
    acc.weighted_expected_gmv_loss += Number(row.weighted_expected_gmv_loss || 0);
    acc.data_issue_rows += Number(row.data_issue_rows || 0);
    acc.comment_shipment_count += Number(row.comment_shipment_count || 0);
    acc.max_event_weight = Math.max(acc.max_event_weight, Number(row.max_event_weight || 0));
    const firstGap = row.first_gap_date || "";
    if (firstGap && (!acc.first_gap_date || firstGap < acc.first_gap_date)) {
      acc.first_gap_date = firstGap;
    }
    return acc;
  }, {
    row_count: 0,
    card_row_count: 0,
    shipment_count: 0,
    sales_link_count: 0,
    in_transit_qty: 0,
    in_transit_expected_gmv: 0,
    raw_expected_gmv_loss: 0,
    weighted_expected_gmv_loss: 0,
    data_issue_rows: 0,
    comment_shipment_count: 0,
    max_event_weight: 0,
    first_gap_date: "",
  });
  totals.composite_weight = totals.raw_expected_gmv_loss
    ? totals.weighted_expected_gmv_loss / totals.raw_expected_gmv_loss
    : 0;
  return totals;
}

function summaryRowsForDisplay() {
  if (isSubjectOwner()) return selectedSubjectRows();
  if (!isBusinessOps()) return state.allSummaryRows || [];
  const rows = normalizedOpsSummaryRows();
  const visibleRows = state.showOnlyLossSummaryLinks ? rows.filter(hasExpectedLoss) : rows;
  const totalLoss = Number(state.summaryTotals.raw_expected_gmv_loss || 0);
  let cumulativeLoss = 0;
  return visibleRows.map((row) => {
    cumulativeLoss += Number(row.raw_expected_gmv_loss || 0);
    return {
      ...row,
      ops_cumulative_loss_pct: totalLoss > 0 ? Math.round((cumulativeLoss / totalLoss) * 100) : 0,
    };
  });
}

function renderSubjectFilter() {
  if (!els.subjectFilterHost) return;
  if (!isSubjectOwner()) {
    els.subjectFilterHost.hidden = true;
    els.subjectFilterHost.innerHTML = "";
    state.subjectOwner.subjectMenuOpen = false;
    return;
  }
  const options = subjectFilterOptions();
  const selectedKeys = state.subjectOwner.selectedSubjectNos || [];
  const selectedSet = new Set(selectedKeys);
  const label = subjectSelectionText();
  els.subjectFilterHost.hidden = false;
  els.subjectFilterHost.innerHTML = `
    <div class="subject-filter${state.subjectOwner.subjectMenuOpen ? " open" : ""}">
      <button class="subject-filter-trigger" type="button" aria-expanded="${state.subjectOwner.subjectMenuOpen ? "true" : "false"}">
        <strong title="${htmlEscape(label)}">${htmlEscape(label)}</strong>
        <span aria-hidden="true">∨</span>
      </button>
      <div class="subject-filter-menu" ${state.subjectOwner.subjectMenuOpen ? "" : "hidden"}>
        <label class="subject-filter-option">
          <input type="checkbox" data-subject-all ${selectedKeys.length ? "" : "checked"}>
          <strong>全部主体</strong>
        </label>
        ${options.map((row) => {
          const key = subjectKey(row);
          return `<label class="subject-filter-option">
            <input type="checkbox" data-subject-no="${htmlEscape(key)}" ${selectedSet.has(key) ? "checked" : ""}>
            <strong>${htmlEscape(subjectLabel(row))}</strong>
          </label>`;
        }).join("")}
      </div>
    </div>
  `;
  els.subjectFilterHost.querySelector(".subject-filter-trigger")?.addEventListener("click", (event) => {
    event.stopPropagation();
    state.subjectOwner.subjectMenuOpen = !state.subjectOwner.subjectMenuOpen;
    renderSubjectFilter();
  });
  els.subjectFilterHost.querySelector(".subject-filter-menu")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  els.subjectFilterHost.querySelector("[data-subject-all]")?.addEventListener("change", async () => {
    resetSubjectOwnerFlow();
    state.subjectOwner.selectedSubjectNos = [];
    state.subjectOwner.selectedOpsPerson = "";
    state.subjectOwner.subjectMenuOpen = true;
    state.summaryRows = summaryRowsForDisplay();
    renderSummary();
    await loadCards();
  });
  els.subjectFilterHost.querySelectorAll("[data-subject-no]").forEach((checkbox) => {
    checkbox.addEventListener("change", async (event) => {
      const key = event.currentTarget.dataset.subjectNo;
      const nextSet = new Set(state.subjectOwner.selectedSubjectNos || []);
      if (event.currentTarget.checked) {
        nextSet.add(key);
      } else {
        nextSet.delete(key);
      }
      resetSubjectOwnerFlow();
      state.subjectOwner.selectedSubjectNos = Array.from(nextSet);
      state.subjectOwner.selectedOpsPerson = "";
      state.subjectOwner.subjectMenuOpen = true;
      state.summaryRows = summaryRowsForDisplay();
      renderSummary();
      await loadCards();
    });
  });
}

function clearCardsForNoSelectedSummary() {
  state.cards = [];
  state.cardTotals = {};
  state.weeklyRows = [];
  state.weeklyAllRows = [];
  state.gapSegments = [];
  state.opsTimelineShipmentNo = "";
  state.issueInsights = [];
  renderIssueInsights();
  renderCards({});
}

async function refreshSummaryListAfterFilterChange(beforeHash) {
  state.summaryRows = summaryRowsForDisplay();
  renderSummary();
  const afterHash = state.selectedSummary?.summary_hash || "";
  if (afterHash !== (beforeHash || "")) {
    if (state.selectedSummary) {
      await loadCards();
    } else {
      clearCardsForNoSelectedSummary();
    }
  }
}

function renderSummaryToolbar() {
  if (!els.summaryListToolbar) return;
  if (isSubjectOwner()) {
    const totalSubjects = subjectFilterOptions().length;
    const selectedCount = selectedSubjectRows().length;
    const opsCount = (state.subjectOwner.opsRows || []).length;
    const selectedOps = state.subjectOwner.selectedOpsPerson;
    els.summaryListToolbar.hidden = false;
    els.summaryListToolbar.innerHTML = `
      <div class="summary-list-heading">
        <div>
          <strong>② 运营风险分布</strong>
          <span>${selectedCount === totalSubjects ? `全部 ${fmtNumber(totalSubjects)} 个主体` : `${fmtNumber(selectedCount)} / ${fmtNumber(totalSubjects)} 个主体`} · ${fmtNumber(opsCount)} 个运营</span>
        </div>
        <button class="ghost-btn owner-reset-ops" type="button" ${selectedOps ? "" : "disabled"}>全部运营</button>
      </div>
      <span class="summary-loss-toggle static">点击运营只看该运营名下的重点核查事项</span>
    `;
    els.summaryListToolbar.querySelector(".owner-reset-ops")?.addEventListener("click", async () => {
      state.subjectOwner.selectedOpsPerson = "";
      renderSubjectOwnerOpsDistribution();
      await loadCards();
    });
    return;
  }
  if (!isBusinessOps()) {
    els.summaryListToolbar.hidden = true;
    els.summaryListToolbar.innerHTML = "";
    return;
  }
  const allRows = normalizedOpsSummaryRows();
  const totalCount = allRows.length;
  const shownCount = state.summaryRows.length;
  els.summaryListToolbar.hidden = false;
  els.summaryListToolbar.innerHTML = `
    <div class="summary-list-heading">
      <strong>销售链接清单</strong>
      <span>${fmtNumber(shownCount)} / ${fmtNumber(totalCount)} 条</span>
    </div>
    <div class="summary-toggle-stack">
      <label class="summary-loss-toggle">
        <input id="summary-loss-toggle" type="checkbox" ${state.showOnlyLossSummaryLinks ? "checked" : ""}>
        默认只显示有预期GMV损失的链接
      </label>
    </div>
  `;
  const toggle = els.summaryListToolbar.querySelector("#summary-loss-toggle");
  toggle?.addEventListener("change", async (event) => {
    const before = state.selectedSummary?.summary_hash;
    state.showOnlyLossSummaryLinks = event.currentTarget.checked;
    await refreshSummaryListAfterFilterChange(before);
  });
}

function ownerDashboardNumber(row, field) {
  return Number(row?.[field] || 0);
}

function ownerDashboardMetric(row, field, fallbackField) {
  if (row && Object.prototype.hasOwnProperty.call(row, field)) {
    return ownerDashboardNumber(row, field);
  }
  return ownerDashboardNumber(row, fallbackField);
}

function ownerDashboardPercent(part, total, digits = 1) {
  const denominator = Number(total || 0);
  if (!denominator) return "--";
  const pct = Math.max(0, Math.min((Number(part || 0) / denominator) * 100, 100));
  return `${pct.toFixed(digits)}%`;
}

function ownerDashboardProgress(row, mode) {
  const base = ownerDashboardNumber(row, "raw_expected_gmv_loss");
  const value = mode === "logistics"
    ? ownerDashboardMetric(row, "filled_recoverable_loss_gmv", "filled_recoverable_gmv")
    : ownerDashboardMetric(row, "recoverable_loss_gmv", "expected_recoverable_gmv");
  const pct = base ? Math.max(0, Math.min((value / base) * 100, 100)) : 0;
  return `<div class="owner-dashboard-progress">
    <strong>${fmtMoneyWan(value)}</strong>
    <span>${base ? `${fmtNumber(pct, 1)}%` : "--"}</span>
    <div class="owner-dashboard-bar"><i style="width:${pct.toFixed(1)}%"></i></div>
  </div>`;
}

function ownerRecoverableBreakdown(row) {
  return `<div class="owner-recover-breakdown">
    <div><span>已填</span><strong class="filled">${fmtMoneyWan(ownerDashboardMetric(row, "filled_recoverable_loss_gmv", "filled_recoverable_gmv"))}</strong></div>
    <div><span>未填</span><strong class="unfilled">${fmtMoneyWan(ownerDashboardMetric(row, "unfilled_recoverable_loss_gmv", "unfilled_recoverable_gmv"))}</strong></div>
  </div>`;
}

function ownerRiskTags(row, mode) {
  const rawLoss = ownerDashboardNumber(row, "raw_expected_gmv_loss");
  const recoverable = ownerDashboardMetric(row, "recoverable_loss_gmv", "expected_recoverable_gmv");
  const filled = ownerDashboardMetric(row, "filled_recoverable_loss_gmv", "filled_recoverable_gmv");
  const unfilled = ownerDashboardMetric(row, "unfilled_recoverable_loss_gmv", "unfilled_recoverable_gmv");
  const tags = [];
  const push = (label, level = "") => {
    if (!tags.some((item) => item.label === label)) tags.push({ label, level });
  };
  if (mode === "logistics") {
    if (recoverable && filled / recoverable < 0.65) push("填写覆盖偏低", "danger");
    if (recoverable && unfilled / recoverable >= 0.25) push("待填写高", "danger");
    if (Number(row.data_issue_rows || 0) > 0) push("数据缺口", "amber");
    if (!tags.length && filled > 0) push("已填写推进中");
  } else {
    if (rawLoss && recoverable / rawLoss < 0.55) push("可推进偏低", "danger");
    if (recoverable && unfilled / recoverable >= 0.25) push("待填写高", "danger");
    if (rawLoss && (rawLoss - recoverable) / rawLoss >= 0.35) push("销售节奏压力", "amber");
    if (!tags.length && filled > 0) push("物流已填写", "amber");
  }
  if (!tags.length) push("待填写");
  const visibleTags = tags.slice(0, 2);
  const hiddenTags = tags.slice(2);
  const title = tags.map((tag) => tag.label).join(" / ");
  return `<div class="owner-risk-tags" title="${htmlEscape(title)}">
    ${visibleTags.map((tag) => `<span class="owner-risk-tag${tag.level ? ` ${tag.level}` : ""}">${htmlEscape(tag.label)}</span>`).join("")}
    ${hiddenTags.length ? `<span class="owner-risk-tag owner-risk-more" aria-label="${htmlEscape(hiddenTags.map((tag) => tag.label).join(" / "))}">+${hiddenTags.length}</span>` : ""}
  </div>`;
}

function ownerDashboardRowLabel(row, mode) {
  if (mode === "logistics") return row.logistics_people || "物流未配置";
  if (mode === "subject") return subjectCodeDisplay(row, "主体缺失");
  return row.business_ops_people || "暂未分配";
}

function ownerDashboardPanelFirstColumn(mode) {
  if (mode === "logistics") return "物流人员";
  if (mode === "subject") return "主体";
  return "运营人员";
}

function renderOwnerDashboardRow(row, mode) {
  const person = ownerDashboardRowLabel(row, mode);
  const canMirror = mode === "logistics"
    ? Boolean(row.target_user_id || row.active_contact_user_id)
    : Boolean(row.target_user_id);
  const mirrorRole = mode === "logistics" ? "first_leg_logistics" : "business_ops";
  return `<article class="owner-dashboard-row">
    <div class="owner-dashboard-person"><strong>${htmlEscape(person)}</strong></div>
    <div class="owner-dashboard-loss">${fmtMoneyWan(row.raw_expected_gmv_loss)}</div>
    ${ownerDashboardProgress(row, mode)}
    ${ownerRecoverableBreakdown(row)}
    ${ownerRiskTags(row, mode)}
    <div class="owner-dashboard-action">
      <button class="ghost-btn compact owner-mirror-btn" type="button" data-owner-mirror-role="${htmlEscape(mirrorRole)}" data-owner-mirror-user="${htmlEscape(row.target_user_id || row.active_contact_user_id || "")}" data-owner-mirror-person="${htmlEscape(person)}" ${canMirror ? "" : "disabled"} title="${canMirror ? "查看该人员视角" : "暂不能打开视角"}">视角</button>
    </div>
  </article>`;
}

function renderOwnerDashboardPanel(title, rows, mode, options = {}) {
  const progressLabel = options.progressLabel || "进度";
  return `<section class="owner-dashboard-panel ${mode}">
    <div class="owner-dashboard-panel-head">
      <h3>${htmlEscape(title)}</h3>
    </div>
    <div class="owner-dashboard-head">
      <span>${ownerDashboardPanelFirstColumn(mode)}</span>
      <span>风险金额</span>
      <span>${htmlEscape(progressLabel)}</span>
      <span>填写拆解</span>
      <span>主要风险</span>
      <span>视角</span>
    </div>
    <div class="owner-dashboard-rows">
      ${rows.length ? rows.map((row) => renderOwnerDashboardRow(row, mode)).join("") : `<div class="empty-state compact">暂无数据</div>`}
    </div>
  </section>`;
}

function renderOwnerDashboardSummary(totals, opsRows) {
  const rawLoss = ownerDashboardNumber(totals, "raw_expected_gmv_loss");
  const recoverable = ownerDashboardMetric(totals, "recoverable_loss_gmv", "expected_recoverable_gmv");
  const filled = ownerDashboardMetric(totals, "filled_recoverable_loss_gmv", "filled_recoverable_gmv");
  const unfilled = ownerDashboardMetric(totals, "unfilled_recoverable_loss_gmv", "unfilled_recoverable_gmv");
  const topOps = opsRows.slice(0, 2).map((row) => row.business_ops_people).filter(Boolean);
  const opsText = topOps.length ? topOps.map((name) => `<strong>${htmlEscape(name)}</strong>`).join("、") : "<strong>暂无集中运营</strong>";
  return `<section class="owner-dashboard-summary">
    当前预计 GMV 损失 <strong>${fmtMoneyWan(rawLoss)}</strong>，当前可能可挽回 <strong>${fmtMoneyWan(recoverable)}</strong>。物流提前能力已填写 <strong>${fmtMoneyWan(filled)}</strong>，未填写 <strong>${fmtMoneyWan(unfilled)}</strong>。运营侧重点看 ${opsText} 等人的可推进占比和主要风险。
  </section>`;
}

function renderPlannerDashboardSummary(totals) {
  const rawLoss = ownerDashboardNumber(totals, "raw_expected_gmv_loss");
  const recoverable = ownerDashboardMetric(totals, "recoverable_loss_gmv", "expected_recoverable_gmv");
  const filled = ownerDashboardMetric(totals, "filled_recoverable_loss_gmv", "filled_recoverable_gmv");
  const unfilled = ownerDashboardMetric(totals, "unfilled_recoverable_loss_gmv", "unfilled_recoverable_gmv");
  return `<section class="owner-dashboard-summary planner-dashboard-summary">
    <span>当前预计 GMV 损失 <strong>${fmtMoneyWan(rawLoss)}</strong></span>
    <span>填写覆盖 <strong>${ownerDashboardPercent(filled, recoverable, 1)}</strong></span>
    <span>可能可挽回 <strong>${fmtMoneyWan(recoverable)}</strong></span>
    <span>待物流填写 <strong>${fmtMoneyWan(unfilled)}</strong></span>
  </section>`;
}

function granularityOptions(sourceOptions = []) {
  const fallback = [
    { value: "brand_group", label: "品牌集合" },
    { value: "subject_no", label: "主体" },
    { value: "account_name", label: "店铺名称" },
    { value: "category1", label: "一级品类" },
    { value: "category2", label: "二级品类" },
    { value: "category3", label: "三级品类" },
    { value: "country", label: "国家" },
  ];
  return sourceOptions.length ? sourceOptions : fallback;
}

function granularityLabel(value, sourceOptions = []) {
  return granularityOptions(sourceOptions).find((row) => row.value === value)?.label || "店铺名称";
}

function renderGranularitySelect(value, options, attrName) {
  return `<label class="granularity-select">
    <span>统计颗粒度</span>
    <select ${attrName}>
      ${granularityOptions(options).map((row) => `<option value="${htmlEscape(row.value)}" ${row.value === value ? "selected" : ""}>${htmlEscape(row.label)}</option>`).join("")}
    </select>
  </label>`;
}

function businessRowsTitle(granularity, options) {
  return `按${granularityLabel(granularity, options)}汇总`;
}

function renderBusinessDistributionPanel(rows, granularity, options, attrName) {
  const title = businessRowsTitle(granularity, options);
  const isSubjectGranularity = granularity === "subject_no" || granularity === "subject";
  const dimensionLabel = (row) => {
    const value = row.dimension_label || row.scope_label || "--";
    return isSubjectGranularity ? subjectCodeDisplay(row.dimension_key || row.scope_key || value, "--") : value;
  };
  return `<section class="business-distribution-panel">
    <div class="business-distribution-head">
      <h3>${htmlEscape(title)}</h3>
      ${renderGranularitySelect(granularity, options, attrName)}
    </div>
    <div class="business-distribution-table">
      <div class="business-distribution-row head">
        <span>${htmlEscape(granularityLabel(granularity, options))}</span>
        <span>风险金额</span>
        <span>可推进挽回</span>
        <span>待物流填写</span>
        <span>货件</span>
        <span>链接</span>
      </div>
      <div class="business-distribution-body">
        ${rows.length ? rows.map((row) => {
    const label = dimensionLabel(row);
    return `<div class="business-distribution-row">
          <strong title="${htmlEscape(label)}">${htmlEscape(label)}</strong>
          <span class="money danger">${fmtMoneyWan(row.raw_expected_gmv_loss)}</span>
          <span class="money">${fmtMoneyWan(row.recoverable_gmv)}</span>
          <span class="money danger">${fmtMoneyWan(row.unfilled_recoverable_gmv)}</span>
          <span>${fmtNumber(row.shipment_count)}</span>
          <span>${fmtNumber(row.sales_link_count)}</span>
        </div>`;
  }).join("") : `<div class="empty-state compact">暂无汇总数据</div>`}
      </div>
    </div>
  </section>`;
}

const PLANNER_OVERDUE_META = {
  serious: {
    label: "严重逾期",
    definition: "当前在途货件，最新预计上架时间比参考时间晚 15 天或以上。",
  },
  express: {
    label: "快递逾期",
    definition: "当前在途货件一级渠道为快递，最新预计上架时间比参考时间晚 3-14 天（包含 3 天、14 天）。",
  },
  air: {
    label: "空运逾期",
    definition: "当前在途货件一级渠道为空运，最新预计上架时间比参考时间晚 5-14 天（包含 5 天、14 天）。",
  },
  freight_land: {
    label: "海运陆运逾期",
    definition: "当前在途货件一级渠道不是快递或空运，最新预计上架时间比参考时间晚 7-14 天（包含 7 天、14 天）。",
  },
};

function plannerOverdueLabel(type) {
  return PLANNER_OVERDUE_META[type]?.label || type || "--";
}

function plannerScopeTitle(scope) {
  if (scope?.mode === "planner_group_leader") return scope.short_name || scope.group_name || "计划小组";
  if (scope?.mode === "planner_trial_subject") return scope.planner_name || "我的主体";
  if (scope?.mode === "scope_table") return `权限主体 ${fmtNumber(scope.scope_count || 0)} 个`;
  if (scope?.mode === "admin_all") return "管理员范围";
  return "我的主体";
}

function plannerScopeMeta(scope) {
  if (scope?.mode === "planner_group_leader") return `${scope.leader_name || "组长"} / ${fmtNumber(scope.scope_count || 0)} 个主体`;
  if (scope?.mode === "planner_trial_subject") return `${fmtNumber(scope.scope_count || 0)} 个主体`;
  if (scope?.mode === "scope_table") return `${fmtNumber(scope.scope_count || 0)} 条权限`;
  if (scope?.mode === "empty_scope") return "暂无计划范围";
  return "按当前计划权限";
}

function plannerSelectedPayload() {
  return state.planner.payload || {};
}

function plannerLinkLoadingPayload(linkKey) {
  const payload = plannerSelectedPayload();
  const linkRows = payload.link_rows || [];
  const selectedLink = linkRows.find((row) => String(row.link_key || "") === String(linkKey || "")) || payload.selected_link || {};
  return {
    ...payload,
    selected_link_key: linkKey,
    selected_link: { ...selectedLink, link_key: linkKey || selectedLink.link_key || "" },
    shipment_rows: [],
    shipment_page: { page: 1, page_size: state.planner.shipmentPageSize || 100, total: 0 },
    is_link_detail_loading: true,
  };
}

function plannerPageInfo(pageInfo = {}) {
  const total = Number(pageInfo.total || 0);
  const pageSize = Math.max(Number(pageInfo.page_size || 100), 1);
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const page = Math.min(Math.max(Number(pageInfo.page || 1), 1), totalPages);
  return { total, pageSize, totalPages, page };
}

function renderPlannerPagination(pageInfo, prefix) {
  const info = plannerPageInfo(pageInfo);
  const prevDisabled = info.page <= 1 ? " disabled" : "";
  const nextDisabled = info.page >= info.totalPages ? " disabled" : "";
  return `<div class="logistics-pagination planner-pagination" aria-label="分页">
    <div class="logistics-page-meta">共 <strong>${fmtNumber(info.total)}</strong> 条 / 每页 <strong>${fmtNumber(info.pageSize)}</strong> 条</div>
    <div class="logistics-page-controls">
      <button class="logistics-page-icon" type="button" data-${prefix}-page-prev title="上一页" aria-label="上一页"${prevDisabled}>&lt;</button>
      <input class="logistics-page-input" type="number" min="1" max="${info.totalPages}" value="${info.page}" data-${prefix}-page-input aria-label="当前页">
      <span class="logistics-page-total">/ ${fmtNumber(info.totalPages)} 页</span>
      <button class="logistics-page-icon" type="button" data-${prefix}-page-next title="下一页" aria-label="下一页"${nextDisabled}>&gt;</button>
    </div>
  </div>`;
}

function plannerLinkTitle(row) {
  return row?.sales_link || row?.replenishment_merge_key || row?.link_key || "--";
}

function plannerLinkMeta(row) {
  return [
    row?.subject_no ? `主体 ${row.subject_no}` : "",
    row?.supply_planner_people ? `计划 ${row.supply_planner_people}` : "",
  ].filter(Boolean).join(" / ") || "--";
}

function plannerDetailValue(rows, fields, fallback = "--", maxItems = 2) {
  const values = [];
  (rows || []).forEach((row) => {
    const value = fields.map((field) => String(row?.[field] || "").trim()).find(Boolean);
    if (value && !values.includes(value)) values.push(value);
  });
  if (!values.length) return fallback;
  const visible = values.slice(0, maxItems).join("、");
  return values.length > maxItems ? `${visible} 等${fmtNumber(values.length)}项` : visible;
}

function renderPlannerSummary() {
  const payload = plannerSelectedPayload();
  const totals = payload.totals || {};
  const selectedType = state.planner.selectedOverdueType || "";
  const scope = payload.scope || state.summaryScope || {};
  const filterCount = activeFilterChips().length;
  if (els.filters && els.summaryList?.contains(els.filters)) {
    placeFiltersForMode(false);
    els.filters.classList.remove("planner-filter-popover");
  }
  els.summaryPane.classList.remove("link-detail-active");
  els.summaryTitle.textContent = "计划观察";
  els.scopeText.hidden = true;
  els.scopeText.textContent = "";
  els.summaryCount.hidden = true;
  els.summaryCount.textContent = "";
  els.subjectFilterHost.hidden = true;
  els.subjectFilterHost.innerHTML = "";
  els.kpiGrid.hidden = true;
  els.kpiGrid.innerHTML = "";
  els.summaryListToolbar.hidden = true;
  els.summaryListToolbar.innerHTML = "";
  els.summaryList.innerHTML = `<div class="planner-summary">
    <section class="planner-scope-card">
      <div>
        <strong>${htmlEscape(plannerScopeTitle(scope))}</strong>
        <span>${htmlEscape(plannerScopeMeta(scope))}</span>
      </div>
      <button class="ghost-btn planner-filter-trigger" type="button" data-planner-filter>${filterCount ? `已筛选 ${fmtNumber(filterCount)} 项` : "筛选"}</button>
    </section>
    <section class="planner-metric-grid">
      <div><span>逾期链接</span><strong>${fmtNumber(totals.overdue_link_count)}</strong></div>
      <div><span>逾期货件</span><strong>${fmtNumber(totals.overdue_shipment_count)}</strong></div>
      <div><span>逾期预计损失</span><strong>${fmtMoneyWan(totals.overdue_expected_loss)}</strong></div>
    </section>
    <section class="planner-type-panel">
      <div class="planner-section-head">
        <strong>逾期结构</strong>
        ${selectedType ? `<button class="ghost-btn compact" type="button" data-planner-type="">全部</button>` : ""}
      </div>
      <div class="planner-type-list">
        ${(payload.type_rows || []).map((row) => {
    const type = row.overdue_type || "";
    const active = selectedType === type ? " active" : "";
    const definition = row.definition || PLANNER_OVERDUE_META[type]?.definition || "";
    return `<button class="planner-type-card${active}" type="button" data-planner-type="${htmlEscape(type)}">
          <span class="planner-type-dot"></span>
          <span class="planner-type-main">
            <span class="planner-type-label">${htmlEscape(row.label || plannerOverdueLabel(type))}<i class="planner-help" tabindex="0" aria-label="${htmlEscape(definition)}">?</i></span>
            <strong>${fmtMoneyWan(row.overdue_expected_loss)}</strong>
          </span>
          <span class="planner-type-count">${fmtNumber(row.shipment_count)}票货件 / ${fmtNumber(row.link_count)}条链接</span>
          <span class="planner-help-pop">${htmlEscape(definition)}</span>
        </button>`;
  }).join("")}
      </div>
    </section>
  </div>`;
  els.summaryList.querySelector("[data-planner-filter]")?.addEventListener("click", () => {
    setFilterCollapsed(!state.filtersCollapsed);
  });
  els.summaryList.querySelectorAll("[data-planner-type]").forEach((button) => {
    button.addEventListener("click", async () => {
      const type = button.dataset.plannerType || "";
      state.planner.selectedOverdueType = type === state.planner.selectedOverdueType ? "" : type;
      state.planner.linkPage = 1;
      state.planner.shipmentPage = 1;
      state.planner.selectedLinkKey = "";
      await loadCards();
    });
  });
  placeFiltersForPlanner();
}

function renderPlannerLinkList(payload) {
  const rows = payload.link_rows || [];
  const selectedKey = state.planner.selectedLinkKey || payload.selected_link_key || "";
  return `<section class="planner-link-list">
    <div class="planner-list-head">
      <strong>链接清单</strong>
    </div>
    <div class="planner-link-scroll">
      ${rows.length ? rows.map((row, index) => {
    const active = String(row.link_key || "") === selectedKey ? " active" : "";
    const types = String(row.overdue_types || row.primary_overdue_type || "").split(",").filter(Boolean);
    return `<button class="planner-link-row${active}" type="button" data-planner-link="${htmlEscape(row.link_key || "")}">
          <span class="planner-link-main">
            <span class="planner-link-title-line">
              <span class="planner-link-rank">#${fmtNumber(index + 1)}</span>
              <span class="planner-link-name" title="${htmlEscape(plannerLinkTitle(row))}">${htmlEscape(plannerLinkTitle(row))}</span>
            </span>
            <span class="planner-link-tags">${types.map((type) => `<em>${htmlEscape(plannerOverdueLabel(type))}</em>`).join("")}</span>
          </span>
          <span class="planner-link-loss">
            <span>预期损失</span>
            <strong>${fmtMoneyWan(row.overdue_expected_loss)}</strong>
          </span>
        </button>`;
  }).join("") : `<div class="empty-state compact">暂无逾期链接</div>`}
    </div>
    ${renderPlannerPagination(payload.link_page, "planner-link")}
  </section>`;
}

function plannerBasicRows(link, shipments = []) {
  return [
    ["主体", link?.subject_no || "--"],
    ["系统SKU", plannerDetailValue(shipments, ["system_sku"])],
    ["店铺名称", plannerDetailValue(shipments, ["account_name", "account", "store_name"])],
    ["平台SKU", plannerDetailValue(shipments, ["platform_sku"])],
    ["运营", personText(link?.business_ops_people)],
    ["逾期预计损失", `${fmtMoneyWan(link?.overdue_expected_loss)}`],
  ];
}

function renderPlannerLinkOverview(payload) {
  const link = payload.selected_link || {};
  const shipments = payload.shipment_rows || [];
  if (!link.link_key) {
    return `<section class="planner-link-overview"><div class="empty-state compact">请选择左侧链接查看衔接情况</div></section>`;
  }
  if (payload.is_link_detail_loading) {
    return `<section class="planner-link-overview">
      <div class="empty-state compact">正在加载当前链接衔接情况...</div>
    </section>`;
  }
  return `<section class="planner-link-overview">
    <div class="link-overview-stack planner-compact-stack">
      <section class="basic-panel">
        <div class="subsection-head">
          <strong>基础信息</strong>
        </div>
        <div class="basic-grid planner-basic-grid">
          ${plannerBasicRows(link, shipments).map(([label, value]) => `<div><span>${htmlEscape(label)}</span><strong title="${htmlEscape(value)}">${htmlEscape(value)}</strong></div>`).join("")}
        </div>
      </section>
      <section class="weekly-panel">
        <div class="subsection-head">
          <strong>按周风险概览</strong>
          ${renderWeeklyChartLegend()}
        </div>
        ${renderWeeklyChart(state.weeklyRows)}
      </section>
      <section class="conclusion-panel">
        <div class="subsection-head">
          <strong>衔接结论</strong>
        </div>
        ${renderGapConclusion(state.gapSegments)}
      </section>
    </div>
  </section>`;
}

function plannerFeedbackSummary(row) {
  const content = String(row.feedback_content || row.latest_tracking_remark || "").trim();
  if (!content) return "暂无反馈";
  return content.length > 36 ? `${content.slice(0, 36)}...` : content;
}

function renderPlannerShipmentRows(payload) {
  const rows = payload.shipment_rows || [];
  return `<section class="planner-shipment-panel">
    <div class="planner-list-head">
      <strong>货件跟进情况</strong>
    </div>
    <div class="planner-shipment-scroll">
      ${payload.is_link_detail_loading ? `<div class="empty-state compact">正在加载当前链接货件...</div>` : rows.length ? rows.map((row, index) => `
        <article class="planner-shipment-row">
          <div class="planner-shipment-main">
            <strong>${htmlEscape(row.shipment_no || "--")}</strong>
            <span>${htmlEscape(row.logistics_country_cn || "--")} / ${htmlEscape(row.freight_type_name || "--")} / ${htmlEscape(row.three_level_channel_name || "--")}</span>
          </div>
          <div class="planner-shipment-combo">
            <span>参考 / 预计</span>
            <strong>${fmtDate(row.reference_putaway_date)} → ${fmtDate(row.latest_expected_putaway_date)}</strong>
            <em>晚 ${fmtNumber(row.overdue_days)} 天</em>
          </div>
          <div class="planner-shipment-combo">
            <span>节点 / 物流</span>
            <strong>${htmlEscape(row.current_node_stage_label || "--")}</strong>
            <em>${htmlEscape(personText(row.first_leg_logistics_people || row.contact_display_name))}</em>
          </div>
          <div class="planner-shipment-feedback">
            <span>反馈</span>
            <strong title="${htmlEscape(plannerFeedbackSummary(row))}">${htmlEscape(plannerFeedbackSummary(row))}</strong>
            <button class="ghost-btn compact" type="button" data-planner-feedback="${index}">详情</button>
          </div>
        </article>
      `).join("") : `<div class="empty-state compact">当前链接暂无逾期货件</div>`}
    </div>
    ${renderPlannerPagination(payload.shipment_page, "planner-shipment")}
  </section>`;
}

function renderPlannerWorkbench() {
  const payload = plannerSelectedPayload();
  renderPlannerSummary();
  els.cardsEmpty.hidden = true;
  els.linkOverview.hidden = true;
  els.linkOverview.innerHTML = "";
  els.issueInsights.hidden = true;
  els.issueInsights.innerHTML = "";
  if (state.planner.loadError) {
    els.riskList.innerHTML = `<div class="empty-state compact">${htmlEscape(state.planner.loadError)}</div>`;
    return;
  }
  els.riskList.innerHTML = `<div class="planner-workbench">
    ${renderPlannerLinkList(payload)}
    <section class="planner-detail-area">
      ${renderPlannerLinkOverview(payload)}
      ${renderPlannerShipmentRows(payload)}
    </section>
  </div>`;
  bindPlannerWorkbenchEvents(payload);
  bindWeeklyTooltips(els.riskList);
}

function bindPlannerWorkbenchEvents(payload) {
  els.riskList.querySelector(".planner-workbench")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-planner-link]");
    if (!button) return;
    const linkKey = button.dataset.plannerLink || "";
    if (!linkKey || linkKey === state.planner.selectedLinkKey) return;
    state.planner.selectedLinkKey = linkKey;
    state.planner.shipmentPage = 1;
    state.planner.payload = plannerLinkLoadingPayload(linkKey);
    state.weeklyRows = [];
    state.gapSegments = [];
    const requestId = ++state.cardsRequestId;
    renderPlannerWorkbench();
    setCardsLoading(true);
    try {
      await loadPlannerLinkDetail(requestId);
    } catch (error) {
      showToast(error.message);
      if (requestId === state.cardsRequestId) {
        const existingPayload = plannerSelectedPayload();
        state.planner.payload = { ...existingPayload, is_link_detail_loading: false };
        renderPlannerWorkbench();
      }
    } finally {
      if (requestId === state.cardsRequestId) setCardsLoading(false);
    }
  });
  const bindPage = (prefix, pageField, loader) => {
    els.riskList.querySelector(`[data-${prefix}-page-prev]`)?.addEventListener("click", async () => {
      state.planner[pageField] = Math.max(Number(state.planner[pageField] || 1) - 1, 1);
      await loader();
    });
    els.riskList.querySelector(`[data-${prefix}-page-next]`)?.addEventListener("click", async () => {
      state.planner[pageField] = Number(state.planner[pageField] || 1) + 1;
      await loader();
    });
    const input = els.riskList.querySelector(`[data-${prefix}-page-input]`);
    const applyInput = async () => {
      const value = Math.max(Number(input?.value || 1), 1);
      state.planner[pageField] = value;
      await loader();
    };
    input?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      applyInput().catch((error) => showToast(error.message));
    });
    input?.addEventListener("blur", () => applyInput().catch((error) => showToast(error.message)));
  };
  const loadFullPlanner = () => loadCards();
  const loadPlannerDetailPage = async () => {
    const requestId = ++state.cardsRequestId;
    setCardsLoading(true);
    try {
      await loadPlannerLinkDetail(requestId);
    } finally {
      if (requestId === state.cardsRequestId) setCardsLoading(false);
    }
  };
  bindPage("planner-link", "linkPage", loadFullPlanner);
  bindPage("planner-shipment", "shipmentPage", loadPlannerDetailPage);
  els.riskList.querySelectorAll("[data-planner-feedback]").forEach((button) => {
    button.addEventListener("click", () => {
      const row = (payload.shipment_rows || [])[Number(button.dataset.plannerFeedback)];
      openPlannerFeedbackDetail(row);
    });
  });
}

function openPlannerFeedbackDetail(row) {
  if (!row) return;
  closePlannerFeedbackDetail();
  const overlay = document.createElement("section");
  overlay.className = "planner-feedback-modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = `<div class="planner-feedback-card">
    <div class="planner-feedback-head">
      <div>
        <span>货件反馈</span>
        <strong>${htmlEscape(row.shipment_no || "--")}</strong>
      </div>
      <button class="icon-btn" type="button" data-planner-feedback-close aria-label="关闭">×</button>
    </div>
    <div class="planner-feedback-body">
      <div><span>当前节点</span><strong>${htmlEscape(row.current_node_stage_label || "--")}</strong></div>
      <div><span>物流人员</span><strong>${htmlEscape(personText(row.first_leg_logistics_people || row.contact_display_name))}</strong></div>
      <div><span>反馈类型</span><strong>${htmlEscape(row.effective_feedback_type || row.manual_feedback_type || "--")}</strong></div>
      <div><span>反馈时间</span><strong>${fmtDateTimeCn(row.feedback_updated_at || row.latest_tracking_remark_at)}</strong></div>
      <div class="wide"><span>节点备注</span><p>${htmlEscape(row.latest_tracking_remark || "暂无节点备注")}</p></div>
      <div class="wide"><span>反馈内容</span><p>${htmlEscape(row.feedback_content || "暂无反馈内容")}</p></div>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector("[data-planner-feedback-close]")?.addEventListener("click", closePlannerFeedbackDetail);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closePlannerFeedbackDetail();
  });
}

function closePlannerFeedbackDetail() {
  document.querySelector(".planner-feedback-modal")?.remove();
}

function renderSupplyPlannerDashboard() {
  if (!isSupplyPlanner()) return;
  renderPlannerWorkbench();
}

function renderSubjectOwnerOpsDistribution() {
  if (!isSubjectOwner()) return;
  state.subjectOwner.linkDetail = null;
  els.workspace?.classList.toggle("owner-link-detail-mode", Boolean(state.subjectOwner.linkDetail));
  if (state.subjectOwner.loadError) {
    els.summaryPane.classList.remove("link-detail-active");
    els.summaryTitle.textContent = "主体负责人看板";
    els.scopeText.hidden = false;
    els.scopeText.textContent = "主体范围内看板数据加载失败";
    renderSubjectFilter();
    renderSummaryToolbar();
    els.summaryList.innerHTML = `<div class="empty-state compact">${htmlEscape(state.subjectOwner.loadError)}</div>`;
    return;
  }
  if (state.subjectOwner.linkDetail) {
    els.summaryPane.classList.add("link-detail-active");
    els.summaryTitle.textContent = "销售链接衔接";
    els.scopeText.hidden = false;
    els.scopeText.textContent = "返回后继续查看主体风险总览和运营分布";
    els.summaryCount.hidden = false;
    els.summaryCount.className = "counter owner-link-close-host";
    els.summaryCount.innerHTML = `<button class="ghost-btn" type="button" data-owner-link-back>关闭展示</button>`;
    els.subjectFilterHost.hidden = true;
    els.kpiGrid.hidden = true;
    els.summaryListToolbar.hidden = true;
    els.summaryListToolbar.innerHTML = "";
    els.summaryList.innerHTML = renderOwnerLinkOverview(state.subjectOwner.linkDetail);
    els.summaryPane.querySelector("[data-owner-link-back]")?.addEventListener("click", () => {
      state.subjectOwner.linkDetail = null;
      renderSummary();
    });
    bindWeeklyTooltips(els.summaryList);
    return;
  }
  els.summaryPane.classList.remove("link-detail-active");
  els.summaryCount.className = "counter";
  els.summaryTitle.textContent = "主体负责人看板";
  els.scopeText.hidden = true;
  els.scopeText.textContent = "";
  els.summaryCount.hidden = true;
  els.summaryCount.textContent = "";
  els.kpiGrid.hidden = false;
  renderSubjectFilter();
  els.summaryListToolbar.hidden = true;
  els.summaryListToolbar.innerHTML = "";
  state.subjectOwner.linkDetail = null;
  const businessRows = state.subjectOwner.businessRows || [];
  const logisticsRows = state.subjectOwner.logisticsRows || [];
  const opsRows = state.subjectOwner.opsRows || [];
  if (!businessRows.length && !opsRows.length && !logisticsRows.length) {
    els.summaryList.innerHTML = `<div class="empty-state compact">暂无主体负责人看板数据</div>`;
    return;
  }
  els.summaryList.innerHTML = `<div class="owner-workbench-overview">
    <section class="owner-top-combo">
      <section class="owner-kpi-panel">
        <div class="owner-kpi-panel-head">
          <h3>主体负责人指标概览</h3>
          <div class="owner-kpi-filter-host" data-owner-subject-filter-host></div>
        </div>
        <div class="owner-kpi-mirror" aria-label="主体风险指标">
          ${els.kpiGrid.innerHTML}
        </div>
      </section>
      ${renderBusinessDistributionPanel(
    businessRows,
    state.subjectOwner.selectedGranularity || "account_name",
    state.subjectOwner.granularityOptions || [],
    "data-owner-granularity",
  )}
    </section>
    <div class="owner-dashboard">
      <div class="owner-dashboard-grid">
        ${renderOwnerDashboardPanel("物流 TOP 清单", logisticsRows, "logistics")}
        ${renderOwnerDashboardPanel("运营 TOP 清单", opsRows, "ops")}
      </div>
    </div>
  </div>`;
  els.kpiGrid.hidden = true;
  els.kpiGrid.innerHTML = "";
  const ownerFilterHost = els.summaryList.querySelector("[data-owner-subject-filter-host]");
  if (ownerFilterHost && els.subjectFilterHost) {
    ownerFilterHost.appendChild(els.subjectFilterHost);
    els.subjectFilterHost.hidden = false;
  }
  els.summaryList.querySelector("[data-owner-granularity]")?.addEventListener("change", async (event) => {
    state.subjectOwner.selectedGranularity = event.currentTarget.value || "account_name";
    await loadCards();
  });
  els.summaryList.querySelectorAll("[data-owner-mirror-role]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.disabled) return;
      await enterReadonlyMirror({
        target_user_id: button.dataset.ownerMirrorUser || "",
        target_role_code: button.dataset.ownerMirrorRole || "",
        person: button.dataset.ownerMirrorPerson || "",
      });
    });
  });
}

function logisticsGroupKey(country, freightType) {
  return `${country || ""}||${freightType || ""}`;
}

function logisticsTreeKey(...parts) {
  return parts.map((part) => encodeURIComponent(part || "")).join("::");
}

function logisticsFreightClass(freightName) {
  const text = String(freightName || "").trim();
  if (text.includes("普船")) return "freight-sea";
  if (text.includes("快船") || text.includes("陆运")) return "freight-fast-land";
  if (text.includes("快递") || text.includes("空运")) return "freight-express-air";
  return "freight-other";
}

const COUNTRY_FLAG_BASE = "static/assets/flags";
const COUNTRY_FLAG_CODE_BY_LABEL = new Map([
  ["AD", "ad"], ["安道尔", "ad"], ["ANDORRA", "ad"],
  ["AE", "ae"], ["阿联酋", "ae"], ["UNITED ARAB EMIRATES", "ae"],
  ["ARE", "are"], ["阿联酋(弃用)", "are"], ["THE UNITED ARAB EMIRATES", "are"],
  ["AL", "al"], ["阿尔巴尼亚", "al"], ["ALBANIA", "al"],
  ["AT", "at"], ["奥地利", "at"], ["AUSTRIA", "at"],
  ["AU", "au"], ["澳大利亚", "au"], ["AUSTRALIA", "au"],
  ["AZ", "az"], ["阿塞拜疆", "az"], ["AZERBAIJAN", "az"],
  ["BE", "be"], ["比利时", "be"], ["BELGIUM", "be"],
  ["BG", "bg"], ["保加利亚", "bg"], ["BULGARIA", "bg"],
  ["BR", "br"], ["巴西", "br"], ["BRAZIL", "br"],
  ["CA", "ca"], ["加拿大", "ca"], ["CANADA", "ca"],
  ["CH", "ch"], ["瑞士", "ch"], ["SWITZERLAND", "ch"],
  ["CL", "cl"], ["智利", "cl"], ["CHILE", "cl"],
  ["CN", "cn"], ["中国", "cn"], ["CHINA", "cn"],
  ["CO", "co"], ["哥伦比亚", "co"], ["COLOMBIA", "co"],
  ["CR", "cr"], ["哥斯达黎加", "cr"], ["COSTA RICA", "cr"],
  ["CY", "cy"], ["塞浦路斯", "cy"], ["CYPRUS", "cy"],
  ["CZ", "cz"], ["捷克", "cz"], ["CZECHIA", "cz"],
  ["DE", "de"], ["德国", "de"], ["GERMANY", "de"],
  ["EC", "ec"], ["厄瓜多尔", "ec"], ["ECUADOR", "ec"],
  ["EE", "ee"], ["爱沙尼亚", "ee"], ["ESTONIA", "ee"],
  ["EG", "eg"], ["埃及", "eg"], ["EGYPT", "eg"],
  ["ES", "es"], ["西班牙", "es"], ["SPAIN", "es"],
  ["ET", "et"], ["埃塞俄比亚", "et"], ["ETHIOPIA", "et"],
  ["FR", "fr"], ["法国", "fr"], ["FRANCE", "fr"],
  ["GB", "gb"], ["UK", "uk"], ["英国", "gb"], ["GREAT BRITAIN", "gb"], ["UNITED KINGDOM", "gb"],
  ["GD", "gd"], ["格林纳达", "gd"], ["GRENADA", "gd"],
  ["GR", "gr"], ["希腊", "gr"], ["GREECE", "gr"],
  ["HK", "hk"], ["中国香港", "hk"], ["香港", "hk"], ["HONG KONG", "hk"], ["HONG KONG SAR, CHINA", "hk"],
  ["HR", "hr"], ["克罗地亚", "hr"], ["CROATIA", "hr"],
  ["ID", "id"], ["印度尼西亚", "id"], ["INDONESIA", "id"],
  ["IE", "ie"], ["爱尔兰", "ie"], ["IRELAND", "ie"],
  ["IN", "in"], ["印度", "in"], ["INDIA", "in"],
  ["IQ", "iq"], ["伊拉克", "iq"], ["IRAQ", "iq"],
  ["IT", "it"], ["意大利", "it"], ["ITALY", "it"],
  ["JO", "jo"], ["约旦", "jo"], ["JORDAN", "jo"],
  ["JP", "jp"], ["日本", "jp"], ["JAPAN", "jp"],
  ["KR", "kr"], ["韩国", "kr"], ["SOUTH KOREA", "kr"], ["KOREA", "kr"],
  ["LV", "lv"], ["拉脱维亚", "lv"], ["LATVIA", "lv"],
  ["MX", "mx"], ["墨西哥", "mx"], ["MEXICO", "mx"],
  ["MY", "my"], ["马来西亚", "my"], ["MALAYSIA", "my"],
  ["NG", "ng"], ["尼日利亚", "ng"], ["NIGERIA", "ng"],
  ["NO", "no"], ["挪威", "no"], ["NORWAY", "no"],
  ["PH", "ph"], ["菲律宾", "ph"], ["PHILIPPINES", "ph"],
  ["PL", "pl"], ["波兰", "pl"], ["POLAND", "pl"],
  ["PT", "pt"], ["葡萄牙", "pt"], ["PORTUGAL", "pt"],
  ["PY", "py"], ["巴拉圭", "py"], ["PARAGUAY", "py"],
  ["RU", "ru"], ["俄罗斯", "ru"], ["RUSSIA", "ru"],
  ["SA", "sa"], ["沙特阿拉伯", "sa"], ["沙特", "sa"], ["SAUDI ARABIA", "sa"],
  ["SE", "se"], ["瑞典", "se"], ["SWEDEN", "se"],
  ["SG", "sg"], ["新加坡", "sg"], ["SINGAPORE", "sg"],
  ["SK", "sk"], ["斯洛伐克", "sk"], ["SLOVAKIA", "sk"],
  ["TH", "th"], ["泰国", "th"], ["THAILAND", "th"],
  ["TT", "tt"], ["特立尼达和多巴哥", "tt"], ["TRINIDAD AND TOBAGO", "tt"],
  ["US", "us"], ["美国", "us"], ["UNITED STATES OF AMERICA", "us"], ["UNITED STATES", "us"],
  ["VN", "vn"], ["越南", "vn"], ["VIETNAM", "vn"],
  ["ZA", "za"], ["南非", "za"], ["SOUTH AFRICA", "za"],
  ["ZM", "zm"], ["赞比亚", "zm"], ["ZAMBIA", "zm"],
]);

function countryFlagCode(countryName) {
  const text = String(countryName || "").trim();
  if (!text || text === "--" || text.includes("缺失")) return "";
  const direct = COUNTRY_FLAG_CODE_BY_LABEL.get(text) || COUNTRY_FLAG_CODE_BY_LABEL.get(text.toUpperCase());
  if (direct) return direct;
  const fuzzy = Array.from(COUNTRY_FLAG_CODE_BY_LABEL.entries())
    .filter(([label]) => label.length > 1 && text.includes(label))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return fuzzy ? fuzzy[1] : "";
}

function countryFlagHtml(countryName) {
  const code = countryFlagCode(countryName);
  if (!code) return "";
  return `<img class="country-flag-icon" src="${COUNTRY_FLAG_BASE}/${code}.svg" alt="" aria-hidden="true" loading="lazy">`;
}

function countryDisplayHtml(countryName) {
  const label = String(countryName || "--").trim() || "--";
  return `<span class="country-with-flag"><span class="country-label">${htmlEscape(label)}</span>${countryFlagHtml(label)}</span>`;
}

function logisticsRouteHtml(countryName, freightName, channelName) {
  return [
    countryDisplayHtml(countryName || "--"),
    htmlEscape(freightName || "--"),
    htmlEscape(channelName || "--"),
  ].join(`<span class="route-separator">/</span>`);
}

function logisticsEmptyTree() {
  return { countries: [], totals: { shipmentCount: 0, requestCount: 0, unreadCount: 0, readCount: 0, gmv: 0 } };
}

function buildLogisticsChannelTree() {
  const rows = state.logistics.channelTreeRows || [];
  if (!rows.length) return logisticsEmptyTree();
  const countryMap = new Map();
  const totals = { shipmentCount: 0, requestCount: 0, unreadCount: 0, readCount: 0, gmv: 0 };
  rows.forEach((row) => {
    const countryName = row.logistics_country_cn || "【国家缺失】";
    const freightName = row.freight_type_name || "【一级渠道缺失】";
    const channelName = row.three_level_channel_name || "【三级渠道缺失】";
    const shipmentCount = Number(row.shipment_count || 0);
    const requestCount = Number(row.request_count || 0);
    const unreadCount = Number(row.unread_shipment_count || 0);
    const readCount = Number(row.read_shipment_count || 0);
    const gmv = Number(row.total_expected_recoverable_gmv || 0);
    totals.shipmentCount += shipmentCount;
    totals.requestCount += requestCount;
    totals.unreadCount += unreadCount;
    totals.readCount += readCount;
    totals.gmv += gmv;
    if (!countryMap.has(countryName)) {
      countryMap.set(countryName, {
        name: countryName,
        shipmentCount: 0,
        requestCount: 0,
        unreadCount: 0,
        readCount: 0,
        gmv: 0,
        freightMap: new Map(),
      });
    }
    const country = countryMap.get(countryName);
    country.shipmentCount += shipmentCount;
    country.requestCount += requestCount;
    country.unreadCount += unreadCount;
    country.readCount += readCount;
    country.gmv += gmv;
    if (!country.freightMap.has(freightName)) {
      country.freightMap.set(freightName, {
        name: freightName,
        country: countryName,
        shipmentCount: 0,
        requestCount: 0,
        unreadCount: 0,
        readCount: 0,
        gmv: 0,
        channels: [],
      });
    }
    const freight = country.freightMap.get(freightName);
    freight.shipmentCount += shipmentCount;
    freight.requestCount += requestCount;
    freight.unreadCount += unreadCount;
    freight.readCount += readCount;
    freight.gmv += gmv;
    freight.channels.push({
      name: channelName,
      country: countryName,
      freight: freightName,
      shipmentCount,
      requestCount,
      unreadCount,
      readCount,
      gmv,
    });
  });
  const byGmv = (a, b) => (b.gmv - a.gmv) || (b.shipmentCount - a.shipmentCount) || a.name.localeCompare(b.name, "zh-CN");
  const countries = Array.from(countryMap.values())
    .map((country) => {
      const freights = Array.from(country.freightMap.values())
        .map((freight) => ({
          ...freight,
          channels: freight.channels.sort(byGmv),
        }))
        .sort(byGmv);
      return { ...country, freights };
    })
    .sort(byGmv);
  return { countries, totals };
}

function logisticsTreeNodeMeta(node) {
  return `<span class="tree-counts">${fmtNumber(node.shipmentCount)}票</span>`;
}

function logisticsTreeNodeSide(node) {
  return `<span class="tree-node-side">
    <span class="tree-counts">${fmtNumber(node.shipmentCount)}票</span>
    <span class="tree-gmv">${fmtMoney(node.gmv)}</span>
  </span>`;
}

function isLogisticsNodeCollapsed(key) {
  return state.logistics.channelTreeCollapsed?.[key] ?? false;
}

function renderLogisticsChannelTreePane() {
  if (!els.logisticsChannelPane || !els.logisticsChannelTree || !els.logisticsChannelToggle) return;
  if (!isLogistics()) {
    els.logisticsChannelPane.hidden = true;
    return;
  }
  els.logisticsChannelPane.hidden = false;
  const tree = buildLogisticsChannelTree();
  els.logisticsChannelToggle.textContent = state.logistics.channelTreeAllCollapsed ? "全部展开" : "全部收起";
  if (!tree.countries.length) {
    els.logisticsChannelTree.innerHTML = `<div class="empty-state compact">暂无渠道数据</div>`;
    return;
  }
  const selectedKey = state.logistics.selectedChannel3
    ? logisticsTreeKey(state.logistics.selectedCountry, state.logistics.selectedFreightType, state.logistics.selectedChannel3)
    : "";
  els.logisticsChannelTree.innerHTML = tree.countries.map((country) => {
    const countryKey = logisticsTreeKey(country.name);
    const countryCollapsed = isLogisticsNodeCollapsed(countryKey);
    return `<section class="logistics-tree-group">
      <button class="logistics-tree-node country" type="button" data-tree-toggle="${htmlEscape(countryKey)}">
        <span class="tree-caret">${countryCollapsed ? "＋" : "－"}</span>
        <span class="tree-name">${countryDisplayHtml(country.name)}</span>
        ${logisticsTreeNodeSide(country)}
      </button>
      <div class="logistics-tree-children" ${countryCollapsed ? "hidden" : ""}>
        ${country.freights.map((freight) => {
    const freightKey = logisticsTreeKey(country.name, freight.name);
    const freightCollapsed = isLogisticsNodeCollapsed(freightKey);
    const freightClass = logisticsFreightClass(freight.name);
    return `<section class="logistics-tree-group freight">
          <button class="logistics-tree-node freight ${freightClass}" type="button" data-tree-toggle="${htmlEscape(freightKey)}">
            <span class="tree-caret">${freightCollapsed ? "＋" : "－"}</span>
            <span class="tree-name">${htmlEscape(freight.name)}</span>
            ${logisticsTreeNodeSide(freight)}
          </button>
          <div class="logistics-tree-children" ${freightCollapsed ? "hidden" : ""}>
            ${freight.channels.map((channel) => {
    const channelKey = logisticsTreeKey(channel.country, channel.freight, channel.name);
    const selected = selectedKey === channelKey ? " selected" : "";
    const channelFreightClass = logisticsFreightClass(channel.freight);
    return `<button class="logistics-tree-leaf ${channelFreightClass}${selected}" type="button" data-tree-channel="${htmlEscape(channelKey)}" data-country="${htmlEscape(channel.country)}" data-freight="${htmlEscape(channel.freight)}" data-channel="${htmlEscape(channel.name)}">
                <span class="tree-leaf-head">
                  <span class="tree-leaf-name">${htmlEscape(channel.name)}</span>
                  ${logisticsTreeNodeMeta(channel)}
                  <span class="tree-leaf-gmv">${fmtMoney(channel.gmv)}</span>
                </span>
              </button>`;
    }).join("")}
          </div>
        </section>`;
  }).join("")}
      </div>
    </section>`;
  }).join("");
  els.logisticsChannelTree.querySelectorAll("[data-tree-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.treeToggle;
      state.logistics.channelTreeCollapsed[key] = !isLogisticsNodeCollapsed(key);
      state.logistics.channelTreeAllCollapsed = false;
      renderLogisticsChannelTreePane();
    });
  });
  els.logisticsChannelTree.querySelectorAll("[data-tree-channel]").forEach((button) => {
    button.addEventListener("click", async () => {
      const country = button.dataset.country || "";
      const freight = button.dataset.freight || "";
      const channel = button.dataset.channel || "";
      if (
        state.logistics.selectedCountry === country &&
        state.logistics.selectedFreightType === freight &&
        state.logistics.selectedChannel3 === channel
      ) {
        state.logistics.selectedCountry = "";
        state.logistics.selectedFreightType = "";
        state.logistics.selectedChannel3 = "";
        state.logistics.selectedShipmentNo = "";
        state.logistics.shipmentPage = 1;
        await loadCards();
        return;
      }
      state.logistics.selectedCountry = country;
      state.logistics.selectedFreightType = freight;
      state.logistics.selectedChannel3 = channel;
      state.logistics.selectedShipmentNo = "";
      state.logistics.shipmentPage = 1;
      await loadCards();
    });
  });
}

function setLogisticsTreeCollapsed(collapsed) {
  const tree = buildLogisticsChannelTree();
  const next = {};
  tree.countries.forEach((country) => {
    next[logisticsTreeKey(country.name)] = collapsed;
    country.freights.forEach((freight) => {
      next[logisticsTreeKey(country.name, freight.name)] = collapsed;
    });
  });
  state.logistics.channelTreeCollapsed = next;
  state.logistics.channelTreeAllCollapsed = collapsed;
  renderLogisticsChannelTreePane();
}

function renderLogisticsSummary() {
  els.summaryPane.classList.remove("link-detail-active");
  els.summaryCount.className = "counter";
  els.summaryTitle.textContent = "① 总览";
  els.scopeText.hidden = true;
  els.scopeText.textContent = "";
  els.summaryCount.hidden = true;
  els.summaryCount.textContent = "";
  els.subjectFilterHost.hidden = true;
  els.subjectFilterHost.innerHTML = "";
  els.kpiGrid.hidden = false;
  els.summaryListToolbar.hidden = true;
  els.summaryListToolbar.innerHTML = "";
  els.summaryList.innerHTML = "";
  renderLogisticsChannelTreePane();
}

const LOGISTICS_ACTION_SCOPES = [
  {
    key: "logistics_owned",
    label: "物流直接动作",
    description: "到港后签收前 + 第三方仓签收未上架",
    className: "primary",
  },
  {
    key: "strong_intervention",
    label: "到港后签收前",
    description: "物流催货代清关、提取、末端配送",
    className: "focus",
  },
  {
    key: "signed_not_putaway_3pl",
    label: "第三方仓上架",
    description: "物流催海外仓服务商上架",
    className: "warning",
  },
  {
    key: "ops_handoff",
    label: "平台仓运营分流",
    description: "运营催店铺客服加紧上架",
    className: "handoff",
  },
];

function logisticsBucketRows() {
  return state.logistics.bucketSummaryRows || [];
}

function logisticsBucketCount(bucket) {
  return logisticsBucketRows()
    .filter((row) => row.logistics_intervention_bucket === bucket)
    .reduce((total, row) => total + Number(row.shipment_count || 0), 0);
}

function logisticsScopeCount(scopeKey) {
  if (scopeKey === "logistics_owned") {
    return logisticsBucketRows().reduce((total, row) => total + Number(row.logistics_owned_action_count || 0), 0);
  }
  if (scopeKey === "strong_intervention") return logisticsBucketCount("strong_intervention");
  if (scopeKey === "signed_not_putaway_3pl") return logisticsBucketCount("signed_not_putaway_3pl");
  if (scopeKey === "ops_handoff") return logisticsBucketCount("signed_not_putaway_platform");
  return logisticsBucketRows().reduce((total, row) => total + Number(row.shipment_count || 0), 0);
}

function logisticsCurrentScopeMeta() {
  return LOGISTICS_ACTION_SCOPES.find((item) => item.key === state.logistics.selectedActionScope)
    || LOGISTICS_ACTION_SCOPES[0];
}

function logisticsBucketMeta(row) {
  const bucket = row?.logistics_intervention_bucket || "";
  if (bucket === "strong_intervention") {
    return {
      label: "到港后签收前",
      owner: "物流",
      action: "催货代加快清关、提取、末端配送",
      className: "strong",
    };
  }
  if (bucket === "signed_not_putaway_platform") {
    return {
      label: "平台仓签收未上架",
      owner: "运营",
      action: "催店铺客服加紧上架",
      className: "handoff",
    };
  }
  if (bucket === "signed_not_putaway_3pl") {
    return {
      label: "第三方仓签收未上架",
      owner: "物流",
      action: "催海外仓服务商加紧上架",
      className: "warehouse",
    };
  }
  return {
    label: row?.current_node_stage_label || "待判断",
    owner: row?.action_owner === "business_ops" ? "运营" : "物流",
    action: row?.logistics_intervention_reason || "--",
    className: "other",
  };
}

function logisticsActionScopeStrip() {
  const selected = state.logistics.selectedActionScope || "logistics_owned";
  return `<div class="logistics-action-scope-strip">
    ${LOGISTICS_ACTION_SCOPES.map((scope) => {
    const count = logisticsScopeCount(scope.key);
    const active = selected === scope.key ? " active" : "";
    return `<button class="logistics-action-scope ${scope.className}${active}" type="button" data-logistics-action-scope="${scope.key}">
        <span>${htmlEscape(scope.label)}</span>
        <strong>${fmtNumber(count)}</strong>
        <em>${htmlEscape(scope.description)}</em>
      </button>`;
  }).join("")}
  </div>`;
}

function logisticsAdvanceCapacityFilled(row) {
  return row?.feedback_max_feasible_advance_days !== null
    && row?.feedback_max_feasible_advance_days !== undefined
    && row?.feedback_max_feasible_advance_days !== "";
}

function logisticsAdvanceCapacityValue(row) {
  return logisticsAdvanceCapacityFilled(row) ? Number(row.feedback_max_feasible_advance_days) : null;
}

function logisticsAdvanceStatusMeta(status) {
  if (status === true || status === "satisfied") return { className: "satisfied", label: "可满足", symbol: "√" };
  if (status === false || status === "unsatisfied") return { className: "unsatisfied", label: "不可满足", symbol: "×" };
  return { className: "pending", label: "待填写", symbol: "" };
}

function logisticsAdvanceGmvTotals(source = state.logistics.totals || {}) {
  const total = Number(source.total_expected_recoverable_gmv || 0);
  const filled = Number(source.filled_recoverable_gmv || 0);
  const unfilled = Number(source.unfilled_recoverable_gmv || Math.max(total - filled, 0));
  return { total, filled, unfilled };
}

function coordinatorParams() {
  const params = userParams();
  params.set("scope_type", state.globalCoordinator.selectedScopeType || "brand_group");
  if (state.globalCoordinator.selectedScopeKey) params.set("scope_key", state.globalCoordinator.selectedScopeKey);
  if (state.globalCoordinator.selectedRoleCode) params.set("selected_role_code", state.globalCoordinator.selectedRoleCode);
  return params;
}

async function loadGlobalCoordinatorWorkbench(requestId = state.cardsRequestId) {
  clearReadonlyMirror();
  const payload = await api(`/api/global-coordinator/workbench?${coordinatorParams().toString()}`);
  if (requestId !== state.cardsRequestId) return;
  state.globalCoordinator.payload = payload;
  state.globalCoordinator.loadError = "";
  state.globalCoordinator.selectedScopeType = payload.scope_type || state.globalCoordinator.selectedScopeType || "brand_group";
  state.globalCoordinator.selectedScopeKey = payload.selected_scope_key || "";
  state.globalCoordinator.selectedRoleCode = payload.selected_role_code || state.globalCoordinator.selectedRoleCode || "subject_owner";
  state.globalCoordinator.granularityOptions = payload.granularity_options || state.globalCoordinator.granularityOptions || [];
  applyCurrencyContext(payload);
  state.summaryScope = payload.scope || null;
  state.summaryTotals = payload.totals || {};
  state.cards = [];
  state.cardTotals = {};
  state.weeklyRows = [];
  state.gapSegments = [];
  state.logisticsOptions = [];
  state.qualityOptions = [];
  state.issueInsights = [];
  renderQualityOptions();
  renderIssueInsights();
  renderKpis(payload.totals || {});
  renderSummary();
  renderGlobalCoordinatorWorkbench();
}

function globalCoordinatorTotals(source = state.globalCoordinator.payload?.totals || {}) {
  const recoverable = Number(source.recoverable_gmv || 0);
  const filled = Number(source.filled_recoverable_gmv || 0);
  const unfilled = Number(source.unfilled_recoverable_gmv || Math.max(recoverable - filled, 0));
  return { recoverable, filled, unfilled };
}

function globalKpiItems(totals = state.globalCoordinator.payload?.totals || {}) {
  const logisticsTotals = globalCoordinatorTotals(totals);
  const coverage = logisticsTotals.recoverable ? `${((logisticsTotals.filled / logisticsTotals.recoverable) * 100).toFixed(0)}%` : "--";
  return [
    ["预期损失", fmtMoneyWan(totals.raw_expected_gmv_loss)],
    ["可推进挽回", fmtMoneyWan(logisticsTotals.recoverable)],
    ["物流填写覆盖", coverage],
    ["待物流填写", fmtMoneyWan(logisticsTotals.unfilled)],
  ];
}

function renderGlobalKpiCards(totals) {
  return globalKpiItems(totals)
    .map(([label, value]) => `<section class="global-kpi"><span>${htmlEscape(label)}</span><strong>${htmlEscape(value)}</strong></section>`)
    .join("");
}

async function loadSummary() {
  const requestId = ++state.summaryRequestId;
  if (isLogistics() || isSupplyPlanner() || isGlobalCoordinator()) {
    state.allSummaryRows = [];
    state.summaryRows = [];
    state.summaryTotals = {};
    state.summaryScope = null;
    state.selectedSummary = null;
    syncSortOptions();
    renderSubjectFilter();
    renderKpis({});
    renderSummary();
    return;
  }
  const params = userParams();
  params.set("limit", "300");
  const payload = await api(`/api/summary?${params.toString()}`);
  if (requestId !== state.summaryRequestId) return;
  state.allSummaryRows = payload.rows || [];
  state.summaryTotals = payload.totals || {};
  state.summaryScope = payload.scope || null;
  sanitizeSubjectSelection();
  state.summaryRows = summaryRowsForDisplay();
  els.scopeText.textContent = scopeText(payload.scope);
  syncSortOptions();
  renderSubjectFilter();
  renderKpis(payload.totals || {});
  renderSummary();
}

function renderKpis(totals) {
  els.kpiGrid.classList.toggle("ops-overview", isBusinessOps());
  els.kpiGrid.classList.toggle("subject-owner-overview", isSubjectOwner() || isSupplyPlanner());
  els.kpiGrid.classList.toggle("logistics-overview", isLogistics());
  els.kpiGrid.classList.toggle("global-overview", isGlobalCoordinator());
  if (isGlobalCoordinator()) {
    els.kpiGrid.hidden = false;
    els.kpiGrid.innerHTML = renderGlobalKpiCards(totals || state.globalCoordinator.payload?.totals || {});
    return;
  }
  els.kpiGrid.hidden = false;
  if (isLogistics()) {
    const source = totals || state.logistics.totals || {};
    const gmvTotals = logisticsAdvanceGmvTotals(source);
    const filledPct = gmvTotals.total ? (gmvTotals.filled / gmvTotals.total) * 100 : 0;
    const unfilledPct = gmvTotals.total ? (gmvTotals.unfilled / gmvTotals.total) * 100 : 0;
    els.kpiGrid.innerHTML = `
      <section class="logistics-gmv-panel">
        <div class="logistics-gmv-chart">
          ${[
            { label: "待判断", className: "unfilled", gmv: gmvTotals.unfilled, pct: unfilledPct },
            { label: "已判断", className: "filled", gmv: gmvTotals.filled, pct: filledPct },
          ].map((row) => `<div class="logistics-gmv-bar advance ${row.className}">
               <p>${htmlEscape(row.label)}</p>
               <div class="logistics-gmv-track">
                  <span style="width:${Math.min(Math.max(row.pct, 0), 100)}%"></span>
                  <em>${fmtNumber(Math.min(Math.max(row.pct, 0), 100), 1)}%</em>
               </div>
              <strong>${fmtMoneyWan(row.gmv)}</strong>
            </div>`).join("")}
        </div>
      </section>
    `;
    return;
  }
  if (isBusinessOps()) {
    const inTransitGmv = Number(totals.in_transit_expected_gmv || 0);
    const rawLoss = Number(totals.raw_expected_gmv_loss || 0);
    const loss80Links = Number(totals.loss_80_link_count || 0);
    const loss80Shipments = Number(totals.loss_80_shipment_count || 0);
    els.kpiGrid.innerHTML = `
      <section class="ops-brief-card primary">
        <span>在途预计GMV</span>
        <strong>${fmtMoneyWan(inTransitGmv)}</strong>
        <p>覆盖 ${fmtNumber(totals.visible_sales_link_count || totals.sales_link_count)} 条链接 / ${fmtNumber(totals.visible_shipment_count || totals.shipment_count)} 票货件</p>
      </section>
      <section class="ops-brief-card danger">
        <span>预计GMV损失</span>
        <strong>${fmtMoneyWan(rawLoss)}</strong>
        <p>占在途预计GMV ${fmtPercent(rawLoss, inTransitGmv, 1)}</p>
      </section>
      <section class="ops-brief-card focus">
        <span>80%损失集中度</span>
        <strong>${fmtNumber(loss80Links)} 条链接</strong>
        <p>涉及 ${fmtNumber(loss80Shipments)} 票货件，左侧已按预期损失排序</p>
      </section>
    `;
    return;
  }
  if (isSubjectOwner() || isSupplyPlanner()) {
    const ownerTotals = Object.keys(state.subjectOwner.totals || {}).length
      ? state.subjectOwner.totals
      : subjectOwnerKpiTotals(totals);
    const rawLoss = Number(ownerTotals.raw_expected_gmv_loss || 0);
    const filledRecoverable = ownerDashboardMetric(ownerTotals, "filled_recoverable_loss_gmv", "filled_recoverable_gmv");
    const recoverable = ownerDashboardMetric(ownerTotals, "recoverable_loss_gmv", "expected_recoverable_gmv");
    const unfilledRecoverable = ownerDashboardMetric(ownerTotals, "unfilled_recoverable_loss_gmv", "unfilled_recoverable_gmv");
    els.kpiGrid.innerHTML = `
      <section class="owner-brief-card danger">
        <span>预计GMV损失</span>
        <strong>${fmtMoneyWan(rawLoss)}</strong>
      </section>
      <section class="owner-brief-card focus">
        <span>填写覆盖占比</span>
        <strong>${ownerDashboardPercent(filledRecoverable, recoverable, 1)}</strong>
      </section>
      <section class="owner-brief-card primary">
        <span>可能可挽回</span>
        <strong>${fmtMoneyWan(recoverable)}</strong>
      </section>
      <section class="owner-brief-card primary">
        <span>整体可推进占比</span>
        <strong>${ownerDashboardPercent(recoverable, rawLoss, 1)}</strong>
      </section>
      <section class="owner-brief-card danger">
        <span>待物流填写</span>
        <strong>${fmtMoneyWan(unfilledRecoverable)}</strong>
      </section>
    `;
    return;
  }
  const items = [
    ["加权GMV损失", `${fmtMoney(totals.weighted_expected_gmv_loss)}`],
    ["原始GMV损失", `${fmtMoney(totals.raw_expected_gmv_loss)}`],
    ["综合权重", fmtWeight(totals.composite_weight)],
    ["最高事件权重", fmtWeight(totals.max_event_weight)],
    ["问题行", fmtNumber(totals.data_issue_rows)],
    ["货件", fmtNumber(totals.shipment_count)],
  ];
  els.kpiGrid.innerHTML = items
    .map(([label, value]) => `<div class="kpi"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderSummary() {
  if (isGlobalCoordinator()) {
    renderGlobalCoordinatorSummary();
    return;
  }
  if (isLogistics()) {
    renderLogisticsSummary();
    return;
  }
  const role = currentRole();
  const isOps = isBusinessOps();
  els.summaryTitle.textContent = isOps
    ? "① 我的链接风险总览"
    : isSubjectOwner()
      ? "① 主体风险总览"
      : (role.role_code ? `${roleName(role.role_code)}首页` : "角色首页");
  els.scopeText.hidden = isOps;
  els.summaryCount.hidden = true;
  els.summaryCount.textContent = "";
  renderSubjectFilter();
  if (isSubjectOwner()) {
    state.selectedSummary = null;
    renderSubjectOwnerOpsDistribution();
    return;
  }
  if (isSupplyPlanner()) {
    state.selectedSummary = null;
    renderSupplyPlannerDashboard();
    return;
  }
  renderSummaryToolbar();
  if (!state.summaryRows.length) {
    state.selectedSummary = null;
    els.summaryList.innerHTML = `<div class="empty-state">暂无摘要数据</div>`;
    return;
  }
  if (!state.selectedSummary || !state.summaryRows.some((row) => row.summary_hash === state.selectedSummary?.summary_hash)) {
    state.selectedSummary = state.summaryRows[0];
  }
  els.summaryList.innerHTML = state.summaryRows
    .map((row, index) => {
      const active = row.summary_hash === state.selectedSummary?.summary_hash ? " active" : "";
      const opsClass = isOps ? " ops-summary-item" : "";
      const mainLoss = isOps ? row.raw_expected_gmv_loss : row.weighted_expected_gmv_loss;
      const mainLossLabel = isOps ? "预期损失" : "加权损失";
      const shareText = isOps ? "" : `<span>综合权重 ${fmtWeight(row.composite_weight)}</span>`;
      const cumulativeText = isOps ? `<span class="loss-cumulative">累计 ${fmtNumber(row.ops_cumulative_loss_pct, 0)}%</span>` : "";
      if (isOps) {
        const productName = row.product_chinese_name || "未匹配产品中文名";
        return `<button class="summary-item${opsClass}${active}" type="button" data-index="${index}" title="${htmlEscape(`${row.summary_label || row.summary_key || ""} ${productName}`)}">
          <div class="summary-main">
            <div class="summary-copy">
              <div class="summary-label"><span class="summary-rank">#${index + 1}</span>${htmlEscape(row.summary_label || row.summary_key)}</div>
              <div class="summary-product-name">${htmlEscape(productName)}</div>
              <div class="summary-compact-facts">
                <span>货件数 ${fmtNumber(row.shipment_count)}</span>
                <span>在途预计GMV ${fmtMoney(row.in_transit_expected_gmv)}</span>
              </div>
            </div>
            <div class="loss-block"><span>${mainLossLabel}</span><strong>${fmtMoney(mainLoss)}</strong>${cumulativeText}</div>
          </div>
        </button>`;
      }
      return `<button class="summary-item${opsClass}${active}" type="button" data-index="${index}" title="${htmlEscape(row.summary_label || row.summary_key || "")}">
        <div class="summary-main">
          <div class="summary-label">${isOps ? `<span class="summary-rank">#${index + 1}</span>` : ""}${htmlEscape(row.summary_label || row.summary_key)}</div>
          <div class="loss-block"><span>${mainLossLabel}</span><strong>${fmtMoney(mainLoss)}</strong>${cumulativeText}</div>
        </div>
        <div class="summary-signals">
          <span>${isOps ? "加权" : "原始"} ${fmtMoney(isOps ? row.weighted_expected_gmv_loss : row.raw_expected_gmv_loss)}</span>
          ${shareText}
          <span>最高事件 ${fmtWeight(row.max_event_weight)}</span>
          <span>问题 ${fmtNumber(row.data_issue_rows)} 行</span>
        </div>
        <div class="meta-grid">
          <span>货件 ${fmtNumber(row.shipment_count)}</span>
          <span>链接 ${fmtNumber(row.sales_link_count)}</span>
          <span>首缺 ${fmtDate(row.first_gap_date)}</span>
        </div>
      </button>`;
    })
    .join("");
  els.summaryList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextSummary = state.summaryRows[Number(button.dataset.index)];
      if (nextSummary?.summary_hash === state.selectedSummary?.summary_hash) return;
      state.selectedSummary = nextSummary;
      state.subjectOwner.selectedOpsPerson = "";
      state.subjectOwner.exceptionOnly = true;
      renderSummary();
      await loadCards();
    });
  });
}

function roleMetricLabel(roleCode) {
  if (roleCode === "first_leg_logistics") return "可推进挽回";
  return "预期损失";
}

function globalEmployeeFourthColumnLabel(roleCode) {
  return roleCode === "first_leg_logistics" ? "待物流填写" : "链接";
}

function globalScopeLabel() {
  const payload = state.globalCoordinator.payload || {};
  return granularityLabel(state.globalCoordinator.selectedScopeType || payload.scope_type || "brand_group", payload.granularity_options || []);
}

function renderGlobalCoordinatorSummary() {
  const payload = state.globalCoordinator.payload || {};
  const rows = payload.scope_rows || [];
  const scopeType = state.globalCoordinator.selectedScopeType || payload.scope_type || "brand_group";
  const options = payload.granularity_options || state.globalCoordinator.granularityOptions || [];
  els.summaryTitle.textContent = "① 全局统筹总览";
  els.scopeText.hidden = true;
  els.summaryCount.hidden = true;
  els.summaryCount.textContent = "";
  els.summaryListToolbar.hidden = false;
  els.summaryListToolbar.innerHTML = `<div class="global-scope-toolbar">
    ${renderGranularitySelect(scopeType, options, "data-global-scope-type")}
  </div>`;
  if (!rows.length) {
    els.summaryList.innerHTML = `<div class="empty-state">暂无摘要数据</div>`;
  } else {
    els.summaryList.innerHTML = `<div class="global-scope-table-head">
      <span>${htmlEscape(globalScopeLabel())}</span>
      <span>主体数</span>
      <span>票数</span>
      <span>链接数</span>
      <span>预期损失</span>
      <span>可推进挽回</span>
    </div>${rows.map((row) => {
      const key = String(row.scope_key || "");
      const active = state.globalCoordinator.selectedScopeKey && key === state.globalCoordinator.selectedScopeKey ? " active" : "";
      const label = scopeType === "subject_no" || scopeType === "subject"
        ? subjectCodeDisplay(row.scope_key || row.scope_label || key, key || "未分组")
        : (row.scope_label || key || "未分组");
      return `<button class="global-scope-row${active}" type="button" data-global-scope-key="${htmlEscape(key)}">
        <strong class="global-scope-name">${htmlEscape(label)}</strong>
        <span>${fmtNumber(row.subject_count)}</span>
        <span>${fmtNumber(row.shipment_count)}</span>
        <span>${fmtNumber(row.sales_link_count)}</span>
        <strong class="global-scope-money loss">${fmtMoneyWan(row.raw_expected_gmv_loss)}</strong>
        <strong class="global-scope-money recover">${fmtMoneyWan(row.recoverable_gmv)}</strong>
      </button>`;
    }).join("")}`;
  }
  els.summaryListToolbar.querySelector("[data-global-scope-type]")?.addEventListener("change", async (event) => {
    const nextType = event.currentTarget.value || "brand_group";
    if (nextType === state.globalCoordinator.selectedScopeType) return;
    state.globalCoordinator.selectedScopeType = nextType;
    state.globalCoordinator.selectedScopeKey = "";
    await loadCards();
  });
  els.summaryList.querySelectorAll("[data-global-scope-key]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextKey = button.dataset.globalScopeKey || "";
      state.globalCoordinator.selectedScopeKey = nextKey === state.globalCoordinator.selectedScopeKey ? "" : nextKey;
      await loadCards();
    });
  });
}

function renderGlobalCoordinatorWorkbench() {
  setGlobalCoordinatorLayoutMode(true);
  const payload = state.globalCoordinator.payload || {};
  const roleRows = payload.role_rows || [];
  const employeeRows = payload.employee_rows || [];
  const selectedScope = payload.selected_scope || {};
  els.detailTitle.textContent = "② 角色视角";
  els.detailMeta.hidden = true;
  els.cardCount.hidden = true;
  els.cardCount.textContent = "";
  els.linkOverview.hidden = true;
  els.issueInsights.hidden = true;
  els.cardsEmpty.hidden = true;
  const selectedRole = state.globalCoordinator.selectedRoleCode || payload.selected_role_code || "subject_owner";
  const valueHead = roleMetricLabel(selectedRole);
  const fourthHead = globalEmployeeFourthColumnLabel(selectedRole);
  const selectedScopeType = state.globalCoordinator.selectedScopeType || payload.scope_type || "brand_group";
  const scopeTitle = !state.globalCoordinator.selectedScopeKey
    ? `${globalScopeLabel()}全量`
    : selectedScopeType === "subject_no" || selectedScopeType === "subject"
    ? subjectCodeDisplay(selectedScope.scope_key || selectedScope.scope_label || state.globalCoordinator.selectedScopeKey || globalScopeLabel(), globalScopeLabel())
    : (selectedScope.scope_label || state.globalCoordinator.selectedScopeKey || globalScopeLabel());
  els.riskList.innerHTML = `<section class="global-workbench">
    <div class="global-role-grid">
      ${roleRows.map((row) => {
        const active = row.role_code === selectedRole ? " active" : "";
        return `<button class="global-role-card${active}" type="button" data-global-role="${htmlEscape(row.role_code || "")}">
          <span>${htmlEscape(row.role_label || roleName(row.role_code))}</span>
          <strong>${fmtNumber(row.person_count)} 人</strong>
        </button>`;
      }).join("")}
    </div>
    <div class="global-employee-panel">
      <div class="global-employee-head">
        <strong>${htmlEscape(scopeTitle)} / ${htmlEscape(roleName(selectedRole))}</strong>
        <span>${fmtNumber(employeeRows.length)} 人</span>
      </div>
      <div class="global-employee-table-head">
        <span>负责人</span>
        <span>${htmlEscape(valueHead)}</span>
        <span>货件</span>
        <span>${htmlEscape(fourthHead)}</span>
        <span>视角</span>
      </div>
      <div class="global-employee-list">
        ${employeeRows.length ? employeeRows.map((row, index) => renderGlobalEmployeeRow(row, selectedRole, index)).join("") : `<div class="empty-state compact">暂无人员数据</div>`}
      </div>
    </div>
  </section>`;
  els.riskList.querySelectorAll("[data-global-role]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRole = button.dataset.globalRole || "subject_owner";
      if (nextRole === state.globalCoordinator.selectedRoleCode) return;
      state.globalCoordinator.selectedRoleCode = nextRole;
      await loadCards();
    });
  });
  els.riskList.querySelectorAll("[data-global-mirror]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = employeeRows[Number(button.dataset.globalMirror)];
      if (row) await enterReadonlyMirror(row);
    });
  });
  updateReadonlyControls();
}

function renderGlobalEmployeeRow(row, roleCode, index) {
  const value = roleCode === "first_leg_logistics" ? row.recoverable_gmv : (row.raw_expected_gmv_loss || row.value_gmv);
  const canMirror = Boolean(row.target_user_id && row.target_role_code);
  return `<article class="global-employee-row">
    <div>
      <strong>${htmlEscape(row.person || "暂未分配")}</strong>
    </div>
    <div>
      <strong>${fmtMoneyWan(value)}</strong>
    </div>
    <div>
      <strong>${fmtNumber(row.shipment_count)}</strong>
    </div>
    ${roleCode === "first_leg_logistics" ? `<div>
      <strong>${fmtMoneyWan(row.unfilled_recoverable_gmv)}</strong>
    </div>` : `<div>
      <strong>${fmtNumber(row.link_count)}</strong>
    </div>`}
    <button class="ghost-btn compact" type="button" data-global-mirror="${index}" ${canMirror ? "" : "disabled"}>查看视角</button>
  </article>`;
}

function updateReadonlyControls() {
  const readonly = isReadonlyMirror();
  const exportBlocked = readonly || isGlobalCoordinator();
  const manualBlocked = readonly || isGlobalCoordinator();
  if (els.manualBtn) {
    els.manualBtn.hidden = manualBlocked;
  }
  if (manualBlocked && els.manualPanel) {
    els.manualPanel.hidden = true;
  }
  if (els.exportBtn) {
    els.exportBtn.disabled = exportBlocked;
    els.exportBtn.hidden = exportBlocked;
  }
  if (els.exportTasksBtn) {
    els.exportTasksBtn.disabled = exportBlocked;
    els.exportTasksBtn.hidden = exportBlocked;
  }
  if (exportBlocked && els.exportPanel) closeExportPanel();
  if (els.commentInput) {
    els.commentInput.disabled = readonly;
    els.commentInput.placeholder = readonly ? "" : "补充当前处理进展、异常原因或需要对方确认的信息";
    if (readonly) els.commentInput.value = "";
  }
  if (els.postCommentBtn) els.postCommentBtn.disabled = readonly;
  if (els.confirmReadBtn) els.confirmReadBtn.disabled = readonly;
  document.body.classList.toggle("readonly-mirror", readonly);
}

function appendSubjectFilterParams(params) {
  if (!isSubjectOwner()) return params;
  (state.subjectOwner.selectedSubjectNos || []).forEach((subjectNo) => {
    if (subjectNo) params.append("subject_no", subjectNo);
  });
  return params;
}

const FIELD_FILTERS = [
  ["salesLinkFilter", "sales_link", "销售链接", "text"],
  ["systemSkuFilter", "system_sku", "系统SKU", "text"],
  ["platformSkuFilter", "platform_sku", "平台SKU", "text"],
  ["shipmentNoFilter", "shipment_no", "货件号", "text"],
];

const CASCADE_FILTERS = [
  {
    id: "brandSubject",
    label: "品牌集合 / 主体编号",
    levels: [
      { label: "品牌集合", optionType: "brand_group", param: "brand_group", missingLabel: "【品牌集合缺失】" },
      { label: "主体编号", optionType: "subject_no", param: "subject_no", missingLabel: "【主体编号缺失】" },
    ],
  },
  {
    id: "channel",
    label: "一级渠道 / 三级渠道",
    levels: [
      { label: "一级渠道", optionType: "freight_type", param: "freight_type", missingLabel: "【一级渠道缺失】" },
      { label: "三级渠道", optionType: "channel3", param: "channel3", missingLabel: "【三级渠道缺失】" },
    ],
  },
  {
    id: "category",
    label: "一级品类 / 二级品类 / 三级品类",
    levels: [
      { label: "一级品类", optionType: "category1", param: "category1", missingLabel: "【一级品类缺失】" },
      { label: "二级品类", optionType: "category2", param: "category2", missingLabel: "【二级品类缺失】" },
      { label: "三级品类", optionType: "category3", param: "category3", missingLabel: "【三级品类缺失】" },
    ],
  },
];

const MULTI_FILTERS = [
  { id: "country", label: "国家", optionType: "country", param: "country" },
  { id: "accountName", label: "店铺名称", optionType: "account_name", param: "account_name" },
  { id: "skuGrade", label: "SKU等级", optionType: "sku_grade", param: "sku_grade" },
  { id: "customLabel", label: "自定义标签", optionType: "custom_label", param: "custom_label" },
];

const WEEK_RANGE_SIZE = 12;

function selectedValues(el) {
  if (!el) return [];
  if (el.tagName === "SELECT" && el.multiple) {
    return Array.from(el.selectedOptions).map((option) => option.value).filter(Boolean);
  }
  const value = String(el.value || "").trim();
  return value ? [value] : [];
}

function filterInputValue(key) {
  return selectedValues(els[key]).join("、");
}

function filterState(id) {
  if (!state.fieldFilters[id]) state.fieldFilters[id] = new Set();
  return state.fieldFilters[id];
}

function optionRows(optionType) {
  return state.filterOptions?.[optionType] || [];
}

function optionValue(item) {
  return String(item?.option_value ?? "").trim();
}

function selectedFilterValues(id) {
  return [...filterState(id)].filter(Boolean);
}

function selectedOptionText(id, limit = 2) {
  const values = selectedFilterValues(id);
  if (!values.length) return "全部";
  const visible = values.slice(0, limit).join("、");
  return values.length > limit ? `${visible} 等 ${fmtNumber(values.length)}项` : visible;
}

function cascadeSelectedValues(config, levelIndex) {
  return selectedFilterValues(`${config.id}_${levelIndex}`);
}

function cascadeParentAllowed(config, levelIndex, option) {
  if (levelIndex <= 0) return true;
  const parentSelected = cascadeSelectedValues(config, levelIndex - 1);
  if (!parentSelected.length) return true;
  const parentType = config.levels[levelIndex - 1]?.optionType;
  return parentSelected.includes(String(option?.[parentType] ?? "").trim());
}

function availableCascadeOptions(config, levelIndex) {
  const level = config.levels[levelIndex];
  return optionRows(level.optionType).filter((item) => cascadeParentAllowed(config, levelIndex, item));
}

function sanitizeCascadeFilter(config, startLevel = 1) {
  for (let levelIndex = startLevel; levelIndex < config.levels.length; levelIndex += 1) {
    const stateSet = filterState(`${config.id}_${levelIndex}`);
    if (!stateSet.size) continue;
    const allowed = new Set(availableCascadeOptions(config, levelIndex).map(optionValue));
    [...stateSet].forEach((value) => {
      if (!allowed.has(value)) stateSet.delete(value);
    });
  }
}

function activeFilterCount() {
  let count = 0;
  FIELD_FILTERS.forEach(([key]) => {
    if (filterInputValue(key)) count += 1;
  });
  CASCADE_FILTERS.forEach((config) => {
    if (config.levels.some((_, index) => cascadeSelectedValues(config, index).length)) count += 1;
  });
  MULTI_FILTERS.forEach((config) => {
    if (selectedFilterValues(config.id).length) count += 1;
  });
  if (!isFullWeekRange()) count += 1;
  return count;
}

function renderFieldFilterOptions() {
  sanitizeAllFilterSelections();
  renderStructuredFilters();
  renderWeekRangeFilter();
  updateFilterPanel();
}

function appendFieldFilterParams(params, { includeWeekRange = true } = {}) {
  FIELD_FILTERS.forEach(([key, param]) => {
    selectedValues(els[key]).forEach((value) => {
      if (value) params.append(param, value);
    });
  });
  CASCADE_FILTERS.forEach((config) => {
    config.levels.forEach((level, index) => {
      cascadeSelectedValues(config, index).forEach((value) => {
        if (value) params.append(level.param, value);
      });
    });
  });
  MULTI_FILTERS.forEach((config) => {
    selectedFilterValues(config.id).forEach((value) => {
      if (value) params.append(config.param, value);
    });
  });
  if (includeWeekRange) appendWeekRangeParams(params);
  return params;
}

function sanitizeAllFilterSelections() {
  CASCADE_FILTERS.forEach((config) => sanitizeCascadeFilter(config, 0));
  MULTI_FILTERS.forEach((config) => {
    const allowed = new Set(optionRows(config.optionType).map(optionValue));
    if (!allowed.size) return;
    [...filterState(config.id)].forEach((value) => {
      if (!allowed.has(value)) filterState(config.id).delete(value);
    });
  });
}

function cascadeSummaryText(config) {
  const selected = config.levels.flatMap((_, index) => cascadeSelectedValues(config, index));
  return selected.length ? `已选 ${fmtNumber(selected.length)} 项` : "全部";
}

function menuOpenId(type, id) {
  return `${type}:${id}`;
}

function isMenuOpen(type, id) {
  return state.openFilterMenu === menuOpenId(type, id);
}

function setFilterMenu(type, id) {
  state.openFilterMenu = state.openFilterMenu === menuOpenId(type, id) ? null : menuOpenId(type, id);
  renderStructuredFilters();
}

function filterSearchValue(key) {
  return String(state.filterSearch[key] || "").trim().toLowerCase();
}

function rowMatchesFilterSearch(row, optionTypes, key) {
  const q = filterSearchValue(key);
  if (!q) return true;
  return optionTypes.some((type) => String(row?.[type] ?? row?.option_value ?? "").toLowerCase().includes(q));
}

function toggleFilterValue(id, value, checked) {
  const values = filterState(id);
  if (checked) values.add(value);
  else values.delete(value);
}

function renderStructuredFilters() {
  renderCascadeFilters();
  renderMultiFilters();
}

function renderCascadeFilters() {
  if (!els.cascadeFilterHost) return;
  els.cascadeFilterHost.innerHTML = CASCADE_FILTERS.map((config) => {
    const open = isMenuOpen("cascade", config.id);
    return `
      <div class="cascade-filter${open ? " open" : ""}" data-cascade-id="${htmlEscape(config.id)}">
        <button class="cascade-trigger" type="button" data-filter-menu="cascade" data-filter-id="${htmlEscape(config.id)}" aria-expanded="${open ? "true" : "false"}">
          <span class="trigger-label">${htmlEscape(config.label)}</span>
          <span class="trigger-value" title="${htmlEscape(cascadeSummaryText(config))}">${htmlEscape(cascadeSummaryText(config))}</span>
          <span class="trigger-caret">${open ? "⌃" : "⌄"}</span>
        </button>
        ${open ? renderCascadeMenu(config) : ""}
      </div>
    `;
  }).join("");
}

function renderCascadeMenu(config) {
  const searchKey = `cascade_${config.id}`;
  return `
    <div class="filter-popover cascade-menu">
      <div class="filter-menu-search">
        <input type="search" value="${htmlEscape(state.filterSearch[searchKey] || "")}" placeholder="搜索" data-filter-search="${htmlEscape(searchKey)}">
      </div>
      <div class="cascade-columns" style="--cascade-levels:${config.levels.length}">
        ${config.levels.map((level, levelIndex) => renderCascadeLevel(config, level, levelIndex, searchKey)).join("")}
      </div>
      <div class="filter-menu-footer">
        <button class="ghost-btn compact" type="button" data-filter-clear-cascade="${htmlEscape(config.id)}">清空</button>
        <button class="primary-btn compact" type="button" data-filter-menu-close>确定</button>
      </div>
    </div>
  `;
}

function renderCascadeLevel(config, level, levelIndex, searchKey) {
  const selected = new Set(cascadeSelectedValues(config, levelIndex));
  const rows = availableCascadeOptions(config, levelIndex)
    .filter((row) => rowMatchesFilterSearch(row, config.levels.map((item) => item.optionType), searchKey))
    .slice(0, 160);
  return `
    <div class="cascade-level">
      <div class="cascade-level-title">${htmlEscape(level.label || config.label)}</div>
      <div class="cascade-option-list">
        ${rows.length ? rows.map((row) => {
          const value = optionValue(row);
          return `
            <label class="filter-option">
              <input type="checkbox" data-cascade-id="${htmlEscape(config.id)}" data-cascade-level="${levelIndex}" value="${htmlEscape(value)}"${selected.has(value) ? " checked" : ""}>
              <span title="${htmlEscape(value)}">${htmlEscape(value)} <em>${fmtNumber(row.row_count)}</em></span>
            </label>
          `;
        }).join("") : `<div class="filter-menu-empty">暂无选项</div>`}
      </div>
    </div>
  `;
}

function renderMultiFilters() {
  if (!els.multiFilterHost) return;
  els.multiFilterHost.innerHTML = MULTI_FILTERS.map((config) => {
    const open = isMenuOpen("multi", config.id);
    return `
      <div class="multi-filter${open ? " open" : ""}" data-multi-id="${htmlEscape(config.id)}">
        <button class="multi-trigger" type="button" data-filter-menu="multi" data-filter-id="${htmlEscape(config.id)}" aria-expanded="${open ? "true" : "false"}">
          <span class="trigger-label">${htmlEscape(config.label)}</span>
          <span class="trigger-value" title="${htmlEscape(selectedOptionText(config.id, 2))}">${htmlEscape(selectedOptionText(config.id, 2))}</span>
          <span class="trigger-caret">${open ? "⌃" : "⌄"}</span>
        </button>
        ${open ? renderMultiMenu(config) : ""}
      </div>
    `;
  }).join("");
}

function renderMultiMenu(config) {
  const searchKey = `multi_${config.id}`;
  const selected = new Set(selectedFilterValues(config.id));
  const rows = optionRows(config.optionType)
    .filter((row) => rowMatchesFilterSearch(row, [config.optionType], searchKey))
    .slice(0, 180);
  return `
    <div class="filter-popover multi-menu">
      <div class="filter-menu-search">
        <input type="search" value="${htmlEscape(state.filterSearch[searchKey] || "")}" placeholder="搜索" data-filter-search="${htmlEscape(searchKey)}">
      </div>
      <div class="filter-option-list">
        ${rows.length ? rows.map((row) => {
          const value = optionValue(row);
          return `
            <label class="filter-option">
              <input type="checkbox" data-multi-id="${htmlEscape(config.id)}" value="${htmlEscape(value)}"${selected.has(value) ? " checked" : ""}>
              <span title="${htmlEscape(value)}">${htmlEscape(value)} <em>${fmtNumber(row.row_count)}</em></span>
            </label>
          `;
        }).join("") : `<div class="filter-menu-empty">暂无选项</div>`}
      </div>
      <div class="filter-menu-footer">
        <button class="ghost-btn compact" type="button" data-filter-clear-multi="${htmlEscape(config.id)}">清空</button>
        <button class="primary-btn compact" type="button" data-filter-menu-close>确定</button>
      </div>
    </div>
  `;
}

function weekRowsForFilter() {
  const source = state.weeklyAllRows?.length ? state.weeklyAllRows : (state.weeklyRows?.length ? state.weeklyRows : []);
  if (source.length) return source.slice(0, WEEK_RANGE_SIZE);
  const today = new Date();
  const day = today.getDay() || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return Array.from({ length: WEEK_RANGE_SIZE }, (_, index) => {
    const start = new Date(monday);
    start.setDate(monday.getDate() + index * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return { week_start: iso(start), week_end: iso(end), week_label: fmtWeek(iso(start)) };
  });
}

function selectedWeekRows(rows = state.weeklyAllRows) {
  const source = (rows || []).slice(0, WEEK_RANGE_SIZE);
  if (!source.length) return [];
  normalizeWeekRange();
  return source.slice(state.weekRange.startIndex, state.weekRange.endIndex + 1);
}

function selectedGapSegments(segments = state.gapSegments, rows = weekRowsForFilter()) {
  const source = segments || [];
  const start = rows[state.weekRange.startIndex];
  const end = rows[state.weekRange.endIndex];
  const startDate = isoDateKey(start?.week_start);
  const endDate = isoDateKey(end?.week_end);
  if (!startDate || !endDate || isFullWeekRange()) return source;
  return source.filter((segment) => {
    const segmentStart = isoDateKey(segment.start_date);
    const segmentEnd = isoDateKey(segment.end_date);
    return segmentStart && segmentEnd && segmentStart <= endDate && segmentEnd >= startDate;
  });
}

function clampWeekIndex(value) {
  const rows = weekRowsForFilter();
  const maxIndex = Math.max(0, rows.length - 1);
  const index = Math.round(Number(value));
  if (!Number.isFinite(index)) return 0;
  return Math.min(maxIndex, Math.max(0, index));
}

function normalizeWeekRange() {
  const start = clampWeekIndex(state.weekRange.startIndex);
  const end = clampWeekIndex(state.weekRange.endIndex);
  state.weekRange.startIndex = Math.min(start, end);
  state.weekRange.endIndex = Math.max(start, end);
}

function isFullWeekRange() {
  const rows = weekRowsForFilter();
  normalizeWeekRange();
  return state.weekRange.startIndex === 0 && state.weekRange.endIndex >= Math.max(0, rows.length - 1);
}

function weekRangeLabel(index) {
  const row = weekRowsForFilter()[clampWeekIndex(index)];
  return row?.week_label || fmtWeek(row?.week_start);
}

function weekRangeTitle(index) {
  const row = weekRowsForFilter()[clampWeekIndex(index)];
  if (!row) return "";
  return `${fmtDate(row.week_start)} 至 ${fmtDate(row.week_end)}`;
}

function weekRangeOptionLabel(row) {
  if (!row) return "--";
  const label = row.week_label || fmtWeek(row.week_start);
  const start = fmtDate(row.week_start).slice(2).replaceAll("-", "/");
  const end = fmtDate(row.week_end).slice(2).replaceAll("-", "/");
  return `${label}（${start}-${end}）`;
}

function weekRangeShortLabel(index) {
  const label = weekRangeLabel(index) || "--";
  const match = String(label).match(/(\d+)\s*-\s*(\d+)\s*周/);
  return match ? `${match[1]}-${match[2]}周` : label;
}

function renderWeekRangeFilter() {
  if (!els.weekRangeFilter) return;
  const rows = weekRowsForFilter();
  if (!rows.length) {
    els.weekRangeFilter.innerHTML = "";
    return;
  }
  normalizeWeekRange();
  const startOptionHtml = rows.map((row, index) => {
    const active = index === state.weekRange.startIndex ? " active" : "";
    return `<button class="compact-filter-option${active}" type="button" data-week-range-option="start" data-week-index="${index}">${htmlEscape(weekRangeOptionLabel(row))}</button>`;
  }).join("");
  const endOptionHtml = rows.map((row, index) => {
    const active = index === state.weekRange.endIndex ? " active" : "";
    const disabled = index < state.weekRange.startIndex ? " disabled" : "";
    return `<button class="compact-filter-option${active}" type="button" data-week-range-option="end" data-week-index="${index}"${disabled}>${htmlEscape(weekRangeOptionLabel(row))}</button>`;
  }).join("");
  els.weekRangeFilter.innerHTML = `
    <span class="compact-filter-group">
      <button class="compact-filter-btn week-filter-btn" type="button" data-week-range-toggle="start" aria-expanded="false" title="${htmlEscape(weekRangeTitle(state.weekRange.startIndex))}">
        ${htmlEscape(weekRangeShortLabel(state.weekRange.startIndex))}
      </button>
      <div class="compact-filter-menu week-filter-menu" data-week-range-menu="start" hidden>${startOptionHtml}</div>
    </span>
    <span class="week-range-separator">至</span>
    <span class="compact-filter-group">
      <button class="compact-filter-btn week-filter-btn" type="button" data-week-range-toggle="end" aria-expanded="false" title="${htmlEscape(weekRangeTitle(state.weekRange.endIndex))}">
        ${htmlEscape(weekRangeShortLabel(state.weekRange.endIndex))}
      </button>
      <div class="compact-filter-menu week-filter-menu" data-week-range-menu="end" hidden>${endOptionHtml}</div>
    </span>
  `;
}

function closeCompactMenus(except = null) {
  document.querySelectorAll(".compact-filter-menu").forEach((menu) => {
    if (menu === except) return;
    menu.hidden = true;
  });
  document.querySelectorAll(".compact-filter-btn[aria-expanded='true']").forEach((button) => {
    const controlsMenu = button.dataset.weekRangeToggle
      ? document.querySelector(`[data-week-range-menu="${cssEscape(button.dataset.weekRangeToggle)}"]`)
      : button.closest(".currency-dropdown")?.querySelector("[data-currency-menu]");
    if (controlsMenu !== except) button.setAttribute("aria-expanded", "false");
  });
}

function toggleWeekRangeMenu(kind) {
  const menu = els.weekRangeFilter?.querySelector(`[data-week-range-menu="${cssEscape(kind)}"]`);
  const button = els.weekRangeFilter?.querySelector(`[data-week-range-toggle="${cssEscape(kind)}"]`);
  if (!menu || !button) return;
  const willOpen = menu.hidden;
  closeCompactMenus(willOpen ? menu : null);
  menu.hidden = !willOpen;
  button.setAttribute("aria-expanded", willOpen ? "true" : "false");
}

function toggleCurrencyMenu() {
  const menu = els.currencyDropdown?.querySelector("[data-currency-menu]");
  const button = els.currencyDropdown?.querySelector("[data-currency-toggle]");
  if (!menu || !button) return;
  const willOpen = menu.hidden;
  closeCompactMenus(willOpen ? menu : null);
  menu.hidden = !willOpen;
  button.setAttribute("aria-expanded", willOpen ? "true" : "false");
}

function applyWeekRangeSelection(kind, value) {
  const index = clampWeekIndex(value);
  if (kind === "start") {
    state.weekRange.startIndex = index;
    if (state.weekRange.endIndex < index) state.weekRange.endIndex = index;
  } else {
    state.weekRange.endIndex = Math.max(index, state.weekRange.startIndex);
  }
  renderWeekRangeFilter();
  updateFilterPanel();
  applyFilters({ collapse: false }).catch((error) => showToast(error.message));
}

function applyCurrencySelection(value) {
  const code = String(value || "").toUpperCase();
  if (!code) return;
  if (els.currencySelect) {
    els.currencySelect.value = code;
  }
  closeCompactMenus();
  handleCurrencyChange().catch((error) => showToast(error.message));
}

function appendWeekRangeParams(params) {
  if (isFullWeekRange()) return params;
  const rows = weekRowsForFilter();
  const start = rows[state.weekRange.startIndex];
  const end = rows[state.weekRange.endIndex];
  if (start?.week_start) params.set("week_start", start.week_start);
  if (end?.week_end) params.set("week_end", end.week_end);
  params.set("week_start_index", String(state.weekRange.startIndex));
  params.set("week_end_index", String(state.weekRange.endIndex));
  return params;
}

function activeFilterChips() {
  return Array.from({ length: activeFilterCount() }, (_, index) => ["筛选", String(index + 1)]);
}

function updateFilterPanel() {
  els.filters?.classList.toggle("filters-collapsed", state.filtersCollapsed);
  syncFilterLayer();
  const logistics = isLogistics();
  const planner = isSupplyPlanner();
  if (els.filterToggle) {
    els.filterToggle.textContent = state.filtersCollapsed ? "展开筛选" : "收起筛选";
    els.filterToggle.setAttribute("aria-expanded", state.filtersCollapsed ? "false" : "true");
  }
  if (els.filterCollapse) {
    els.filterCollapse.textContent = planner ? "×" : "收起";
    els.filterCollapse.setAttribute("aria-label", planner ? "关闭筛选" : "收起筛选");
  }
  const count = activeFilterCount();
  if (els.filterSummary) {
    els.filterSummary.innerHTML = count && !logistics
      ? `<span class="filter-count-pill"><b>已筛选</b> ${fmtNumber(count)} 项</span>`
      : "";
  }
  renderStructuredFilters();
  renderWeekRangeFilter();
}

function rememberFilterLiftHome() {
  if (!els.filters || filterLiftHome.parent) return;
  filterLiftHome.parent = els.filters.parentElement;
  filterLiftHome.nextSibling = els.filters.nextSibling;
}

function restoreFilterLayer() {
  if (!els.filters || !filterLiftHome.parent) return;
  if (els.filters.parentElement !== filterLiftHome.parent) {
    filterLiftHome.parent.insertBefore(els.filters, filterLiftHome.nextSibling);
  }
  filterLiftHome.parent = null;
  filterLiftHome.nextSibling = null;
}

function syncFilterLayer() {
  if (!els.filters || isGlobalCoordinator()) return;
  const shouldLift = !state.filtersCollapsed && (isBusinessOps() || isSupplyPlanner() || isLogistics());
  if (shouldLift) {
    rememberFilterLiftHome();
    if (els.filters.parentElement !== document.body) {
      document.body.appendChild(els.filters);
    }
    els.filters.classList.add("filter-layer-fixed");
  } else {
    els.filters.classList.remove("filter-layer-fixed");
    restoreFilterLayer();
  }
}

function placeFiltersForMode(logisticsMode) {
  if (!els.filters) return;
  restoreFilterLayer();
  if (!filterHome.parent) {
    filterHome.parent = els.filters.parentElement;
    filterHome.nextSibling = els.filters.nextSibling;
  }
  let target = filterHome.parent;
  const opsMode = isBusinessOps();
  if (logisticsMode || opsMode) {
    target = els.summaryHeadActions || filterHome.parent;
  }
  if (target && els.filters.parentElement !== target) {
    target.insertBefore(
      els.filters,
      (logisticsMode || opsMode) ? target.firstChild : filterHome.nextSibling
    );
  }
  els.appShell?.classList.toggle("logistics-top-filter", false);
  if (els.topFilterHost) els.topFilterHost.hidden = true;
  els.filters.classList.toggle("summary-filter-popover", Boolean(logisticsMode || opsMode));
  els.filters.classList.toggle("logistics-filter-popover", Boolean(logisticsMode));
}

function placeFiltersForPlanner() {
  if (!els.filters) return;
  restoreFilterLayer();
  if (!filterHome.parent) {
    filterHome.parent = els.filters.parentElement;
    filterHome.nextSibling = els.filters.nextSibling;
  }
  if (els.appShell && els.filters.parentElement !== els.appShell) {
    els.appShell.appendChild(els.filters);
  }
  if (els.topFilterHost) els.topFilterHost.hidden = true;
  els.appShell?.classList.remove("logistics-top-filter");
  els.filters.classList.toggle("planner-filter-popover", true);
  updateFilterPanel();
}

function setLogisticsLayoutMode(active) {
  placeFiltersForMode(active);
  if (!active) {
    els.filters?.classList.remove("planner-filter-popover", "summary-filter-popover", "logistics-filter-popover");
  }
  els.workspace?.classList.toggle("logistics-mode", Boolean(active));
  els.detailPane?.classList.toggle("logistics-mode", Boolean(active));
  els.detailBody?.classList.toggle("logistics-layout", Boolean(active));
  if (active) {
    els.workspace?.classList.remove("owner-mode", "planner-mode", "owner-link-detail-mode", "global-coordinator-mode");
    els.detailPane?.classList.remove("ops-mode", "owner-mode", "planner-mode", "global-coordinator-mode");
    els.detailBody?.classList.remove("ops-layout", "owner-layout", "planner-layout", "global-coordinator-layout");
    syncSortOptions();
    updateFilterPanel();
  }
}

function setFilterCollapsed(collapsed) {
  state.filtersCollapsed = Boolean(collapsed);
  if (state.filtersCollapsed) hideClearFiltersConfirm();
  updateFilterPanel();
  if (isSupplyPlanner()) renderPlannerSummary();
}

function clearFilters() {
  FIELD_FILTERS.map(([key]) => els[key]).forEach((el) => {
    if (!el) return;
    if (el.tagName === "SELECT" && el.multiple) {
      Array.from(el.options).forEach((option) => {
        option.selected = false;
      });
      return;
    }
    el.value = "";
  });
  state.fieldFilters = {};
  state.openFilterMenu = null;
  state.filterSearch = {};
  state.weekRange = {
    startIndex: 0,
    endIndex: Math.max(0, weekRowsForFilter().length - 1),
  };
  state.opsTimelineShipmentNo = "";
  updateFilterPanel();
}

function clearFiltersAndApply({ collapse = true } = {}) {
  hideClearFiltersConfirm();
  clearFilters();
  applyFilters({ collapse }).catch((error) => showToast(error.message));
}

function showClearFiltersConfirm() {
  if (els.filterClearConfirm) els.filterClearConfirm.hidden = false;
}

function hideClearFiltersConfirm() {
  if (els.filterClearConfirm) els.filterClearConfirm.hidden = true;
}

function confirmClearFilters() {
  clearFiltersAndApply({ collapse: false });
}

async function applyFilters({ collapse = true } = {}) {
  hideClearFiltersConfirm();
  state.opsTimelineShipmentNo = "";
  if (isSupplyPlanner()) {
    state.planner.linkPage = 1;
    state.planner.shipmentPage = 1;
    state.planner.selectedLinkKey = "";
  }
  updateFilterPanel();
  if (collapse) setFilterCollapsed(true);
  await loadCards();
}

function cardsParams() {
  const params = appendSubjectFilterParams(userParams());
  params.set("limit", isBusinessOps() ? "500" : (isSubjectOwner() ? "80" : "120"));
  params.set("sort", isBusinessOps() ? "recovery_desc" : "loss_desc");
  if (!isSubjectOwner() && state.selectedSummary?.home_grain && state.selectedSummary?.summary_key) {
    params.set("home_grain", state.selectedSummary.home_grain);
    params.set("summary_key", state.selectedSummary.summary_key);
  }
  appendFieldFilterParams(params);
  return params;
}

function applyReadonlyMirrorParams(params) {
  if (!isReadonlyMirror()) return params;
  const mirror = state.globalCoordinator.mirror;
  if (mirror?.viewerUserId) params.set("viewer_user_id", mirror.viewerUserId);
  params.set("viewer_role_code", mirror?.viewerRoleCode || "global_coordinator");
  params.set("mode", "readonly_mirror");
  return params;
}

function logisticsParams() {
  const params = userParams();
  const logisticsSorts = new Set(["priority", "recoverable_desc", "requested_date_asc", "tracking_desc", "feedback_pending"]);
  const selectedSort = logisticsSorts.has(els.sortFilter?.value) ? els.sortFilter.value : "priority";
  params.set("limit", "500");
  params.set("sort", selectedSort);
  params.set("action_scope", state.logistics.selectedActionScope || "logistics_owned");
  appendFieldFilterParams(params);
  if (state.logistics.selectedCountry) params.append("country", state.logistics.selectedCountry);
  if (state.logistics.selectedFreightType) params.append("freight_type", state.logistics.selectedFreightType);
  if (state.logistics.selectedChannel3) params.append("channel3", state.logistics.selectedChannel3);
  return params;
}

function subjectOwnerWorkbenchParams() {
  const params = cardsParams();
  params.set("exception_only", state.subjectOwner.exceptionOnly ? "1" : "0");
  params.set("granularity", state.subjectOwner.selectedGranularity || "account_name");
  if (state.subjectOwner.selectedOpsPerson) {
    params.set("ops_person", state.subjectOwner.selectedOpsPerson);
  }
  return params;
}

function plannerOverdueParams() {
  const params = userParams();
  params.set("link_page", String(state.planner.linkPage || 1));
  params.set("link_page_size", String(state.planner.linkPageSize || 100));
  params.set("shipment_page", String(state.planner.shipmentPage || 1));
  params.set("shipment_page_size", String(state.planner.shipmentPageSize || 100));
  if (state.planner.selectedOverdueType) params.set("overdue_type", state.planner.selectedOverdueType);
  if (state.planner.selectedLinkKey) params.set("link_key", state.planner.selectedLinkKey);
  appendFieldFilterParams(params);
  return params;
}

function plannerDetailParams(linkKey = state.planner.selectedLinkKey) {
  const params = userParams();
  params.set("shipment_page", String(state.planner.shipmentPage || 1));
  params.set("shipment_page_size", String(state.planner.shipmentPageSize || 100));
  if (state.planner.selectedOverdueType) params.set("overdue_type", state.planner.selectedOverdueType);
  if (linkKey) params.set("link_key", linkKey);
  appendFieldFilterParams(params);
  return params;
}

function linkOverviewParams() {
  const params = userParams();
  if (state.selectedSummary?.home_grain && state.selectedSummary?.summary_key) {
    params.set("home_grain", state.selectedSummary.home_grain);
    params.set("summary_key", state.selectedSummary.summary_key);
  }
  appendFieldFilterParams(params);
  return params;
}

function plannerLinkWeeklyParams(linkKey = state.planner.selectedLinkKey) {
  const params = userParams();
  if (linkKey) {
    params.set("home_grain", "sales_link");
    params.set("summary_key", linkKey);
  }
  appendFieldFilterParams(params);
  return params;
}

function exportParams() {
  const params = cardsParams();
  params.delete("limit");
  params.delete("offset");
  if (isGlobalCoordinator()) {
    params.set("scope_type", state.globalCoordinator.selectedScopeType || "brand_group");
    if (state.globalCoordinator.selectedScopeKey) params.set("scope_key", state.globalCoordinator.selectedScopeKey);
    if (state.globalCoordinator.selectedRoleCode) params.set("selected_role_code", state.globalCoordinator.selectedRoleCode);
  }
  return applyReadonlyMirrorParams(params);
}

async function loadLogisticsResponse(requestId = state.cardsRequestId) {
  const payload = await api(`/api/logistics/response?${logisticsParams().toString()}`);
  if (requestId !== state.cardsRequestId) return;
  state.logistics.rows = payload.rows || [];
  state.logistics.totals = payload.totals || {};
  state.logistics.distributionRows = payload.distribution_rows || [];
  state.logistics.channelRows = payload.channel_rows || [];
  state.logistics.channelTreeRows = payload.channel_tree_rows || [];
  state.logistics.bucketSummaryRows = payload.bucket_summary_rows || [];
  const validTreeKeys = new Set();
  state.logistics.channelTreeRows.forEach((row) => {
    const country = row.logistics_country_cn || "【国家缺失】";
    const freight = row.freight_type_name || "【一级渠道缺失】";
    validTreeKeys.add(logisticsTreeKey(country));
    validTreeKeys.add(logisticsTreeKey(country, freight));
  });
  Object.keys(state.logistics.channelTreeCollapsed || {}).forEach((key) => {
    if (!validTreeKeys.has(key)) delete state.logistics.channelTreeCollapsed[key];
  });
  state.logistics.feedbackOptions = payload.feedback_options || [];
  state.logistics.feedbackSummaryRows = payload.feedback_summary_rows || [];
  state.summaryScope = payload.scope || null;
  state.cards = state.logistics.rows;
  state.cardTotals = state.logistics.totals;
  state.qualityOptions = state.logistics.feedbackOptions;
  state.issueInsights = [];
  const visibleShipments = new Set(state.logistics.rows.map((row) => row.shipment_no).filter(Boolean));
  if (!visibleShipments.has(state.logistics.selectedShipmentNo)) {
    state.logistics.selectedShipmentNo = state.logistics.rows[0]?.shipment_no || "";
    state.logistics.shipmentPage = 1;
    state.logistics.detail = null;
  }
  renderQualityOptions();
  renderKpis(state.logistics.totals);
  renderSummary();
  renderLogisticsChannelTreePane();
  renderLogisticsWorkbench();
  if (state.logistics.selectedShipmentNo) {
    loadLogisticsDetail(state.logistics.selectedShipmentNo, requestId).catch((error) => showToast(error.message));
  }
}

async function loadPlannerOverdue(requestId = state.cardsRequestId) {
  setLogisticsLayoutMode(false);
  const payload = await api(`/api/planner/overdue-links?${plannerOverdueParams().toString()}`);
  if (requestId !== state.cardsRequestId) return;
  state.planner.payload = payload;
  state.planner.loadError = "";
  state.planner.selectedOverdueType = payload.selected_overdue_type || state.planner.selectedOverdueType || "";
  const nextLinkKey = payload.selected_link_key || payload.link_rows?.[0]?.link_key || "";
  state.planner.selectedLinkKey = nextLinkKey;
  state.summaryScope = payload.scope || null;
  state.cards = payload.shipment_rows || [];
  state.cardTotals = payload.totals || {};
  state.weeklyRows = [];
  state.gapSegments = [];
  state.logisticsOptions = [];
  state.qualityOptions = [];
  state.issueInsights = [];
  renderQualityOptions();
  renderIssueInsights();
  renderCards(payload.totals || {});
  if (nextLinkKey) {
    const weeklyPayload = await api(`/api/link-weekly?${plannerLinkWeeklyParams(nextLinkKey).toString()}`).catch(() => ({ rows: [], gap_segments: [] }));
    if (requestId !== state.cardsRequestId) return;
    state.weeklyRows = weeklyPayload.rows || [];
    state.gapSegments = weeklyPayload.gap_segments || [];
    renderCards(state.cardTotals || {});
  }
}

async function loadPlannerLinkDetail(requestId = state.cardsRequestId) {
  const linkKey = state.planner.selectedLinkKey || "";
  if (!linkKey) return;
  const [detailPayload, weeklyPayload] = await Promise.all([
    api(`/api/planner/link-detail?${plannerDetailParams(linkKey).toString()}`),
    api(`/api/link-weekly?${plannerLinkWeeklyParams(linkKey).toString()}`).catch(() => ({ rows: [], gap_segments: [] })),
  ]);
  if (requestId !== state.cardsRequestId) return;
  const existingPayload = state.planner.payload || {};
  state.planner.payload = {
    ...existingPayload,
    selected_link_key: detailPayload.selected_link_key || linkKey,
    selected_link: detailPayload.selected_link || null,
    shipment_rows: detailPayload.shipment_rows || [],
    shipment_page: detailPayload.shipment_page || existingPayload.shipment_page || {},
    is_link_detail_loading: false,
  };
  state.planner.selectedLinkKey = detailPayload.selected_link_key || linkKey;
  state.cards = state.planner.payload.shipment_rows || [];
  state.weeklyRows = weeklyPayload.rows || [];
  state.gapSegments = weeklyPayload.gap_segments || [];
  state.summaryScope = detailPayload.scope || state.summaryScope;
  renderCards(state.cardTotals || {});
}

async function loadCards() {
  const requestId = ++state.cardsRequestId;
  setCardsLoading(true);
  try {
    if (isGlobalCoordinator()) {
      await loadGlobalCoordinatorWorkbench(requestId);
      return;
    }
    if (isLogistics()) {
      setLogisticsLayoutMode(true);
      await loadLogisticsResponse(requestId);
      return;
    }
    if (isSupplyPlanner()) {
      await loadPlannerOverdue(requestId);
      return;
    }
    if (isBusinessOps()) {
      const weeklyPromise = api(`/api/link-weekly?${linkOverviewParams().toString()}`).catch(() => ({ rows: [], gap_segments: [] }));
      const payload = await api(`/api/cards?${cardsParams().toString()}`);
      if (requestId !== state.cardsRequestId) return;
      state.cards = payload.rows || [];
      state.cardTotals = payload.totals || {};
      state.weeklyRows = [];
      state.weeklyAllRows = [];
      state.gapSegments = [];
      state.logisticsOptions = payload.logistics_options || [];
      state.qualityOptions = payload.quality_options || [];
      state.issueInsights = payload.issue_insights || [];
      state.subjectOwner.opsRows = [];
      state.subjectOwner.businessRows = [];
      state.subjectOwner.logisticsRows = [];
      state.subjectOwner.issueRows = [];
      state.subjectOwner.actionRows = [];
      state.subjectOwner.totals = {};
      state.subjectOwner.scopeExceptionTotals = {};
      state.subjectOwner.loadError = "";
      state.subjectOwner.selectedOpsPerson = "";
      renderQualityOptions();
      renderIssueInsights();
      renderCards(payload.totals || {});
      setCardsLoading(false);

      weeklyPromise.then((weeklyPayload) => {
        if (requestId !== state.cardsRequestId) return;
        state.weeklyAllRows = (weeklyPayload.rows || []).slice(0, WEEK_RANGE_SIZE);
        normalizeWeekRange();
        state.weeklyRows = selectedWeekRows(state.weeklyAllRows);
        state.gapSegments = weeklyPayload.gap_segments || [];
        renderWeekRangeFilter();
        renderCards(state.cardTotals || {});
      });
      return;
    }
    const ownerPromise = isSubjectOwner()
      ? api(`/api/subject-owner/workbench?${subjectOwnerWorkbenchParams().toString()}`).catch((error) => ({ ok: false, message: error.message }))
      : Promise.resolve(null);
    const [payload, ownerPayload] = await Promise.all([
      api(`/api/cards?${cardsParams().toString()}`),
      ownerPromise,
    ]);
    if (requestId !== state.cardsRequestId) return;
    state.cards = payload.rows || [];
    state.cardTotals = payload.totals || {};
    state.weeklyRows = [];
    state.weeklyAllRows = [];
    state.gapSegments = [];
    state.logisticsOptions = payload.logistics_options || [];
    state.qualityOptions = payload.quality_options || [];
    state.issueInsights = payload.issue_insights || [];
    if (ownerPayload) {
      if (ownerPayload.ok === false) {
        const message = `主体负责人工作台加载失败：${ownerPayload.message || "请稍后重试"}`;
        state.subjectOwner.opsRows = [];
        state.subjectOwner.subjectRows = [];
        state.subjectOwner.businessRows = [];
        state.subjectOwner.logisticsRows = [];
        state.subjectOwner.issueRows = [];
        state.subjectOwner.actionRows = [];
        state.subjectOwner.totals = {};
        state.subjectOwner.scopeExceptionTotals = {};
        state.subjectOwner.loadError = message;
        showToast(message);
      } else {
        state.subjectOwner.subjectRows = ownerPayload.subject_rows || [];
        state.subjectOwner.businessRows = ownerPayload.business_rows || [];
        state.subjectOwner.logisticsRows = ownerPayload.logistics_rows || [];
        state.subjectOwner.opsRows = ownerPayload.ops_rows || [];
        state.subjectOwner.selectedGranularity = ownerPayload.granularity || state.subjectOwner.selectedGranularity || "account_name";
        state.subjectOwner.granularityOptions = ownerPayload.granularity_options || state.subjectOwner.granularityOptions || [];
        applyCurrencyContext(ownerPayload);
        state.subjectOwner.issueRows = ownerPayload.issue_rows || [];
        state.subjectOwner.actionRows = ownerPayload.action_rows || [];
        state.subjectOwner.totals = ownerPayload.totals || {};
        state.subjectOwner.scopeExceptionTotals = ownerPayload.scope_exception_totals || {};
        state.subjectOwner.loadError = "";
      }
    } else {
      state.subjectOwner.opsRows = [];
      state.subjectOwner.subjectRows = [];
      state.subjectOwner.businessRows = [];
      state.subjectOwner.logisticsRows = [];
      state.subjectOwner.issueRows = [];
      state.subjectOwner.actionRows = [];
      state.subjectOwner.totals = {};
      state.subjectOwner.scopeExceptionTotals = {};
      state.subjectOwner.loadError = "";
      state.subjectOwner.selectedOpsPerson = "";
    }
    renderQualityOptions();
    renderIssueInsights();
    if (isSubjectOwner()) {
      renderKpis(state.summaryTotals || {});
    }
    renderCards(payload.totals || {});
  } finally {
    if (requestId === state.cardsRequestId) {
      setCardsLoading(false);
    }
  }
}

function setCardsLoading(isLoading) {
  els.detailPane.classList.toggle("loading", isLoading);
}

function renderManualIfOpen() {
  if (!els.manualPanel || els.manualPanel.hidden) return;
  renderManual();
}

function renderManual() {
  const role = currentRole();
  const manual = currentManual();
  els.manualTitle.textContent = `${roleName(role.role_code)}分析说明`;
  els.manualRoleSummary.textContent = manual.summary;
  els.manualSteps.innerHTML = manual.steps.map((item) => `<li>${htmlEscape(item)}</li>`).join("");
  els.manualNotes.innerHTML = manual.notes.map((item) => `<li>${htmlEscape(item)}</li>`).join("");
}

function openManual() {
  renderManual();
  els.manualPanel.hidden = false;
}

async function exportCards() {
  if (isReadonlyMirror() || isGlobalCoordinator()) {
    showToast("只读镜像不允许导出");
    return;
  }
  if (!state.user?.id) {
    showToast("请先选择用户");
    return;
  }
  const params = exportParams();
  els.exportBtn.disabled = true;
  try {
    await api(`/api/cards/export-tasks?${params.toString()}`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    showToast("导出任务已提交，完成后可在「我的导出」下载");
    await openExportPanel();
  } finally {
    els.exportBtn.disabled = false;
  }
}

const EXPORT_STATUS_LABELS = {
  queued: "排队中",
  running: "生成中",
  started: "生成中",
  success: "已完成",
  rejected: "已拒绝",
  failed: "失败",
};

function exportDownloadUrl(row) {
  const csv = [
    "export_id,status,row_count",
    `${row.export_id || "demo"},${row.status || "success"},${row.row_count ?? ""}`,
  ].join("\n");
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
}

function exportDownloadName(row) {
  return row.file_name || `OHC_EXPORT_${row.export_id || "DEMO"}.csv`;
}

function renderExportTasks() {
  if (!els.exportList) return;
  const rows = state.exportTasks || [];
  if (!rows.length) {
    els.exportList.innerHTML = `<div class="empty-state compact">暂无导出任务</div>`;
    return;
  }
  els.exportList.innerHTML = rows.map((row) => {
    const status = row.status || "queued";
    const label = EXPORT_STATUS_LABELS[status] || status;
    const message = row.reject_reason || row.error_message || "";
    const sizeText = row.file_size_bytes ? `${fmtNumber(Math.round(Number(row.file_size_bytes) / 1024))} KB` : "";
    const rowCountText = row.row_count === null || row.row_count === undefined ? "--" : fmtNumber(row.row_count);
    const limitText = row.row_limit === null || row.row_limit === undefined ? "" : ` / ${fmtNumber(row.row_limit)}`;
    return `<article class="export-task">
      <div class="export-task-head">
        <strong>${htmlEscape(row.file_name || `导出任务 #${row.export_id}`)}</strong>
        <span class="export-status ${htmlEscape(status)}">${htmlEscape(label)}</span>
      </div>
      <div class="export-task-meta">
        <span>提交 ${fmtDateTimeCn(row.created_at)}</span>
        <span>完成 ${fmtDateTimeCn(row.finished_at)}</span>
        <span>行数 ${rowCountText}${limitText}</span>
        ${sizeText ? `<span>${htmlEscape(sizeText)}</span>` : ""}
      </div>
      ${message ? `<div class="export-task-message">${htmlEscape(message)}</div>` : ""}
      <div class="export-task-actions">
        ${status === "success" ? `<a class="primary-btn" href="${htmlEscape(exportDownloadUrl(row))}" download="${htmlEscape(exportDownloadName(row))}">下载</a>` : ""}
      </div>
    </article>`;
  }).join("");
}

async function loadExportTasks() {
  if (!state.user?.id) return;
  const params = userParams();
  const payload = await api(`/api/cards/export-tasks?${params.toString()}`);
  state.exportTasks = payload.rows || [];
  renderExportTasks();
  const hasPending = state.exportTasks.some((row) => ["queued", "running", "started"].includes(row.status));
  if (hasPending && state.exportPanelOpen) startExportTaskPolling();
  if (!hasPending) stopExportTaskPolling();
}

function startExportTaskPolling() {
  if (state.exportTaskTimer) return;
  state.exportTaskTimer = window.setInterval(() => {
    if (!state.exportPanelOpen) {
      stopExportTaskPolling();
      return;
    }
    loadExportTasks().catch((error) => showToast(error.message));
  }, 5000);
}

function stopExportTaskPolling() {
  window.clearInterval(state.exportTaskTimer);
  state.exportTaskTimer = null;
}

async function openExportPanel() {
  if (isReadonlyMirror() || isGlobalCoordinator()) {
    showToast("只读镜像不允许导出");
    return;
  }
  state.exportPanelOpen = true;
  els.exportPanel.hidden = false;
  renderExportTasks();
  await loadExportTasks();
}

function closeExportPanel() {
  state.exportPanelOpen = false;
  els.exportPanel.hidden = true;
  stopExportTaskPolling();
}

function renderQualityOptions() {
  if (!els.qualityFilter) return;
  const current = els.qualityFilter.value;
  if (isLogistics()) {
    const options = [`<option value="">全部反馈类型</option>`].concat(
      (state.logistics.feedbackOptions || []).map((item) => `<option value="${htmlEscape(item.effective_feedback_type || "")}">${htmlEscape(item.effective_feedback_type || "空值")} (${fmtNumber(item.row_count)})</option>`)
    );
    els.qualityFilter.innerHTML = options.join("");
    els.qualityFilter.value = current;
    updateFilterPanel();
    return;
  }
  const options = [`<option value="">全部数据质量</option>`].concat(
    state.qualityOptions.map((item) => `<option value="${htmlEscape(item.data_quality_label || "")}">${htmlEscape(item.data_quality_label || "空值")} (${fmtNumber(item.row_count)})</option>`)
  );
  els.qualityFilter.innerHTML = options.join("");
  els.qualityFilter.value = current;
  updateFilterPanel();
}

function syncSortOptions() {
  if (!els.sortFilter?.options?.length) return;
  const mode = isLogistics() ? "logistics" : (isBusinessOps() ? "ops" : "default");
  const modeChanged = els.sortFilter.dataset.mode !== mode;
  if (modeChanged) {
    const optionsByMode = {
      logistics: [
        ["priority", "响应优先"],
        ["recoverable_desc", "挽回GMV优先"],
        ["requested_date_asc", "期望上架日优先"],
        ["tracking_desc", "物流更新优先"],
        ["feedback_pending", "待确认优先"],
      ],
      ops: [
        ["recovery_desc", "挽回优先"],
        ["gap_asc", "缺口日期优先"],
        ["eta_asc", "预计上架优先"],
        ["comment_desc", "最近留言优先"],
      ],
      default: [
        ["loss_desc", "损失优先"],
        ["gap_asc", "缺口日期优先"],
        ["eta_asc", "预计上架优先"],
        ["comment_desc", "最近留言优先"],
      ],
    };
    els.sortFilter.innerHTML = optionsByMode[mode]
      .map(([value, label]) => `<option value="${value}">${label}</option>`)
      .join("");
    els.sortFilter.dataset.mode = mode;
    if (els.qualityFilter) els.qualityFilter.value = "";
    if (els.onlyComments) els.onlyComments.checked = false;
  }
  if (els.qualityFilter) {
    els.qualityFilter.setAttribute("aria-label", isLogistics() ? "反馈类型" : "数据质量");
  }
  if (els.onlyCommentsLabel) {
    els.onlyCommentsLabel.textContent = isLogistics() ? "只看优先展示组" : "有留言";
  }
  if (els.opsActionFilter) {
    els.opsActionFilter.hidden = !isBusinessOps();
  }
  if (isLogistics()) return;
  const firstOption = els.sortFilter.options[0];
  if (isBusinessOps()) {
    firstOption.value = "recovery_desc";
    firstOption.textContent = "挽回优先";
    if (["loss_desc", "raw_loss_desc"].includes(els.sortFilter.value)) {
      els.sortFilter.value = "recovery_desc";
    }
    return;
  }
  firstOption.value = "loss_desc";
  firstOption.textContent = "损失优先";
  if (els.sortFilter.value === "recovery_desc") {
    els.sortFilter.value = "loss_desc";
  }
}

function qualityBadgeClass(label) {
  if (!label || label === "数据齐全") return "";
  if (label.includes("缺失") || label.includes("未分配")) return " warning";
  return " danger";
}

function renderIssueInsights() {
  const rows = state.issueInsights || [];
  if (isBusinessOps() || isSubjectOwner() || !rows.length) {
    els.issueInsights.hidden = true;
    els.issueInsights.innerHTML = "";
    return;
  }
  els.issueInsights.hidden = false;
  els.issueInsights.innerHTML = `<div class="issue-head">
      <div>
        <strong>主要问题</strong>
        <span>${isBusinessOps() ? "按当前链接的预期损失聚合" : "按当前筛选的加权损失聚合"}</span>
      </div>
    </div>
    <div class="issue-list">
      ${rows
    .map((row) => `<div class="issue-item">
        <div class="issue-main">
          <strong>${htmlEscape(row.issue_type || "未标记")}</strong>
          <span>${htmlEscape(row.weight_dimension || "--")} / ${htmlEscape(row.action_hint || "--")}</span>
        </div>
        <div class="issue-loss">${fmtMoney(row.weighted_expected_gmv_loss)}</div>
        <div class="issue-meta">
          <span>行 ${fmtNumber(row.row_count)}</span>
          <span>原始 ${fmtMoney(row.raw_expected_gmv_loss)}</span>
          <span>权重 ${fmtWeight(row.composite_weight)}</span>
          <span>首缺 ${fmtDate(row.first_gap_date)}</span>
        </div>
      </div>`)
    .join("")}
    </div>`;
}

function renderWeightChips(row) {
  const chips = [
    ["物流", row.logistics_urgency_weight],
    ["置信", row.confidence_weight],
    ["可行动", row.actionability_weight],
    ["状态", row.status_weight],
  ];
  return chips
    .map(([label, value]) => {
      const num = Number(value || 0);
      const cls = num >= 0.85 ? " strong" : num < 0.4 ? " weak" : "";
      return `<span class="weight-chip${cls}">${label} ${fmtWeight(value)}</span>`;
    })
    .join("");
}

function renderIssueBadges(row) {
  const badges = [];
  const quality = row.data_quality_label || "未标记";
  badges.push(`<span class="badge${qualityBadgeClass(quality)}">${htmlEscape(quality)}</span>`);
  if (row.price_status && row.price_status !== "已匹配售价") badges.push(`<span class="badge warning">${htmlEscape(row.price_status)}</span>`);
  if (row.stock_status_name === "清货中") badges.push(`<span class="badge warning">清货降权</span>`);
  if (row.stock_status_name === "不备货") badges.push(`<span class="badge danger">不备货</span>`);
  if (row.eta_shipment_status === "已取消") badges.push(`<span class="badge danger">货件已取消</span>`);
  if (Number(row.logistics_urgency_weight || 0) >= 0.9) badges.push(`<span class="badge warning">物流窗口临近</span>`);
  if (Number(row.actionability_weight || 1) < 0.5) badges.push(`<span class="badge warning">可行动性低</span>`);
  badges.push(`<span class="badge">权重${weightLevel(row.composite_weight)}</span>`);
  return badges.join("");
}

function riskLevelForSummary(row) {
  if (!row || Number(row.raw_expected_gmv_loss || row.weighted_expected_gmv_loss || 0) <= 0) return "暂无明显风险";
  if (!row.first_gap_date) return "待确认";
  const today = new Date();
  const firstGap = new Date(`${fmtDate(row.first_gap_date)}T00:00:00`);
  const days = Math.ceil((firstGap - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  if (days <= 0) return "已缺口";
  if (days <= 27) return "短期风险";
  if (days <= 55) return "中期风险";
  return "远期风险";
}

function peakRiskWeek(rows) {
  return (rows || []).reduce((best, row) => {
    const score = Number(row.gap_qty || 0) * Math.max(Number(row.demand_qty || 0), 1);
    const bestScore = best ? Number(best.gap_qty || 0) * Math.max(Number(best.demand_qty || 0), 1) : -1;
    return score > bestScore ? row : best;
  }, null);
}

function shipmentImpactText(row) {
  if (!row.first_gap_date) return "暂未形成明确缺口";
  return `${fmtDate(row.first_gap_date)} 起未来12周销售`;
}

function isoDateKey(value) {
  const text = fmtDate(value);
  return text === "--" ? "" : text;
}

function dateMs(value) {
  const key = isoDateKey(value);
  if (!key) return null;
  const parsed = new Date(`${key}T00:00:00`).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

function daysBetween(laterValue, earlierValue) {
  const later = dateMs(laterValue);
  const earlier = dateMs(earlierValue);
  if (later === null || earlier === null) return 0;
  return Math.max(0, Math.round((later - earlier) / 86400000));
}

function inclusiveDaysBetween(startValue, endValue) {
  const start = dateMs(startValue);
  const end = dateMs(endValue);
  if (start === null || end === null || end < start) return 0;
  return Math.round((end - start) / 86400000) + 1;
}

function weekIndexForDate(value, weeklyRows = state.weeklyRows) {
  const date = isoDateKey(value);
  if (!date) return -1;
  return (weeklyRows || []).findIndex((row) => {
    const startDate = isoDateKey(row.week_start);
    const endDate = isoDateKey(row.week_end);
    return startDate && endDate && startDate <= date && date <= endDate;
  });
}

function weekLabelForDate(value, weeklyRows = state.weeklyRows) {
  const index = weekIndexForDate(value, weeklyRows);
  if (index >= 0) {
    const row = weeklyRows[index];
    return row.week_label || fmtWeek(row.week_start);
  }
  return fmtWeek(value);
}

function gapSegmentRows(segments = state.gapSegments) {
  return (segments || [])
    .filter((segment) => Number(segment.gap_qty || 0) > 0)
    .map((segment, index) => ({ segment, index }));
}

function shipmentCoveredGapSegments(row, segments = state.gapSegments) {
  const recoverable = isBusinessOps() ? opsDisplayRecoverable(row) : Number(row.expected_recoverable_gmv || 0);
  const targetDate = isBusinessOps() ? opsDisplayTargetDate(row) : isoDateKey(row.recommended_putaway_date);
  const etaDate = isoDateKey(row.eta_putaway_date);
  if (recoverable <= 0 || !targetDate || !etaDate) return [];
  return gapSegmentRows(segments).filter(({ segment }) => {
    const startDate = isoDateKey(segment.start_date);
    const endDate = isoDateKey(segment.end_date);
    if (!startDate || !endDate) return false;
    return targetDate <= endDate && etaDate > startDate;
  });
}

function gapMatchesWeekIndices(matches, weeklyRows = state.weeklyRows) {
  const indices = new Set();
  (matches || []).forEach(({ segment }) => {
    const startDate = isoDateKey(segment.start_date);
    const endDate = isoDateKey(segment.end_date);
    if (!startDate || !endDate) return;
    (weeklyRows || []).forEach((week, index) => {
      const weekStart = isoDateKey(week.week_start);
      const weekEnd = isoDateKey(week.week_end);
      if (weekStart && weekEnd && startDate <= weekEnd && endDate >= weekStart) {
        indices.add(index);
      }
    });
  });
  return [...indices].sort((a, b) => a - b);
}

function gapSegmentLabel(match) {
  return `缺口${match.index + 1}`;
}

function compactGapLabels(matches) {
  const numbers = [...new Set(matches.map(({ index }) => index + 1))].sort((a, b) => a - b);
  const ranges = [];
  for (let cursor = 0; cursor < numbers.length; cursor += 1) {
    const start = numbers[cursor];
    let end = start;
    while (numbers[cursor + 1] === end + 1) {
      cursor += 1;
      end = numbers[cursor];
    }
    ranges.push(start === end ? `缺口${start}` : `缺口${start}-${end}`);
  }
  return ranges.join("、");
}

function shipmentCoveredWeekIndices(row, weeklyRows = state.weeklyRows, segments = state.gapSegments) {
  const matches = shipmentCoveredGapSegments(row, segments);
  return gapMatchesWeekIndices(matches, weeklyRows);
}

function opsEtaText(row) {
  const etaDate = isoDateKey(row.eta_putaway_date);
  if (!etaDate) return "--";
  return `${etaDate}（${weekLabelForDate(etaDate)}）`;
}

function opsLogisticsNextActionText(row) {
  if (!isoDateKey(row?.actual_foreign_clearance_date)) {
    return "建议动作：已到港未清关，物流催货代推进海外清关，并反馈预计放行时间。";
  }
  if (!isoDateKey(row?.actual_pickup_date)) {
    return "建议动作：清关已完成，物流催货代安排提取和末端派送，并反馈预计签收时间。";
  }
  if (!isoDateKey(row?.actual_signed_date)) {
    return "建议动作：已提取未签收，物流催货代跟进末端派送签收，并反馈预计签收时间。";
  }
  return "建议动作：当前到港后签收前节点已推进完毕，需刷新节点后再判断下一步动作。";
}

function opsActionabilityMeta(row) {
  const bucket = String(row?.logistics_intervention_bucket || "").trim();
  const owner = String(row?.action_owner || "none").trim();
  const nodeLabel = String(row?.current_node_stage_label || "").trim();
  const logisticsOwned = Number(row?.is_logistics_owned_action || 0) === 1 || owner === "first_leg_logistics";
  const opsOwned = Number(row?.is_ops_owned_action || 0) === 1 || owner === "business_ops";

  if (logisticsOwned && bucket === "signed_not_putaway_3pl") {
    return {
      bucket,
      owner,
      label: "第三方仓上架催办",
      badgeClass: "success",
      toneClass: "",
      nodeLabel,
      actionText: "建议动作：已签收未上架，目的仓为第三方仓，物流催海外仓服务商完成入库上架。",
      buttonLabel: "给物流留言",
      buttonTitle: "当前货件已签收未上架且目的仓为第三方仓，可给物流留言催海外仓服务商。",
      commentMode: "logistics_3pl",
      contactLabel: "对接物流人员",
      contactValue: null,
    };
  }
  if (logisticsOwned) {
    return {
      bucket,
      owner,
      label: "需物流协同",
      badgeClass: "success",
      toneClass: "",
      nodeLabel,
      actionText: opsLogisticsNextActionText(row),
      buttonLabel: "给物流留言",
      buttonTitle: "当前货件需要物流协同，可给物流留言催办未完成环节。",
      commentMode: "logistics_forwarder",
      contactLabel: "对接物流人员",
      contactValue: null,
    };
  }
  if (opsOwned || bucket === "signed_not_putaway_platform") {
    return {
      bucket,
      owner: "business_ops",
      label: "平台仓上架分流",
      badgeClass: "warning",
      toneClass: " handoff",
      nodeLabel,
      actionText: "建议动作：已签收未上架，目的仓为平台仓，由运营催店铺客服加紧上架。",
      buttonLabel: "记录上架分流",
      buttonTitle: "当前货件已签收未上架且目的仓为平台仓，由运营催店铺客服。",
      commentMode: "ops_platform_putaway",
      contactLabel: "处理建议",
      contactValue: "运营催店铺客服",
    };
  }
  if (bucket === "excluded_default_channel_can_cover") {
    return {
      bucket,
      owner: "none",
      label: "默认物流可覆盖",
      badgeClass: "",
      toneClass: " muted",
      nodeLabel,
      actionText: "预计到货可覆盖缺口，无需物流催办；运营按当前销售节奏观察。",
      buttonLabel: "查看留言",
      buttonTitle: "预计到货可覆盖缺口，无需物流催办；运营按当前销售节奏观察。",
      commentMode: "",
      contactLabel: "动作判断",
      contactValue: "建议运营调整销售节奏",
    };
  }
  if (bucket === "excluded_default_window_missing") {
    return {
      bucket,
      owner: "none",
      label: "默认窗口缺失",
      badgeClass: "warning",
      toneClass: " muted",
      nodeLabel,
      actionText: "建议动作：缺少默认物流窗口数据，先补齐口径后再判断是否催办。",
      buttonLabel: "查看留言",
      buttonTitle: "当前货件缺少默认物流窗口数据，先补齐口径后再判断销售节奏。",
      commentMode: "",
      contactLabel: "动作判断",
      contactValue: "先补窗口数据",
    };
  }
  if (bucket === "excluded_no_expected_loss") {
    return {
      bucket,
      owner: "none",
      label: "无预期损失",
      badgeClass: "",
      toneClass: " muted",
      nodeLabel,
      actionText: "建议动作：当前无预期 GMV 损失，不作为优先催办对象。",
      buttonLabel: "查看留言",
      buttonTitle: "当前货件无预期 GMV 损失，无需物流催办。",
      commentMode: "",
      contactLabel: "动作判断",
      contactValue: "无需催办",
    };
  }
  return {
    bucket: bucket || "excluded_no_action_space",
    owner: "none",
    label: "建议运营调整销售节奏",
    badgeClass: "",
    toneClass: " muted",
    nodeLabel,
    actionText: "建议动作：当前尚未进入物流可有效催办节点，建议运营调整销售节奏。",
    buttonLabel: "查看留言",
    buttonTitle: "当前节点无物流有效动作空间，建议运营调整销售节奏。",
    commentMode: "",
    contactLabel: "动作判断",
    contactValue: "建议运营调整销售节奏",
  };
}

function opsActionabilityBadges(row) {
  const meta = opsActionabilityMeta(row);
  if (meta.label === "需物流协同") return "";
  return `<span class="badge${meta.badgeClass ? ` ${meta.badgeClass}` : ""}">${htmlEscape(meta.label)}</span>`;
}

function opsActionRank(row) {
  const meta = opsActionabilityMeta(row);
  if (meta.owner === "first_leg_logistics") return 0;
  if (meta.owner === "business_ops") return 1;
  return 2;
}

function opsDisplayRecoverable(row) {
  const rowValue = Number(row.expected_recoverable_gmv || 0);
  return rowValue;
}

function opsDisplayTargetDate(row) {
  const rowTarget = isoDateKey(row.recommended_putaway_date);
  return rowTarget;
}

function opsDisplayAdvanceDays(row, targetDate) {
  const rowAdvance = Number(row.recommended_advance_days || 0);
  return rowAdvance || daysBetween(row.eta_putaway_date, targetDate);
}

function opsRowsForDisplay() {
  return state.cards
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const rankDiff = opsActionRank(a.row) - opsActionRank(b.row);
      if (rankDiff) return rankDiff;
      const recoverableDiff = opsDisplayRecoverable(b.row) - opsDisplayRecoverable(a.row);
      if (recoverableDiff) return recoverableDiff;
      const aDate = opsDisplayTargetDate(a.row) || isoDateKey(a.row.eta_putaway_date) || "9999-12-31";
      const bDate = opsDisplayTargetDate(b.row) || isoDateKey(b.row.eta_putaway_date) || "9999-12-31";
      if (aDate !== bDate) return aDate.localeCompare(bDate);
      return String(a.row.shipment_no || "").localeCompare(String(b.row.shipment_no || ""));
    });
}

function opsShipmentListTitle() {
  return "全部理论挽回货件";
}

function selectedSummaryNumber(field, fallback = 0) {
  const value = Number(state.selectedSummary?.[field]);
  return Number.isFinite(value) ? value : fallback;
}

function opsSelectedLinkRawLoss(fallback = 0) {
  return selectedSummaryNumber("raw_expected_gmv_loss", fallback);
}

function opsSelectedLinkShipmentCount(fallback = 0) {
  return selectedSummaryNumber("shipment_count", fallback);
}

function opsShipmentListCountText(totals) {
  const filteredCount = Number(totals?.shipment_count || 0);
  const totalCount = opsSelectedLinkShipmentCount(filteredCount);
  return `全部 ${fmtNumber(filteredCount || totalCount)} 票`;
}

function opsShipmentEmptyText(totals) {
  return "暂无可展示货件";
}

function opsDaysAfterText(days) {
  if (days === null || days === undefined || !Number.isFinite(Number(days))) return "--";
  const safeDays = Math.max(0, Math.round(Number(days)));
  return safeDays === 0 ? "今天" : `${fmtNumber(safeDays, 0)} 天后`;
}

function opsStageBaseline(row, nodes) {
  const lastDoneIndex = nodes.reduce((last, node, index) => (node.status === "done" ? index : last), -1);
  const lastDone = lastDoneIndex >= 0 ? nodes[lastDoneIndex] : null;
  const nextNode = nodes.find((node, index) => index > lastDoneIndex && node.status !== "done") || null;
  return {
    lastDoneIndex,
    lastDone,
    nextNode,
    baselineDate: lastDone?.date || logisticsTodayKey(),
  };
}

function opsNonnegativeSignedDays(laterValue, earlierValue) {
  const days = logisticsSignedDays(laterValue, earlierValue);
  return days === null ? null : Math.max(0, days);
}

function opsShipmentTimelineContext(row) {
  const nodes = logisticsTimelineNodes(row);
  const stage = opsStageBaseline(row, nodes);
  const putawayNode = nodes.find((node) => node.name === "上架");
  const etaDate = isoDateKey(row.eta_putaway_date) || putawayNode?.date || "";
  const targetDate = isoDateKey(row.first_gap_date) || opsDisplayTargetDate(row);
  const etaDays = opsNonnegativeSignedDays(etaDate, stage.baselineDate);
  const backendAdvanceDays = Math.max(0, Math.round(opsDisplayAdvanceDays(row, targetDate) || 0));
  const targetDaysByDate = opsNonnegativeSignedDays(targetDate, stage.baselineDate);
  const targetDaysFromToday = opsNonnegativeSignedDays(targetDate, logisticsTodayKey());
  const requestedDays = targetDaysFromToday !== null
    ? targetDaysFromToday
    : (etaDays !== null && backendAdvanceDays > 0 ? Math.max(0, etaDays - backendAdvanceDays) : targetDaysByDate);
  const advanceDays = etaDays !== null && requestedDays !== null
    ? Math.max(0, etaDays - requestedDays)
    : backendAdvanceDays;
  const progressPrefix = stage.lastDone
    ? `${logisticsShortDate(stage.lastDone.date)} 已${stage.lastDone.name}`
    : logisticsTimelineCurrentText(nodes);
  const progressEtaText = etaDate
    ? `预计 ${opsDaysAfterText(etaDays)}上架`
    : "预计上架待确认";
  const progressText = `${progressPrefix}，${progressEtaText}`;
  const needText = targetDate && opsDisplayRecoverable(row) > 0
    ? `需 ${opsDaysAfterText(requestedDays)}上架，比当前预计提前 ${fmtNumber(advanceDays, 0)} 天`
    : "暂无明确挽回上架需求";
  return {
    nodes,
    ...stage,
    etaDate,
    targetDate,
    etaDays,
    advanceDays,
    requestedDays,
    progressPrefix,
    progressEtaText,
    progressText,
    needText,
    currentText: logisticsTimelineCurrentText(nodes),
  };
}

function opsLogisticsJudgement(row, context, actionability) {
  const status = row.logistics_advance_status || "unconfirmed";
  const meta = logisticsAdvanceStatusMeta(status);
  if (status === "satisfied" || status === "unsatisfied") {
    return {
      text: `按需提前 ${fmtNumber(context.advanceDays, 0)} 天${meta.label}`,
      className: meta.className,
    };
  }
  if (actionability.owner === "first_leg_logistics") {
    return { text: "待物流填写", className: "pending" };
  }
  if (context.lastDoneIndex < 3) {
    return { text: "系统判断：未到港，建议运营调整销售节奏", className: "muted" };
  }
  if (actionability.owner === "business_ops") {
    return { text: "系统判断：平台仓由运营推进", className: "handoff" };
  }
  if (actionability.bucket === "excluded_default_channel_can_cover") {
    return { text: "预计到货可覆盖缺口，无需物流催办；运营按当前销售节奏观察。", className: "muted" };
  }
  if (actionability.bucket === "excluded_default_window_missing") {
    return { text: "系统判断：待补默认物流窗口", className: "handoff" };
  }
  if (actionability.bucket === "excluded_no_expected_loss") {
    return { text: "系统判断：无预期损失，建议运营调整销售节奏", className: "muted" };
  }
  return { text: "系统判断：建议运营调整销售节奏", className: "muted" };
}

function renderOpsJudgementRows(row, actionability) {
  const context = opsShipmentTimelineContext(row);
  const judgement = opsLogisticsJudgement(row, context, actionability);
  const rows = [
    ["货件进度", context.progressText, "progress"],
    ["挽回GMV的需求", context.needText, "need"],
    ["物流判断", judgement.text, judgement.className],
  ];
  return rows.map(([label, value, className]) => {
    const valueHtml = className === "progress"
      ? `<strong class="ops-progress-lines"><span>${htmlEscape(context.progressPrefix)}</span><span class="ops-progress-eta">${htmlEscape(context.progressEtaText)}</span></strong>`
      : `<strong>${htmlEscape(value)}</strong>`;
    return `
    <div class="ops-judgement-line ${className}">
      <span>${htmlEscape(label)}</span>
      ${valueHtml}
    </div>
  `;
  }).join("");
}

function opsShipmentActionLines(row) {
  const recoverable = opsDisplayRecoverable(row);
  const targetDate = opsDisplayTargetDate(row);
  const meta = opsActionabilityMeta(row);
  if (recoverable <= 0 || !targetDate) {
    return [row.recovery_action_text || "暂无明确提前建议", meta.actionText];
  }
  const coveredSegments = shipmentCoveredGapSegments(row);
  const advanceDays = opsDisplayAdvanceDays(row, targetDate);
  const lines = [`理论目标：提前${fmtNumber(advanceDays, 0)}天至 ${targetDate} 上架。`];
  if (coveredSegments.length) {
    lines.push(`可覆盖${compactGapLabels(coveredSegments)}。`);
  }
  lines.push(meta.actionText);
  return lines;
}

function logisticsCommentPrefill(row) {
  const recoverable = opsDisplayRecoverable(row);
  const targetDate = opsDisplayTargetDate(row);
  if (recoverable <= 0 || !targetDate) return "";
  const meta = opsActionabilityMeta(row);
  if (meta.commentMode === "logistics_forwarder" || meta.commentMode === "logistics_3pl") {
    return [
      `【运营物流协同】货件 ${row.shipment_no || "--"}`,
      `理论目标上架日：${targetDate}`,
      meta.actionText,
      "请反馈最早可上架时间、当前阻塞点和下一步预计完成时间。",
    ].join("\n");
  }
  if (meta.commentMode === "ops_platform_putaway") {
    return [
      `【平台仓上架分流】货件 ${row.shipment_no || "--"}`,
      `理论目标上架日：${targetDate}`,
      meta.actionText,
      "请记录店铺客服反馈、预计上架时间或无法推进原因。",
    ].join("\n");
  }
  return "";
}

function weeklyTooltipText(row) {
  const label = row.week_label || fmtWeek(row.week_start);
  return [
    `${label}（${fmtDate(row.week_start)} 至 ${fmtDate(row.week_end)}）`,
    `周末库存：${fmtNumber(row.week_end_inventory_qty, 0)}`,
    `周缺口：${fmtNumber(row.gap_qty, 0)}`,
    `周入库：${fmtNumber(row.inbound_qty, 0)}`,
    `周需求：${fmtNumber(row.demand_qty, 0)}`,
  ].join("\n");
}

function ownerPrimaryGapMatch(row, segments = state.gapSegments) {
  const rows = gapSegmentRows(segments);
  if (!rows.length) {
    const firstGapDate = isoDateKey(row?.first_gap_date);
    if (!firstGapDate) return null;
    return {
      index: 0,
      inferred: true,
      segment: {
        start_date: firstGapDate,
        end_date: firstGapDate,
        duration_days: 1,
        gap_qty: row?.allocated_lost_qty_total_12w || row?.lost_qty_total_12w || 0,
        raw_expected_gmv_loss: row?.allocated_raw_expected_gmv_loss || 0,
      },
    };
  }
  const targetDates = [row?.first_gap_date, row?.recommended_putaway_date, row?.eta_putaway_date]
    .map((value) => isoDateKey(value))
    .filter(Boolean);
  for (const targetDate of targetDates) {
    const inWindow = rows.find(({ segment }) => {
      const startDate = isoDateKey(segment.start_date);
      const endDate = isoDateKey(segment.end_date);
      return startDate && endDate && startDate <= targetDate && targetDate <= endDate;
    });
    if (inWindow) return inWindow;
    const nextWindow = rows.find(({ segment }) => {
      const endDate = isoDateKey(segment.end_date);
      return endDate && targetDate <= endDate;
    });
    if (nextWindow) return nextWindow;
  }
  return rows[0];
}

function ownerShipmentJudgement(row, weeklyRows = state.weeklyRows, segments = state.gapSegments) {
  const currentRow = row || {};
  const etaDate = isoDateKey(currentRow.eta_putaway_date);
  const logisticsPerson = personText(currentRow.first_leg_logistics_people || currentRow.contact_display_name);
  const primaryGap = ownerPrimaryGapMatch(currentRow, segments);
  const etaText = etaDate ? `${etaDate}（${weekLabelForDate(etaDate, weeklyRows)}）` : "--";
  if (!primaryGap) {
    return {
      level: "neutral",
      primaryGap: null,
      gapWindow: "当前链接 12 周内暂无连续缺口",
      etaText,
      logisticsPerson,
      judgement: "当前货件暂未对应连续缺口，可先作为观察记录。",
      action: "建议核查运营是否确认暂不跟进；如仍认为有风险，再补充业务原因。",
      conclusion: etaDate
        ? `当前货件预计 ${etaDate} 上架，但当前链接 12 周内暂无连续缺口。`
        : "当前货件暂无 ETA，且当前链接 12 周内暂无连续缺口。",
    };
  }
  const { segment } = primaryGap;
  const startDate = isoDateKey(segment.start_date);
  const endDate = isoDateKey(segment.end_date);
  const gapLabel = gapSegmentLabel(primaryGap);
  const inferredGap = Boolean(primaryGap.inferred);
  const gapWindow = inferredGap ? `缺口窗口：${fmtDate(startDate)} 起` : `${gapLabel}：${fmtDate(startDate)} 至 ${fmtDate(endDate)}`;
  const gapStartName = inferredGap ? "缺口开始" : `${gapLabel}开始`;
  const gapEndName = inferredGap ? "缺口开始" : `${gapLabel}结束`;
  if (!etaDate || !startDate || !endDate) {
    return {
      level: "missing",
      primaryGap,
      gapWindow,
      etaText,
      logisticsPerson,
      judgement: "当前货件缺少 ETA，暂无法判断是否能覆盖该缺口窗口。",
      action: "建议先核查 ETA 或最早可上架时间；补齐后再判断是否需要继续跟进。",
      conclusion: `当前货件暂无 ETA，需先补齐最早上架时间，才能判断是否覆盖${inferredGap ? "该缺口窗口" : gapLabel}。`,
    };
  }
  if (etaDate > endDate) {
    const lateDays = daysBetween(etaDate, endDate);
    return {
      level: "late",
      primaryGap,
      gapWindow,
      etaText,
      logisticsPerson,
      judgement: `当前 ETA 晚于${gapEndName} ${fmtNumber(lateDays, 0)} 天，仅靠该货件较难覆盖该缺口。`,
      action: "建议核查运营是否已有替代货件、调拨、控销或接受损失等说明。",
      conclusion: `当前货件预计 ${etaDate} 上架，晚于${gapEndName}日 ${endDate}，不能单独闭环该缺口。`,
    };
  }
  if (etaDate >= startDate) {
    return {
      level: "aligned",
      primaryGap,
      gapWindow,
      etaText,
      logisticsPerson,
      judgement: `当前 ETA 落在${inferredGap ? "缺口开始日" : `${gapLabel}窗口内`}，可作为覆盖缺口的候选货件。`,
      action: "建议核查运营是否确认数量和实际上架可覆盖，确认后可降低后续跟进优先级。",
      conclusion: `当前货件预计 ${etaDate} 上架，落在${inferredGap ? "缺口开始日" : `${gapLabel}窗口内`}，需要确认能否实际闭环。`,
    };
  }
  const earlyDays = daysBetween(startDate, etaDate);
  return {
    level: "early",
    primaryGap,
    gapWindow,
    etaText,
    logisticsPerson,
    judgement: `当前 ETA 早于${gapStartName} ${fmtNumber(earlyDays, 0)} 天，可作为闭环候选货件。`,
    action: "建议核查运营是否已确认该货件可覆盖缺口；如已确认，可记录为风险已解释。",
    conclusion: `当前货件预计 ${etaDate} 上架，早于${gapStartName}日 ${startDate}，可作为闭环该缺口的优先核查对象。`,
  };
}

function renderOwnerShipmentJudgement(row, weeklyRows = state.weeklyRows, segments = state.gapSegments) {
  const judgement = ownerShipmentJudgement(row, weeklyRows, segments);
  return `<div class="owner-judgement-lines">
    <div class="owner-judgement-line"><span>缺口窗口</span><strong>${htmlEscape(judgement.gapWindow)}</strong></div>
    <div class="owner-judgement-line"><span>当前 ETA</span><strong>${htmlEscape(judgement.etaText)}</strong></div>
    <div class="owner-judgement-line"><span>对应物流</span><strong>${htmlEscape(judgement.logisticsPerson)}</strong></div>
    <div class="owner-judgement-callout is-${htmlEscape(judgement.level)}">${htmlEscape(judgement.judgement)}</div>
    <div class="owner-judgement-line"><span>核查建议</span><strong>${htmlEscape(judgement.action)}</strong></div>
  </div>`;
}

function renderOwnerCurrentShipmentConclusion(judgement) {
  return `<div class="owner-current-conclusion is-${htmlEscape(judgement.level)}">
    <strong>当前货件核查判断</strong>
    <span>${htmlEscape(judgement.conclusion)}</span>
  </div>`;
}

function renderGapConclusion(segments, options = {}) {
  const rows = gapSegmentRows(segments);
  const highlightGapIndices = new Set((options.highlightGapIndices || []).map((index) => String(index)));
  if (!rows.length) {
    return `<div class="gap-conclusion-empty">当前 12 周内未识别到连续缺口。</div>`;
  }
  return `<div class="gap-conclusion-list">
    ${rows.map(({ segment, index }) => {
    const durationDays = Math.max(Number(segment.duration_days || 0), inclusiveDaysBetween(segment.start_date, segment.end_date));
    const text = `缺口${index + 1}：${fmtDate(segment.start_date)} 至 ${fmtDate(segment.end_date)}，持续 ${fmtNumber(durationDays, 0)} 天，缺口 ${fmtNumber(segment.gap_qty, 0)} 件，预期损失 ${fmtMoney(segment.raw_expected_gmv_loss)}；`;
    return `<p class="${highlightGapIndices.has(String(index)) ? "is-linked-highlight" : ""}" data-gap-index="${index}" title="${htmlEscape(text)}">${text}</p>`;
  }).join("")}
  </div>`;
}

function renderWeeklyChart(rows, options = {}) {
  const data = (rows || []).slice(0, 12);
  if (!data.length) {
    return `<div class="empty-state compact">暂无周度推演数据</div>`;
  }
  const coverWeekIndices = new Set((options.coverWeekIndices || []).map((index) => Number(index)).filter((index) => Number.isInteger(index) && index >= 0));
  const etaWeekIndex = Number.isInteger(Number(options.etaWeekIndex)) ? Number(options.etaWeekIndex) : -1;
  const width = 900;
  const height = 340;
  const padX = 110;
  const plotW = width - padX - 28;
  const step = data.length > 1 ? plotW / (data.length - 1) : plotW;
  const topZero = 110;
  const topTop = 18;
  const topBottom = 148;
  const flowZero = 248;
  const flowTop = 172;
  const flowBottom = 306;
  const maxInventory = Math.max(...data.map((row) => Math.max(Number(row.week_end_inventory_qty || 0), 0)), 1);
  const maxGap = Math.max(...data.map((row) => Math.max(Number(row.gap_qty || 0), 0)), 1);
  const maxFlow = Math.max(...data.map((row) => Math.max(Number(row.inbound_qty || 0), Number(row.demand_qty || 0))), 1);
  const topScale = (topZero - topTop) / maxInventory;
  const gapScale = (topBottom - topZero) / maxGap;
  const flowUpScale = (flowZero - flowTop) / maxFlow;
  const flowDownScale = (flowBottom - flowZero) / maxFlow;
  const xAt = (index) => padX + index * step;
  const invPoints = data
    .map((row, index) => `${xAt(index).toFixed(1)},${Math.max(topTop, topZero - Number(row.week_end_inventory_qty || 0) * topScale).toFixed(1)}`)
    .join(" ");
  const gapBars = data.map((row, index) => {
    const value = Math.max(Number(row.gap_qty || 0), 0);
    if (!value) return "";
    const barW = Math.max(16, step * 0.94);
    return `<rect class="chart-gap" x="${(xAt(index) - barW / 2).toFixed(1)}" y="${topZero}" width="${barW.toFixed(1)}" height="${Math.max(2, value * gapScale).toFixed(1)}" rx="2"></rect>`;
  }).join("");
  const flowBars = data.map((row, index) => {
    const inbound = Math.max(Number(row.inbound_qty || 0), 0);
    const demand = Math.max(Number(row.demand_qty || 0), 0);
    const barW = Math.max(16, step * 0.94);
    const x = xAt(index);
    const inboundH = Math.max(inbound ? 2 : 0, inbound * flowUpScale);
    const demandH = Math.max(demand ? 2 : 0, demand * flowDownScale);
    const inboundClass = `chart-inbound${index === etaWeekIndex ? " is-inbound-focus is-current-eta" : ""}`;
    return `
      <rect class="${inboundClass}" data-week-index="${index}" x="${(x - barW / 2).toFixed(1)}" y="${(flowZero - inboundH).toFixed(1)}" width="${barW.toFixed(1)}" height="${inboundH.toFixed(1)}" rx="3"></rect>
      <rect class="chart-demand" x="${(x - barW / 2).toFixed(1)}" y="${flowZero}" width="${barW.toFixed(1)}" height="${demandH.toFixed(1)}" rx="3"></rect>
    `;
  }).join("");
  const labels = data.map((row, index) => {
    const x = xAt(index);
    return `<text class="chart-x" x="${x.toFixed(1)}" y="330" text-anchor="middle">${htmlEscape(row.week_label || fmtWeek(row.week_start))}</text>`;
  }).join("");
  const points = data.map((row, index) => {
    const x = xAt(index);
    const y = Math.max(topTop, topZero - Number(row.week_end_inventory_qty || 0) * topScale);
    return `<circle class="chart-point" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"></circle>`;
  }).join("");
  const hitRects = data.map((row, index) => {
    const hitW = Math.max(42, step * 0.94);
    return `<rect class="chart-hit" data-week-index="${index}" x="${(xAt(index) - hitW / 2).toFixed(1)}" y="${topTop}" width="${hitW.toFixed(1)}" height="${(flowBottom - topTop).toFixed(1)}">
      <title>${htmlEscape(weeklyTooltipText(row))}</title>
    </rect>`;
  }).join("");
  const weekHighlightRects = data.map((row, index) => {
    const hitW = Math.max(42, step * 0.94);
    const highlightClass = `chart-week-cover-highlight${coverWeekIndices.has(index) ? " is-linked-highlight" : ""}`;
    return `<rect class="${highlightClass}" data-cover-week-index="${index}" x="${(xAt(index) - hitW / 2).toFixed(1)}" y="${(topTop - 4).toFixed(1)}" width="${hitW.toFixed(1)}" height="${(flowBottom - topTop + 12).toFixed(1)}" rx="5"></rect>`;
  }).join("");
  const etaMarker = etaWeekIndex >= 0 && etaWeekIndex < data.length
    ? (() => {
      const etaX = xAt(etaWeekIndex);
      const nearLeft = etaX < padX + 96;
      const nearRight = etaX > width - 126;
      const labelX = nearLeft ? etaX + 8 : (nearRight ? etaX - 8 : etaX);
      const anchor = nearLeft ? "start" : (nearRight ? "end" : "middle");
      const label = options.etaMarkerText || "当前货件 ETA";
      return `<line class="chart-current-eta-line" x1="${etaX.toFixed(1)}" y1="${(topTop - 4).toFixed(1)}" x2="${etaX.toFixed(1)}" y2="${(flowBottom + 4).toFixed(1)}"></line>
        <text class="chart-current-eta-label" x="${labelX.toFixed(1)}" y="${(topTop + 13).toFixed(1)}" text-anchor="${anchor}">${htmlEscape(label)}</text>`;
    })()
    : "";
  return `
    <svg class="weekly-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="按周风险概览" data-weekly-json="${htmlEscape(JSON.stringify(data))}">
      <text class="chart-axis-title" x="10" y="18">周末库存 / 周缺口</text>
      <line class="chart-grid strong" x1="${padX}" y1="${topZero}" x2="${width - 20}" y2="${topZero}"></line>
      <line class="chart-grid" x1="${padX}" y1="${topTop}" x2="${width - 20}" y2="${topTop}"></line>
      <line class="chart-grid" x1="${padX}" y1="${topBottom}" x2="${width - 20}" y2="${topBottom}"></line>
      ${gapBars}
      <polyline class="chart-inventory-line" points="${invPoints}"></polyline>
      ${points}
      <text class="chart-axis-title" x="10" y="164">周进销变动</text>
      <line class="chart-grid strong" x1="${padX}" y1="${flowZero}" x2="${width - 20}" y2="${flowZero}"></line>
      <line class="chart-grid" x1="${padX}" y1="${flowTop}" x2="${width - 20}" y2="${flowTop}"></line>
      <line class="chart-grid" x1="${padX}" y1="${flowBottom}" x2="${width - 20}" y2="${flowBottom}"></line>
      ${flowBars}
      ${weekHighlightRects}
      ${etaMarker}
      ${labels}
      ${hitRects}
    </svg>
    <div class="chart-tooltip" hidden></div>
  `;
}

function renderWeeklyChartLegend() {
  return `<div class="chart-legend">
    <span><i class="legend-line"></i>周末库存</span>
    <span><i class="legend-gap"></i>周缺口</span>
    <span><i class="legend-inbound"></i>周入库</span>
    <span><i class="legend-demand"></i>周需求</span>
  </div>`;
}

function bindWeeklyTooltips(root = els.linkOverview) {
  root?.querySelectorAll(".weekly-panel").forEach((panel) => {
    const tooltip = panel.querySelector(".chart-tooltip");
    if (!tooltip) return;
    let scopedRows = [];
    try {
      scopedRows = JSON.parse(panel.querySelector(".weekly-svg")?.dataset.weeklyJson || "[]");
    } catch {
      scopedRows = [];
    }
    panel.querySelectorAll(".chart-hit").forEach((hit) => {
      hit.addEventListener("mousemove", (event) => {
        const row = scopedRows[Number(hit.dataset.weekIndex)] || state.weeklyRows[Number(hit.dataset.weekIndex)];
        if (!row) return;
        tooltip.textContent = weeklyTooltipText(row);
        tooltip.hidden = false;
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 12;
        let left = event.clientX + margin;
        let top = event.clientY + margin;
        if (left + tooltipRect.width + margin > window.innerWidth) {
          left = event.clientX - tooltipRect.width - margin;
        }
        if (top + tooltipRect.height + margin > window.innerHeight) {
          top = event.clientY - tooltipRect.height - margin;
        }
        left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));
        top = Math.max(margin, Math.min(top, window.innerHeight - tooltipRect.height - margin));
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });
      hit.addEventListener("mouseleave", () => {
        tooltip.hidden = true;
      });
    });
  });
}

function renderLinkOverview(totals) {
  if (!isBusinessOps() || !state.selectedSummary) {
    els.linkOverview.hidden = true;
    els.linkOverview.innerHTML = "";
    return;
  }
  const summary = state.selectedSummary;
  const cards = state.cards || [];
  const planner = uniqueJoined(cards, "supply_planner_people");
  const salesLink = summary.summary_label || summary.summary_key || "当前链接";
  const productName = summary.product_chinese_name || uniqueValues(cards, "product_chinese_name", "未匹配产品中文名");
  const linkRawLoss = opsSelectedLinkRawLoss(Number(totals?.raw_expected_gmv_loss || 0));
  const timelineRow = cards.find((row) => String(row.shipment_no || "") === state.opsTimelineShipmentNo);
  const timelineFreightClass = timelineRow ? logisticsFreightClass(timelineRow.freight_type_name) : "";
  const timelineOverlay = timelineRow ? `
    <div class="ops-timeline-overlay ${timelineFreightClass}">
      <button class="ghost-btn ops-timeline-close" type="button" data-ops-timeline-close>收起</button>
      ${renderLogisticsTimeline(timelineRow, logisticsTimelineNodes(timelineRow))}
    </div>
  ` : "";
  const basicRows = [
    ["系统SKU", uniqueValues(cards, "system_sku")],
    ["国家", uniqueValues(cards, "logistics_country_cn")],
    ["店铺名称", uniqueValues(cards, "account_name")],
    ["售价", `${fmtMoney(cards[0]?.gmv_unit_price_rmb)}`],
    ["主体", uniqueValues(cards, "subject_no", summary.subject_no || "--")],
    ["计划员", planner],
  ];
  els.linkOverview.hidden = false;
  els.linkOverview.innerHTML = `
    <div class="link-story-head">
      <div>
        <h2 class="step-title">② 链接整体衔接</h2>
      </div>
      <div class="story-loss">
        <span>预期GMV损失</span>
        <strong>${fmtMoney(linkRawLoss)}</strong>
      </div>
    </div>
    <div class="link-overview-stack">
      <section class="basic-panel">
        <div class="subsection-head">
          <strong>基础信息</strong>
          <span>当前链接的跨角色对接面</span>
        </div>
        <div class="basic-grid">
          <div class="basic-grid-wide"><span>销售链接</span><strong title="${htmlEscape(salesLink)}">${htmlEscape(salesLink)}</strong></div>
          <div class="basic-grid-wide"><span>产品中文名</span><strong title="${htmlEscape(productName)}">${htmlEscape(productName)}</strong></div>
          ${basicRows.map(([label, value]) => `<div><span>${htmlEscape(label)}</span><strong>${htmlEscape(value)}</strong></div>`).join("")}
        </div>
      </section>
      <section class="weekly-panel">
        <div class="subsection-head">
          <strong>按周风险概览</strong>
          ${renderWeeklyChartLegend()}
        </div>
        ${renderWeeklyChart(state.weeklyRows)}
      </section>
      <section class="conclusion-panel">
        <div class="subsection-head">
          <strong>衔接结论</strong>
        </div>
        ${renderGapConclusion(state.gapSegments)}
      </section>
    </div>
    ${timelineOverlay}
  `;
  bindWeeklyTooltips();
}

function renderOwnerLinkOverview(detail) {
  if (!detail) return "";
  if (detail.loading) {
    const loadingRow = detail.row || {};
    const loadingSummary = detail.summary || {};
    const loadingSalesLink = loadingSummary.summary_label || loadingSummary.summary_key || loadingRow.sales_link || "当前链接";
    const loadingProductName = loadingSummary.product_chinese_name || loadingRow.product_chinese_name || "加载中";
    return `
      <section class="owner-link-detail">
        <div class="owner-link-detail-head">
          <div>
            <strong title="${htmlEscape(loadingSalesLink)}">${htmlEscape(loadingSalesLink)}</strong>
            <span title="${htmlEscape(loadingProductName)}">${htmlEscape(loadingProductName)}</span>
          </div>
        </div>
        <div class="empty-state compact">链接衔接数据加载中...</div>
      </section>
    `;
  }
  const cards = detail.cards || [];
  const sourceCards = cards.length ? cards : [detail.row || {}];
  const currentRow = detail.row || sourceCards[0] || {};
  const weeklyRows = detail.weeklyRows || [];
  const gapSegments = detail.gapSegments || [];
  const summary = detail.summary || {};
  const totals = detail.totals || {};
  const planner = uniqueJoined(sourceCards, "supply_planner_people");
  const currentLogistics = personText(currentRow.first_leg_logistics_people || currentRow.contact_display_name);
  const salesLink = summary.summary_label || summary.summary_key || sourceCards[0]?.sales_link || "当前链接";
  const productName = summary.product_chinese_name || uniqueValues(sourceCards, "product_chinese_name", "未匹配产品中文名");
  const currentJudgement = ownerShipmentJudgement(currentRow, weeklyRows, gapSegments);
  const coveredGapMatches = shipmentCoveredGapSegments(currentRow, gapSegments);
  const primaryGapMatches = currentJudgement.primaryGap ? [currentJudgement.primaryGap] : [];
  const highlightMatches = coveredGapMatches.length ? coveredGapMatches : primaryGapMatches;
  const highlightGapIndices = [...new Set(highlightMatches.map(({ index }) => index))];
  const highlightWeekIndices = gapMatchesWeekIndices(highlightMatches, weeklyRows);
  const etaWeekIndex = weekIndexForDate(currentRow.eta_putaway_date, weeklyRows);
  const basicRows = [
    ["系统SKU", uniqueValues(sourceCards, "system_sku")],
    ["国家", uniqueValues(sourceCards, "logistics_country_cn")],
    ["店铺名称", uniqueValues(sourceCards, "account_name")],
    ["售价", `${fmtMoney(sourceCards[0]?.gmv_unit_price_rmb)}`],
    ["主体", uniqueValues(sourceCards, "subject_no", sourceCards[0]?.subject_no || "--")],
    ["计划员", planner],
    ["当前货件物流", currentLogistics],
  ];
  return `
    <section class="owner-link-detail">
      <div class="owner-link-detail-head">
        <div>
          <strong title="${htmlEscape(salesLink)}">${htmlEscape(salesLink)}</strong>
          <span title="${htmlEscape(productName)}">${htmlEscape(productName)}</span>
        </div>
      </div>
      <div class="link-overview-stack compact">
        <section class="basic-panel">
          <div class="subsection-head">
            <strong>基础信息</strong>
            <span>当前链接的跨角色对接面</span>
          </div>
          <div class="basic-grid owner-basic-grid">
            ${basicRows.map(([label, value]) => `<div><span>${htmlEscape(label)}</span><strong>${htmlEscape(value)}</strong></div>`).join("")}
          </div>
        </section>
        <section class="weekly-panel">
          <div class="subsection-head">
            <strong>按周风险概览</strong>
            ${renderWeeklyChartLegend()}
          </div>
          ${renderWeeklyChart(weeklyRows, {
            coverWeekIndices: highlightWeekIndices,
            etaWeekIndex,
            etaMarkerText: "当前货件 ETA",
          })}
        </section>
        <section class="conclusion-panel">
          <div class="subsection-head">
            <strong>衔接结论</strong>
          </div>
          ${renderOwnerCurrentShipmentConclusion(currentJudgement)}
          ${renderGapConclusion(gapSegments, { highlightGapIndices })}
        </section>
      </div>
    </section>
  `;
}

function ownerLinkSummaryFromRow(row) {
  return {
    home_grain: "sales_link",
    summary_key: row.sales_link || "",
    summary_label: row.sales_link || "",
    product_chinese_name: row.product_chinese_name || "",
  };
}

async function openOwnerLinkDetail(row) {
  if (!row?.sales_link) {
    showToast("该行没有销售链接，暂不能查看链接衔接");
    return;
  }
  const previousDetail = state.subjectOwner.linkDetail;
  state.subjectOwner.linkDetail = {
    loading: true,
    row,
    summary: ownerLinkSummaryFromRow(row),
    cards: [],
    weeklyRows: [],
    gapSegments: [],
    totals: {},
  };
  renderSubjectOwnerOpsDistribution();
  const params = appendSubjectFilterParams(userParams());
  params.set("home_grain", "sales_link");
  params.set("summary_key", row.sales_link);
  params.set("limit", "500");
  params.set("sort", "loss_desc");
  const weeklyParams = new URLSearchParams(params);
  try {
    const [cardsPayload, weeklyPayload] = await Promise.all([
      api(`/api/cards?${params.toString()}`),
      api(`/api/link-weekly?${weeklyParams.toString()}`).catch(() => ({ rows: [], gap_segments: [] })),
    ]);
    state.subjectOwner.linkDetail = {
      loading: false,
      row,
      summary: ownerLinkSummaryFromRow(row),
      cards: cardsPayload.rows || [],
      weeklyRows: weeklyPayload.rows || [],
      gapSegments: weeklyPayload.gap_segments || [],
      totals: cardsPayload.totals || {},
    };
  } catch (error) {
    state.subjectOwner.linkDetail = previousDetail || null;
    showToast(error.message);
  }
  renderSubjectOwnerOpsDistribution();
}

function renderOpsShipmentCard(row, index) {
  const unread = Number(row.unread_comment_count || 0) > 0;
  const recoverable = opsDisplayRecoverable(row);
  const coveredSegments = shipmentCoveredGapSegments(row);
  const gapIndices = coveredSegments.map(({ index: gapIndex }) => gapIndex).join(",");
  const coveredWeekIndices = shipmentCoveredWeekIndices(row).join(",");
  const etaWeekIndex = weekIndexForDate(row.eta_putaway_date);
  const actionability = opsActionabilityMeta(row);
  const logisticsPerson = personText(row.first_leg_logistics_people || row.contact_display_name);
  const contactValue = actionability.contactValue || logisticsPerson;
  const shipmentNo = String(row.shipment_no || "");
  const timelineOpen = shipmentNo && shipmentNo === state.opsTimelineShipmentNo;
  const commentCountSuffix = Number(row.comment_count_loaded ?? 1) ? ` ${fmtNumber(row.comment_count)}` : "";
  return `<article class="risk-card ops-shipment-card${unread ? " unread" : ""}${timelineOpen ? " is-timeline-open" : ""}" data-gap-indices="${gapIndices}" data-cover-week-indices="${coveredWeekIndices}" data-eta-week-index="${etaWeekIndex}">
    <div class="ops-shipment-top">
      <div>
        <div class="shipment">${htmlEscape(row.shipment_no || "未匹配货件")}</div>
        <div class="ops-shipment-badges">${opsActionabilityBadges(row)}</div>
      </div>
      <div class="loss-block"><span>期望挽回</span><strong>${fmtMoney(recoverable)}</strong></div>
    </div>
    <div class="ops-shipment-facts">
      <div class="ops-shipment-fact"><span>物流方式</span><strong>${htmlEscape(row.freight_type_name || "--")}</strong></div>
      <div class="ops-shipment-fact"><span>在途数量</span><strong>${fmtNumber(row.in_transit_qty, 0)}</strong></div>
    </div>
    <div class="ops-judgement-panel">${renderOpsJudgementRows(row, actionability)}</div>
    <div class="ops-shipment-contact-row">
      <div class="ops-shipment-contact"><span>${htmlEscape(actionability.contactLabel)}</span><strong title="${htmlEscape(contactValue)}">${htmlEscape(contactValue)}</strong></div>
      <div class="ops-shipment-buttons">
        <button class="ghost-btn" type="button" data-ops-timeline-index="${index}">${timelineOpen ? "收起时间轴" : "展开时间轴"}</button>
        <button class="ghost-btn" type="button" data-comment-index="${index}" title="${htmlEscape(actionability.buttonTitle)}">${htmlEscape(actionability.buttonLabel)}${commentCountSuffix}</button>
      </div>
    </div>
  </article>`;
}

function toggleOpsTimeline(index) {
  const row = state.cards[Number(index)];
  const shipmentNo = String(row?.shipment_no || "");
  if (!shipmentNo) {
    showToast("该行没有货件号，暂不能查看时间轴");
    return;
  }
  state.opsTimelineShipmentNo = state.opsTimelineShipmentNo === shipmentNo ? "" : shipmentNo;
  renderCards(state.cardTotals || {});
}

function bindOpsShipmentHoverLinks() {
  if (!isBusinessOps()) return;
  const rows = els.linkOverview.querySelectorAll("[data-gap-index]");
  const rowByIndex = new Map(Array.from(rows).map((row) => [row.dataset.gapIndex, row]));
  const weekHighlights = els.linkOverview.querySelectorAll("[data-cover-week-index]");
  const weekHighlightByIndex = new Map(Array.from(weekHighlights).map((row) => [row.dataset.coverWeekIndex, row]));
  const inboundBars = els.linkOverview.querySelectorAll(".chart-inbound[data-week-index]");
  els.riskList.querySelectorAll(".ops-shipment-card").forEach((card) => {
    const gapIndices = String(card.dataset.gapIndices || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const coverWeekIndices = String(card.dataset.coverWeekIndices || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const etaWeekIndex = String(card.dataset.etaWeekIndex || "");
    const toggle = (active) => {
      card.classList.toggle("is-linked-highlight", active);
      gapIndices.forEach((index) => {
        rowByIndex.get(index)?.classList.toggle("is-linked-highlight", active);
      });
      coverWeekIndices.forEach((index) => {
        weekHighlightByIndex.get(index)?.classList.toggle("is-linked-highlight", active);
      });
      inboundBars.forEach((bar) => {
        const isEtaWeek = etaWeekIndex !== "-1" && bar.dataset.weekIndex === etaWeekIndex;
        bar.classList.toggle("is-inbound-dimmed", active && etaWeekIndex !== "-1" && !isEtaWeek);
        bar.classList.toggle("is-inbound-focus", active && isEtaWeek);
      });
    };
    card.addEventListener("mouseenter", () => toggle(true));
    card.addEventListener("mouseleave", () => toggle(false));
  });
}

function ownerBlockerText(row) {
  const issue = row.issue_type || row.data_quality_label || "待确认";
  const action = row.action_hint || "";
  return action ? `${issue}：${action}` : issue;
}

function ownerShipmentSummaryHtml(row) {
  const shipmentNo = row.shipment_no || "未匹配货件";
  const country = row.logistics_country_cn || "--";
  const freight = row.freight_type_name || "--";
  const etaDate = isoDateKey(row.eta_putaway_date);
  const etaText = etaDate ? `${etaDate}（${weekLabelForDate(etaDate)}）` : "--";
  const qtyText = `${fmtNumber(row.in_transit_qty, 0)}件`;
  return `<div class="owner-shipment-summary">
    <strong title="${htmlEscape(shipmentNo)}">货件号 ${htmlEscape(shipmentNo)}</strong>
    <span>${htmlEscape(country)} / ${htmlEscape(freight)}</span>
    <span>预计${htmlEscape(etaText)}上架 ${htmlEscape(qtyText)}</span>
  </div>`;
}

function ownerCommentPrefill(row, actionType) {
  const shipment = row.shipment_no || "该货件";
  const link = row.sales_link || "当前链接";
  const ops = personText(row.business_ops_people);
  const planner = personText(row.supply_planner_people);
  const logistics = personText(row.first_leg_logistics_people || row.contact_display_name);
  const eta = fmtDate(row.eta_putaway_date);
  const gap = fmtDate(row.first_gap_date);
  const blocker = ownerBlockerText(row);
  const base = `【主体负责人核查】链接 ${link} / 货件 ${shipment}，运营 ${ops}，当前核查点：${blocker}。`;
  if (actionType === "logistics") {
    return `${base}\n请补充物流 ${logistics} 当前 ETA ${eta} 是否稳定，以及是否存在影响上架的风险。`;
  }
  if (actionType === "planner") {
    return `${base}\n请补充计划 ${planner} 对 ${gap} 前后缺口的判断：当前货件是否可覆盖，是否仍需替代、调拨或观察。`;
  }
  if (actionType === "hold") {
    return `${base}\n主体侧暂按“暂不处理/观察”记录，请补充原因和下一次回看时间。`;
  }
  return `${base}\n请在核查备注中补充当前结论：风险已解释、仍需继续跟进或暂不处理，并写明依据。`;
}

function ownerActionKey(row) {
  return [
    row.issue_type || "",
    row.sales_link || "",
    row.shipment_no || "",
    row.eta_putaway_date || "",
  ].join("||");
}

function ownerRowsForSelectedIssue() {
  const issueType = state.subjectOwner.selectedIssueType;
  return (state.subjectOwner.actionRows || []).filter((row) => !issueType || row.issue_type === issueType);
}

function ownerDefaultBatchDraft(issueType) {
  const selectedOps = state.subjectOwner.selectedOpsPerson;
  const opsText = selectedOps ? `（当前筛选运营：${selectedOps}）` : "";
  const subjectText = subjectSelectionText();
  if (issueType === "高损失链接重点抽检") {
    return `【主体负责人核查】当前为高损失链接重点抽检${opsText}。请补充核查结论：风险已解释、仍需继续跟进或暂不处理；如已解释，请说明覆盖货件、缺口窗口和依据。主体范围：${subjectText}。`;
  }
  if (issueType === "缺口已发生且方案未闭环") {
    return `【主体负责人核查】当前链接已进入缺口但方案说明不足${opsText}。请补充当前判断：已有在途覆盖、已有替代方案、需要继续跟进或暂不处理，并写明依据。主体范围：${subjectText}。`;
  }
  if (issueType === "物流反馈未闭环") {
    return `【主体负责人核查】当前链接物流反馈说明不足${opsText}。请补充 ETA 是否稳定、最早可上架时间和是否仍需继续跟进。主体范围：${subjectText}。`;
  }
  if (issueType === "链接风险信息缺失") {
    return `【主体负责人核查】当前链接风险信息不完整，暂不能判断真实优先级${opsText}。请先补齐缺口推演映射、售价或链接基础信息，补齐后重新判断是否需要继续跟进。主体范围：${subjectText}。`;
  }
  return `【主体负责人核查】请补充当前事项的核查结论、依据和是否需要继续跟进。主体范围：${subjectText}。`;
}

function ensureOwnerIssueSelection() {
  const issueRows = state.subjectOwner.issueRows || [];
  const current = state.subjectOwner.selectedIssueType;
  if (!issueRows.length) {
    state.subjectOwner.selectedIssueType = "";
    state.subjectOwner.batchDraftText = "";
    state.subjectOwner.batchEditorOpen = false;
    return;
  }
  if (!current || !issueRows.some((row) => row.issue_type === current)) {
    state.subjectOwner.selectedIssueType = issueRows[0].issue_type || "";
    state.subjectOwner.batchDraftText = ownerDefaultBatchDraft(state.subjectOwner.selectedIssueType);
    state.subjectOwner.batchEditorOpen = false;
    state.subjectOwner.excludedKeys = [];
    state.subjectOwner.customDrafts = {};
    state.subjectOwner.linkDetail = null;
  }
  if (!state.subjectOwner.batchDraftText) {
    state.subjectOwner.batchDraftText = ownerDefaultBatchDraft(state.subjectOwner.selectedIssueType);
  }
}

function ownerDraftForRow(row) {
  const key = ownerActionKey(row);
  return (state.subjectOwner.customDrafts || {})[key] || state.subjectOwner.batchDraftText || ownerDefaultBatchDraft(row.issue_type);
}

function ownerRowContext(row) {
  return [
    `链接：${row.sales_link || "--"}`,
    `货件：${row.shipment_no || "--"}`,
    `运营：${personText(row.business_ops_people)}`,
    `计划：${personText(row.supply_planner_people)}`,
    `物流：${personText(row.first_leg_logistics_people || row.contact_display_name)}`,
    `缺口开始：${fmtDate(row.first_gap_date)}`,
    `预计上架：${fmtDate(row.eta_putaway_date)}`,
    `事项：${row.issue_type || "--"}`,
  ].join("；");
}

function ownerFinalComment(row) {
  return `${ownerDraftForRow(row)}\n\n【本条上下文】${ownerRowContext(row)}`;
}

function ownerCommentContentFromDraft(row, draft) {
  const content = String(draft || "").trim();
  if (!content) return "";
  if (content.includes("【本条上下文】")) return content;
  return `${content}\n\n【本条上下文】${ownerRowContext(row)}`;
}

async function submitOwnerSingleComment(row, content) {
  const finalContent = ownerCommentContentFromDraft(row, content);
  if (!row?.shipment_no) {
    showToast("该行没有货件号，暂不能保存核查备注");
    return;
  }
  if (!finalContent) {
    showToast("核查备注不能为空");
    return;
  }
  await api(`/api/shipments/${encodeURIComponent(row.shipment_no)}/comments`, {
    method: "POST",
    body: JSON.stringify({
      user_id: state.user?.id,
      role_code: state.roleCode,
      comment_content: finalContent,
    }),
  });
  showToast("核查备注已保存");
  await loadCards();
}

function renderSubjectOwnerWorkbench(totals) {
  const owner = state.subjectOwner;
  if (owner.loadError) {
    renderSubjectOwnerOpsDistribution();
    els.linkOverview.hidden = false;
    els.linkOverview.innerHTML = `<div class="empty-state compact">${htmlEscape(owner.loadError)}</div>`;
    els.riskList.innerHTML = `<div class="empty-state compact">${htmlEscape(owner.loadError)}</div>`;
    return;
  }
  renderSubjectOwnerOpsDistribution();
  els.linkOverview.hidden = true;
  els.linkOverview.innerHTML = "";
  els.riskList.innerHTML = "";
  els.cardsEmpty.hidden = true;
  return;
  const issueRows = owner.issueRows || [];
  ensureOwnerIssueSelection();
  const issueType = owner.selectedIssueType;
  const actionRows = ownerRowsForSelectedIssue();
  const customDrafts = owner.customDrafts || {};
  renderSubjectOwnerOpsDistribution();
  els.linkOverview.hidden = false;
  els.linkOverview.innerHTML = `
    <section class="owner-panel owner-issue-panel">
      <div class="subsection-head owner-issue-head">
        <div>
          <strong>③ 重点核查事项</strong>
          <span>最多 4 类事项，点击后切换下方重点核查明细</span>
        </div>
        <span>${fmtNumber(issueRows.length)} 类</span>
      </div>
      <div class="owner-issue-grid" data-issue-count="${issueRows.length}">
        ${issueRows.length ? issueRows.map((row) => `<button class="owner-issue-item${row.issue_type === issueType ? " active" : ""}" type="button" data-owner-issue="${htmlEscape(row.issue_type || "")}">
          <strong>${htmlEscape(row.issue_type || "未标记")}</strong>
          <span>${htmlEscape(row.action_hint || "--")}</span>
          <div class="owner-issue-loss">${fmtMoney(row.weighted_expected_gmv_loss)}</div>
          <div class="owner-ops-meta">
            <span>链接 ${fmtNumber(row.sales_link_count)}</span>
            <span>货件 ${fmtNumber(row.shipment_count)}</span>
          </div>
        </button>`).join("") : `<div class="empty-state compact">暂无重点核查事项数据</div>`}
      </div>
    </section>
  `;
  els.linkOverview.querySelectorAll("[data-owner-issue]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextIssue = button.dataset.ownerIssue || "";
      if (nextIssue === state.subjectOwner.selectedIssueType) return;
      state.subjectOwner.selectedIssueType = nextIssue;
      state.subjectOwner.batchDraftText = ownerDefaultBatchDraft(nextIssue);
      state.subjectOwner.batchEditorOpen = false;
      state.subjectOwner.excludedKeys = [];
      state.subjectOwner.customDrafts = {};
      state.subjectOwner.linkDetail = null;
      renderSubjectOwnerWorkbench(totals);
    });
  });
  bindWeeklyTooltips();

  const actionCards = actionRows.map((row, index) => {
    const unread = Number(row.unread_comment_count || 0) > 0;
    const key = ownerActionKey(row);
    const hasCustomDraft = Object.prototype.hasOwnProperty.call(customDrafts, key);
    const draftText = ownerDraftForRow(row);
    const commentCount = Number(row.comment_count || 0);
    const unreadCount = Number(row.unread_comment_count || 0);
    const latestCommentAt = row.latest_comment_at ? String(row.latest_comment_at).replace("T", " ").slice(0, 16) : "--";
    return `<article class="owner-action-card${unread ? " unread" : ""}" data-owner-key="${htmlEscape(key)}">
      <section class="owner-card-info owner-card-main">
        <div class="owner-card-head">
          <div>
            <span>销售链接</span>
            <strong title="${htmlEscape(row.sales_link || "--")}">${htmlEscape(row.sales_link || "--")}</strong>
          </div>
        </div>
        ${ownerShipmentSummaryHtml(row)}
        <div class="owner-blocker">${htmlEscape(ownerBlockerText(row))}</div>
      </section>
      <section class="owner-card-info owner-card-judgement">
        <div class="owner-card-section-head">
          <strong>当前货件核查判断</strong>
          ${hasCustomDraft ? `<span class="owner-custom-badge owner-judgement-badge">已编辑备注</span>` : ""}
        </div>
        ${renderOwnerShipmentJudgement(row)}
        <div class="owner-card-actions">
          <button class="ghost-btn" type="button" data-owner-link-detail="${index}">查看链接衔接</button>
          ${hasCustomDraft ? `<button class="ghost-btn" type="button" data-owner-reset-draft="${index}">恢复默认备注</button>` : ""}
        </div>
      </section>
      <section class="owner-card-comment">
        <div class="owner-comment-head">
          <strong>核查备注</strong>
          <span>${fmtNumber(commentCount)} 条 / 未读 ${fmtNumber(unreadCount)} / 最近 ${htmlEscape(latestCommentAt)}</span>
        </div>
        <textarea data-owner-comment-draft="${index}" rows="5">${htmlEscape(draftText)}</textarea>
        <div class="owner-comment-actions">
          <button class="primary-btn" type="button" data-owner-comment-submit="${index}">保存核查备注</button>
          <button class="ghost-btn" type="button" data-owner-comment="${index}">查看历史备注</button>
        </div>
      </section>
    </article>`;
  }).join("");

  els.riskList.innerHTML = `<div class="owner-action-head">
      <div class="owner-action-title">
        <h2 class="step-title">④ 重点核查明细</h2>
        <strong>${htmlEscape(issueType || "重点核查事项")} / 共 ${fmtNumber(actionRows.length)} 条</strong>
      </div>
      <div class="owner-bulk-actions">
        <label class="summary-loss-toggle owner-head-toggle">
          <input id="owner-exception-toggle" type="checkbox" ${owner.exceptionOnly ? "checked" : ""}>
          只看重点核查项
        </label>
      </div>
    </div>
    ${actionCards || `<div class="empty-state compact">暂无需要核查的明细</div>`}`;
  els.riskList.querySelector("#owner-exception-toggle")?.addEventListener("change", async (event) => {
    state.subjectOwner.exceptionOnly = event.currentTarget.checked;
    await loadCards();
  });
  els.riskList.querySelectorAll("[data-owner-reset-draft]").forEach((button) => {
    button.addEventListener("click", () => {
      const row = actionRows[Number(button.dataset.ownerResetDraft)];
      const key = ownerActionKey(row);
      const drafts = { ...(state.subjectOwner.customDrafts || {}) };
      delete drafts[key];
      state.subjectOwner.customDrafts = drafts;
      renderSubjectOwnerWorkbench(totals);
    });
  });
  els.riskList.querySelectorAll("[data-owner-comment]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = actionRows[Number(button.dataset.ownerComment)];
      await openComments(row.shipment_no, ownerFinalComment(row));
    });
  });
  els.riskList.querySelectorAll("[data-owner-comment-draft]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      const row = actionRows[Number(event.currentTarget.dataset.ownerCommentDraft)];
      const key = ownerActionKey(row);
      state.subjectOwner.customDrafts = { ...(state.subjectOwner.customDrafts || {}), [key]: event.currentTarget.value };
    });
  });
  els.riskList.querySelectorAll("[data-owner-comment-submit]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.ownerCommentSubmit);
      const row = actionRows[index];
      const textarea = els.riskList.querySelector(`[data-owner-comment-draft="${index}"]`);
      await submitOwnerSingleComment(row, textarea?.value || ownerFinalComment(row));
    });
  });
  els.riskList.querySelectorAll("[data-owner-link-detail]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = actionRows[Number(button.dataset.ownerLinkDetail)];
      await openOwnerLinkDetail(row);
    });
  });
}

function feedbackClass(type) {
  if (type === "待确认") return " warning";
  if (type === "无法按期" || type === "数据异常") return " danger";
  if (type === "可按期推进") return " success";
  return "";
}

function dateInputValue(value) {
  const text = fmtDate(value);
  return text === "--" ? "" : text;
}

function logisticsTags(row) {
  const tags = [];
  const meta = logisticsBucketMeta(row);
  tags.push(`<span class="badge success">${htmlEscape(meta.owner)}动作</span>`);
  tags.push(`<span class="badge">${htmlEscape(meta.label)}</span>`);
  if (Number(row.has_subject_owner_focus || 0) === 1) tags.push(`<span class="badge warning">主体负责人重点核查</span>`);
  if (Number(row.has_attention || 0) === 1) tags.push(`<span class="badge warning">有人关注</span>`);
  if (row.top_issue_type) tags.push(`<span class="badge">${htmlEscape(row.top_issue_type)}</span>`);
  if (Number(row.total_expected_recoverable_gmv || 0) > 0) tags.push(`<span class="badge">有预计挽回</span>`);
  if (row.earliest_uncovered_window_start_date) tags.push(`<span class="badge">默认窗口 ${fmtDate(row.earliest_uncovered_window_start_date)}</span>`);
  if (!row.expected_signed_date) tags.push(`<span class="badge warning">预计签收缺失</span>`);
  return tags.join("");
}

function logisticsCommentPrefillFromShipment(row) {
  const meta = logisticsBucketMeta(row);
  return [
    `【物流响应】货件 ${row.shipment_no || "--"}`,
    `入池类型：${meta.label}`,
    `处理建议归属：${meta.owner}`,
    `建议动作：${meta.action}`,
    `当前反馈类型：${row.effective_feedback_type || "待确认"}`,
    `默认窗口开始：${fmtDate(row.earliest_uncovered_window_start_date)}`,
    `预计签收日期：${fmtDate(row.expected_signed_date)}`,
    `预计上架日期：${fmtDate(row.forecast_putaway_date || row.latest_snapshot_putaway_date)}`,
    meta.owner === "运营" ? "请运营承接平台仓上架催办，并补充店铺客服反馈。" : "请补充当前推进进展、阻塞点和下一节点预计日期。",
  ].join("\n");
}

function logisticsChannelFilterMarkup() {
  const rows = state.logistics.channelRows || [];
  const selected = state.logistics.selectedChannel3;
  if (!rows.length) {
    return `<section class="logistics-channel-panel logistics-channel-strip">
      <div class="empty-state compact">暂无三级渠道数据</div>
    </section>`;
  }
  return `
    <section class="logistics-channel-panel logistics-channel-strip">
      <div class="subsection-head">
        <div>
          <strong>三级渠道筛选</strong>
          <span>${selected ? `当前只看：${htmlEscape(selected)}` : "全部三级渠道"}</span>
        </div>
        <button class="ghost-btn" type="button" data-logistics-clear-channel ${selected ? "" : "disabled"}>全部三级渠道</button>
      </div>
      <div class="logistics-channel-grid">
        ${rows.map((row, index) => {
    const channel = row.three_level_channel_name || "【三级渠道缺失】";
    const active = selected === channel ? " active" : "";
    const freightClass = logisticsFreightClass(row.freight_type_name);
    return `<button class="logistics-channel ${freightClass}${active}" type="button" data-logistics-channel="${index}">
          <strong>${htmlEscape(channel)}</strong>
          <span>货件 ${fmtNumber(row.shipment_count)} / 待确认 ${fmtNumber(row.pending_feedback_count)}</span>
          <span>预计挽回 ${fmtMoney(row.total_expected_recoverable_gmv)}</span>
        </button>`;
  }).join("")}
      </div>
    </section>
  `;
}

function bindLogisticsChannelFilter(root) {
  const rows = state.logistics.channelRows || [];
  root.querySelector("[data-logistics-clear-channel]")?.addEventListener("click", async () => {
    state.logistics.selectedChannel3 = "";
    state.logistics.selectedShipmentNo = "";
    state.logistics.shipmentPage = 1;
    await loadCards();
  });
  root.querySelectorAll("[data-logistics-channel]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = rows[Number(button.dataset.logisticsChannel)] || {};
      const channel = row.three_level_channel_name || "【三级渠道缺失】";
      if (state.logistics.selectedChannel3 === channel) return;
      state.logistics.selectedChannel3 = channel;
      state.logistics.selectedShipmentNo = "";
      state.logistics.shipmentPage = 1;
      await loadCards();
    });
  });
}

function renderLogisticsChannelFilter() {
  els.issueInsights.hidden = true;
  els.issueInsights.innerHTML = "";
}

function logisticsShortDate(value) {
  const key = isoDateKey(value);
  return key ? key.slice(2) : "--";
}

function logisticsFullDate(value) {
  return isoDateKey(value) || "--";
}

function logisticsPickDate(row, fields) {
  for (const field of fields) {
    const key = isoDateKey(row?.[field]);
    if (key) return key;
  }
  return "";
}

function logisticsTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function logisticsSignedDays(laterValue, earlierValue) {
  const later = dateMs(laterValue);
  const earlier = dateMs(earlierValue);
  if (later === null || earlier === null) return null;
  return Math.round((later - earlier) / 86400000);
}

function logisticsSpeedMeta(diff, prefix = "") {
  if (diff === null || diff === undefined) return null;
  if (diff > 0) return { text: `${prefix}慢${diff}天`, className: "slow" };
  if (diff < 0) return { text: `${prefix}快${Math.abs(diff)}天`, className: "fast" };
  return { text: `${prefix}准时`, className: "on-time" };
}

function logisticsNumber(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function logisticsShipmentStartDate(row) {
  const today = logisticsTodayKey();
  const actualDate = logisticsPickDate(row, ["collection_actual_date"]);
  const forecastDate = logisticsPickDate(row, ["collection_forecast_date"]);
  if (actualDate && actualDate <= today) return actualDate;
  return forecastDate || actualDate;
}

function logisticsReferenceLeadDays(row, startDate) {
  const directFields = ["reference_lead_days", "tracking_reference_days", "reference_prescription"];
  for (const field of directFields) {
    const days = logisticsNumber(row?.[field]);
    if (days !== null && days > 0) return Math.round(days);
  }
  const referenceDate = logisticsPickDate(row, ["reference_putaway_date", "target_putaway_date", "main_reference_putaway_date"]);
  const days = startDate && referenceDate ? logisticsSignedDays(referenceDate, startDate) : null;
  return days !== null && days >= 0 ? days : null;
}

function logisticsReferencePace(row, nodes) {
  const startDate = logisticsShipmentStartDate(row);
  const putawayNode = nodes.find((node) => node.name === "上架");
  const putawayDate = putawayNode?.date || "";
  const referenceDays = logisticsReferenceLeadDays(row, startDate);
  const actualDays = startDate && putawayDate ? logisticsSignedDays(putawayDate, startDate) : null;
  const diff = actualDays !== null && referenceDays !== null ? actualDays - referenceDays : null;
  const speed = logisticsSpeedMeta(diff);
  return {
    startDate,
    putawayDate,
    putawayStatus: putawayNode?.status || "forecast",
    referenceDays,
    actualDays,
    speed,
  };
}

function logisticsTransitDaysText(pace) {
  if (!pace.startDate) return "--";
  const endDate = pace.putawayStatus === "done" && pace.putawayDate ? pace.putawayDate : logisticsTodayKey();
  const days = logisticsSignedDays(endDate, pace.startDate);
  if (days === null) return "--";
  return `${fmtNumber(Math.max(0, days))}天`;
}

function logisticsPutawayCountdownText(pace) {
  if (!pace.putawayDate) return "--";
  if (pace.putawayStatus === "done") return "已上架";
  const days = logisticsSignedDays(pace.putawayDate, logisticsTodayKey());
  if (days === null) return "--";
  if (days > 0) return `${fmtNumber(days)}天后`;
  if (days < 0) return `已过${fmtNumber(Math.abs(days))}天`;
  return "今天";
}

function logisticsPutawayCountdownParts(date, status = "forecast") {
  if (!date) return { days: null, value: "--", suffix: "上架", className: "" };
  if (status === "done") return { days: 0, value: "已", suffix: "上架", className: "done" };
  const days = logisticsSignedDays(date, logisticsTodayKey());
  if (days === null) return { days: null, value: "--", suffix: "上架", className: "" };
  if (days > 0) return { days, value: fmtNumber(days, 0), suffix: "天后上架", className: "future" };
  if (days < 0) return { days, value: `已过${fmtNumber(Math.abs(days), 0)}`, suffix: "天", className: "overdue" };
  return { days, value: "今天", suffix: "上架", className: "today" };
}

function logisticsTransitDaysNumber(pace) {
  if (!pace.startDate) return null;
  const endDate = pace.putawayStatus === "done" && pace.putawayDate ? pace.putawayDate : logisticsTodayKey();
  const days = logisticsSignedDays(endDate, pace.startDate);
  return days === null ? null : Math.max(0, days);
}

function logisticsRemainingDaysNumber(pace) {
  if (!pace.putawayDate || pace.putawayStatus === "done") return 0;
  const days = logisticsSignedDays(pace.putawayDate, logisticsTodayKey());
  return days === null ? null : Math.max(0, days);
}

function logisticsReferenceDeltaText(pace) {
  if (!pace.speed) return "--";
  if (pace.speed.className === "on-time") return "等于参考时效";
  return `比参考时效${pace.speed.text}`;
}

function logisticsPct(value, total) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.min(Math.max((value / total) * 100, 0), 100);
}

function logisticsReferenceArrivalText(pace) {
  if (!pace.speed) return "--";
  return pace.speed.className === "on-time" ? "准时到" : `${pace.speed.text}到`;
}

function logisticsNode(row, config) {
  const today = logisticsTodayKey();
  const actualDate = logisticsPickDate(row, config.actualFields || []);
  const forecastDate = logisticsPickDate(row, config.forecastFields || []);
  const targetDate = logisticsPickDate(row, config.targetFields || []);
  const hasActual = Boolean(actualDate);
  const actualDone = hasActual && actualDate <= today;
  const futureActual = hasActual && actualDate > today;
  const displayDate = actualDone ? actualDate : (forecastDate || actualDate || targetDate);
  return {
    name: config.name,
    status: actualDone ? "done" : "forecast",
    date: displayDate,
    dateText: logisticsShortDate(displayDate),
    targetDate,
    speed: null,
    showSpeed: config.showSpeed !== false,
    futureActual,
  };
}

function logisticsSegmentSpeed(node, previousNode, index) {
  if (!node?.showSpeed || !previousNode?.date || !node?.date || !node?.targetDate) return null;
  const previousTargetDate = index === 1 ? previousNode.date : (previousNode.targetDate || previousNode.date);
  if (!previousTargetDate) return null;
  const actualDuration = logisticsSignedDays(node.date, previousNode.date);
  const targetDuration = logisticsSignedDays(node.targetDate, previousTargetDate);
  if (actualDuration === null || targetDuration === null) return null;
  return logisticsSpeedMeta(actualDuration - targetDuration);
}

function logisticsApplySegmentSpeeds(nodes) {
  return nodes.map((node, index) => ({
    ...node,
    speed: index === 0 ? null : logisticsSegmentSpeed(node, nodes[index - 1], index),
  }));
}

function logisticsTimelineNodes(row) {
  return logisticsApplySegmentSpeeds([
    logisticsNode(row, {
      name: "发货",
      actualFields: ["collection_actual_date"],
      forecastFields: ["collection_forecast_date"],
      targetFields: ["collection_forecast_date"],
      showSpeed: false,
    }),
    logisticsNode(row, {
      name: "国内清关放行",
      actualFields: ["actual_domestic_clearance_date"],
      forecastFields: ["forecast_domestic_clearance_date"],
      targetFields: ["target_domestic_clearance_date"],
    }),
    logisticsNode(row, {
      name: "离港",
      actualFields: ["actual_departure_date"],
      forecastFields: ["forecast_departure_date"],
      targetFields: ["target_departure_date"],
    }),
    logisticsNode(row, {
      name: "到港",
      actualFields: ["actual_arrival_port_date"],
      forecastFields: ["forecast_arrival_port_date", "expected_arrival_port_date"],
      targetFields: ["target_arrival_port_date"],
    }),
    logisticsNode(row, {
      name: "国外清关放行",
      actualFields: ["actual_foreign_clearance_date"],
      forecastFields: ["forecast_foreign_clearance_date"],
      targetFields: ["target_foreign_clearance_date"],
    }),
    logisticsNode(row, {
      name: "提取",
      actualFields: ["actual_pickup_date"],
      forecastFields: ["forecast_pickup_date", "expected_pickup_date"],
      targetFields: ["target_pickup_date"],
    }),
    logisticsNode(row, {
      name: "签收",
      actualFields: ["actual_signed_date"],
      forecastFields: ["forecast_signed_date", "expected_signed_date"],
      targetFields: ["target_signed_date"],
    }),
    logisticsNode(row, {
      name: "上架",
      actualFields: ["actual_putaway_date"],
      forecastFields: ["latest_snapshot_putaway_date", "eta_putaway_date", "forecast_putaway_date", "earliest_snapshot_putaway_date"],
      targetFields: ["target_putaway_date"],
    }),
  ]);
}

function logisticsTimelineCurrentText(nodes) {
  const lastDoneIndex = nodes.reduce((last, node, index) => (node.status === "done" ? index : last), -1);
  const nextNode = nodes.find((node, index) => index > lastDoneIndex && node.status !== "done");
  if (!nextNode) return "已完成上架";
  if (lastDoneIndex < 0) return `待${nextNode.name}`;
  return `${nodes[lastDoneIndex].name}后，待${nextNode.name}`;
}

function logisticsCleanBlocker(row) {
  const raw = row.latest_tracking_remark || row.type_of_delay_str || row.tracking_remark || row.exception_remark || "";
  const text = String(raw).trim();
  if (!text) return "";
  return text.split(/[-－]/)[0].trim() || text;
}

function logisticsPutawayPressure(row, nodes) {
  const putawayNode = nodes.find((node) => node.name === "上架");
  const requestedDate = isoDateKey(row.earliest_requested_putaway_date);
  const putawayDate = putawayNode?.date || "";
  const speed = requestedDate && putawayDate ? logisticsSpeedMeta(logisticsSignedDays(putawayDate, requestedDate), "预计") : null;
  return {
    putawayDate,
    requestedDate,
    speed,
  };
}

function logisticsRemarkRows(detail) {
  return (detail.trackingRemarks || []).slice(0, 3);
}

function renderLogisticsRouteSummary(row, nodes) {
  const pace = logisticsReferencePace(row, nodes);
  const arrivalClass = pace.speed?.className || "";
  const transitDays = logisticsTransitDaysNumber(pace);
  const remainingDays = logisticsRemainingDaysNumber(pace);
  const actualDays = pace.actualDays !== null
    ? pace.actualDays
    : (transitDays !== null && remainingDays !== null ? transitDays + remainingDays : null);
  const scaleDays = Math.max(pace.referenceDays || 0, actualDays || 0, transitDays || 0, 1);
  const referencePct = logisticsPct(pace.referenceDays, scaleDays);
  const transitPct = logisticsPct(transitDays, scaleDays);
  const remainingPct = logisticsPct(remainingDays, scaleDays);
  const actualPct = logisticsPct(actualDays, scaleDays);
  const countdown = logisticsPutawayCountdownParts(pace.putawayDate, pace.putawayStatus);
  const deltaText = logisticsReferenceDeltaText(pace);
  const referenceText = pace.referenceDays !== null ? `${fmtNumber(pace.referenceDays, 0)}天` : "--";
  const transitText = transitDays !== null ? `已在途 ${fmtNumber(transitDays, 0)}天` : "已在途 --";
  const remainingText = remainingDays !== null ? `剩余 ${fmtNumber(remainingDays, 0)}天` : "剩余 --";
  return `<div class="logistics-route-summary">
    <div class="logistics-route-hero-line">
      <div class="logistics-route-hero">
        <span>预计</span>
        <strong class="${countdown.className}">${htmlEscape(countdown.value)}</strong>
        <b>${htmlEscape(countdown.suffix)}</b>
      </div>
      <span class="logistics-route-delta ${arrivalClass}">${htmlEscape(deltaText)}</span>
    </div>
    <div class="logistics-route-bars" style="--reference-pct:${referencePct.toFixed(3)}%; --actual-pct:${actualPct.toFixed(3)}%; --transit-pct:${transitPct.toFixed(3)}%; --remaining-pct:${remainingPct.toFixed(3)}%;">
      <div class="logistics-route-bar-row reference">
        <span class="logistics-route-bar-label">参考时效</span>
        <div class="logistics-route-bar-shell">
          <div class="logistics-route-bar-fill reference">
            <b>${htmlEscape(referenceText)}</b>
          </div>
        </div>
      </div>
      <div class="logistics-route-bar-row actual">
        <span class="logistics-route-bar-label">实际时效</span>
        <div class="logistics-route-bar-shell">
          <span class="logistics-route-bar-fill actual-done"></span>
          <span class="logistics-route-bar-fill actual-remaining"></span>
          <i class="logistics-route-forecast-marker" aria-hidden="true"></i>
        </div>
      </div>
      <div class="logistics-route-bar-meta">
        <span>${htmlEscape(transitText)}</span>
        <span>${htmlEscape(remainingText)}</span>
      </div>
    </div>
  </div>`;
}

function renderLogisticsTimeline(row, nodes) {
  return `<section class="logistics-timeline-panel">
    <div class="subsection-head">
      <strong>货件主时间轴</strong>
    </div>
    ${renderLogisticsRouteSummary(row, nodes)}
    <div class="logistics-timeline-legend">
      <div class="logistics-timeline-legend-row">
        <span><i class="legend-dot done"></i>已完成节点</span>
        <span><i class="legend-dot forecast"></i>待完成节点</span>
      </div>
      <div class="logistics-timeline-legend-row">
        <span><b class="logistics-speed sample slow">慢5天</b>晚于目标</span>
        <span><b class="logistics-speed sample fast">快2天</b>早于目标</span>
        <span><b class="logistics-speed sample on-time">准时</b>等于目标</span>
      </div>
    </div>
    <div class="logistics-timeline-list">
      ${nodes.map((node, index) => `<div class="logistics-timeline-node is-${node.status}" style="--node-index:${index}">
        <span class="logistics-speed-slot">${node.speed ? `<span class="logistics-speed ${node.speed.className}">${htmlEscape(node.speed.text)}</span>` : ""}</span>
        <span class="logistics-timeline-dot" aria-hidden="true"></span>
        <span class="logistics-node-name">${htmlEscape(node.name)}</span>
        <strong class="logistics-node-date">${htmlEscape(node.dateText)}</strong>
      </div>`).join("")}
    </div>
  </section>`;
}

function logisticsAdvanceSortNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function logisticsSortedAdvanceGroups(groups = []) {
  return [...groups].sort((a, b) => {
    const advanceDiff = logisticsAdvanceSortNumber(a.recommended_advance_days)
      - logisticsAdvanceSortNumber(b.recommended_advance_days);
    if (advanceDiff) return advanceDiff;
    const gmvDiff = logisticsAdvanceSortNumber(b.expected_recoverable_gmv)
      - logisticsAdvanceSortNumber(a.expected_recoverable_gmv);
    if (gmvDiff) return gmvDiff;
    return String(a.earliest_requested_putaway_date || "").localeCompare(String(b.earliest_requested_putaway_date || ""));
  });
}

function renderLogisticsAdvanceStatusIcon(status) {
  if (status === null || status === undefined) {
    return `<span class="logistics-advance-status-placeholder" aria-hidden="true"></span>`;
  }
  const meta = logisticsAdvanceStatusMeta(status);
  return `<span class="logistics-advance-status ${meta.className}" title="${htmlEscape(meta.label)}" aria-label="${htmlEscape(meta.label)}">${htmlEscape(meta.symbol)}</span>`;
}

function renderLogisticsAdvanceCapacityForm(row) {
  const capacityValue = logisticsAdvanceCapacityValue(row);
  const value = capacityValue === null ? "" : String(capacityValue);
  const disabled = isReadonlyMirror() ? " disabled" : "";
  return `<div class="logistics-advance-form">
    <label>
      <span>最多可提前</span>
      <input type="number" min="0" step="1" inputmode="numeric" data-feedback-max-advance-days value="${htmlEscape(value)}" placeholder="填写整数"${disabled}>
      <span>天</span>
    </label>
    <button class="primary-btn" type="button" data-logistics-save-feedback="${htmlEscape(row.shipment_no || "")}"${disabled}>${capacityValue === null ? "提交" : "提交修改"}</button>
    <span class="logistics-submit-inline-tip" data-logistics-submit-tip hidden></span>
  </div>`;
}

function renderLogisticsAdvanceGroupRow(group) {
  const status = group.is_satisfied;
  const advanceDays = logisticsAdvanceSortNumber(group.recommended_advance_days);
  return `<article class="logistics-advance-group">
    <div class="logistics-advance-main">
      <strong>提前 ${fmtNumber(advanceDays, 0)} 天</strong>
      <span>期望${htmlEscape(logisticsFullDate(group.earliest_requested_putaway_date))}上架</span>
    </div>
    <div class="logistics-advance-metrics">
      <span>预计可挽回GMV</span>
      <strong>${fmtMoney(group.expected_recoverable_gmv)}</strong>
    </div>
    <div class="logistics-advance-result">
      ${renderLogisticsAdvanceStatusIcon(status)}
    </div>
  </article>`;
}

function renderLogisticsAdvancePanel(row, detail, latestTracking) {
  const groups = logisticsSortedAdvanceGroups(detail.advanceGroups || []);
  const remarks = logisticsRemarkRows(detail);
  return `<section class="logistics-insight-panel logistics-advance-panel">
    <div class="subsection-head">
      <strong>货件跟踪备注</strong>
      <span>最近更新 ${htmlEscape(latestTracking)}</span>
    </div>
    <div class="logistics-insight-card wide logistics-advance-remarks">
      <div class="logistics-erp-remarks">
        ${remarks.length ? remarks.map((remark) => `<p><span>${htmlEscape(logisticsShortDate(remark.remark_created_at))}</span>${htmlEscape(remark.remark || "--")}</p>`).join("") : `<p><span>--</span>暂无ERP跟踪备注</p>`}
      </div>
    </div>
    <div class="subsection-head logistics-advance-subhead">
      <strong>提前能力判断</strong>
    </div>
    ${renderLogisticsAdvanceCapacityForm(row)}
    <div class="logistics-advance-group-list">
      ${groups.length ? groups.map(renderLogisticsAdvanceGroupRow).join("") : `<div class="empty-state compact">暂无提前上架诉求</div>`}
    </div>
  </section>`;
}

function renderLogisticsInsight(row, detail, nodes, latestTracking) {
  return renderLogisticsAdvancePanel(row, detail, latestTracking);
}

function renderLogisticsDetail() {
  const detail = state.logistics.detail;
  const selected = state.logistics.selectedShipmentNo;
  if (!selected) {
    els.linkOverview.hidden = false;
    els.linkOverview.innerHTML = `<div class="empty-state compact">暂无可处理货件</div>`;
    return;
  }
  els.linkOverview.hidden = false;
  if (!detail || detail.loading || detail.shipment?.shipment_no !== selected) {
    els.linkOverview.innerHTML = `<section class="logistics-detail-panel freight-other"><div class="empty-state compact">货件详情加载中...</div></section>`;
    return;
  }
  const row = detail.shipment || {};
  const latestTracking = row.tracking_updated_at ? String(row.tracking_updated_at).replace("T", " ").slice(0, 16) : "--";
  const freightClass = logisticsFreightClass(row.freight_type_name);
  const timelineNodes = logisticsTimelineNodes(row);
  const commentCount = Number(row.comment_count || 0);
  const unreadCommentCount = Number(row.unread_comment_count || 0);
  const commentButtonClass = `${commentCount > 0 ? " has-comments" : ""}${unreadCommentCount > 0 ? " has-unread-comments" : ""}`;
  const shipmentNo = row.shipment_no || selected;
  els.linkOverview.innerHTML = `
    <section class="logistics-detail-panel ${freightClass}">
      <div class="logistics-detail-head">
        <div>
          <h2 class="step-title">④ 货件详情</h2>
          <div class="logistics-detail-title-line">
            <button class="logistics-shipment-copy" type="button" data-copy-shipment="${htmlEscape(shipmentNo)}" title="点击复制货件号">${htmlEscape(shipmentNo)}</button>
            <span class="logistics-detail-country">${countryDisplayHtml(row.logistics_country_cn || "--")}</span>
            <span class="logistics-freight-badge">${htmlEscape(row.freight_type_name || "--")}</span>
            <span class="logistics-freight-badge logistics-channel3-badge">${htmlEscape(row.three_level_channel_name || "--")}</span>
          </div>
        </div>
        <div class="logistics-detail-actions">
          <button class="ghost-btn logistics-comment-btn${commentButtonClass}" type="button" data-logistics-comment>查看留言 ${fmtNumber(commentCount)}</button>
        </div>
      </div>
      <div class="logistics-detail-grid">
        ${renderLogisticsTimeline(row, timelineNodes)}
        ${renderLogisticsInsight(row, detail, timelineNodes, latestTracking)}
      </div>
    </section>
  `;
  els.linkOverview.querySelector("[data-logistics-comment]")?.addEventListener("click", async () => {
    await openComments(row.shipment_no, logisticsCommentPrefillFromShipment(row));
  });
  els.linkOverview.querySelector("[data-copy-shipment]")?.addEventListener("click", async (event) => {
    const shipmentNoToCopy = event.currentTarget.dataset.copyShipment || "";
    await copyTextToClipboard(shipmentNoToCopy);
    showToast("货件号已复制");
  });
  els.linkOverview.querySelector("[data-logistics-save-feedback]")?.addEventListener("click", async (event) => {
    if (isReadonlyMirror()) {
      showToast("只读镜像不允许写入");
      return;
    }
    try {
      await saveLogisticsFeedback(event.currentTarget.dataset.logisticsSaveFeedback || shipmentNo);
    } catch (error) {
      showToast(error.message);
    }
  });
}

function renderLogisticsShipmentCard(row, index) {
  const selected = row.shipment_no === state.logistics.selectedShipmentNo ? " selected" : "";
  const freightClass = logisticsFreightClass(row.freight_type_name);
  const unread = Number(row.unread_comment_count || 0) > 0;
  const capacityValue = logisticsAdvanceCapacityValue(row);
  const completed = capacityValue !== null;
  return `<article class="risk-card logistics-shipment-card ${freightClass}${selected}${completed ? " completed" : ""}" data-logistics-shipment="${index}">
    <div class="logistics-shipment-line">
      <span class="logistics-shipment-no-wrap">
        <strong class="logistics-shipment-no">${htmlEscape(row.shipment_no || "未匹配货件")}</strong>
        <span class="logistics-judgement-badge">${completed ? "已判断" : "待判断"}</span>
      </span>
      <span class="logistics-shipment-gmv">${fmtMoney(row.total_expected_recoverable_gmv)}</span>
    </div>
    <div class="logistics-shipment-badges">
      ${unread ? `<span class="badge warning">未读 ${fmtNumber(row.unread_comment_count)}</span>` : ""}
      <span class="logistics-freight-badge">${htmlEscape(row.freight_type_name || "--")}</span>
      <span class="logistics-freight-badge logistics-channel3-badge">${htmlEscape(row.three_level_channel_name || "--")}</span>
    </div>
  </article>`;
}

function logisticsShipmentPageCount(rows = state.logistics.rows || []) {
  return Math.max(1, Math.ceil(rows.length / LOGISTICS_SHIPMENT_PAGE_SIZE));
}

function clampLogisticsShipmentPage(value, rows = state.logistics.rows || []) {
  const totalPages = logisticsShipmentPageCount(rows);
  const page = Math.round(Number(value) || 1);
  return Math.min(Math.max(page, 1), totalPages);
}

function logisticsSelectedShipmentIndex(rows = state.logistics.rows || []) {
  const selected = state.logistics.selectedShipmentNo;
  if (!selected) return -1;
  return rows.findIndex((row) => row.shipment_no === selected);
}

function syncLogisticsShipmentPageToSelection(rows = state.logistics.rows || []) {
  const selectedIndex = logisticsSelectedShipmentIndex(rows);
  if (selectedIndex >= 0) {
    state.logistics.shipmentPage = Math.floor(selectedIndex / LOGISTICS_SHIPMENT_PAGE_SIZE) + 1;
    return;
  }
  state.logistics.shipmentPage = clampLogisticsShipmentPage(state.logistics.shipmentPage, rows);
}

function logisticsShipmentPageRows(rows = state.logistics.rows || []) {
  state.logistics.shipmentPage = clampLogisticsShipmentPage(state.logistics.shipmentPage, rows);
  const start = (state.logistics.shipmentPage - 1) * LOGISTICS_SHIPMENT_PAGE_SIZE;
  return {
    start,
    rows: rows.slice(start, start + LOGISTICS_SHIPMENT_PAGE_SIZE),
    totalPages: logisticsShipmentPageCount(rows),
  };
}

function renderLogisticsShipmentPagination(rows = state.logistics.rows || []) {
  if (!rows.length) return "";
  const totalPages = logisticsShipmentPageCount(rows);
  const page = clampLogisticsShipmentPage(state.logistics.shipmentPage, rows);
  const prevDisabled = page <= 1 ? " disabled" : "";
  const nextDisabled = page >= totalPages ? " disabled" : "";
  return `<div class="logistics-pagination" aria-label="货件清单分页">
    <div class="logistics-page-meta">共 <strong>${fmtNumber(rows.length)}</strong> 票 · <strong>${fmtNumber(LOGISTICS_SHIPMENT_PAGE_SIZE)}</strong>/页</div>
    <div class="logistics-page-controls">
      <button class="logistics-page-icon" type="button" data-logistics-page-prev title="上一页" aria-label="上一页"${prevDisabled}>&lt;</button>
      <input class="logistics-page-input" type="number" min="1" max="${totalPages}" value="${page}" data-logistics-page-input aria-label="页码">
      <span class="logistics-page-total">/ ${fmtNumber(totalPages)}</span>
      <button class="logistics-page-icon" type="button" data-logistics-page-next title="下一页" aria-label="下一页"${nextDisabled}>&gt;</button>
    </div>
  </div>`;
}

function renderLogisticsWorkbench() {
  const totals = state.logistics.totals || {};
  setLogisticsLayoutMode(true);
  els.detailTitle.textContent = "物流响应台";
  els.detailMeta.hidden = true;
  els.detailMeta.textContent = "";
  els.cardCount.hidden = true;
  els.cardCount.textContent = "";
  renderLogisticsChannelFilter();
  renderLogisticsDetail();
  const rows = state.logistics.rows || [];
  syncLogisticsShipmentPageToSelection(rows);
  const page = logisticsShipmentPageRows(rows);
  els.cardsEmpty.hidden = true;
  els.riskList.innerHTML = `<div class="shipment-list-head logistics-list-head">
      <div>
        <h2 class="step-title">③ 货件清单</h2>
      </div>
      <span>${fmtNumber(rows.length)} 票</span>
    </div>
    <div class="logistics-page-card-list">
      ${page.rows.length ? page.rows.map((row, index) => renderLogisticsShipmentCard(row, page.start + index)).join("") : `<div class="empty-state compact">暂无可展示货件</div>`}
    </div>
    ${renderLogisticsShipmentPagination(rows)}`;
  els.riskList.querySelectorAll("[data-logistics-shipment], [data-logistics-open]").forEach((target) => {
    target.addEventListener("click", async (event) => {
      event.stopPropagation();
      const index = Number(event.currentTarget.dataset.logisticsShipment ?? event.currentTarget.dataset.logisticsOpen);
      const row = rows[index];
      if (row) await openLogisticsShipment(row);
    });
  });
  els.riskList.querySelector("[data-logistics-page-prev]")?.addEventListener("click", () => {
    setLogisticsShipmentPage(state.logistics.shipmentPage - 1).catch((error) => showToast(error.message));
  });
  els.riskList.querySelector("[data-logistics-page-next]")?.addEventListener("click", () => {
    setLogisticsShipmentPage(state.logistics.shipmentPage + 1).catch((error) => showToast(error.message));
  });
  els.riskList.querySelector("[data-logistics-page-input]")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    setLogisticsShipmentPage(event.currentTarget.value).catch((error) => showToast(error.message));
  });
  els.riskList.querySelector("[data-logistics-page-input]")?.addEventListener("blur", (event) => {
    setLogisticsShipmentPage(event.currentTarget.value).catch((error) => showToast(error.message));
  });
  els.riskList.querySelectorAll("[data-logistics-comment]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const row = rows[Number(button.dataset.logisticsComment)];
      if (row) await openComments(row.shipment_no, logisticsCommentPrefillFromShipment(row));
    });
  });
}

async function setLogisticsShipmentPage(pageValue) {
  const rows = state.logistics.rows || [];
  state.logistics.shipmentPage = clampLogisticsShipmentPage(pageValue, rows);
  const page = logisticsShipmentPageRows(rows);
  const firstRow = page.rows[0];
  if (!firstRow) {
    state.logistics.selectedShipmentNo = "";
    state.logistics.detail = null;
    renderLogisticsWorkbench();
    return;
  }
  if (firstRow.shipment_no === state.logistics.selectedShipmentNo) {
    renderLogisticsWorkbench();
    return;
  }
  await openLogisticsShipment(firstRow);
}

async function openLogisticsShipment(row) {
  if (!row?.shipment_no) return;
  state.logistics.selectedShipmentNo = row.shipment_no;
  syncLogisticsShipmentPageToSelection();
  state.logistics.requestDetailsOpen = false;
  state.logistics.detail = { loading: true, shipment: row, requestRows: [], advanceGroups: [], trackingRemarks: [] };
  renderLogisticsWorkbench();
  await loadLogisticsDetail(row.shipment_no, state.cardsRequestId);
}

async function loadLogisticsDetail(shipmentNo, requestId = state.cardsRequestId) {
  const detailRequestId = ++state.logisticsDetailRequestId;
  state.logistics.detail = { loading: true, shipment: { shipment_no: shipmentNo }, requestRows: [], advanceGroups: [], trackingRemarks: [] };
  renderLogisticsDetail();
  const params = userParams();
  const payload = await api(`/api/logistics/shipments/${encodeURIComponent(shipmentNo)}/detail?${params.toString()}`);
  if (requestId !== state.cardsRequestId || detailRequestId !== state.logisticsDetailRequestId) return;
  state.logistics.detail = {
    loading: false,
    shipment: payload.shipment || {},
    requestRows: payload.request_rows || [],
    advanceGroups: payload.advance_groups || [],
    trackingRemarks: payload.tracking_remarks || [],
  };
  renderLogisticsWorkbench();
}

async function markLogisticsRead(shipmentNo) {
  if (isReadonlyMirror()) {
    showToast("只读镜像不允许写入");
    return;
  }
  await api(`/api/shipments/${encodeURIComponent(shipmentNo)}/read`, {
    method: "POST",
    body: JSON.stringify({ user_id: state.user?.id, role_code: state.roleCode, confirm_action: "logistics_detail_read" }),
  });
  showToast("已确认读取该货件");
  await loadCards();
}

async function saveLogisticsFeedback(shipmentNo) {
  if (isReadonlyMirror()) {
    showToast("只读镜像不允许写入");
    return;
  }
  const root = els.linkOverview;
  const detailRow = state.logistics.detail?.shipment || {};
  const body = {
    user_id: state.user?.id,
    role_code: state.roleCode,
    feedback_type: detailRow.manual_feedback_type || detailRow.effective_feedback_type || "尽量推进但不保证",
    expected_signed_date: dateInputValue(detailRow.feedback_expected_signed_date || detailRow.expected_signed_date) || "",
    expected_putaway_date: dateInputValue(detailRow.feedback_expected_putaway_date || detailRow.forecast_putaway_date || detailRow.latest_snapshot_putaway_date) || "",
    earliest_putaway_date: dateInputValue(detailRow.feedback_earliest_putaway_date || detailRow.earliest_requested_putaway_date) || "",
    max_feasible_advance_days: root.querySelector("[data-feedback-max-advance-days]")?.value ?? "",
    blocker_type: detailRow.blocker_type || "",
    feedback_content: detailRow.feedback_content || "",
  };
  await api(`/api/logistics/shipments/${encodeURIComponent(shipmentNo)}/feedback`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const tip = root.querySelector("[data-logistics-submit-tip]");
  if (tip) {
    const isUpdate = logisticsAdvanceCapacityFilled(detailRow);
    tip.textContent = isUpdate ? "已提交修改" : "已提交";
    tip.hidden = false;
    window.setTimeout(() => {
      tip.hidden = true;
    }, 1800);
  }
  window.setTimeout(() => {
    loadCards().catch((error) => showToast(error.message));
  }, 900);
}

function renderCards(totals) {
  const isOps = isBusinessOps();
  const isOwner = isSubjectOwner();
  const isPlanner = isSupplyPlanner();
  const selectedLabel = isOwner ? subjectSelectionText() : (state.selectedSummary?.summary_label || "全部明细");
  setGlobalCoordinatorLayoutMode(false);
  setLogisticsLayoutMode(false);
  renderLogisticsChannelTreePane();
  els.workspace?.classList.toggle("owner-mode", isOwner);
  els.workspace?.classList.toggle("planner-mode", isPlanner);
  els.detailPane.classList.toggle("ops-mode", isOps);
  els.detailPane.classList.toggle("owner-mode", isOwner);
  els.detailPane.classList.toggle("planner-mode", isPlanner);
  els.detailBody.classList.toggle("ops-layout", isOps);
  els.detailBody.classList.toggle("owner-layout", isOwner);
  els.detailBody.classList.toggle("planner-layout", isPlanner);
  if (!isOwner) els.workspace?.classList.remove("owner-link-detail-mode");
  if (!isPlanner && !isLogistics() && !isGlobalCoordinator()) {
    placeFiltersForMode(false);
    els.filters?.classList.remove("planner-filter-popover", "logistics-filter-popover");
  }
  els.detailTitle.textContent = isOps ? "" : (isOwner ? "主体负责人工作台" : (isPlanner ? "链接明细" : selectedLabel));
  els.detailMeta.hidden = isOps;
  els.detailMeta.textContent = isOps
    ? ""
    : isOwner
      ? `主体 ${selectedLabel} / 运营分布、重点核查事项和重点核查明细`
      : isPlanner
        ? "逾期链接、链接整体衔接、货件跟进情况"
      : `货件 ${fmtNumber(totals.shipment_count)} / 链接 ${fmtNumber(totals.sales_link_count)} / 加权 ${fmtMoney(totals.weighted_expected_gmv_loss)} / 原始 ${fmtMoney(totals.raw_expected_gmv_loss)} / 权重 ${fmtWeight(totals.composite_weight)}`;
  els.cardCount.hidden = true;
  els.cardCount.textContent = "";
  renderLinkOverview(totals);
  if (isOwner) {
    renderSubjectOwnerWorkbench(totals);
    els.cardsEmpty.hidden = true;
    return;
  }
  if (isPlanner) {
    renderSupplyPlannerDashboard();
    els.cardsEmpty.hidden = true;
    return;
  }
  const opsRows = isOps ? opsRowsForDisplay() : [];
  const listRows = isOps ? opsRows : state.cards.map((row, index) => ({ row, index }));
  els.cardsEmpty.hidden = isOps || state.cards.length > 0;
  const shipmentCards = listRows
    .map(({ row, index }) => {
      if (isOps) return renderOpsShipmentCard(row, index);
      const unread = Number(row.unread_comment_count || 0) > 0;
      const rawLoss = Number(row.allocated_raw_expected_gmv_loss || 0);
      const weightedLoss = Number(row.allocated_weighted_expected_gmv_loss || 0);
      const inTransitGmv = Number(row.in_transit_qty || 0) * Number(row.gmv_unit_price_rmb || 0);
      return `<article class="risk-card${unread ? " unread" : ""}">
        <div class="risk-top">
          <div>
            <div class="shipment">${htmlEscape(row.shipment_no || "未匹配货件")}</div>
            <div class="link-text">${htmlEscape(row.sales_link || "--")}</div>
            <div class="badge-row">
              ${renderIssueBadges(row)}
              <span class="badge">${htmlEscape(row.subject_no || "--")}</span>
              <span class="badge">${htmlEscape(row.logistics_country_cn || "--")} / ${htmlEscape(row.freight_type_name || "--")}</span>
              ${unread ? `<span class="badge warning">未读 ${fmtNumber(row.unread_comment_count)}</span>` : ""}
            </div>
          </div>
          <div class="loss-block"><span>${isOps ? "预期损失" : "加权损失"}</span><strong>${fmtMoney(isOps ? rawLoss : weightedLoss)}</strong></div>
        </div>
        <div class="weight-flow">
          <div><span>${isOps ? "在途预计GMV" : "原始损失"}</span><strong>${isOps ? `${fmtMoney(inTransitGmv)}` : `${fmtMoney(rawLoss)}`}</strong></div>
          <div><span>${isOps ? "损失占比" : "综合权重"}</span><strong>${isOps ? fmtPercent(rawLoss, inTransitGmv, 1) : fmtWeight(row.composite_weight)}</strong></div>
          <div><span>${isOps ? "加权后排序值" : "加权损失"}</span><strong>${fmtMoney(weightedLoss)}</strong></div>
        </div>
        <div class="weight-chip-row">
          ${renderWeightChips(row)}
        </div>
        ${isOps ? `<div class="shipment-impact">
          <div><span>影响销售窗口</span><strong>${htmlEscape(shipmentImpactText(row))}</strong></div>
          <div><span>物流对接</span><strong>${htmlEscape(personText(row.first_leg_logistics_people || row.contact_display_name))}</strong></div>
        </div>` : ""}
        <div class="risk-metrics">
          <div class="metric"><span>平台SKU</span><strong>${htmlEscape(row.platform_sku || "--")}</strong></div>
          <div class="metric"><span>在途数量</span><strong>${fmtNumber(row.in_transit_qty, 0)}</strong></div>
          <div class="metric"><span>12周缺口</span><strong>${fmtNumber(row.allocated_lost_qty_total_12w, 0)}</strong></div>
          <div class="metric"><span>预计上架</span><strong>${fmtDate(row.eta_putaway_date)}</strong></div>
          <div class="people-metric">${renderPeopleRows(row)}</div>
        </div>
        <div class="card-actions">
          <button class="ghost-btn" type="button" data-comment-index="${index}">${isOps ? "给物流留言" : "留言"} ${fmtNumber(row.comment_count)}</button>
        </div>
      </article>`;
    })
    .join("");
  els.riskList.innerHTML = isOps
      ? `<div class="shipment-list-head">
        <div>
          <h2 class="step-title">③ 货件行动清单</h2>
          <strong>${htmlEscape(opsShipmentListTitle())}</strong>
        </div>
        <span>${htmlEscape(opsShipmentListCountText(totals))}</span>
      </div>
      ${shipmentCards || `<div class="empty-state compact">${htmlEscape(opsShipmentEmptyText(totals))}</div>`}`
    : shipmentCards;
  els.riskList.querySelectorAll("[data-comment-index]").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = state.cards[Number(button.dataset.commentIndex)];
      await openComments(card.shipment_no, logisticsCommentPrefill(card));
    });
  });
  els.riskList.querySelectorAll("[data-ops-timeline-index]").forEach((button) => {
    button.addEventListener("click", () => toggleOpsTimeline(button.dataset.opsTimelineIndex));
  });
  els.linkOverview.querySelectorAll("[data-ops-timeline-close]").forEach((button) => {
    button.addEventListener("click", () => {
      state.opsTimelineShipmentNo = "";
      renderCards(state.cardTotals || {});
    });
  });
  bindOpsShipmentHoverLinks();
  updateReadonlyControls();
}

async function openComments(shipmentNo, prefillText = "") {
  if (!shipmentNo) {
    showToast("该行没有货件号，暂不能留言");
    return;
  }
  const previousShipment = state.activeShipment;
  state.activeShipment = shipmentNo;
  els.commentTitle.textContent = shipmentNo;
  els.commentPanel.hidden = false;
  await loadComments();
  updateReadonlyControls();
  if (prefillText && !isReadonlyMirror()) {
    els.commentInput.value = prefillText;
    els.commentInput.focus();
  } else if (previousShipment !== shipmentNo) {
    els.commentInput.value = "";
  }
}

async function loadComments() {
  if (!state.activeShipment) return;
  const params = userParams();
  const payload = await api(`/api/shipments/${encodeURIComponent(state.activeShipment)}/comments?${params.toString()}`);
  renderComments(payload.comments || [], payload.pinned || null);
}

function renderComments(comments, pinned) {
  updateReadonlyControls();
  if (!comments.length) {
    els.commentList.innerHTML = `<div class="empty-state">暂无留言</div>`;
    return;
  }
  els.commentList.innerHTML = comments
    .map((comment) => {
      const withdrawn = Number(comment.is_withdrawn || 0) === 1;
      const pinnedClass = Number(comment.is_pinned || 0) === 1 ? " pinned" : "";
      const content = withdrawn ? "该留言已撤回" : comment.comment_content;
      const canWithdraw = Number(comment.can_withdraw || 0) === 1 && !isReadonlyMirror();
      const isPinned = pinned?.pinned_comment_id === comment.comment_id;
      return `<div class="comment-item${pinnedClass}">
        <div class="comment-meta">
          <strong>${htmlEscape(userDisplayName(comment))}</strong>
          <span>${htmlEscape(roleName(comment.role_code))}</span>
          <span>${String(comment.created_at || "").replace("T", " ").slice(0, 19)}</span>
          ${isPinned ? "<span>置顶</span>" : ""}
        </div>
        <div class="comment-content">${htmlEscape(content)}</div>
        ${withdrawn || isReadonlyMirror() ? "" : `<div class="comment-row-actions">
          <button class="ghost-btn" type="button" data-pin="${comment.comment_id}">${isPinned ? "取消置顶" : "置顶"}</button>
          ${canWithdraw ? `<button class="ghost-btn" type="button" data-withdraw="${comment.comment_id}">撤回</button>` : ""}
        </div>`}
      </div>`;
    })
    .join("");
  els.commentList.querySelectorAll("[data-pin]").forEach((button) => {
    button.addEventListener("click", async () => {
      const commentId = Number(button.dataset.pin);
      const isPinned = pinned?.pinned_comment_id === commentId;
      await pinComment(commentId, !isPinned);
    });
  });
  els.commentList.querySelectorAll("[data-withdraw]").forEach((button) => {
    button.addEventListener("click", async () => {
      await withdrawComment(Number(button.dataset.withdraw));
    });
  });
}

async function postComment() {
  if (isReadonlyMirror()) {
    showToast("只读镜像不允许写入");
    return;
  }
  const content = els.commentInput.value.trim();
  if (!content) {
    showToast("留言内容不能为空");
    return;
  }
  const body = {
    user_id: state.user?.id,
    role_code: state.roleCode,
    comment_content: content,
  };
  await api(`/api/shipments/${encodeURIComponent(state.activeShipment)}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  els.commentInput.value = "";
  showToast("留言已提交");
  await loadComments();
  await loadCards();
}

async function confirmRead() {
  if (isReadonlyMirror()) {
    showToast("只读镜像不允许写入");
    return;
  }
  await api(`/api/shipments/${encodeURIComponent(state.activeShipment)}/read`, {
    method: "POST",
    body: JSON.stringify({ user_id: state.user?.id, role_code: state.roleCode, confirm_action: "confirm_one" }),
  });
  showToast("已确认");
  await loadComments();
  await loadCards();
}

async function withdrawComment(commentId) {
  if (isReadonlyMirror()) {
    showToast("只读镜像不允许写入");
    return;
  }
  await api(`/api/comments/${commentId}/withdraw`, {
    method: "POST",
    body: JSON.stringify({ user_id: state.user?.id, role_code: state.roleCode }),
  });
  showToast("留言已撤回");
  await loadComments();
  await loadCards();
}

async function pinComment(commentId, active) {
  if (isReadonlyMirror()) {
    showToast("只读镜像不允许写入");
    return;
  }
  await api(`/api/shipments/${encodeURIComponent(state.activeShipment)}/pin`, {
    method: "POST",
    body: JSON.stringify({ user_id: state.user?.id, role_code: state.roleCode, comment_id: commentId, active }),
  });
  showToast(active ? "已置顶" : "已取消置顶");
  await loadComments();
  await loadCards();
}

function debounce(fn, wait = 260) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function bindEvents() {
  els.userSearch.addEventListener("input", debounce(async () => {
    await searchUsers(els.userSearch.value.trim());
  }));
  els.userSearch.addEventListener("focus", () => showUserOptionsFromInput().catch((error) => showToast(error.message)));
  els.userSearch.addEventListener("click", () => showUserOptionsFromInput().catch((error) => showToast(error.message)));
  document.addEventListener("click", (event) => {
    if (!els.userResults.contains(event.target) && event.target !== els.userSearch) {
      els.userResults.hidden = true;
    }
    if (
      state.openFilterMenu
      && els.filters
      && !event.target.closest("[data-filter-menu]")
      && !event.target.closest(".filter-popover")
    ) {
      state.openFilterMenu = null;
      renderStructuredFilters();
    }
    if (
      state.subjectOwner.subjectMenuOpen
      && els.subjectFilterHost
      && !els.subjectFilterHost.contains(event.target)
    ) {
      state.subjectOwner.subjectMenuOpen = false;
      renderSubjectFilter();
    }
    if (
      isSupplyPlanner()
      && !state.filtersCollapsed
      && els.filters
      && !els.filters.contains(event.target)
      && !event.target.closest("[data-planner-filter]")
    ) {
      setFilterCollapsed(true);
    }
  });
  els.identityTrigger.addEventListener("click", () => {
    if (els.identityPanel.hidden) {
      openIdentityPanel();
    } else {
      closeIdentityPanel();
    }
  });
  els.identityClose.addEventListener("click", () => closeIdentityPanel());
  els.identityCancel.addEventListener("click", () => closeIdentityPanel());
  els.identityBackdrop.addEventListener("click", () => closeIdentityPanel());
  els.identityConfirm.addEventListener("click", () => applyIdentityChange().catch((error) => showToast(error.message)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCompactMenus();
      closePlannerFeedbackDetail();
    }
    if (event.key === "Escape" && isSupplyPlanner() && !state.filtersCollapsed) {
      setFilterCollapsed(true);
    }
    if (event.key === "Escape" && !els.identityPanel.hidden) {
      closeIdentityPanel();
    }
  });
  els.manualBtn.addEventListener("click", openManual);
  els.manualClose.addEventListener("click", () => {
    els.manualPanel.hidden = true;
  });
  els.currencySelect?.addEventListener("change", () => {
    handleCurrencyChange().catch((error) => showToast(error.message));
  });
  els.currencyDropdown?.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-currency-toggle]");
    if (toggle) {
      event.preventDefault();
      toggleCurrencyMenu();
      return;
    }
    const option = event.target.closest("[data-currency-option]");
    if (option) {
      event.preventDefault();
      applyCurrencySelection(option.dataset.currencyOption);
    }
  });
  els.exportBtn.addEventListener("click", () => exportCards().catch((error) => showToast(error.message)));
  els.exportTasksBtn?.addEventListener("click", () => openExportPanel().catch((error) => showToast(error.message)));
  els.exportClose?.addEventListener("click", closeExportPanel);
  els.logisticsChannelToggle?.addEventListener("click", () => {
    setLogisticsTreeCollapsed(!state.logistics.channelTreeAllCollapsed);
  });
  els.filterToggle?.addEventListener("click", () => setFilterCollapsed(!state.filtersCollapsed));
  els.filterCollapse?.addEventListener("click", () => setFilterCollapsed(true));
  els.filterClear?.addEventListener("click", showClearFiltersConfirm);
  els.filterClearHead?.addEventListener("click", showClearFiltersConfirm);
  els.filterClearCancel?.addEventListener("click", hideClearFiltersConfirm);
  els.filterClearConfirmBtn?.addEventListener("click", confirmClearFilters);
  els.filterClose?.addEventListener("click", () => setFilterCollapsed(true));
  els.filterApply?.addEventListener("click", () => {
    applyFilters({ collapse: true }).catch((error) => showToast(error.message));
  });
  els.filters?.addEventListener("click", (event) => {
    const menuTrigger = event.target.closest("[data-filter-menu]");
    if (menuTrigger) {
      event.preventDefault();
      setFilterMenu(menuTrigger.dataset.filterMenu, menuTrigger.dataset.filterId);
      return;
    }
    if (event.target.closest("[data-filter-menu-close]")) {
      state.openFilterMenu = null;
      renderStructuredFilters();
      return;
    }
    const clearCascade = event.target.closest("[data-filter-clear-cascade]");
    if (clearCascade) {
      const config = CASCADE_FILTERS.find((item) => item.id === clearCascade.dataset.filterClearCascade);
      config?.levels.forEach((_, index) => filterState(`${config.id}_${index}`).clear());
      renderStructuredFilters();
      updateFilterPanel();
      return;
    }
    const clearMulti = event.target.closest("[data-filter-clear-multi]");
    if (clearMulti) {
      filterState(clearMulti.dataset.filterClearMulti).clear();
      renderStructuredFilters();
      updateFilterPanel();
    }
  });
  els.filters?.addEventListener("input", (event) => {
    const search = event.target.closest("[data-filter-search]");
    if (search) {
      state.filterSearch[search.dataset.filterSearch] = search.value;
      renderStructuredFilters();
      const next = els.filters.querySelector(`[data-filter-search="${cssEscape(search.dataset.filterSearch)}"]`);
      next?.focus();
      return;
    }
  });
  els.weekRangeFilter?.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-week-range-toggle]");
    if (toggle) {
      event.preventDefault();
      toggleWeekRangeMenu(toggle.dataset.weekRangeToggle);
      return;
    }
    const option = event.target.closest("[data-week-range-option]");
    if (option) {
      event.preventDefault();
      if (option.disabled) return;
      applyWeekRangeSelection(option.dataset.weekRangeOption, option.dataset.weekIndex);
    }
  });
  els.filters?.addEventListener("change", (event) => {
    if (event.target.matches("[data-cascade-id][data-cascade-level]")) {
      const config = CASCADE_FILTERS.find((item) => item.id === event.target.dataset.cascadeId);
      const levelIndex = Number(event.target.dataset.cascadeLevel);
      if (!config || !Number.isInteger(levelIndex)) return;
      toggleFilterValue(`${config.id}_${levelIndex}`, event.target.value, event.target.checked);
      sanitizeCascadeFilter(config, levelIndex + 1);
      renderStructuredFilters();
      updateFilterPanel();
      return;
    }
    if (event.target.matches("[data-multi-id]")) {
      toggleFilterValue(event.target.dataset.multiId, event.target.value, event.target.checked);
      renderStructuredFilters();
      updateFilterPanel();
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest(".week-range-filter, .currency-dropdown")) return;
    closeCompactMenus();
  });
  FIELD_FILTERS.map(([key]) => els[key]).forEach((el) => {
    if (!el) return;
    el.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || el.tagName === "TEXTAREA") return;
      event.preventDefault();
      applyFilters({ collapse: true }).catch((error) => showToast(error.message));
    });
    el.addEventListener("input", debounce(updateFilterPanel));
    el.addEventListener("change", updateFilterPanel);
  });
  [els.qualityFilter, els.sortFilter, els.onlyComments].forEach((el) => {
    if (!el) return;
    el.addEventListener("change", updateFilterPanel);
  });
  els.commentClose.addEventListener("click", () => {
    els.commentPanel.hidden = true;
    state.activeShipment = null;
  });
  els.postCommentBtn.addEventListener("click", () => postComment().catch((error) => showToast(error.message)));
  els.confirmReadBtn.addEventListener("click", () => confirmRead().catch((error) => showToast(error.message)));
}

function cacheElements() {
  Object.assign(els, {
    appShell: document.querySelector(".app-shell"),
    identityTrigger: $("identity-trigger"),
    identityCurrent: $("identity-current"),
    currencySelect: $("currency-select"),
    currencyDropdown: $("currency-dropdown"),
    identityBackdrop: $("identity-backdrop"),
    identityPanel: $("identity-panel"),
    identityClose: $("identity-close"),
    identityCancel: $("identity-cancel"),
    identityConfirm: $("identity-confirm"),
    identityDraftText: $("identity-draft-text"),
    identityGrain: $("identity-grain"),
    identityScope: $("identity-scope"),
    identityDrill: $("identity-drill"),
    identityExport: $("identity-export"),
    userSearch: $("user-search"),
    userResults: $("user-results"),
    roleSwitch: $("role-switch"),
    snapshotTime: $("snapshot-time"),
    workspace: document.querySelector(".workspace"),
    summaryPane: document.querySelector(".summary-pane"),
    summaryHeadActions: document.querySelector(".summary-pane > .pane-head .summary-head-actions"),
    summaryTitle: $("summary-title"),
    scopeText: $("scope-text"),
    summaryCount: $("summary-count"),
    subjectFilterHost: $("subject-filter-host"),
    topFilterHost: $("top-filter-host"),
    kpiGrid: $("kpi-grid"),
    summaryListToolbar: $("summary-list-toolbar"),
    summaryList: $("summary-list"),
    logisticsChannelPane: $("logistics-channel-pane"),
    logisticsChannelToggle: $("logistics-channel-toggle"),
    logisticsChannelTree: $("logistics-channel-tree"),
    detailTitle: $("detail-title"),
    detailPane: document.querySelector(".detail-pane"),
    detailMeta: $("detail-meta"),
    cardCount: $("card-count"),
    exportBtn: $("export-btn"),
    exportTasksBtn: $("export-tasks-btn"),
    filters: $("filters"),
    filterToggle: $("filter-toggle"),
    filterSummary: $("filter-summary"),
    weekRangeFilter: $("week-range-filter"),
    filterPanel: $("filter-panel"),
    filterCollapse: $("filter-collapse"),
    filterClear: $("filter-clear"),
    filterClearHead: $("filter-clear-head"),
    filterClearConfirm: $("filter-clear-confirm"),
    filterClearCancel: $("filter-clear-cancel"),
    filterClearConfirmBtn: $("filter-clear-confirm-btn"),
    filterClose: $("filter-close"),
    filterApply: $("filter-apply"),
    salesLinkFilter: $("sales-link-filter"),
    systemSkuFilter: $("system-sku-filter"),
    platformSkuFilter: $("platform-sku-filter"),
    shipmentNoFilter: $("shipment-no-filter"),
    cascadeFilterHost: $("cascade-filter-host"),
    multiFilterHost: $("multi-filter-host"),
    qualityFilter: $("quality-filter"),
    sortFilter: $("sort-filter"),
    onlyComments: $("only-comments"),
    onlyCommentsLabel: $("only-comments-label"),
    detailBody: $("detail-body"),
    linkOverview: $("link-overview"),
    issueInsights: $("issue-insights"),
    cardsEmpty: $("cards-empty"),
    riskList: $("risk-list"),
    commentPanel: $("comment-panel"),
    commentTitle: $("comment-title"),
    commentClose: $("comment-close"),
    commentList: $("comment-list"),
    commentInput: $("comment-input"),
    confirmReadBtn: $("confirm-read-btn"),
    postCommentBtn: $("post-comment-btn"),
    manualBtn: $("manual-btn"),
    manualPanel: $("manual-panel"),
    manualTitle: $("manual-title"),
    manualClose: $("manual-close"),
    manualRoleSummary: $("manual-role-summary"),
    manualSteps: $("manual-steps"),
    manualNotes: $("manual-notes"),
    exportPanel: $("export-panel"),
    exportClose: $("export-close"),
    exportList: $("export-list"),
    toast: $("toast"),
  });
}

async function restoreUser() {
  const cached = localStorage.getItem("ohc_user");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed?.source === "legacy_internal_user") {
        localStorage.removeItem("ohc_user");
      } else {
        state.roleCode = preferredRoleForUser(parsed);
        setUser(parsed);
        return;
      }
    } catch {
      localStorage.removeItem("ohc_user");
    }
  }
  const users = await searchUsers("");
  if (users[0]) {
    state.roleCode = preferredRoleForUser(users[0]);
    setUser(users[0]);
    els.userResults.hidden = true;
  }
}

async function init() {
  cacheElements();
  updateFilterPanel();
  bindEvents();
  try {
    await loadCurrencies().catch(() => renderCurrencySelector());
    await loadHealth();
    await loadFilterOptions();
    await loadRoles();
    await restoreUser();
    await syncSession();
    await loadSummary();
    await loadCards();
  } catch (error) {
    showToast(error.message);
  }
}

document.addEventListener("DOMContentLoaded", init);


