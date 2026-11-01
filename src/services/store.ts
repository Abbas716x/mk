import {
  Branch,
  LoungeTable,
  Invoice,
  DebtRecord,
  AuditLog,
  UserSession,
  OrderItem,
  GameType,
  BranchFinancials
} from '../types';

const STORAGE_PREFIX = 'respawn_purple_v3_';
const KEY_BRANCHES = `${STORAGE_PREFIX}branches`;
const KEY_TABLES = `${STORAGE_PREFIX}tables`;
const KEY_INVOICES = `${STORAGE_PREFIX}invoices`;
const KEY_DEBTS = `${STORAGE_PREFIX}debts`;
const KEY_AUDIT_LOGS = `${STORAGE_PREFIX}audit_logs`;
const KEY_SESSION = `${STORAGE_PREFIX}current_user`;
const KEY_CURRENT_BRANCH = `${STORAGE_PREFIX}active_branch_id`;

// BroadcastChannel for instant cross-tab & multi-screen zero-delay sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('respawn_purple_realtime_mesh')
  : null;

const DEFAULT_BRANCHES: Branch[] = [
  {
    id: 'branch_mansour',
    name: 'فرع المنصور الرئيسي (VIP Cyber Lounge)',
    code: 'MNS-01',
    status: 'active',
    capacity: 24,
    tablesCount: 6,
    defaultHourlyRate: 5000,
    address: 'بغداد - المنصور - شارع الأميرات',
    createdAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'branch_karrada',
    name: 'فرع الكرادة (Cyber Arena)',
    code: 'KRD-02',
    status: 'active',
    capacity: 30,
    tablesCount: 4,
    defaultHourlyRate: 4500,
    address: 'بغداد - الكرادة داخل - تقاطع مسبح',
    createdAt: '2026-02-15T14:30:00Z'
  },
  {
    id: 'branch_zayouna',
    name: 'فرع زيونة (Grand Lounge)',
    code: 'ZYN-03',
    status: 'active',
    capacity: 20,
    tablesCount: 4,
    defaultHourlyRate: 4000,
    address: 'بغداد - زيونة - مقابل المدينة المائية',
    createdAt: '2026-03-01T10:00:00Z'
  }
];

