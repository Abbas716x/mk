export type GameType = 'ps5' | 'billiards' | 'tennis' | 'domino';

export type TableStatus = 'available' | 'active' | 'cleaning' | 'reserved';

export type SessionMode = 'open' | 'timer';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  category: 'drinks' | 'snacks' | 'hookah' | 'accessories';
  icon: string;
}

export interface TableSession {
  sessionId: string;
  customerName: string;
  customerPhone?: string;
  mode: SessionMode;
  targetMinutes?: number;
  startedAt: string; // ISO string
  isMultiplayer: boolean;
  hourlyRate: number;
  orders: OrderItem[];
  discount: number;
  isPaused: boolean;
  pausedAt?: string;
  totalPausedSeconds: number;
  earlyPaid: number;
}

export interface LoungeTable {
  id: string;
  branchId: string;
  number: number;
  name: string;
  gameType: GameType;
  status: TableStatus;
  hourlyRateSingle: number;
  hourlyRateMulti: number;
  deviceLabel: string;
  session?: TableSession;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'frozen' | 'maintenance';
  capacity: number;
  tablesCount: number;
  defaultHourlyRate: number;
  address: string;
  createdAt?: string;
}

export interface Invoice {
  id: string;
  branchId: string;
  branchName: string;
  tableId: string;
  tableName: string;
  tableNumber: number;
  gameType: GameType;
  customerName: string;
  customerPhone?: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  timeCost: number;
  ordersCost: number;
  orders: OrderItem[];
  discount: number;
  subtotal: number;
  total: number;
  paidAmount: number;
  debtAmount: number;
  paymentMethod: 'cash' | 'zaincash' | 'debt';
  timestamp: string;
}

export interface DebtRecord {
  id: string;
  branchId: string;
  customerName: string;
  phone: string;
  amount: number;
  paid: number;
  tableName: string;
  invoiceId?: string;
  notes: string;
  date: string;
  status: 'unpaid' | 'partial' | 'settled';
}

export interface AuditLog {
  id: string;
  branchId: string;
  branchName: string;
  user: string;
  action: string;
  details: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  timestamp: string;
}

export interface UserSession {
  username: string;
  name: string;
  role: 'SUPER_ADMIN' | 'BRANCH_OPERATOR';
  assignedBranch: string; // 'all' or branchId
  token: string;
  loggedInAt: string;
}

export interface BranchFinancials {
  dailyRevenue: number;
  yesterdayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalDebts: number;
  activeSessionsCount: number;
  occupiedTablesCount: number;
  totalTablesCount: number;
}
