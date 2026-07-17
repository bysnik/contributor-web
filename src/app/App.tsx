import { useState } from "react";
import {
  LayoutDashboard, LifeBuoy, BookOpen, Server, CreditCard,
  AlertCircle, Clock, Plus, Search, Paperclip, Send,
  ChevronRight, ChevronLeft, Cpu, HardDrive, Network,
  Activity, FileText, Download, Shield, User, Settings,
  Building2, X, Bell, Eye, RefreshCw, Check, Zap,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

// ─── Data ─────────────────────────────────────────────────────────────────────

const TICKETS = [
  { id: "INC-2847", title: "Нет доступа к 1С с рабочих станций бухгалтерии", priority: "critical", status: "in_progress", category: "Инфраструктура", created: "16.07.2024 09:12", assignee: "Иванов И.А.", slaLeft: 47, comments: 3 },
  { id: "INC-2841", title: "Медленная работа Wi-Fi в конференц-зале №2", priority: "high", status: "pending", category: "Сеть", created: "15.07.2024 14:30", assignee: null, slaLeft: 180, comments: 1 },
  { id: "REQ-0412", title: "Создание пользователя в AD для Смирновой Е.В.", priority: "low", status: "resolved", category: "ПО", created: "14.07.2024 11:00", assignee: "Сидоров С.К.", slaLeft: 0, comments: 2 },
  { id: "INC-2839", title: "Принтер HP LaserJet M507 не принимает задания", priority: "medium", status: "pending", category: "Инфраструктура", created: "13.07.2024 16:45", assignee: null, slaLeft: 320, comments: 0 },
  { id: "CHG-0089", title: "Плановое обновление антивируса на серверах", priority: "low", status: "approved", category: "ПО", created: "10.07.2024 09:00", assignee: "Иванов И.А.", slaLeft: 0, comments: 4 },
];

const WORK_LOG = [
  { id: 1, date: "16.07.2024", time: "14:22", engineer: "Иванов И.А.", title: "Обновление ядра Linux на сервере srv-db-01", body: "Обновлено ядро с 5.15.0 до 6.1.86-LTS. Работы выполнены в сервисное окно 03:00–04:00. Все сервисы запущены в штатном режиме, проверена доступность БД PostgreSQL.", ticket: "INC-2815", device: "srv-db-01", attachments: ["kernel_update_log.txt"], confirmed: true },
  { id: 2, date: "15.07.2024", time: "11:05", engineer: "Сидоров С.К.", title: "Замена диска в RAID-массиве NAS Synology", body: "Выполнена плановая замена накопителя Seagate ST4000NM001A (S/N: ZFN2K3QE). Массив перестроен, статус HEALTHY. Рекомендуем проверить архив резервных копий.", ticket: null, device: "nas-01", attachments: [], confirmed: false },
  { id: 3, date: "14.07.2024", time: "09:30", engineer: "Иванов И.А.", title: "Настройка SSL-VPN для удалённых сотрудников", body: "Настроен SSL-VPN на Fortinet FortiGate 100F. Добавлено 12 профилей, настроена двухфакторная аутентификация через TOTP. Проверена работа с 5 тестовых устройств.", ticket: "REQ-0405", device: "fw-01", attachments: ["vpn_config_backup.conf"], confirmed: true },
  { id: 4, date: "10.07.2024", time: "16:00", engineer: "Петров В.С.", title: "Аудит учётных записей Active Directory", body: "Проведён аудит 347 учётных записей. Заблокировано 8 неактивных аккаунтов, удалено 3 устаревших группы безопасности. Отчёт приложен.", ticket: null, device: null, attachments: ["ad_audit_report_july.xlsx"], confirmed: true },
];

const DEVICES = [
  { id: "srv-db-01", name: "srv-db-01", type: "server", model: "Dell PowerEdge R740", serial: "JF7KL92B", location: "Главный офис", rack: "Rack-A", unit: "U12–U15", ip: "10.0.1.10", os: "Ubuntu Server 22.04 LTS", status: "ok", cpu: 34, ram: 67, disk: 52, uptime: "47 дней", warranty: "15.03.2026", vms: ["vm-1c-prod", "vm-postgres-01"], cpuHistory: [20,34,28,45,23,56,34,28,67,34,45,34] },
  { id: "srv-app-01", name: "srv-app-01", type: "server", model: "Dell PowerEdge R640", serial: "GH3MN18A", location: "Главный офис", rack: "Rack-A", unit: "U8–U10", ip: "10.0.1.11", os: "Rocky Linux 9.3", status: "ok", cpu: 12, ram: 45, disk: 38, uptime: "124 дня", warranty: "20.01.2027", vms: ["vm-nginx-01", "vm-gitlab"], cpuHistory: [8,12,10,15,9,11,14,12,10,13,12,11] },
  { id: "sw-core-01", name: "sw-core-01", type: "switch", model: "Cisco Catalyst 9300-48P", serial: "FCW2247L001", location: "Главный офис", rack: "Rack-A", unit: "U1", ip: "10.0.0.1", os: "IOS XE 17.9.4a", status: "ok", cpu: 8, ram: null, disk: null, uptime: "203 дня", warranty: "01.06.2028", vms: [], cpuHistory: [5,8,6,9,7,8,10,8,7,9,8,8] },
  { id: "fw-01", name: "fw-01", type: "firewall", model: "Fortinet FortiGate 100F", serial: "FGT1H3K18034567", location: "Главный офис", rack: "Rack-A", unit: "U2", ip: "10.0.0.254", os: "FortiOS 7.4.3", status: "warning", cpu: 71, ram: 58, disk: null, uptime: "47 дней", warranty: "30.09.2026", vms: [], cpuHistory: [45,55,60,71,68,72,71,65,70,71,73,71] },
  { id: "nas-01", name: "nas-01", type: "storage", model: "Synology RS3621xs+", serial: "2250NNN000111", location: "Серверная №2", rack: "Rack-B", unit: "U4", ip: "10.0.1.20", os: "DSM 7.2.1", status: "ok", cpu: 8, ram: null, disk: 44, uptime: "180 дней", warranty: "12.05.2027", vms: [], cpuHistory: [5,6,8,7,9,8,7,6,8,9,8,7] },
];

const DOCUMENTS = [
  { id: 1, title: "Договор №2024-IT-089 на техническое обслуживание", type: "Договор", tags: ["Юридические"], date: "01.02.2024", size: "348 КБ" },
  { id: 2, title: "Спецификация оборудования — Поставка март 2024", type: "Спецификация", tags: ["Оборудование"], date: "15.03.2024", size: "1.2 МБ" },
  { id: 3, title: "Акт приёмки-передачи серверного оборудования", type: "Акт", tags: ["Юридические", "Серверы"], date: "22.03.2024", size: "512 КБ" },
  { id: 4, title: "Инструкция по подключению к VPN для сотрудников", type: "Инструкция", tags: ["Сеть", "ПО"], date: "14.07.2024", size: "890 КБ" },
  { id: 5, title: "Схема сетевой топологии (актуализирована)", type: "Схема", tags: ["Сеть"], date: "10.05.2024", size: "2.4 МБ" },
  { id: 6, title: "Регламент доступа к корпоративному Wi-Fi", type: "Регламент", tags: ["Сеть", "Политика"], date: "01.01.2024", size: "145 КБ" },
];

const INVOICES = [
  { id: "СЧ-2024-07", period: "Июль 2024", amount: 185000, status: "pending", issued: "01.07.2024", due: "31.07.2024" },
  { id: "СЧ-2024-06", period: "Июнь 2024", amount: 185000, status: "paid", issued: "01.06.2024", due: "30.06.2024" },
  { id: "СЧ-2024-05", period: "Май 2024", amount: 197500, status: "paid", issued: "01.05.2024", due: "31.05.2024" },
  { id: "СЧ-2024-04", period: "Апрель 2024", amount: 185000, status: "paid", issued: "01.04.2024", due: "30.04.2024" },
];

const LICENSES = [
  { name: "Microsoft 365 Business", expires: "15.12.2024", daysLeft: 152, vendor: "Microsoft", seats: 45 },
  { name: "Kaspersky Endpoint Security", expires: "01.11.2024", daysLeft: 108, vendor: "Kaspersky", seats: 50 },
  { name: "Veeam Backup & Replication", expires: "30.09.2024", daysLeft: 76, vendor: "Veeam", seats: null },
];

const MAINTENANCE = [
  { title: "Замена ИБП в стойке Rack-A", date: "20.07.2024", time: "03:00–05:00" },
  { title: "Обновление прошивки коммутаторов", date: "27.07.2024", time: "02:00–04:00" },
  { title: "Квартальное ТО серверного оборудования", date: "15.08.2024", time: "09:00–18:00" },
];

// ─── Config maps ──────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  ok: { label: "OK", color: "#22C55E" },
  warning: { label: "Внимание", color: "#F59E0B" },
  critical: { label: "Критично", color: "#EF4444" },
  offline: { label: "Недоступен", color: "#6B7280" },
};