const INITIAL_TABLES: LoungeTable[] = [
  {
    id: 'tbl_m1',
    branchId: 'branch_mansour',
    number: 1,
    name: 'محطة PS5 Cyber 01',
    gameType: 'ps5',
    status: 'active',
    hourlyRateSingle: 5000,
    hourlyRateMulti: 7000,
    deviceLabel: 'PlayStation 5 Console 4K 120Hz',
    session: {
      sessionId: 'ses_101',
      customerName: 'حيدر الكرخي',
      customerPhone: '07701234567',
      mode: 'open',
      startedAt: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
      isMultiplayer: true,
      hourlyRate: 7000,
      orders: [
        { id: 'ord_1', name: 'ريد بول بارد', price: 2500, qty: 2, category: 'drinks', icon: '⚡' },
        { id: 'ord_2', name: 'أركيلة تفاحتين فاخر', price: 5000, qty: 1, category: 'hookah', icon: '💨' }
      ],
      discount: 0,
      isPaused: false,
      totalPausedSeconds: 0,
      earlyPaid: 0
    }
  },
  {
    id: 'tbl_m2',
    branchId: 'branch_mansour',
    number: 2,
    name: 'طاولة بليارد الملكية 01',
    gameType: 'billiards',
    status: 'active',
    hourlyRateSingle: 6000,
    hourlyRateMulti: 6000,
    deviceLabel: 'Tournament Grade 9ft Diamond Felt',
    session: {
      sessionId: 'ses_102',
      customerName: 'علي الدليمي',
      customerPhone: '07809876543',
      mode: 'timer',
      targetMinutes: 60,
      startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      isMultiplayer: false,
      hourlyRate: 6000,
      orders: [
        { id: 'ord_3', name: 'قهوة اسبريسو إيطالية', price: 2000, qty: 2, category: 'drinks', icon: '☕' }
      ],
      discount: 1000,
      isPaused: false,
      totalPausedSeconds: 0,
      earlyPaid: 0
    }
  },
  {
    id: 'tbl_m3',
    branchId: 'branch_mansour',
    number: 3,
    name: 'طاولة تنس الطاولة 01',
    gameType: 'tennis',
    status: 'available',
    hourlyRateSingle: 3500,
    hourlyRateMulti: 3500,
    deviceLabel: 'ITTF Certified Olympic Ping Pong'
  },
  {
    id: 'tbl_m4',
    branchId: 'branch_mansour',
    number: 4,
    name: 'طاولة دومينو وطاولة زهر VIP',
    gameType: 'domino',
    status: 'available',
    hourlyRateSingle: 3000,
    hourlyRateMulti: 3000,
    deviceLabel: 'Classic Ivory & Walnut Board'
  },
  {
    id: 'tbl_m5',
    branchId: 'branch_mansour',
    number: 5,
    name: 'محطة PS5 02',
    gameType: 'ps5',
    status: 'available',
    hourlyRateSingle: 4500,
    hourlyRateMulti: 6500,
    deviceLabel: 'PlayStation 5 Console OLED 65"'
  },
  {
    id: 'tbl_m6',
    branchId: 'branch_mansour',
    number: 6,
    name: 'طاولة بليارد برو 02',
    gameType: 'billiards',
    status: 'available',
    hourlyRateSingle: 5000,
    hourlyRateMulti: 5000,
    deviceLabel: 'Tournament Grade 9ft Blue Felt'
  },

  // Karrada Branch
  {
    id: 'tbl_k1',
    branchId: 'branch_karrada',
    number: 1,
    name: 'PS5 Cyber Pod 01',
    gameType: 'ps5',
    status: 'available',
    hourlyRateSingle: 4500,
    hourlyRateMulti: 6500,
    deviceLabel: 'PS5 Cyber Studio'
  },
  {
    id: 'tbl_k2',
    branchId: 'branch_karrada',
    number: 2,
    name: 'طاولة بليارد الكرادة',
    gameType: 'billiards',
    status: 'available',
    hourlyRateSingle: 5000,
    hourlyRateMulti: 5000,
    deviceLabel: 'Diamond Table 9ft'
  },

  // Zayouna Branch
  {
    id: 'tbl_z1',
    branchId: 'branch_zayouna',
    number: 1,
    name: 'PS5 زيونة VIP',
    gameType: 'ps5',
    status: 'available',
    hourlyRateSingle: 4000,
    hourlyRateMulti: 6000,
    deviceLabel: 'PS5 Pro Station'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2601-89',
    branchId: 'branch_mansour',
    branchName: 'فرع المنصور الرئيسي (VIP Cyber Lounge)',
    tableId: 'tbl_m5',
    tableName: 'محطة PS5 02',
    tableNumber: 5,
    gameType: 'ps5',
    customerName: 'أحمد السامرائي',
    customerPhone: '07712345678',
    startedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    timeCost: 9000,
    ordersCost: 6000,
    orders: [
      { id: 'o1', name: 'برجر لحم فاخر', price: 6000, qty: 1, category: 'snacks', icon: '🍔' }
    ],
    discount: 0,
    subtotal: 15000,
    total: 15000,
    paidAmount: 15000,
    debtAmount: 0,
    paymentMethod: 'cash',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  }
];