const TICKET_STATUS_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Ожидает", bg: "#1A222920", text: "#94A3B8", dot: "#94A3B8" },
  in_progress: { label: "В работе", bg: "#0D213720", text: "#38BDF8", dot: "#38BDF8" },
  resolved: { label: "Решён", bg: "#0D231820", text: "#22C55E", dot: "#22C55E" },
  approved: { label: "Согласован", bg: "#1A1A2E20", text: "#8B5CF6", dot: "#8B5CF6" },
  closed: { label: "Закрыт", bg: "#11182020", text: "#4A6070", dot: "#4A6070" },
};

const PRIORITY_CFG: Record<string, { label: string; color: string }> = {
  critical: { label: "Критический", color: "#EF4444" },
  high: { label: "Высокий", color: "#F59E0B" },
  medium: { label: "Средний", color: "#3B82F6" },
  low: { label: "Низкий", color: "#22C55E" },
};

const DEVICE_ICON: Record<string, React.ElementType> = {
  server: Server,
  switch: Network,
  firewall: Shield,
  storage: HardDrive,
};

// ─── Utility components ───────────────────────────────────────────────────────

function StatusDot({ status, size = 8 }: { status: string; size?: number }) {
  const color = STATUS_CFG[status]?.color ?? "#6B7280";
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
    />
  );
}