const INITIAL_DEBTS: DebtRecord[] = [
  {
    id: 'debt_01',
    branchId: 'branch_mansour',
    customerName: 'سيف المحمدي',
    phone: '07801122334',
    amount: 15000,
    paid: 5000,
    tableName: 'محطة PS5 Cyber 01',
    notes: 'متبقي حساب سهرة أمس + أركيلتين',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'partial'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    branchId: 'branch_mansour',
    branchName: 'فرع المنصور الرئيسي',
    user: 'المدير العام (Super Admin)',
    action: 'SYSTEM_BOOT',
    details: 'تشغيل واجهة RESPAWN Lounge OS (Cyber-Purple Glass Edition)',
    severity: 'success',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

export const AVAILABLE_PRODUCTS: OrderItem[] = [
  { id: 'prod_1', name: 'بيبسي مثلج', price: 1000, qty: 1, category: 'drinks', icon: '🥤' },
  { id: 'prod_2', name: 'ريد بول بارد', price: 2500, qty: 1, category: 'drinks', icon: '⚡' },
  { id: 'prod_3', name: 'قهوة اسبريسو إيطالية', price: 2000, qty: 1, category: 'drinks', icon: '☕' },
  { id: 'prod_4', name: 'عصير برتقال طبيعي', price: 2500, qty: 1, category: 'drinks', icon: '🍊' },
  { id: 'prod_5', name: 'مياه معدنية', price: 500, qty: 1, category: 'drinks', icon: '💧' },
  { id: 'prod_6', name: 'برجر لحم فاخر', price: 6000, qty: 1, category: 'snacks', icon: '🍔' },
  { id: 'prod_7', name: 'بيتزا شاورما لحم', price: 7000, qty: 1, category: 'snacks', icon: '🍕' },
  { id: 'prod_8', name: 'بطاطا مقلية كريسبي', price: 2500, qty: 1, category: 'snacks', icon: '🍟' },
  { id: 'prod_9', name: 'أركيلة تفاحتين فاخر', price: 5000, qty: 1, category: 'hookah', icon: '💨' },
  { id: 'prod_10', name: 'أركيلة علكة ونعناع', price: 5000, qty: 1, category: 'hookah', icon: '💨' },
  { id: 'prod_11', name: 'يدة إضافية PS5', price: 1500, qty: 1, category: 'accessories', icon: '🎮' }
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (syncChannel) {
      syncChannel.postMessage({ type: 'SYNC_UPDATE', key, timestamp: Date.now() });
    }
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export const RespawnStore = {
  // Authentication
  getCurrentUser(): UserSession | null {
    return readStorage<UserSession | null>(KEY_SESSION, null);
  },

  setCurrentUser(user: UserSession | null): void {
    writeStorage(KEY_SESSION, user);
  },

  getActiveBranchId(): string {
    return readStorage<string>(KEY_CURRENT_BRANCH, 'branch_mansour');
  },

  setActiveBranchId(branchId: string): void {
    writeStorage(KEY_CURRENT_BRANCH, branchId);
  },

  // Branches
  getBranches(): Branch[] {
    return readStorage<Branch[]>(KEY_BRANCHES, DEFAULT_BRANCHES);
  },

  addBranch(name: string, code: string, address: string, defaultHourlyRate: number, capacity: number = 20): Branch {
    const branches = this.getBranches();
    const cleanId = `branch_${Date.now().toString(36)}`;
    const newBranch: Branch = {
      id: cleanId,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      address: address.trim(),
      defaultHourlyRate: Number(defaultHourlyRate) || 4000,
      capacity: Number(capacity) || 20,
      tablesCount: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    branches.push(newBranch);
    writeStorage(KEY_BRANCHES, branches);

    this.addAuditLog('all', 'BRANCH_CREATED', `تمت إضافة فرع جديد: ${newBranch.name} (${newBranch.code})`, 'success');
    return newBranch;
  },

  deleteBranch(branchId: string): boolean {
    const branches = this.getBranches();
    const target = branches.find(b => b.id === branchId);
    if (!target) return false;

    const updated = branches.filter(b => b.id !== branchId);
    writeStorage(KEY_BRANCHES, updated);

    // Clean tables belonging to this branch
    const allTables = this.getTables();
    const remainingTables = allTables.filter(t => t.branchId !== branchId);
    writeStorage(KEY_TABLES, remainingTables);

    this.addAuditLog('all', 'BRANCH_DELETED', `تم حذف الفرع نهائياً: ${target.name}`, 'warning');
    return true;
  },

  updateBranchStatus(branchId: string, status: 'active' | 'frozen' | 'maintenance'): void {
    const branches = this.getBranches().map(b => b.id === branchId ? { ...b, status } : b);
    writeStorage(KEY_BRANCHES, branches);
    this.addAuditLog(branchId, 'BRANCH_STATUS_CHANGE', `تم تغيير حالة الفرع إلى: ${status}`, status === 'frozen' ? 'warning' : 'info');
  },

  // Tables
  getTables(branchId?: string): LoungeTable[] {
    const all = readStorage<LoungeTable[]>(KEY_TABLES, INITIAL_TABLES);
    if (branchId && branchId !== 'all') {
      return all.filter(t => t.branchId === branchId);
    }
    return all;
  },

  getTableById(tableId: string): LoungeTable | undefined {
    return this.getTables().find(t => t.id === tableId);
  },

  addTable(
    branchId: string,
    name: string,
    gameType: GameType,
    deviceLabel: string,
    rateSingle: number,
    rateMulti?: number
  ): LoungeTable {
    const tables = this.getTables();
    const branchTables = tables.filter(t => t.branchId === branchId);
    const newNumber = branchTables.length + 1;

    const newTable: LoungeTable = {
      id: `tbl_${Date.now().toString(36)}`,
      branchId,
      number: newNumber,
      name: name.trim() || `طاولة رقم ${newNumber}`,
      gameType,
      status: 'available',
      hourlyRateSingle: Number(rateSingle) || 4000,
      hourlyRateMulti: Number(rateMulti) || Number(rateSingle) || 6000,
      deviceLabel: deviceLabel.trim() || `${gameType.toUpperCase()} Station`
    };

    tables.push(newTable);
    writeStorage(KEY_TABLES, tables);

    // Update branch table count
    const branches = this.getBranches();
    const b = branches.find(x => x.id === branchId);
    if (b) {
      b.tablesCount = tables.filter(t => t.branchId === branchId).length;
      writeStorage(KEY_BRANCHES, branches);
    }

    this.addAuditLog(branchId, 'TABLE_CREATED', `إضافة طاولة جديدة: ${newTable.name} (${newTable.deviceLabel})`, 'success');
    return newTable;
  },

  deleteTable(tableId: string): boolean {
    const tables = this.getTables();
    const target = tables.find(t => t.id === tableId);
    if (!target) return false;

    const updated = tables.filter(t => t.id !== tableId);
    writeStorage(KEY_TABLES, updated);

    // Update branch table count
    const branches = this.getBranches();
    const b = branches.find(x => x.id === target.branchId);
    if (b) {
      b.tablesCount = updated.filter(t => t.branchId === target.branchId).length;
      writeStorage(KEY_BRANCHES, branches);
    }

    this.addAuditLog(target.branchId, 'TABLE_DELETED', `تم حذف الطاولة: ${target.name}`, 'warning');
    return true;
  },

  openTableSession(
    tableId: string,
    customerName: string,
    mode: 'open' | 'timer',
    targetMinutes?: number,
    isMultiplayer: boolean = false,
    phone?: string
  ): LoungeTable | null {
    const tables = this.getTables();
    const idx = tables.findIndex(t => t.id === tableId);
    if (idx === -1) return null;

    const table = tables[idx];
    const rate = isMultiplayer ? table.hourlyRateMulti : table.hourlyRateSingle;

    table.status = 'active';
    table.session = {
      sessionId: `ses_${Date.now()}`,
      customerName: customerName || 'زبون عام',
      customerPhone: phone,
      mode,
      targetMinutes: mode === 'timer' ? (targetMinutes || 60) : undefined,
      startedAt: new Date().toISOString(),
      isMultiplayer,
      hourlyRate: rate,
      orders: [],
      discount: 0,
      isPaused: false,
      totalPausedSeconds: 0,
      earlyPaid: 0
    };

    writeStorage(KEY_TABLES, tables);
    this.addAuditLog(
      table.branchId,
      'TABLE_OPENED',
      `تم فتح الطاولة "${table.name}" للزبون "${customerName || 'عام'}" بنمط ${mode === 'timer' ? `${targetMinutes} دقيقة` : 'وقت مفتوح'}`,
      'info'
    );
    return table;
  },

  addOrderToSession(tableId: string, item: OrderItem): void {
    const tables = this.getTables();
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.session) return;

    const existingIdx = table.session.orders.findIndex(o => o.id === item.id);
    if (existingIdx !== -1) {
      table.session.orders[existingIdx].qty += item.qty;
    } else {
      table.session.orders.push({ ...item });
    }

    writeStorage(KEY_TABLES, tables);
    this.addAuditLog(
      table.branchId,
      'ORDER_ADDED',
      `إضافة طلب "${item.name}" (×${item.qty}) للطاولة "${table.name}"`,
      'info'
    );
  },

  updateSessionOrderQty(tableId: string, orderId: string, delta: number): void {
    const tables = this.getTables();
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.session) return;

    table.session.orders = table.session.orders
      .map(o => o.id === orderId ? { ...o, qty: Math.max(0, o.qty + delta) } : o)
      .filter(o => o.qty > 0);

    writeStorage(KEY_TABLES, tables);
  },

  applySessionDiscount(tableId: string, discount: number): void {
    const tables = this.getTables();
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.session) return;

    table.session.discount = Math.max(0, discount);
    writeStorage(KEY_TABLES, tables);
  },

  toggleSessionPause(tableId: string): void {
    const tables = this.getTables();
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.session) return;

    if (!table.session.isPaused) {
      table.session.isPaused = true;
      table.session.pausedAt = new Date().toISOString();
    } else {
      table.session.isPaused = false;
      if (table.session.pausedAt) {
        const pauseDuration = Math.floor((Date.now() - new Date(table.session.pausedAt).getTime()) / 1000);
        table.session.totalPausedSeconds += Math.max(0, pauseDuration);
        table.session.pausedAt = undefined;
      }
    }

    writeStorage(KEY_TABLES, tables);
    this.addAuditLog(
      table.branchId,
      table.session.isPaused ? 'SESSION_PAUSED' : 'SESSION_RESUMED',
      `تم ${table.session.isPaused ? 'إيقاف' : 'استئناف'} عداد الطاولة "${table.name}"`,
      'info'
    );
  },

  closeTableSession(
    tableId: string,
    paidAmount: number,
    debtAmount: number,
    paymentMethod: 'cash' | 'zaincash' | 'debt',
    debtNotes?: string
  ): Invoice | null {
    const tables = this.getTables();
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.session) return null;

    const session = table.session;
    const now = new Date();
    const startTime = new Date(session.startedAt).getTime();
    const nowTime = now.getTime();
    
    let effectiveSeconds = Math.floor((nowTime - startTime) / 1000) - (session.totalPausedSeconds || 0);
    if (session.isPaused && session.pausedAt) {
      const ongoingPause = Math.floor((nowTime - new Date(session.pausedAt).getTime()) / 1000);
      effectiveSeconds -= ongoingPause;
    }
    effectiveSeconds = Math.max(60, effectiveSeconds);

    const durationMinutes = Math.ceil(effectiveSeconds / 60);

    let timeCost = 0;
    if (session.mode === 'timer' && session.targetMinutes) {
      timeCost = Math.round((session.targetMinutes / 60) * session.hourlyRate);
    } else {
      timeCost = Math.round((effectiveSeconds / 3600) * session.hourlyRate);
    }

    const ordersCost = session.orders.reduce((sum, o) => sum + o.price * o.qty, 0);
    const subtotal = timeCost + ordersCost;
    const total = Math.max(0, subtotal - session.discount);

    const branches = this.getBranches();
    const branch = branches.find(b => b.id === table.branchId);

    const invoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      branchId: table.branchId,
      branchName: branch ? branch.name : 'قاعة رسبون',
      tableId: table.id,
      tableName: table.name,
      tableNumber: table.number,
      gameType: table.gameType,
      customerName: session.customerName,
      customerPhone: session.customerPhone,
      startedAt: session.startedAt,
      endedAt: now.toISOString(),
      durationMinutes,
      timeCost,
      ordersCost,
      orders: [...session.orders],
      discount: session.discount,
      subtotal,
      total,
      paidAmount,
      debtAmount,
      paymentMethod,
      timestamp: now.toISOString()
    };

    const invoices = this.getInvoices();
    invoices.unshift(invoice);
    writeStorage(KEY_INVOICES, invoices);

    if (debtAmount > 0) {
      const debts = this.getDebts();
      const newDebt: DebtRecord = {
        id: `debt_${Date.now()}`,
        branchId: table.branchId,
        customerName: session.customerName,
        phone: session.customerPhone || '',
        amount: debtAmount,
        paid: 0,
        tableName: table.name,
        invoiceId: invoice.id,
        notes: debtNotes || `متبقي من فاتورة ${invoice.id}`,
        date: now.toISOString(),
        status: 'unpaid'
      };
      debts.unshift(newDebt);
      writeStorage(KEY_DEBTS, debts);
    }

    table.status = 'available';
    table.session = undefined;
    writeStorage(KEY_TABLES, tables);

    this.addAuditLog(
      table.branchId,
      'TABLE_CLOSED',
      `إغلاق طاولة "${table.name}" - إجمالي الفاتورة: ${total.toLocaleString()} د.ع`,
      'success'
    );

    return invoice;
  },

  // Invoices & Debts
  getInvoices(branchId?: string): Invoice[] {
    const list = readStorage<Invoice[]>(KEY_INVOICES, INITIAL_INVOICES);
    if (branchId && branchId !== 'all') {
      return list.filter(i => i.branchId === branchId);
    }
    return list;
  },

  getDebts(branchId?: string): DebtRecord[] {
    const list = readStorage<DebtRecord[]>(KEY_DEBTS, INITIAL_DEBTS);
    if (branchId && branchId !== 'all') {
      return list.filter(d => d.branchId === branchId);
    }
    return list;
  },

  payDebt(debtId: string, amount: number): void {
    const debts = this.getDebts();
    const d = debts.find(x => x.id === debtId);
    if (!d) return;

    d.paid = Math.min(d.amount, d.paid + amount);
    d.status = d.paid >= d.amount ? 'settled' : 'partial';
    writeStorage(KEY_DEBTS, debts);

    this.addAuditLog(
      d.branchId,
      'DEBT_PAYMENT',
      `تسديد ${amount.toLocaleString()} د.ع من دين الزبون "${d.customerName}"`,
      'success'
    );
  },

  // Audit Logs
  getAuditLogs(branchId?: string): AuditLog[] {
    const list = readStorage<AuditLog[]>(KEY_AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    if (branchId && branchId !== 'all') {
      return list.filter(l => l.branchId === branchId);
    }
    return list;
  },

  addAuditLog(branchId: string, action: string, details: string, severity: 'info' | 'success' | 'warning' | 'critical' = 'info'): void {
    const user = this.getCurrentUser();
    const branches = this.getBranches();
    const b = branches.find(x => x.id === branchId);

    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      branchId,
      branchName: b ? b.name : (branchId === 'all' ? 'كافة الفروع' : branchId),
      user: user ? user.name : 'System Core',
      action,
      details,
      severity,
      timestamp: new Date().toISOString()
    };

    const logs = this.getAuditLogs();
    logs.unshift(log);
    writeStorage(KEY_AUDIT_LOGS, logs.slice(0, 150));
  },

  // Financial Statistics
  getBranchFinancials(branchId?: string): BranchFinancials {
    const invoices = this.getInvoices(branchId);
    const debts = this.getDebts(branchId);
    const tables = this.getTables(branchId);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfWeek = startOfToday - 7 * 86400000;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let dailyRevenue = 0;
    let yesterdayRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;

    invoices.forEach(inv => {
      const t = new Date(inv.timestamp).getTime();
      const revenuePart = inv.paidAmount;
      if (t >= startOfToday) {
        dailyRevenue += revenuePart;
      } else if (t >= startOfYesterday && t < startOfToday) {
        yesterdayRevenue += revenuePart;
      }

      if (t >= startOfWeek) {
        weeklyRevenue += revenuePart;
      }
      if (t >= startOfMonth) {
        monthlyRevenue += revenuePart;
      }
    });

    const totalDebts = debts
      .filter(d => d.status !== 'settled')
      .reduce((sum, d) => sum + (d.amount - d.paid), 0);

    const occupiedTablesCount = tables.filter(t => t.status === 'active').length;

    return {
      dailyRevenue,
      yesterdayRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalDebts,
      activeSessionsCount: occupiedTablesCount,
      occupiedTablesCount,
      totalTablesCount: tables.length
    };
  },

  subscribe(callback: () => void): () => void {
    if (!syncChannel) return () => {};
    const handler = () => callback();
    syncChannel.addEventListener('message', handler);
    return () => syncChannel.removeEventListener('message', handler);
  }
};