function TicketBadge({ status }: { status: string }) {
  const c = TICKET_STATUS_CFG[status] ?? TICKET_STATUS_CFG.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs" style={{ ...MONO, backgroundColor: c.bg, color: c.text, border: `1px solid ${c.dot}20` }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  );
}

function PriorityTag({ priority }: { priority: string }) {
  const c = PRIORITY_CFG[priority] ?? PRIORITY_CFG.low;
  return (
    <span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, color: c.color, backgroundColor: `${c.color}15`, border: `1px solid ${c.color}30` }}>
      {c.label}
    </span>
  );
}

function SLATimer({ minutes }: { minutes: number }) {
  if (minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const urgent = minutes < 60;
  return (
    <span className="text-xs flex items-center gap-1 flex-shrink-0" style={{ ...MONO, color: urgent ? "#EF4444" : "#94A3B8" }}>
      <Clock size={11} />
      {h > 0 ? `${h}ч ${m}м` : `${m}м`}
    </span>
  );
}

function Sparkline({ data, color = "#00D4A8" }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`sg${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg${color.replace("#", "")})`} dot={false} isAnimationActive={false} />
        <Tooltip
          contentStyle={{ background: "#0C1117", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: "2px 8px" }}
          itemStyle={{ color }}
          formatter={(v: number) => [`${v}%`, ""]}
          labelFormatter={() => ""}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const barColor = value > 80 ? "#EF4444" : value > 65 ? "#F59E0B" : color;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs" style={{ ...MONO, color: "#4A6070" }}>
        <span>{label}</span>
        <span style={{ color: value > 65 ? barColor : "#94A3B8" }}>{value}%</span>
      </div>
      <div className="h-px rounded-full" style={{ backgroundColor: "#1A2229" }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`bg-card border border-border rounded ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>{children}</div>;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const critical = DEVICES.some(d => d.status === "critical");
  const warning = DEVICES.some(d => d.status === "warning");
  const health = critical ? "critical" : warning ? "warning" : "ok";
  const healthColor = STATUS_CFG[health].color;
  const healthLabel = { ok: "Штатный режим", warning: "Требует внимания", critical: "Критические проблемы" }[health];
  const criticalTickets = TICKETS.filter(t => t.priority === "critical" && t.status !== "resolved");

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-4">
          <Label>Состояние инфраструктуры</Label>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${healthColor}15` }}>
              <Activity size={20} style={{ color: healthColor }} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: healthColor }}>{healthLabel}</div>
              <div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>
                {DEVICES.filter(d => d.status === "ok").length}/{DEVICES.length} устройств норма
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            {DEVICES.map(d => <StatusDot key={d.id} status={d.status} size={6} />)}
          </div>
        </Card>

        <Card className="p-4">
          <Label>Активные инциденты</Label>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold" style={{ color: criticalTickets.length > 0 ? "#EF4444" : "#22C55E" }}>
              {criticalTickets.length}
            </span>
            <span className="text-muted-foreground text-sm mb-1.5">критических</span>
          </div>
          <div className="space-y-1 mt-1">
            {TICKETS.filter(t => t.status === "in_progress").slice(0, 2).map(t => (
              <div key={t.id} className="flex items-center gap-1.5 text-xs" style={{ ...MONO, color: "#4A6070" }}>
                <span style={{ color: PRIORITY_CFG[t.priority].color }}>●</span>
                {t.id}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <Label>Ближайшие работы</Label>
          <div className="space-y-2.5">
            {MAINTENANCE.slice(0, 2).map((m, i) => (
              <div key={i}>
                <div className="text-xs text-foreground leading-snug">{m.title}</div>
                <div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>{m.date} · {m.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <Label>Лицензии / подписки</Label>
          <div className="space-y-2">
            {LICENSES.map((l, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground truncate flex-1">{l.name.split(" ").slice(0, 2).join(" ")}</span>
                <span className="text-xs flex-shrink-0" style={{ ...MONO, color: l.daysLeft < 90 ? "#F59E0B" : "#4A6070" }}>
                  {l.daysLeft}д
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Device sparklines */}
      <div>
        <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Мониторинг устройств</div>
        <div className="grid grid-cols-5 gap-3">
          {DEVICES.map(device => {
            const Icon = DEVICE_ICON[device.type] ?? Server;
            const sc = STATUS_CFG[device.status];
            const sparkColor = (device.cpu ?? 0) > 70 ? "#F59E0B" : "#00D4A8";
            return (
              <Card key={device.id} className="p-3 hover:border-[rgba(255,255,255,0.15)] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={13} style={{ color: sc.color }} />
                  <StatusDot status={device.status} size={5} />
                </div>
                <div className="text-xs font-medium truncate" style={MONO}>{device.name}</div>
                <div className="text-xs truncate mt-0.5" style={{ color: "#4A6070" }}>{device.model.split(" ").slice(0, 2).join(" ")}</div>
                {device.cpu != null && (
                  <>
                    <div className="mt-2">
                      <Sparkline data={device.cpuHistory} color={sparkColor} />
                    </div>
                    <div className="text-xs text-center" style={{ ...MONO, color: sparkColor }}>CPU {device.cpu}%</div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tickets + log preview */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Последние обращения</div>
          <div className="space-y-2">
            {TICKETS.slice(0, 3).map(t => (
              <Card key={t.id} className="p-3 flex items-center gap-3">
                <AlertCircle size={13} style={{ color: PRIORITY_CFG[t.priority].color, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{t.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{t.id}</span>
                    <TicketBadge status={t.status} />
                  </div>
                </div>
                {t.slaLeft > 0 && <SLATimer minutes={t.slaLeft} />}
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Последние работы</div>
          <div className="space-y-2">
            {WORK_LOG.slice(0, 3).map(log => (
              <Card key={log.id} className="p-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#00D4A8" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{log.title}</div>
                    <div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>{log.date} · {log.engineer}</div>
                  </div>
                  {log.confirmed && <Check size={11} style={{ color: "#22C55E", flexShrink: 0, marginTop: 3 }} />}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Service Desk ─────────────────────────────────────────────────────────────

function ServiceDesk() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selPriority, setSelPriority] = useState("medium");

  const filtered = TICKETS.filter(t => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.includes(search)) return false;
    return true;
  });

  const sel = selected ? TICKETS.find(t => t.id === selected) : null;

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4A6070" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по заявкам..." className="w-full rounded text-sm pl-8 pr-3 py-2 outline-none transition-colors" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} />
          </div>
          {(["all","in_progress","pending","resolved"] as const).map(v => (
            <button key={v} onClick={() => setFilter(v)} className="text-xs px-3 py-2 rounded border transition-colors" style={{ borderColor: filter === v ? "#00D4A8" : "rgba(255,255,255,0.065)", color: filter === v ? "#00D4A8" : "#4A6070", backgroundColor: filter === v ? "#00D4A808" : "transparent" }}>
              {v === "all" ? "Все" : v === "in_progress" ? "В работе" : v === "pending" ? "Ожидает" : "Решён"}
            </button>
          ))}
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: "#00D4A8", color: "#000" }}>
            <Plus size={13} />
            Создать
          </button>
        </div>

        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} onClick={() => setSelected(t.id === selected ? null : t.id)} className="p-4 border rounded transition-all" style={{ backgroundColor: selected === t.id ? "#00D4A808" : "#0C1117", borderColor: selected === t.id ? "rgba(0,212,168,0.35)" : "rgba(255,255,255,0.065)", cursor: "pointer" }}>
              <div className="flex items-start gap-3">
                <AlertCircle size={14} style={{ color: PRIORITY_CFG[t.priority].color, flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{t.id}</span>
                    <PriorityTag priority={t.priority} />
                    <TicketBadge status={t.status} />
                  </div>
                  <div className="text-sm text-foreground">{t.title}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ ...MONO, color: "#4A6070" }}>
                    <span>{t.category}</span>
                    <span>·</span>
                    <span>{t.created}</span>
                    {t.assignee && <><span>·</span><span>{t.assignee}</span></>}
                    {t.comments > 0 && <><span>·</span><span>{t.comments} комм.</span></>}
                  </div>
                </div>
                {t.slaLeft > 0 && <SLATimer minutes={t.slaLeft} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {sel && (
        <div className="w-72 flex-shrink-0">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold" style={{ ...MONO, color: "#00D4A8" }}>{sel.id}</span>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors"><X size={13} /></button>
            </div>
            <div className="text-sm font-medium mb-3">{sel.title}</div>
            <div className="flex gap-1.5 flex-wrap mb-4">
              <PriorityTag priority={sel.priority} />
              <TicketBadge status={sel.status} />
            </div>
            <div className="space-y-2 text-xs mb-4" style={MONO}>
              {[["Категория", sel.category], ["Создана", sel.created], ["Исполнитель", sel.assignee ?? "Не назначен"]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#4A6070" }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
              {sel.slaLeft > 0 && (
                <div className="flex justify-between py-1.5">
                  <span style={{ color: "#4A6070" }}>SLA (решение)</span>
                  <SLATimer minutes={sel.slaLeft} />
                </div>
              )}
            </div>
            <div className="text-xs mb-2" style={{ ...MONO, color: "#4A6070" }}>Комментарий</div>
            <textarea rows={3} placeholder="Добавить комментарий..." className="w-full rounded text-xs p-2 resize-none outline-none transition-colors" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC", fontFamily: "inherit" }} />
            <button className="mt-2 w-full flex items-center justify-center gap-2 py-1.5 rounded text-xs font-medium" style={{ backgroundColor: "#00D4A815", color: "#00D4A8", border: "1px solid #00D4A830" }}>
              <Send size={10} />
              Отправить
            </button>
          </Card>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="w-full max-w-lg rounded p-6" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold">Новая заявка</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={15} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Категория</div>
                <select className="w-full rounded text-sm py-2 px-3 outline-none" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }}>
                  <option>Инфраструктура</option>
                  <option>Сеть</option>
                  <option>ПО</option>
                  <option>Запрос на изменение</option>
                </select>
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Тема</div>
                <input className="w-full rounded text-sm py-2 px-3 outline-none" placeholder="Кратко опишите проблему" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} />
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Описание</div>
                <textarea rows={4} className="w-full rounded text-sm py-2 px-3 outline-none resize-none" placeholder="Подробно опишите ситуацию: что случилось, с каких устройств, когда началось..." style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC", fontFamily: "inherit" }} />
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Приоритет</div>
                <div className="flex gap-2">
                  {(["low","medium","high","critical"] as const).map(p => (
                    <button key={p} onClick={() => setSelPriority(p)} className="flex-1 py-1.5 rounded text-xs transition-all" style={{ borderWidth: 1, borderStyle: "solid", borderColor: selPriority === p ? PRIORITY_CFG[p].color : `${PRIORITY_CFG[p].color}30`, color: PRIORITY_CFG[p].color, backgroundColor: selPriority === p ? `${PRIORITY_CFG[p].color}18` : `${PRIORITY_CFG[p].color}08`, ...MONO }}>
                      {PRIORITY_CFG[p].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded p-4 flex items-center justify-center gap-2 text-sm" style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "#4A6070" }}>
                <Paperclip size={13} />
                Перетащите файлы или кликните для загрузки
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded text-sm transition-colors" style={{ border: "1px solid rgba(255,255,255,0.065)", color: "#4A6070" }}>
                  Отмена
                </button>
                <button className="flex-1 py-2 rounded text-sm font-medium" style={{ backgroundColor: "#00D4A8", color: "#000" }}>
                  Создать заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Documents & Work Log ─────────────────────────────────────────────────────

function Docs() {
  const [tab, setTab] = useState<"docs" | "log">("docs");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allTags = [...new Set(DOCUMENTS.flatMap(d => d.tags))];
  const filtered = activeTag ? DOCUMENTS.filter(d => d.tags.includes(activeTag)) : DOCUMENTS;

  return (
    <div className="space-y-4">
      <div className="flex gap-0 border-b border-border">
        {([["docs", "Документы"], ["log", "Журнал работ"]] as const).map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} className="px-5 py-2.5 text-sm -mb-px border-b-2 transition-colors" style={{ borderColor: tab === v ? "#00D4A8" : "transparent", color: tab === v ? "#00D4A8" : "#4A6070" }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "docs" && (
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[null, ...allTags].map(tag => (
              <button key={tag ?? "__all"} onClick={() => setActiveTag(tag)} className="text-xs px-3 py-1 rounded border transition-colors" style={{ borderColor: activeTag === tag ? "#00D4A8" : "rgba(255,255,255,0.065)", color: activeTag === tag ? "#00D4A8" : "#4A6070", backgroundColor: activeTag === tag ? "#00D4A808" : "transparent" }}>
                {tag ?? "Все"}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filtered.map(doc => (
              <Card key={doc.id} className="p-4 flex items-center gap-4 hover:border-[rgba(255,255,255,0.12)] transition-colors">
                <FileText size={16} style={{ color: "#4A6070", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground">{doc.title}</div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{doc.type}</span>
                    {doc.tags.map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#111C24", color: "#4A6070" }}>{tag}</span>
                    ))}
                    <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{doc.date}</span>
                    <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{doc.size}</span>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors ml-1"><Eye size={13} /></button>
                <button className="text-muted-foreground hover:text-foreground transition-colors"><Download size={13} /></button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "log" && (
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          <div className="space-y-6">
            {WORK_LOG.map(log => (
              <div key={log.id} className="flex gap-4">
                <div className="flex-shrink-0 w-10 flex justify-center pt-1 z-10 relative">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#00D4A8", backgroundColor: "#06090C" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#00D4A8" }} />
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="text-sm font-medium text-foreground">{log.title}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ ...MONO, color: "#4A6070" }}>
                          <span>{log.date} {log.time}</span>
                          <span>·</span>
                          <span>{log.engineer}</span>
                          {log.ticket && <><span>·</span><span style={{ color: "#38BDF8" }}>{log.ticket}</span></>}
                          {log.device && <><span>·</span><span style={{ color: "#00D4A8" }}>{log.device}</span></>}
                        </div>
                      </div>
                      {log.confirmed ? (
                        <span className="flex items-center gap-1 text-xs flex-shrink-0" style={{ ...MONO, color: "#22C55E" }}>
                          <Check size={10} />
                          Ознакомлен
                        </span>
                      ) : (
                        <button className="text-xs px-2.5 py-1 rounded flex-shrink-0 border transition-colors" style={{ borderColor: "#00D4A830", color: "#00D4A8", ...MONO }}>
                          Подтвердить
                        </button>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{log.body}</p>
                    {log.attachments.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {log.attachments.map(att => (
                          <button key={att} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors" style={{ ...MONO, backgroundColor: "#111C24", color: "#4A6070" }}>
                            <Paperclip size={9} />
                            {att}
                          </button>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Infrastructure ───────────────────────────────────────────────────────────

function Infra() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string>("Главный офис");
  const device = selectedId ? DEVICES.find(d => d.id === selectedId) : null;
  const locations = [...new Set(DEVICES.map(d => d.location))];

  return (
    <div className="flex gap-4 h-full">
      {/* Tree */}
      <div className="w-52 flex-shrink-0 space-y-0.5">
        <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Структура</div>
        {locations.map(loc => (
          <div key={loc}>
            <button onClick={() => setExpanded(loc === expanded ? "" : loc)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-foreground hover:bg-muted transition-colors">
              <ChevronRight size={11} style={{ transition: "transform 0.15s", transform: expanded === loc ? "rotate(90deg)" : "none" }} />
              <Building2 size={11} style={{ color: "#4A6070" }} />
              <span className="flex-1 text-left">{loc}</span>
            </button>
            {expanded === loc && DEVICES.filter(d => d.location === loc).map(d => {
              const Icon = DEVICE_ICON[d.type] ?? Server;
              const active = selectedId === d.id;
              return (
                <button key={d.id} onClick={() => setSelectedId(d.id === selectedId ? null : d.id)} className="w-full flex items-center gap-2 px-4 py-1.5 rounded text-xs transition-colors" style={{ color: active ? "#00D4A8" : "#4A6070", backgroundColor: active ? "#00D4A810" : "transparent" }}>
                  <Icon size={10} />
                  <span className="flex-1 text-left" style={MONO}>{d.name}</span>
                  <StatusDot status={d.status} size={5} />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {!device ? (
          <>
            <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Оборудование</div>
            <div className="grid grid-cols-3 gap-3">
              {DEVICES.map(d => {
                const Icon = DEVICE_ICON[d.type] ?? Server;
                const sc = STATUS_CFG[d.status];
                return (
                  <Card key={d.id} className="p-4 hover:border-[rgba(255,255,255,0.15)] transition-colors" onClick={() => setSelectedId(d.id)}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon size={15} style={{ color: sc.color }} />
                        <span className="text-xs font-medium" style={MONO}>{d.name}</span>
                      </div>
                      <StatusDot status={d.status} size={6} />
                    </div>
                    <div className="text-xs mb-3" style={{ color: "#4A6070" }}>{d.model}</div>
                    <div className="space-y-2">
                      {d.cpu != null && <MetricBar label="CPU" value={d.cpu} color="#00D4A8" />}
                      {d.ram != null && <MetricBar label="RAM" value={d.ram} color="#3B82F6" />}
                      {d.disk != null && <MetricBar label="Disk" value={d.disk} color="#8B5CF6" />}
                    </div>
                    <div className="mt-3 pt-3 flex justify-between text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", ...MONO, color: "#4A6070" }}>
                      <span>{d.ip}</span>
                      <span>{d.uptime}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setSelectedId(null)} className="p-1 rounded transition-colors hover:bg-muted" style={{ color: "#4A6070" }}>
                <ChevronLeft size={15} />
              </button>
              <span className="text-xs uppercase tracking-widest" style={{ ...MONO, color: "#4A6070" }}>{device.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {(() => { const Icon = DEVICE_ICON[device.type] ?? Server; return <Icon size={18} style={{ color: STATUS_CFG[device.status].color }} />; })()}
                      <div>
                        <div className="font-semibold" style={MONO}>{device.name}</div>
                        <div className="text-sm" style={{ color: "#4A6070" }}>{device.model}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusDot status={device.status} size={7} />
                      <span className="text-sm" style={{ color: STATUS_CFG[device.status].color }}>{STATUS_CFG[device.status].label}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-0 text-xs" style={MONO}>
                    {[["Серийный номер", device.serial], ["IP-адрес", device.ip, "#00D4A8"], ["ОС / прошивка", device.os], ["Аптайм", device.uptime], ["Стойка / юниты", `${device.rack} ${device.unit}`], ["Гарантия до", device.warranty]].map(([k, v, clr]) => (
                      <div key={String(k)} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ color: "#4A6070" }}>{k}</span>
                        <span style={clr ? { color: clr as string } : {}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-xs mb-3" style={{ ...MONO, color: "#4A6070" }}>НАГРУЗКА CPU (ПОСЛЕДНИЕ 12 ТОЧЕК)</div>
                  <ResponsiveContainer width="100%" height={72}>
                    <AreaChart data={device.cpuHistory.map((v, i) => ({ v, i }))} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                      <defs>
                        <linearGradient id="cpuG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={device.cpu > 65 ? "#F59E0B" : "#00D4A8"} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={device.cpu > 65 ? "#F59E0B" : "#00D4A8"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="i" hide />
                      <Tooltip contentStyle={{ background: "#0C1117", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} formatter={(v: number) => [`${v}%`, "CPU"]} labelFormatter={() => ""} />
                      <Area type="monotone" dataKey="v" stroke={device.cpu > 65 ? "#F59E0B" : "#00D4A8"} strokeWidth={1.5} fill="url(#cpuG)" dot={false} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="text-xs mb-3" style={{ ...MONO, color: "#4A6070" }}>ЗАГРУЗКА</div>
                  <div className="space-y-3">
                    {device.cpu != null && <MetricBar label="CPU" value={device.cpu} color="#00D4A8" />}
                    {device.ram != null && <MetricBar label="RAM" value={device.ram} color="#3B82F6" />}
                    {device.disk != null && <MetricBar label="Disk" value={device.disk} color="#8B5CF6" />}
                  </div>
                </Card>
                {device.vms.length > 0 && (
                  <Card className="p-4">
                    <div className="text-xs mb-3" style={{ ...MONO, color: "#4A6070" }}>ВИРТУАЛЬНЫЕ МАШИНЫ</div>
                    <div className="space-y-2">
                      {device.vms.map(vm => (
                        <div key={vm} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
                          <span className="text-xs" style={MONO}>{vm}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Finance ──────────────────────────────────────────────────────────────────

function Finance() {
  const paid = INVOICES.filter(i => i.status === "paid");
  const pending = INVOICES.filter(i => i.status === "pending");
  const totalPaid = paid.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs mb-2" style={{ ...MONO, color: "#4A6070" }}>АВАНС / БАЛАНС</div>
          <div className="text-3xl font-bold" style={{ color: "#22C55E" }}>+42 000 ₽</div>
          <div className="text-xs mt-1" style={{ ...MONO, color: "#4A6070" }}>Остаток по предоплате</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs mb-2" style={{ ...MONO, color: "#4A6070" }}>К ОПЛАТЕ</div>
          <div className="text-3xl font-bold" style={{ color: pending.length ? "#F59E0B" : "#22C55E" }}>
            {pending.length ? `${pending[0].amount.toLocaleString("ru-RU")} ₽` : "—"}
          </div>
          <div className="text-xs mt-1" style={{ ...MONO, color: "#4A6070" }}>{pending.length ? `Счёт ${pending[0].id}` : "Задолженностей нет"}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs mb-2" style={{ ...MONO, color: "#4A6070" }}>ОПЛАЧЕНО В 2024</div>
          <div className="text-3xl font-bold text-foreground">{totalPaid.toLocaleString("ru-RU")} ₽</div>
          <div className="text-xs mt-1" style={{ ...MONO, color: "#4A6070" }}>{paid.length} закрытых счета</div>
        </Card>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>История счетов</div>
        <div className="space-y-2">
          {INVOICES.map(inv => (
            <Card key={inv.id} className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: inv.status === "paid" ? "#22C55E15" : "#F59E0B15" }}>
                <CreditCard size={13} style={{ color: inv.status === "paid" ? "#22C55E" : "#F59E0B" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground">{inv.period}</div>
                <div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>{inv.id} · Выставлен {inv.issued} · Срок {inv.due}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-semibold text-sm" style={MONO}>{inv.amount.toLocaleString("ru-RU")} ₽</div>
                <div className="text-xs mt-0.5" style={{ ...MONO, color: inv.status === "paid" ? "#22C55E" : "#F59E0B" }}>
                  {inv.status === "paid" ? "Оплачен" : "Ожидает оплаты"}
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors ml-2"><Download size={13} /></button>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Инвентаризация ПО</div>
        <Card className="overflow-hidden">
          <table className="w-full text-xs" style={MONO}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.065)" }}>
                {["Программное обеспечение", "Вендор", "Мест", "Истекает", "Статус"].map(h => (
                  <th key={h} className="text-left font-normal px-4 py-3" style={{ color: "#4A6070" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LICENSES.map((l, i) => (
                <tr key={i} style={{ borderBottom: i < LICENSES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <td className="px-4 py-3 text-foreground">{l.name}</td>
                  <td className="px-4 py-3" style={{ color: "#4A6070" }}>{l.vendor}</td>
                  <td className="px-4 py-3" style={{ color: "#4A6070" }}>{l.seats ?? "—"}</td>
                  <td className="px-4 py-3" style={{ color: "#4A6070" }}>{l.expires}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: l.daysLeft < 90 ? "#F59E0B" : "#22C55E" }}>
                      {l.daysLeft < 90 ? `${l.daysLeft} дн.` : "Активна"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard", label: "Обзор", icon: LayoutDashboard },
  { id: "servicedesk", label: "Заявки", icon: LifeBuoy, badge: 2 },
  { id: "docs", label: "Документы", icon: BookOpen },
  { id: "infra", label: "Инфраструктура", icon: Server },
  { id: "finance", label: "Финансы", icon: CreditCard },
] as const;

function Sidebar({ view, setView }: { view: string; setView: (v: string) => void }) {
  return (
    <div className="w-52 flex-shrink-0 flex flex-col" style={{ backgroundColor: "#04070A", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: "#00D4A8" }}>
            <Zap size={13} style={{ color: "#000" }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">TechCore</div>
            <div className="text-xs" style={{ ...MONO, color: "#4A6070" }}>системная интеграция</div>
          </div>
        </div>
      </div>

      <div className="px-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2 px-2 py-2 rounded" style={{ backgroundColor: "#0C1117" }}>
          <Building2 size={11} style={{ color: "#4A6070", flexShrink: 0 }} />
          <div className="min-w-0">
            <div className="text-xs text-foreground truncate">ООО «АльфаТрейд»</div>
            <div className="text-xs" style={{ ...MONO, color: "#4A6070", fontSize: 10 }}>ID: ORG-0071</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(item => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => setView(item.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-sm transition-all" style={{ color: active ? "#00D4A8" : "#4A6070", backgroundColor: active ? "#00D4A810" : "transparent", borderLeft: active ? "2px solid #00D4A8" : "2px solid transparent", paddingLeft: active ? 10 : 12 }}>
              <Icon size={14} />
              <span className="flex-1 text-left">{item.label}</span>
              {"badge" in item && item.badge && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#EF444420", color: "#EF4444" }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ ...MONO, backgroundColor: "#00D4A818", color: "#00D4A8" }}>
            ПА
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-foreground truncate">Петров А.С.</div>
            <div className="text-xs" style={{ ...MONO, color: "#4A6070", fontSize: 10 }}>Администратор</div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Дашборд",
  servicedesk: "Служба поддержки",
  docs: "Документы и журнал работ",
  infra: "Инфраструктура",
  finance: "Финансы",
};

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ backgroundColor: "#04070A", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <h1 className="text-sm font-semibold text-foreground">{PAGE_TITLES[view]}</h1>
            <div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>ООО «АльфаТрейд» · 16.07.2024</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded hover:bg-muted transition-colors" style={{ color: "#4A6070" }}>
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#EF4444" }} />
            </button>
            <button className="p-2 rounded hover:bg-muted transition-colors" style={{ color: "#4A6070" }}>
              <RefreshCw size={13} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>Обновлено: 14:22</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {view === "dashboard" && <Dashboard />}
          {view === "servicedesk" && <ServiceDesk />}
          {view === "docs" && <Docs />}
          {view === "infra" && <Infra />}
          {view === "finance" && <Finance />}
        </div>
      </div>
    </div>
  );
}
