import { useState, useRef, useCallback, useEffect, useId } from "react";
import {
  LayoutDashboard, LifeBuoy, BookOpen, CreditCard,
  AlertCircle, Clock, Plus, Search, Paperclip, Send,
  ChevronRight, ChevronLeft, HardDrive, Activity,
  FileText, Download, Shield, Settings, Building2,
  X, Bell, Eye, RefreshCw, Check, Zap, ArrowLeft,
  Maximize2, Box, Layers, GitBranch, ChevronDown,
  Database, Globe, Router, TerminalSquare, Award,
  Key, Copy, EyeOff, BarChart2, Calendar, Code2,
  TrendingUp, Users, Newspaper, Star, User, Package,
  History, Trash2, Edit3, ExternalLink, Lock, Radio,
  ChevronUp, Network, Cpu, BellRing, BookMarked,
  MessageSquare, Wrench, Timer, LogOut,
  ArrowRightLeft, Gauge, PlayCircle, StopCircle,
  Flame, GitMerge, StickyNote, LayoutGrid, Sun, Moon,
  Hash, Filter, TicketCheck,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

// ─── Static Data ──────────────────────────────────────────────────────────────

const TICKETS = [
  { id: "INC-2847", title: "Нет доступа к 1С с рабочих станций бухгалтерии", priority: "critical", status: "in_progress", category: "Инфраструктура", created: "16.07.2024 09:12", assignee: "Иванов И.А.", slaLeft: 47, comments: 3 },
  { id: "INC-2841", title: "Медленная работа Wi-Fi в конференц-зале №2", priority: "high", status: "pending", category: "Сеть", created: "15.07.2024 14:30", assignee: null, slaLeft: 180, comments: 1 },
  { id: "REQ-0412", title: "Создание пользователя в AD для Смирновой Е.В.", priority: "low", status: "resolved", category: "ПО", created: "14.07.2024 11:00", assignee: "Сидоров С.К.", slaLeft: 0, comments: 2 },
  { id: "INC-2839", title: "Принтер HP LaserJet M507 не принимает задания", priority: "medium", status: "pending", category: "Инфраструктура", created: "13.07.2024 16:45", assignee: null, slaLeft: 320, comments: 0 },
  { id: "CHG-0089", title: "Плановое обновление антивируса на серверах", priority: "low", status: "approved", category: "ПО", created: "10.07.2024 09:00", assignee: "Иванов И.А.", slaLeft: 0, comments: 4 },
];

const CHAT_MESSAGES = [
  { id: 1, from: "client", author: "Петров А.С.", avatar: "ПА", time: "09:12", text: "Доброе утро! С сегодняшнего утра несколько сотрудников бухгалтерии (Комнаты 201, 203) не могут зайти в 1С. Ошибка: «Сервер баз данных недоступен». Обычные сайты открываются нормально." },
  { id: 2, from: "engineer", author: "Иванов И.А.", avatar: "ИИ", time: "09:18", text: "Принял в работу. Первым делом проверю состояние сервера srv-db-01 и сетевую доступность. Уточните — это произошло внезапно или после каких-то изменений вчера вечером?" },
  { id: 3, from: "client", author: "Петров А.С.", avatar: "ПА", time: "09:21", text: "Вчера вечером никаких работ не было запланировано, насколько я знаю. Это случилось с утра — примерно с 08:45." },
  { id: 4, from: "engineer", author: "Иванов И.А.", avatar: "ИИ", time: "09:35", text: "Нашёл причину. На srv-db-01 закончилось свободное место на разделе /var/lib/postgresql (99.8% заполнен). PostgreSQL перешёл в read-only и не принимает новые подключения. Очищаю WAL-архивы. Займёт ~10 минут." },
  { id: 5, from: "system", author: "Система", avatar: "SYS", time: "09:41", text: "К тикету прикреплён файл: disk_cleanup_log_2024-07-16.txt (12 КБ)" },
  { id: 6, from: "engineer", author: "Иванов И.А.", avatar: "ИИ", time: "09:48", text: "Готово. Диск разгружен до 71%. PostgreSQL перезапущен и принимает подключения. Проверьте 1С на одной из рабочих станций, пожалуйста." },
  { id: 7, from: "client", author: "Петров А.С.", avatar: "ПА", time: "09:52", text: "Проверили — 1С открывается! Спасибо за оперативность. Нужно ли что-то делать, чтобы это не повторилось?" },
  { id: 8, from: "engineer", author: "Иванов И.А.", avatar: "ИИ", time: "09:55", text: "Да, настрою алерт в Zabbix на заполнение диска >85% и увеличу лимит хранения WAL-архивов. Также рекомендую расширить раздел с 120 ГБ до 200 ГБ — это займёт плановое окно." },
];

const WORK_LOG = [
  { id: 1, date: "16.07.2024", time: "14:22", engineer: "Иванов И.А.", title: "Обновление ядра Linux на сервере srv-db-01", body: "Обновлено ядро с 5.15.0 до 6.1.86-LTS. Работы выполнены в сервисное окно 03:00–04:00. Все сервисы запущены в штатном режиме, проверена доступность БД PostgreSQL.", ticket: "INC-2815", device: "srv-db-01", attachments: ["kernel_update_log.txt"], confirmed: true },
  { id: 2, date: "15.07.2024", time: "11:05", engineer: "Сидоров С.К.", title: "Замена диска в RAID-массиве NAS Synology", body: "Выполнена плановая замена накопителя Seagate ST4000NM001A (S/N: ZFN2K3QE). Массив перестроен, статус HEALTHY. Рекомендуем проверить архив резервных копий.", ticket: null, device: "nas-01", attachments: [], confirmed: false },
  { id: 3, date: "14.07.2024", time: "09:30", engineer: "Иванов И.А.", title: "Настройка SSL-VPN для удалённых сотрудников", body: "Настроен SSL-VPN на Fortinet FortiGate 100F. Добавлено 12 профилей, настроена двухфакторная аутентификация через TOTP. Проверена работа с 5 тестовых устройств.", ticket: "REQ-0405", device: "fw-01", attachments: ["vpn_config_backup.conf"], confirmed: true },
  { id: 4, date: "10.07.2024", time: "16:00", engineer: "Петров В.С.", title: "Аудит учётных записей Active Directory", body: "Проведён аудит 347 учётных записей. Заблокировано 8 неактивных аккаунтов, удалено 3 устаревших группы безопасности. Отчёт приложен.", ticket: null, device: null, attachments: ["ad_audit_report_july.xlsx"], confirmed: true },
];

const DEVICES = [
  { id: "srv-db-01", name: "srv-db-01", type: "server", model: "Dell PowerEdge R740", serial: "JF7KL92B", location: "Главный офис", rack: "Rack-A", unit: "U12–U15", ip: "10.0.1.10", os: "Ubuntu Server 22.04 LTS", status: "ok", cpu: 34, ram: 67, disk: 52, uptime: "47 дней", warranty: "15.03.2026", vms: ["vm-1c-prod", "vm-postgres-01"], cpuHistory: [20,34,28,45,23,56,34,28,67,34,45,34], netHistory: [12,18,15,22,10,28,16,14,32,20,24,18] },
  { id: "srv-app-01", name: "srv-app-01", type: "server", model: "Dell PowerEdge R640", serial: "GH3MN18A", location: "Главный офис", rack: "Rack-A", unit: "U8–U10", ip: "10.0.1.11", os: "Rocky Linux 9.3", status: "ok", cpu: 12, ram: 45, disk: 38, uptime: "124 дня", warranty: "20.01.2027", vms: ["vm-nginx-01", "vm-gitlab"], cpuHistory: [8,12,10,15,9,11,14,12,10,13,12,11], netHistory: [5,8,7,10,6,9,11,8,7,9,8,7] },
  { id: "sw-core-01", name: "sw-core-01", type: "switch", model: "Cisco Catalyst 9300-48P", serial: "FCW2247L001", location: "Главный офис", rack: "Rack-A", unit: "U1", ip: "10.0.0.1", os: "IOS XE 17.9.4a", status: "ok", cpu: 8, ram: null, disk: null, uptime: "203 дня", warranty: "01.06.2028", vms: [], cpuHistory: [5,8,6,9,7,8,10,8,7,9,8,8], netHistory: [40,55,48,62,44,58,66,52,49,60,54,50] },
  { id: "fw-01", name: "fw-01", type: "firewall", model: "Fortinet FortiGate 100F", serial: "FGT1H3K18034567", location: "Главный офис", rack: "Rack-A", unit: "U2", ip: "10.0.0.254", os: "FortiOS 7.4.3", status: "warning", cpu: 71, ram: 58, disk: null, uptime: "47 дней", warranty: "30.09.2026", vms: [], cpuHistory: [45,55,60,71,68,72,71,65,70,71,73,71], netHistory: [30,38,34,42,36,45,41,38,43,44,46,42] },
  { id: "nas-01", name: "nas-01", type: "storage", model: "Synology RS3621xs+", serial: "2250NNN000111", location: "Серверная №2", rack: "Rack-B", unit: "U4", ip: "10.0.1.20", os: "DSM 7.2.1", status: "ok", cpu: 8, ram: null, disk: 44, uptime: "180 дней", warranty: "12.05.2027", vms: [], cpuHistory: [5,6,8,7,9,8,7,6,8,9,8,7], netHistory: [8,12,10,14,9,11,13,10,9,12,11,10] },
];

const HYPERVISORS = [
  { id: "pve-01", name: "pve-01", model: "Dell PowerEdge R740", ip: "10.0.1.10", version: "Proxmox VE 8.2.2", cpu: 34, ram: 67, disk: 52, status: "ok", vms: [
    { id: "vm-100", name: "vm-1c-prod", type: "vm", status: "running", cpu: 18, ram: 52, disk: 38, cores: 8, mem: "16 GB", os: "Windows Server 2022" },
    { id: "vm-101", name: "vm-postgres-01", type: "vm", status: "running", cpu: 12, ram: 71, disk: 44, cores: 4, mem: "32 GB", os: "Ubuntu 22.04" },
    { id: "lxc-200", name: "lxc-gitlab", type: "lxc", status: "running", cpu: 6, ram: 34, disk: 22, cores: 2, mem: "4 GB", os: "Debian 12" },
    { id: "lxc-201", name: "lxc-redis", type: "lxc", status: "stopped", cpu: 0, ram: 0, disk: 2, cores: 1, mem: "1 GB", os: "Alpine 3.19" },
  ]},
  { id: "pve-02", name: "pve-02", model: "Dell PowerEdge R640", ip: "10.0.1.11", version: "Proxmox VE 8.2.2", cpu: 12, ram: 45, disk: 38, status: "ok", vms: [
    { id: "vm-102", name: "vm-nginx-01", type: "vm", status: "running", cpu: 4, ram: 28, disk: 18, cores: 2, mem: "4 GB", os: "Rocky Linux 9.3" },
    { id: "vm-103", name: "vm-gitlab-runner", type: "vm", status: "running", cpu: 8, ram: 55, disk: 30, cores: 4, mem: "8 GB", os: "Ubuntu 22.04" },
    { id: "lxc-202", name: "lxc-monitoring", type: "lxc", status: "running", cpu: 3, ram: 22, disk: 8, cores: 1, mem: "2 GB", os: "Debian 12" },
  ]},
];

const DOCKER_CONTAINERS = [
  { id: "c1", name: "nginx-proxy", image: "nginx:1.25-alpine", host: "pve-02 / vm-nginx-01", status: "running", cpu: 1.2, ram: 128, ports: "80:80, 443:443", uptime: "14д 6ч", network: "proxy-net" },
  { id: "c2", name: "gitlab-ce", image: "gitlab/gitlab-ce:16.11", host: "pve-01 / lxc-gitlab", status: "running", cpu: 8.4, ram: 3840, ports: "22:22, 8929:80", uptime: "7д 2ч", network: "gitlab-net" },
  { id: "c3", name: "postgres-15", image: "postgres:15.6-alpine", host: "pve-01 / vm-postgres-01", status: "running", cpu: 4.1, ram: 2048, ports: "5432:5432", uptime: "47д", network: "db-net" },
  { id: "c4", name: "redis-7", image: "redis:7.2-alpine", host: "pve-01 / lxc-redis", status: "stopped", cpu: 0, ram: 0, ports: "6379:6379", uptime: "—", network: "db-net" },
  { id: "c5", name: "zabbix-agent", image: "zabbix/zabbix-agent2:6.4", host: "pve-02 / lxc-monitoring", status: "running", cpu: 0.3, ram: 48, ports: "10050:10050", uptime: "31д", network: "monitor-net" },
  { id: "c6", name: "gitlab-runner", image: "gitlab/gitlab-runner:alpine", host: "pve-02 / vm-gitlab-runner", status: "running", cpu: 12.7, ram: 512, ports: "—", uptime: "3д 14ч", network: "gitlab-net" },
];

const K8S_NODES = [
  { id: "k8s-node-01", name: "k8s-node-01", role: "master", ip: "10.0.2.10", status: "ready", cpu: 22, ram: 44, pods: [
    { name: "kube-apiserver", namespace: "kube-system", status: "running", image: "registry.k8s.io/kube-apiserver:v1.29" },
    { name: "etcd", namespace: "kube-system", status: "running", image: "registry.k8s.io/etcd:3.5.12" },
    { name: "coredns-5dd5756b68", namespace: "kube-system", status: "running", image: "registry.k8s.io/coredns:v1.11.1" },
  ]},
  { id: "k8s-node-02", name: "k8s-node-02", role: "worker", ip: "10.0.2.11", status: "ready", cpu: 48, ram: 61, pods: [
    { name: "app-backend-7c9d5f", namespace: "production", status: "running", image: "registry.local/app-backend:2.4.1" },
    { name: "app-frontend-6b8c4d", namespace: "production", status: "running", image: "registry.local/app-frontend:1.9.3" },
    { name: "postgres-exporter", namespace: "monitoring", status: "running", image: "prometheuscommunity/postgres-exporter:0.15" },
  ]},
  { id: "k8s-node-03", name: "k8s-node-03", role: "worker", ip: "10.0.2.12", status: "not_ready", cpu: 0, ram: 0, pods: [] },
];

const TOPOLOGY_NODES = [
  { id: "internet", label: "Internet", type: "external", ip: "—", x: 400, y: 32 },
  { id: "fw-01", label: "fw-01", type: "firewall", ip: "10.0.0.254", x: 400, y: 120 },
  { id: "sw-core-01", label: "sw-core-01", type: "switch", ip: "10.0.0.1", x: 400, y: 220 },
  { id: "sw-access-01", label: "sw-access-01", type: "switch", ip: "10.0.0.2", x: 160, y: 320 },
  { id: "srv-db-01", label: "srv-db-01", type: "database", ip: "10.0.1.10", x: 340, y: 340 },
  { id: "srv-app-01", label: "srv-app-01", type: "server", ip: "10.0.1.11", x: 520, y: 340 },
  { id: "nas-01", label: "nas-01", type: "storage", ip: "10.0.1.20", x: 640, y: 240 },
  { id: "workstations", label: "Workstations x32", type: "group", ip: "10.0.3.0/24", x: 120, y: 430 },
];

const TOPOLOGY_EDGES = [
  { from: "internet", to: "fw-01", label: "WAN", bw: "100M", color: "#EF4444" },
  { from: "fw-01", to: "sw-core-01", label: "10G", bw: "10G", color: "#F59E0B" },
  { from: "sw-core-01", to: "sw-access-01", label: "1G", bw: "1G", color: "#4A6070" },
  { from: "sw-core-01", to: "srv-db-01", label: "10G", bw: "10G", color: "#00D4A8" },
  { from: "sw-core-01", to: "srv-app-01", label: "10G", bw: "10G", color: "#00D4A8" },
  { from: "sw-core-01", to: "nas-01", label: "10G", bw: "10G", color: "#00D4A8" },
  { from: "sw-access-01", to: "workstations", label: "1G", bw: "1G", color: "#4A6070" },
  { from: "srv-db-01", to: "nas-01", label: "Backup", bw: "1G", color: "#8B5CF6" },
];

const K8S_MESH = {
  nodes: [
    { id: "frontend", label: "app-frontend", ns: "production", status: "running", type: "web", x: 160, y: 180 },
    { id: "backend", label: "app-backend", ns: "production", status: "running", type: "api", x: 360, y: 180 },
    { id: "redis", label: "redis-7", ns: "production", status: "stopped", type: "cache", x: 520, y: 110 },
    { id: "postgres", label: "postgres-15", ns: "production", status: "running", type: "database", x: 520, y: 260 },
    { id: "coredns", label: "coredns", ns: "kube-system", status: "running", type: "system", x: 280, y: 330 },
  ],
  edges: [
    { from: "frontend", to: "backend", label: "HTTP/2", volume: "high" },
    { from: "backend", to: "redis", label: "Redis", volume: "medium" },
    { from: "backend", to: "postgres", label: "SQL", volume: "high" },
    { from: "frontend", to: "coredns", label: "DNS", volume: "low" },
    { from: "backend", to: "coredns", label: "DNS", volume: "low" },
  ],
};

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
  { name: "Microsoft 365 Business", expires: "15.12.2024", daysLeft: 152, vendor: "Microsoft", seats: 45, used: 41 },
  { name: "Kaspersky Endpoint Security", expires: "01.11.2024", daysLeft: 108, vendor: "Kaspersky", seats: 50, used: 48 },
  { name: "Veeam Backup & Replication", expires: "30.09.2024", daysLeft: 76, vendor: "Veeam", seats: null, used: null },
];

const SOFTWARE_DETAILS: Record<string, { publisher: string; version: string; installed: string; key: string; devices: string[]; notes: string }> = {
  "Microsoft 365 Business": { publisher: "Microsoft Corporation", version: "Current Channel (март 2024)", installed: "01.02.2024", key: "XXXXX-XXXXX-XXXXX-XXXXX-AB1CD", devices: ["pc-buh-01", "pc-buh-02", "pc-sec-01", "srv-app-01", "laptop-dir-01"], notes: "Не обновляйте Teams до версии 2.0 (new Teams) до проверки совместимости с АТС. Тестирование запланировано на 01.09.2024." },
  "Kaspersky Endpoint Security": { publisher: "Kaspersky Lab", version: "KES 12.4.0", installed: "01.11.2023", key: "YYYYY-YYYYY-YYYYY-YYYYY-FG2HI", devices: ["srv-db-01", "srv-app-01", "pc-buh-01", "pc-sec-01", "nas-01"], notes: "" },
  "Veeam Backup & Replication": { publisher: "Veeam Software", version: "v12.1.2.172", installed: "15.09.2023", key: "ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ-KL3MN", devices: ["srv-db-01", "srv-app-01", "nas-01"], notes: "Лицензия Enterprise Plus. При продлении уточнить возможность перехода на Veeam Data Platform." },
};

const MAINTENANCE = [
  { title: "Замена ИБП в стойке Rack-A", date: "20.07.2024", time: "03:00–05:00" },
  { title: "Обновление прошивки коммутаторов", date: "27.07.2024", time: "02:00–04:00" },
  { title: "Квартальное ТО серверного оборудования", date: "15.08.2024", time: "09:00–18:00" },
];

const ACTIVITY_FEED = [
  { id: 1, date: "16.07.2024", time: "10:00", type: "invoice", title: "Выставлен счёт за июль 2024", body: "Счёт СЧ-2024-07 на сумму 185 000 ₽. Срок оплаты: 31.07.2024.", icon: CreditCard },
  { id: 2, date: "15.07.2024", time: "16:30", type: "doc", title: "Обновлена документация VPN", body: "Инструкция по подключению к VPN актуализирована — добавлены шаги для iOS и Android.", icon: FileText },
  { id: 3, date: "15.07.2024", time: "09:00", type: "maintenance", title: "Перенос планового обслуживания", body: "Квартальное ТО перенесено с 01.08 на 15.08. Окно работ: 09:00–18:00.", icon: Calendar },
  { id: 4, date: "10.07.2024", time: "14:00", type: "system", title: "Новый инженер прикреплён к договору", body: "Петров В.С. добавлен в команду поддержки вашей организации.", icon: Users },
  { id: 5, date: "02.07.2024", time: "11:00", type: "doc", title: "Загружен акт приёмки-передачи", body: "Документ «Акт приёмки-передачи серверного оборудования» доступен для скачивания.", icon: FileText },
  { id: 6, date: "25.06.2024", time: "15:00", type: "invoice", title: "Счёт за июнь оплачен", body: "Поступила оплата по счёту СЧ-2024-06 на сумму 185 000 ₽. Спасибо!", icon: Check },
];

const ACHIEVEMENTS = [
  { id: "first_step", name: "Первый шаг", desc: "Первый вход в портал TechCore", color: "#00D4A8", earned: true, points: 10, progress: 1, max: 1 },
  { id: "quick_response", name: "Быстрый ответ", desc: "Ответ в тикете в течение 1 часа", color: "#22C55E", earned: true, points: 25, progress: 1, max: 1 },
  { id: "support_hero", name: "Герой поддержки", desc: "Создано 10 заявок в Service Desk", color: "#F59E0B", earned: false, points: 50, progress: 7, max: 10 },
  { id: "scholar", name: "Исследователь", desc: "Просмотрено 50 документов в Библиотеке", color: "#3B82F6", earned: false, points: 100, progress: 23, max: 50 },
  { id: "keeper", name: "Хранитель записей", desc: "Подтверждено 5 записей в журнале работ", color: "#8B5CF6", earned: false, points: 30, progress: 3, max: 5 },
  { id: "infra_watcher", name: "Взгляд инженера", desc: "Просмотрено 20 устройств в деталях", color: "#EF4444", earned: false, points: 75, progress: 5, max: 20 },
];

const API_TOKENS = [
  { id: "tok_1", name: "Zabbix Webhook", created: "01.06.2024", lastUsed: "16.07.2024 14:18", scope: "read-only", token: "tc_live_a8f3b2c1d9e4f0a7b6c5d2e1_abc1" },
  { id: "tok_2", name: "Telegram Bot (мониторинг)", created: "15.04.2024", lastUsed: "16.07.2024 09:30", scope: "read-only", token: "tc_live_f7e2d1c8b3a4f9e0d7c6b5a4_def2" },
];

const AUDIT_EVENTS = [
  { id: 1, user: "Петров А.С.", action: "Просмотр документа", target: "Договор №2024-IT-089", time: "16.07.2024 14:05", ip: "192.168.1.105" },
  { id: 2, user: "Ковалёва М.Н.", action: "Скачивание файла", target: "Спецификация оборудования — Поставка март 2024", time: "16.07.2024 13:12", ip: "192.168.1.110" },
  { id: 3, user: "Петров А.С.", action: "Создание заявки", target: "INC-2847", time: "16.07.2024 09:12", ip: "192.168.1.105" },
  { id: 4, user: "Ковалёва М.Н.", action: "Вход в систему", target: "—", time: "16.07.2024 08:55", ip: "192.168.1.110" },
  { id: 5, user: "Петров А.С.", action: "Подтверждение записи журнала", target: "Журнал работ #3 — Настройка SSL-VPN", time: "15.07.2024 18:00", ip: "192.168.1.105" },
  { id: 6, user: "Захаров Д.Е.", action: "Вход в систему", target: "—", time: "15.07.2024 10:30", ip: "192.168.1.122" },
  { id: 7, user: "Петров А.С.", action: "Просмотр устройства", target: "fw-01 (Fortinet FortiGate 100F)", time: "14.07.2024 15:22", ip: "192.168.1.105" },
  { id: 8, user: "Захаров Д.Е.", action: "Просмотр документа", target: "Инструкция по подключению к VPN", time: "14.07.2024 11:10", ip: "192.168.1.122" },
];

const PLAN_DATA = {
  plan: "Standard", price: 185000,
  devices: { used: 5, limit: 10 }, storage: { used: 1.4, limit: 50 },
  users: { used: 3, limit: 10 }, tickets: { used: 5, limit: 50 },
  nextBilling: "01.08.2024",
  features: ["Мониторинг до 10 устройств", "Service Desk (50 тикетов/мес.)", "Библиотека документов", "Журнал работ инженеров", "Базовая отчётность SLA"],
};

const ALL_WIDGETS = [
  { id: "health", label: "Состояние инфраструктуры", size: "sm" },
  { id: "incidents", label: "Активные инциденты", size: "sm" },
  { id: "maintenance", label: "Ближайшие работы", size: "sm" },
  { id: "licenses", label: "Лицензии / подписки", size: "sm" },
  { id: "devicemon", label: "Мониторинг устройств", size: "full" },
  { id: "tickets", label: "Последние обращения", size: "half" },
  { id: "logs", label: "Последние работы", size: "half" },
  { id: "k8s", label: "Kubernetes статус", size: "half" },
  { id: "sla_widget", label: "SLA за текущий месяц", size: "sm" },
  { id: "billing_widget", label: "Сводка по тарифу", size: "sm" },
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
  server: Globe, switch: Router, firewall: Shield, storage: HardDrive,
};

const TOPO_NODE_CFG: Record<string, { color: string; label: string }> = {
  external: { color: "#4A6070", label: "Внешняя сеть" },
  firewall: { color: "#EF4444", label: "Межсетевой экран" },
  switch: { color: "#F59E0B", label: "Коммутатор" },
  database: { color: "#3B82F6", label: "БД-сервер" },
  server: { color: "#8B5CF6", label: "Сервер приложений" },
  storage: { color: "#6B7280", label: "Хранилище" },
  group: { color: "#4A6070", label: "Группа устройств" },
};

const MESH_NODE_CFG: Record<string, { color: string }> = {
  web: { color: "#00D4A8" }, api: { color: "#8B5CF6" }, cache: { color: "#F59E0B" },
  database: { color: "#3B82F6" }, system: { color: "#4A6070" },
};

// ─── Utility components ───────────────────────────────────────────────────────

function StatusDot({ status, size = 8 }: { status: string; size?: number }) {
  const color = STATUS_CFG[status]?.color ?? "#6B7280";
  return <span className="inline-block rounded-full flex-shrink-0" style={{ width: size, height: size, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />;
}

function TicketBadge({ status }: { status: string }) {
  const c = TICKET_STATUS_CFG[status] ?? TICKET_STATUS_CFG.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs" style={{ ...MONO, backgroundColor: c.bg, color: c.text, border: `1px solid ${c.dot}20` }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: c.dot }} />{c.label}
    </span>
  );
}

function PriorityTag({ priority }: { priority: string }) {
  const c = PRIORITY_CFG[priority] ?? PRIORITY_CFG.low;
  return <span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, color: c.color, backgroundColor: `${c.color}15`, border: `1px solid ${c.color}30` }}>{c.label}</span>;
}

function SLATimer({ minutes }: { minutes: number }) {
  if (minutes <= 0) return null;
  const h = Math.floor(minutes / 60), m = minutes % 60, urgent = minutes < 60;
  return <span className="text-xs flex items-center gap-1 flex-shrink-0" style={{ ...MONO, color: urgent ? "#EF4444" : "#94A3B8" }}><Clock size={11} />{h > 0 ? `${h}ч ${m}м` : `${m}м`}</span>;
}

function Sparkline({ data, color = "#00D4A8", height = 36 }: { data: number[]; color?: string; height?: number }) {
  const uid = useId().replace(/:/g, "_");
  const gradId = `sg_${uid}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data.map((v, i) => ({ v, i }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.3} /><stop offset="95%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false} isAnimationActive={false} />
        <Tooltip contentStyle={{ background: "#0C1117", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: "2px 8px" }} itemStyle={{ color }} formatter={(v: number) => [`${v}%`, ""]} labelFormatter={() => ""} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const bc = value > 80 ? "#EF4444" : value > 65 ? "#F59E0B" : color;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs" style={{ ...MONO, color: "#4A6070" }}><span>{label}</span><span style={{ color: value > 65 ? bc : "#94A3B8" }}>{value}%</span></div>
      <div className="h-px rounded-full" style={{ backgroundColor: "#1A2229" }}><div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: bc }} /></div>
    </div>
  );
}

function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`bg-card border border-border rounded ${className}`} onClick={onClick} style={onClick ? { cursor: "pointer" } : undefined}>{children}</div>;
}

function SLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>{children}</div>;
}

function SubTabs({ tabs, active, onChange }: { tabs: [string, string][]; active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-0 border-b border-border mb-4">
      {tabs.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} className="px-4 py-2 text-xs -mb-px border-b-2 transition-colors" style={{ borderColor: active === v ? "#00D4A8" : "transparent", color: active === v ? "#00D4A8" : "#4A6070", ...MONO }}>{l}</button>
      ))}
    </div>
  );
}

// ─── Onboarding Banner ────────────────────────────────────────────────────────

function OnboardingBanner({ onDismiss }: { onDismiss: () => void }) {
  const steps = [
    { done: true, label: "Договор подписан" },
    { done: false, label: "Установить агент мониторинга" },
    { done: true, label: "Создать тестовую заявку" },
    { done: false, label: "Назначить роли сотрудникам" },
  ];
  const doneCount = steps.filter(s => s.done).length;
  return (
    <div className="p-4 rounded mb-5" style={{ backgroundColor: "#00D4A808", border: "1px solid #00D4A825" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3"><Zap size={14} style={{ color: "#00D4A8" }} /><span className="text-sm font-semibold text-foreground">Добро пожаловать в TechCore Portal</span><span className="text-xs px-2 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#00D4A815", color: "#00D4A8" }}>{doneCount}/{steps.length} выполнено</span></div>
        <button onClick={onDismiss} style={{ color: "#4A6070" }}><X size={13} /></button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color: s.done ? "#22C55E" : "#4A6070" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: s.done ? "#22C55E15" : "#4A607010", border: `1px solid ${s.done ? "#22C55E40" : "#4A607030"}` }}>
              {s.done ? <Check size={9} style={{ color: "#22C55E" }} /> : <span style={{ ...MONO, fontSize: 9, color: "#4A6070" }}>{i + 1}</span>}
            </div>
            <span className="leading-tight">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const DEFAULT_WIDGETS = ["health", "incidents", "maintenance", "licenses", "devicemon", "tickets", "logs"];

function Dashboard({ onNavigateToTicket, onNavigateToDevice }: { onNavigateToTicket: (id: string) => void; onNavigateToDevice: (id: string) => void }) {
  const [editMode, setEditMode] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<string[]>(DEFAULT_WIDGETS);
  const [showLib, setShowLib] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const health = DEVICES.some(d => d.status === "critical") ? "critical" : DEVICES.some(d => d.status === "warning") ? "warning" : "ok";
  const hColor = STATUS_CFG[health].color;
  const hLabel = ({ ok: "Штатный режим", warning: "Требует внимания", critical: "Критические проблемы" } as Record<string, string>)[health];
  const critTickets = TICKETS.filter(t => t.priority === "critical" && t.status !== "resolved");
  const available = ALL_WIDGETS.filter(w => !activeWidgets.includes(w.id));
  const has = (id: string) => activeWidgets.includes(id);

  const WW = ({ id, children, full }: { id: string; children: React.ReactNode; full?: boolean }) => (
    <div className={`relative ${full ? "col-span-full" : ""}`}>
      {editMode && <button onClick={() => setActiveWidgets(p => p.filter(w => w !== id))} className="absolute -top-2 -right-2 z-20 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EF4444", color: "#fff" }}><X size={10} /></button>}
      {children}
    </div>
  );

  return (
    <div className="space-y-5">
      {showOnboarding && <OnboardingBanner onDismiss={() => setShowOnboarding(false)} />}
      <div className="flex items-center justify-end gap-2">
        {editMode && <button onClick={() => setShowLib(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ backgroundColor: "#00D4A815", color: "#00D4A8", border: "1px solid #00D4A830" }}><Plus size={11} />Добавить виджет</button>}
        <button onClick={() => setEditMode(e => !e)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors" style={{ backgroundColor: editMode ? "#00D4A820" : "#0C1117", color: editMode ? "#00D4A8" : "#4A6070", border: `1px solid ${editMode ? "#00D4A840" : "rgba(255,255,255,0.065)"}` }}>
          <Edit3 size={11} />{editMode ? "Готово" : "Изменить дашборд"}
        </button>
      </div>

      {/* KPI row */}
      {(has("health") || has("incidents") || has("maintenance") || has("licenses") || has("sla_widget") || has("billing_widget")) && (
        <div className="grid grid-cols-4 gap-3">
          {has("health") && <WW id="health"><Card className="p-4"><SLabel>Состояние инфраструктуры</SLabel><div className="flex items-center gap-3"><div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${hColor}15` }}><Activity size={20} style={{ color: hColor }} /></div><div><div className="text-sm font-semibold" style={{ color: hColor }}>{hLabel}</div><div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>{DEVICES.filter(d => d.status === "ok").length}/{DEVICES.length} устройств норма</div></div></div><div className="flex gap-1.5 mt-3">{DEVICES.map(d => <StatusDot key={d.id} status={d.status} size={6} />)}</div></Card></WW>}
          {has("incidents") && <WW id="incidents"><Card className="p-4"><SLabel>Активные инциденты</SLabel><div className="flex items-end gap-2"><span className="text-4xl font-bold" style={{ color: critTickets.length > 0 ? "#EF4444" : "#22C55E" }}>{critTickets.length}</span><span className="text-muted-foreground text-sm mb-1.5">критических</span></div><div className="space-y-1 mt-1">{TICKETS.filter(t => t.status === "in_progress").slice(0, 2).map(t => <button key={t.id} onClick={() => onNavigateToTicket(t.id)} className="flex items-center gap-1.5 text-xs w-full text-left hover:opacity-80" style={{ ...MONO, color: "#4A6070" }}><span style={{ color: PRIORITY_CFG[t.priority].color }}>●</span>{t.id}</button>)}</div></Card></WW>}
          {has("maintenance") && <WW id="maintenance"><Card className="p-4"><SLabel>Ближайшие работы</SLabel><div className="space-y-2.5">{MAINTENANCE.slice(0, 2).map((m, i) => <div key={i}><div className="text-xs text-foreground leading-snug">{m.title}</div><div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>{m.date} · {m.time}</div></div>)}</div></Card></WW>}
          {has("licenses") && <WW id="licenses"><Card className="p-4"><SLabel>Лицензии / подписки</SLabel><div className="space-y-2">{LICENSES.map((l, i) => <div key={i} className="flex items-center justify-between gap-2"><span className="text-xs text-foreground truncate flex-1">{l.name.split(" ").slice(0, 2).join(" ")}</span><span className="text-xs flex-shrink-0" style={{ ...MONO, color: l.daysLeft < 90 ? "#F59E0B" : "#4A6070" }}>{l.daysLeft}д</span></div>)}</div></Card></WW>}
          {has("sla_widget") && <WW id="sla_widget"><Card className="p-4"><SLabel>SLA за июль</SLabel><div className="text-3xl font-bold" style={{ ...MONO, color: "#22C55E" }}>99.87%</div><div className="text-xs mt-1" style={{ ...MONO, color: "#4A6070" }}>Цель: 99.5%</div></Card></WW>}
          {has("billing_widget") && <WW id="billing_widget"><Card className="p-4"><SLabel>Тариф</SLabel><div className="text-sm font-semibold text-foreground mb-1">Standard Plan</div><div className="text-xs" style={{ ...MONO, color: "#4A6070" }}>Устройства: {PLAN_DATA.devices.used}/{PLAN_DATA.devices.limit}</div><div className="mt-2"><MetricBar label="Использование" value={Math.round(PLAN_DATA.devices.used / PLAN_DATA.devices.limit * 100)} color="#00D4A8" /></div></Card></WW>}
        </div>
      )}

      {has("devicemon") && (
        <WW id="devicemon" full>
          <SLabel>Мониторинг устройств</SLabel>
          <div className="grid grid-cols-5 gap-3">
            {DEVICES.map(device => {
              const Icon = DEVICE_ICON[device.type] ?? Globe;
              const sc = STATUS_CFG[device.status];
              const sparkColor = (device.cpu ?? 0) > 70 ? "#F59E0B" : "#00D4A8";
              return (
                <Card key={device.id} className="p-3 hover:border-[rgba(255,255,255,0.15)] transition-colors" onClick={() => onNavigateToDevice(device.id)}>
                  <div className="flex items-center justify-between mb-2"><Icon size={13} style={{ color: sc.color }} /><StatusDot status={device.status} size={5} /></div>
                  <div className="text-xs font-medium truncate" style={MONO}>{device.name}</div>
                  <div className="text-xs truncate mt-0.5" style={{ color: "#4A6070" }}>{device.model.split(" ").slice(0, 2).join(" ")}</div>
                  {device.cpu != null && (<><div className="mt-2"><Sparkline data={device.cpuHistory} color={sparkColor} /></div><div className="text-xs text-center" style={{ ...MONO, color: sparkColor }}>CPU {device.cpu}%</div></>)}
                </Card>
              );
            })}
          </div>
        </WW>
      )}

      {(has("tickets") || has("logs") || has("k8s")) && (
        <div className="grid grid-cols-2 gap-4">
          {has("tickets") && <WW id="tickets"><SLabel>Последние обращения</SLabel><div className="space-y-2">{TICKETS.slice(0, 3).map(t => <Card key={t.id} className="p-3 flex items-center gap-3 hover:border-[rgba(255,255,255,0.12)] transition-colors" onClick={() => onNavigateToTicket(t.id)}><AlertCircle size={13} style={{ color: PRIORITY_CFG[t.priority].color, flexShrink: 0 }} /><div className="flex-1 min-w-0"><div className="text-sm truncate">{t.title}</div><div className="flex items-center gap-2 mt-1"><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{t.id}</span><TicketBadge status={t.status} /></div></div>{t.slaLeft > 0 && <SLATimer minutes={t.slaLeft} />}</Card>)}</div></WW>}
          {has("logs") && <WW id="logs"><SLabel>Последние работы</SLabel><div className="space-y-2">{WORK_LOG.slice(0, 3).map(log => <Card key={log.id} className="p-3 hover:border-[rgba(255,255,255,0.12)] transition-colors"><div className="flex items-start gap-2.5"><div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#00D4A8" }} /><div className="flex-1 min-w-0"><div className="text-sm truncate">{log.title}</div><div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>{log.date} · {log.engineer}</div></div>{log.confirmed && <Check size={11} style={{ color: "#22C55E", flexShrink: 0, marginTop: 3 }} />}</div></Card>)}</div></WW>}
          {has("k8s") && <WW id="k8s"><SLabel>Kubernetes — k8s-prod-01</SLabel><div className="space-y-2">{K8S_NODES.map(n => <Card key={n.id} className="p-3 flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: n.status === "ready" ? "#22C55E" : "#EF4444" }} /><span className="text-xs flex-1" style={MONO}>{n.name}</span><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{n.role}</span><span className="text-xs" style={{ ...MONO, color: n.status === "ready" ? "#22C55E" : "#EF4444" }}>{n.status}</span></Card>)}</div></WW>}
        </div>
      )}

      {showLib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="w-full max-w-lg rounded p-6" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
            <div className="flex items-center justify-between mb-5"><h3 className="text-sm font-semibold">Библиотека виджетов</h3><button onClick={() => setShowLib(false)} style={{ color: "#4A6070" }}><X size={14} /></button></div>
            {available.length === 0 ? <div className="text-center py-8 text-sm" style={{ color: "#4A6070" }}>Все виджеты уже добавлены</div> : (
              <div className="grid grid-cols-2 gap-2">
                {available.map(w => <button key={w.id} onClick={() => { setActiveWidgets(p => [...p, w.id]); setShowLib(false); }} className="p-3 rounded text-left transition-colors hover:border-[rgba(0,212,168,0.3)]" style={{ border: "1px solid rgba(255,255,255,0.065)", backgroundColor: "#111C24" }}><div className="text-xs font-medium text-foreground mb-1">{w.label}</div><div className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{w.size === "full" ? "Полная ширина" : w.size === "half" ? "Половина" : "Четверть"}</div></button>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Full Chat ────────────────────────────────────────────────────────────────

function FullChat({ ticketId, onBack }: { ticketId: string; onBack: () => void }) {
  const ticket = TICKETS.find(t => t.id === ticketId);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sideTab, setSideTab] = useState<"attachments"|"links"|"participants">("attachments");
  const [showSide, setShowSide] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);
  const handleSend = () => { if (!input.trim()) return; setInput(""); setTyping(true); setTimeout(() => setTyping(false), 2200); };
  const ac = (from: string) => from === "engineer" ? { bg: "#00D4A818", color: "#00D4A8" } : from === "system" ? { bg: "#38BDF820", color: "#38BDF8" } : { bg: "#8B5CF620", color: "#8B5CF6" };

  const attachments = [
    { name: "disk_cleanup_log_2024-07-16.txt", size: "12 КБ", time: "09:41" },
    { name: "srv-db-01_iostat.csv", size: "4.2 КБ", time: "09:35" },
  ];
  const links = [
    { url: "https://zabbix.techcore.ru/problem/1248", label: "Zabbix Alert #1248" },
    { url: "https://wiki.techcore.ru/postgresql/wal", label: "Wiki: PostgreSQL WAL" },
  ];
  const participants = [
    { name: "Петров А.С.", role: "Клиент", initials: "ПА", color: "#8B5CF6", online: true },
    { name: "Иванов И.А.", role: "Инженер L2", initials: "ИИ", color: "#00D4A8", online: true },
    { name: "Ковалёва М.Н.", role: "Клиент", initials: "КМ", color: "#F59E0B", online: false },
  ];

  return (
    <div className="flex h-full">
      {/* Main chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.065)" }}>
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs hover:text-foreground transition-colors" style={{ color: "#4A6070" }}><ArrowLeft size={13} />К тикету</button>
          <div className="w-px h-4 bg-border" />
          {ticket && (<><span className="text-xs font-semibold" style={{ ...MONO, color: "#00D4A8" }}>{ticket.id}</span><span className="text-xs text-foreground truncate flex-1">{ticket.title}</span><TicketBadge status={ticket.status} /></>)}
          <button onClick={() => setShowSide(s => !s)} className="ml-2 p-1.5 rounded hover:bg-muted" style={{ color: showSide ? "#00D4A8" : "#4A6070" }}><Layers size={13} /></button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {CHAT_MESSAGES.map(msg => {
            const a = ac(msg.from);
            if (msg.from === "system") return <div key={msg.id} className="flex justify-center"><div className="flex items-center gap-2 px-3 py-1.5 rounded text-xs" style={{ ...MONO, backgroundColor: "#38BDF810", color: "#38BDF8", border: "1px solid #38BDF820" }}><Paperclip size={10} />{msg.text}</div></div>;
            const isClient = msg.from === "client";
            return (
              <div key={msg.id} className={`flex gap-3 ${isClient ? "flex-row-reverse" : ""}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ ...MONO, backgroundColor: a.bg, color: a.color }}>{msg.avatar}</div>
                <div className={`max-w-xl flex flex-col gap-1 ${isClient ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2" style={{ flexDirection: isClient ? "row-reverse" : "row" }}><span className="text-xs font-medium text-foreground">{msg.author}</span><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{msg.time}</span></div>
                  <div className="px-4 py-2.5 rounded text-sm leading-relaxed" style={{ backgroundColor: isClient ? "#00D4A812" : "#111C24", border: `1px solid ${isClient ? "#00D4A830" : "rgba(255,255,255,0.065)"}`, color: "#C4D2DC" }}>{msg.text}</div>
                </div>
              </div>
            );
          })}
          {typing && <div className="flex gap-3"><div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ ...MONO, backgroundColor: "#00D4A818", color: "#00D4A8" }}>ИИ</div><div className="px-4 py-3 rounded flex items-center gap-1.5" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)" }}>{[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#00D4A8", display: "inline-block", animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}</div></div>}
          <div ref={bottomRef} />
        </div>
        <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.065)" }}>
          <div className="flex gap-2 items-end">
            <div className="flex-1 rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.065)", backgroundColor: "#0C1117" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} rows={3} placeholder="Введите сообщение... (Enter — отправить)" className="w-full px-4 py-3 text-sm outline-none resize-none" style={{ backgroundColor: "transparent", color: "#C4D2DC", fontFamily: "inherit" }} />
              <div className="flex items-center gap-2 px-3 pb-2"><button className="text-muted-foreground hover:text-foreground p-1"><Paperclip size={13} /></button><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>Прикрепить файл</span></div>
            </div>
            <button onClick={handleSend} disabled={!input.trim()} className="px-4 py-3 rounded flex items-center gap-2 text-sm font-medium flex-shrink-0" style={{ backgroundColor: input.trim() ? "#00D4A8" : "#00D4A820", color: input.trim() ? "#000" : "#4A6070" }}><Send size={13} />Отправить</button>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      {showSide && (
        <div className="w-64 flex-shrink-0 flex flex-col overflow-hidden" style={{ borderLeft: "1px solid rgba(255,255,255,0.065)" }}>
          <div className="flex border-b border-border flex-shrink-0">
            {([["attachments","Файлы"],["links","Ссылки"],["participants","Участники"]] as [string,string][]).map(([id,label]) => (
              <button key={id} onClick={() => setSideTab(id as typeof sideTab)} className="flex-1 py-2.5 text-xs transition-colors border-b-2" style={{ borderColor: sideTab === id ? "#00D4A8" : "transparent", color: sideTab === id ? "#00D4A8" : "#4A6070", ...MONO }}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {sideTab === "attachments" && attachments.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
                <FileText size={13} style={{ color: "#4A6070", flexShrink: 0 }} />
                <div className="flex-1 min-w-0"><div className="text-xs text-foreground truncate">{f.name}</div><div className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{f.size} · {f.time}</div></div>
                <button style={{ color: "#4A6070" }}><Download size={11} /></button>
              </div>
            ))}
            {sideTab === "links" && links.map((l, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
                <ExternalLink size={11} style={{ color: "#4A6070", flexShrink: 0, marginTop: 2 }} />
                <span className="text-xs" style={{ color: "#00D4A8" }}>{l.label}</span>
              </div>
            ))}
            {sideTab === "participants" && participants.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ ...MONO, backgroundColor: `${p.color}18`, color: p.color, fontSize: 9 }}>{p.initials}</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border" style={{ backgroundColor: p.online ? "#22C55E" : "#4A6070", borderColor: "#06090C" }} />
                </div>
                <div><div className="text-xs text-foreground">{p.name}</div><div className="text-xs" style={{ ...MONO, color: "#4A6070", fontSize: 9 }}>{p.role}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

// ─── Service Desk ─────────────────────────────────────────────────────────────

function ServiceDesk({ onOpenChat, initialTicket }: { onOpenChat: (id: string) => void; initialTicket?: string | null }) {
  const [selected, setSelected] = useState<string | null>(initialTicket ?? null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selPri, setSelPri] = useState("medium");
  const sel = selected ? TICKETS.find(t => t.id === selected) : null;
  const filtered = TICKETS.filter(t => (filter === "all" || t.status === filter) && (!search || t.title.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search)));

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative"><Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4A6070" }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по заявкам..." className="w-full rounded text-sm pl-8 pr-3 py-2 outline-none" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} /></div>
          {(["all","in_progress","pending","resolved"] as const).map(v => <button key={v} onClick={() => setFilter(v)} className="text-xs px-3 py-2 rounded border transition-colors" style={{ borderColor: filter === v ? "#00D4A8" : "rgba(255,255,255,0.065)", color: filter === v ? "#00D4A8" : "#4A6070", backgroundColor: filter === v ? "#00D4A808" : "transparent" }}>{v === "all" ? "Все" : v === "in_progress" ? "В работе" : v === "pending" ? "Ожидает" : "Решён"}</button>)}
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: "#00D4A8", color: "#000" }}><Plus size={13} />Создать</button>
        </div>
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} onClick={() => setSelected(t.id === selected ? null : t.id)} className="p-4 border rounded transition-all" style={{ backgroundColor: selected === t.id ? "#00D4A808" : "#0C1117", borderColor: selected === t.id ? "rgba(0,212,168,0.35)" : "rgba(255,255,255,0.065)", cursor: "pointer" }}>
              <div className="flex items-start gap-3">
                <AlertCircle size={14} style={{ color: PRIORITY_CFG[t.priority].color, flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap"><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{t.id}</span><PriorityTag priority={t.priority} /><TicketBadge status={t.status} /></div>
                  <div className="text-sm text-foreground">{t.title}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ ...MONO, color: "#4A6070" }}><span>{t.category}</span><span>·</span><span>{t.created}</span>{t.assignee && <><span>·</span><span>{t.assignee}</span></>}{t.comments > 0 && <><span>·</span><span>{t.comments} комм.</span></>}</div>
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
            <div className="flex items-center justify-between mb-4"><span className="text-xs font-semibold" style={{ ...MONO, color: "#00D4A8" }}>{sel.id}</span><button onClick={() => setSelected(null)} style={{ color: "#4A6070" }}><X size={13} /></button></div>
            <div className="text-sm font-medium mb-3">{sel.title}</div>
            <div className="flex gap-1.5 flex-wrap mb-4"><PriorityTag priority={sel.priority} /><TicketBadge status={sel.status} /></div>
            <div className="space-y-2 text-xs mb-4" style={MONO}>
              {[["Категория", sel.category], ["Создана", sel.created], ["Исполнитель", sel.assignee ?? "Не назначен"]].map(([k, v]) => <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}><span style={{ color: "#4A6070" }}>{k}</span><span>{v}</span></div>)}
              {sel.slaLeft > 0 && <div className="flex justify-between py-1.5"><span style={{ color: "#4A6070" }}>SLA</span><SLATimer minutes={sel.slaLeft} /></div>}
            </div>
            <button onClick={() => onOpenChat(sel.id)} className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-medium mb-3" style={{ backgroundColor: "#00D4A8", color: "#000" }}><Maximize2 size={11} />Открыть полный чат</button>
            <div className="text-xs mb-2" style={{ ...MONO, color: "#4A6070" }}>Комментарий</div>
            <textarea rows={3} placeholder="Добавить комментарий..." className="w-full rounded text-xs p-2 resize-none outline-none" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC", fontFamily: "inherit" }} />
            <button className="mt-2 w-full flex items-center justify-center gap-2 py-1.5 rounded text-xs font-medium" style={{ backgroundColor: "#00D4A815", color: "#00D4A8", border: "1px solid #00D4A830" }}><Send size={10} />Отправить</button>
          </Card>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="w-full max-w-lg rounded p-6" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
            <div className="flex items-center justify-between mb-5"><h3 className="text-base font-semibold">Новая заявка</h3><button onClick={() => setShowForm(false)} style={{ color: "#4A6070" }}><X size={15} /></button></div>
            <div className="space-y-4">
              <div><div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Категория</div><select className="w-full rounded text-sm py-2 px-3 outline-none" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }}><option>Инфраструктура</option><option>Сеть</option><option>ПО</option><option>Запрос на изменение</option></select></div>
              <div><div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Тема</div><input className="w-full rounded text-sm py-2 px-3 outline-none" placeholder="Кратко опишите проблему" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} /></div>
              <div><div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Описание</div><textarea rows={4} className="w-full rounded text-sm py-2 px-3 outline-none resize-none" placeholder="Подробно опишите ситуацию..." style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC", fontFamily: "inherit" }} /></div>
              <div><div className="text-xs mb-1.5" style={{ ...MONO, color: "#4A6070" }}>Приоритет</div><div className="flex gap-2">{(["low","medium","high","critical"] as const).map(p => <button key={p} onClick={() => setSelPri(p)} className="flex-1 py-1.5 rounded text-xs transition-all" style={{ borderWidth: 1, borderStyle: "solid", borderColor: selPri === p ? PRIORITY_CFG[p].color : `${PRIORITY_CFG[p].color}30`, color: PRIORITY_CFG[p].color, backgroundColor: selPri === p ? `${PRIORITY_CFG[p].color}18` : `${PRIORITY_CFG[p].color}08`, ...MONO }}>{PRIORITY_CFG[p].label}</button>)}</div></div>
              <div className="rounded p-4 flex items-center justify-center gap-2 text-sm" style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "#4A6070" }}><Paperclip size={13} />Перетащите файлы или кликните для загрузки</div>
              <div className="flex gap-3 pt-1"><button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded text-sm" style={{ border: "1px solid rgba(255,255,255,0.065)", color: "#4A6070" }}>Отмена</button><button className="flex-1 py-2 rounded text-sm font-medium" style={{ backgroundColor: "#00D4A8", color: "#000" }}>Создать заявку</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Docs ─────────────────────────────────────────────────────────────────────

function Docs() {
  const [tab, setTab] = useState<"docs"|"log">("docs");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allTags = [...new Set(DOCUMENTS.flatMap(d => d.tags))];
  const filtered = activeTag ? DOCUMENTS.filter(d => d.tags.includes(activeTag)) : DOCUMENTS;

  return (
    <div className="space-y-4">
      <div className="flex gap-0 border-b border-border">{([["docs","Документы"],["log","Журнал работ"]] as const).map(([v,l]) => <button key={v} onClick={() => setTab(v)} className="px-5 py-2.5 text-sm -mb-px border-b-2 transition-colors" style={{ borderColor: tab === v ? "#00D4A8" : "transparent", color: tab === v ? "#00D4A8" : "#4A6070" }}>{l}</button>)}</div>
      {tab === "docs" && (<div><div className="flex gap-2 mb-4 flex-wrap">{[null,...allTags].map(tag => <button key={tag??"__all"} onClick={() => setActiveTag(tag)} className="text-xs px-3 py-1 rounded border transition-colors" style={{ borderColor: activeTag===tag?"#00D4A8":"rgba(255,255,255,0.065)", color: activeTag===tag?"#00D4A8":"#4A6070", backgroundColor: activeTag===tag?"#00D4A808":"transparent" }}>{tag??"Все"}</button>)}</div><div className="space-y-2">{filtered.map(doc => <Card key={doc.id} className="p-4 flex items-center gap-4 hover:border-[rgba(255,255,255,0.12)] transition-colors"><FileText size={16} style={{ color: "#4A6070", flexShrink: 0 }} /><div className="flex-1 min-w-0"><div className="text-sm text-foreground">{doc.title}</div><div className="flex items-center gap-3 mt-1 flex-wrap">{doc.tags.map(tag => <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#111C24", color: "#4A6070" }}>{tag}</span>)}<span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{doc.date}</span><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{doc.size}</span></div></div><button style={{ color: "#4A6070" }}><Eye size={13} /></button><button style={{ color: "#4A6070" }}><Download size={13} /></button></Card>)}</div></div>)}
      {tab === "log" && (
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          <div className="space-y-6">
            {WORK_LOG.map(log => (
              <div key={log.id} className="flex gap-4">
                <div className="flex-shrink-0 w-10 flex justify-center pt-1 z-10 relative"><div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#00D4A8", backgroundColor: "#06090C" }}><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#00D4A8" }} /></div></div>
                <div className="flex-1 pb-2"><Card className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2"><div><div className="text-sm font-medium text-foreground">{log.title}</div><div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ ...MONO, color: "#4A6070" }}><span>{log.date} {log.time}</span><span>·</span><span>{log.engineer}</span>{log.ticket&&<><span>·</span><span style={{ color:"#38BDF8" }}>{log.ticket}</span></>}{log.device&&<><span>·</span><span style={{ color:"#00D4A8" }}>{log.device}</span></>}</div></div>{log.confirmed?<span className="flex items-center gap-1 text-xs flex-shrink-0" style={{ ...MONO, color:"#22C55E" }}><Check size={10} />Ознакомлен</span>:<button className="text-xs px-2.5 py-1 rounded flex-shrink-0 border" style={{ borderColor:"#00D4A830", color:"#00D4A8", ...MONO }}>Подтвердить</button>}</div>
                  <p className="text-sm leading-relaxed" style={{ color:"#94A3B8" }}>{log.body}</p>
                  {log.attachments.length>0&&<div className="flex gap-2 mt-3">{log.attachments.map(att=><button key={att} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded" style={{ ...MONO, backgroundColor:"#111C24", color:"#4A6070" }}><Paperclip size={9}/>{att}</button>)}</div>}
                </Card></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Network Topology with slide-out drawer ───────────────────────────────────

function NetworkTopology({ onNavigateToDevice }: { onNavigateToDevice: (id: string) => void }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [drawerNode, setDrawerNode] = useState<string | null>(null);

  const onWheel = useCallback((e: React.WheelEvent) => { e.preventDefault(); setScale(s => Math.min(2.5, Math.max(0.4, s - e.deltaY * 0.001))); }, []);
  const onMD = (e: React.MouseEvent) => { if ((e.target as Element).closest("[data-node]")) return; setDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const onMM = useCallback((e: React.MouseEvent) => { if (!dragging) return; setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }, [dragging, dragStart]);

  const bwW = (bw: string) => bw === "10G" ? 2.5 : bw === "1G" ? 1.5 : 1;
  const selNode = drawerNode ? TOPOLOGY_NODES.find(n => n.id === drawerNode) : null;
  const linkedDev = drawerNode ? DEVICES.find(d => d.id === drawerNode) : null;

  return (
    <div className="flex gap-0 h-full min-h-0 relative">
      {/* SVG canvas */}
      <div className="flex-1 relative min-h-0 rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.065)", backgroundColor: "#04070A", cursor: dragging ? "grabbing" : "grab" }}>
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <button onClick={() => setScale(s => Math.min(2.5, s + 0.15))} className="w-7 h-7 rounded flex items-center justify-center text-sm" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }}>+</button>
          <button onClick={() => setScale(s => Math.max(0.4, s - 0.15))} className="w-7 h-7 rounded flex items-center justify-center text-sm" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }}>−</button>
          <button onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }} className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#4A6070" }}><RefreshCw size={10} /></button>
        </div>
        <div className="absolute top-3 right-3 z-10 text-xs px-2 py-1 rounded" style={{ ...MONO, backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#4A6070" }}>{Math.round(scale * 100)}%</div>

        <svg width="100%" height="100%" onWheel={onWheel} onMouseDown={onMD} onMouseMove={onMM} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}>
          <g transform={`translate(${offset.x},${offset.y}) scale(${scale})`}>
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="0.8" fill="rgba(255,255,255,0.03)" /></pattern></defs>
            <rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#grid)" />
            {TOPOLOGY_EDGES.map((edge, i) => {
              const from = TOPOLOGY_NODES.find(n => n.id === edge.from)!;
              const to = TOPOLOGY_NODES.find(n => n.id === edge.to)!;
              const hi = hovered === edge.from || hovered === edge.to || drawerNode === edge.from || drawerNode === edge.to;
              const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
              return <g key={i}><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={hi ? edge.color : `${edge.color}50`} strokeWidth={bwW(edge.bw)} strokeDasharray={edge.label === "Backup" ? "4 3" : undefined} /><text x={mx} y={my - 5} textAnchor="middle" fontSize="8" fill={hi ? "#94A3B8" : "#2A3A44"} fontFamily="JetBrains Mono,monospace">{edge.label}</text></g>;
            })}
            {TOPOLOGY_NODES.map(node => {
              const cfg = TOPO_NODE_CFG[node.type] ?? TOPO_NODE_CFG.server;
              const isActive = drawerNode === node.id, isHov = hovered === node.id;
              return (
                <g key={node.id} data-node={node.id} transform={`translate(${node.x},${node.y})`} style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} onClick={() => setDrawerNode(drawerNode === node.id ? null : node.id)}>
                  {(isHov || isActive) && <circle r={30} fill="none" stroke={`${cfg.color}20`} strokeWidth={8} />}
                  <circle r={22} fill={isActive ? `${cfg.color}20` : "#0C1117"} stroke={isActive || isHov ? cfg.color : `${cfg.color}60`} strokeWidth={isActive ? 2 : 1.5} />
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={cfg.color}>{node.type === "firewall" ? "⬡" : node.type === "switch" ? "◈" : node.type === "database" ? "◉" : node.type === "storage" ? "▣" : node.type === "external" ? "◎" : "○"}</text>
                  <text x={0} y={32} textAnchor="middle" fontSize="9" fill={isActive || isHov ? "#C4D2DC" : "#4A6070"} fontFamily="JetBrains Mono,monospace">{node.label}</text>
                  <text x={0} y={43} textAnchor="middle" fontSize="7" fill="#2A3A44" fontFamily="JetBrains Mono,monospace">{node.ip}</text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Slide-out drawer */}
      <div className="flex-shrink-0 overflow-hidden transition-all duration-200" style={{ width: drawerNode ? 380 : 0 }}>
        {selNode && (
          <div className="w-[380px] h-full overflow-auto" style={{ borderLeft: "1px solid rgba(255,255,255,0.065)", backgroundColor: "#04070A" }}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground" style={MONO}>{selNode.label}</span>
                    {linkedDev && <span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor: `${STATUS_CFG[linkedDev.status].color}15`, color: STATUS_CFG[linkedDev.status].color, border: `1px solid ${STATUS_CFG[linkedDev.status].color}30` }}>{STATUS_CFG[linkedDev.status].label}</span>}
                  </div>
                  <div className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{TOPO_NODE_CFG[selNode.type]?.label}</div>
                </div>
                <button onClick={() => setDrawerNode(null)} style={{ color: "#4A6070" }}><X size={14} /></button>
              </div>

              {/* Fast facts */}
              <div className="rounded mb-4" style={{ border: "1px solid rgba(255,255,255,0.065)" }}>
                {[["IP-адрес", selNode.ip, "#00D4A8"],
                  ...(linkedDev ? [["ОС / прошивка", linkedDev.os, ""], ["Аптайм", linkedDev.uptime, ""], ["Модель", linkedDev.model, ""], ["Гарантия", linkedDev.warranty, ""]] : [])
                ].map(([k, v, clr], i) => (
                  <div key={i} className="flex justify-between px-3 py-2 text-xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", ...MONO }}>
                    <span style={{ color: "#4A6070" }}>{k}</span><span style={{ color: (clr as string) || "#94A3B8" }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Sparklines */}
              {linkedDev && linkedDev.cpu != null && (
                <div className="space-y-3 mb-4">
                  <div><div className="text-xs mb-1" style={{ ...MONO, color: "#4A6070" }}>CPU — последний час</div><Sparkline data={linkedDev.cpuHistory} color={linkedDev.cpu > 65 ? "#F59E0B" : "#00D4A8"} /></div>
                  <div><div className="text-xs mb-1" style={{ ...MONO, color: "#4A6070" }}>Сеть (Mbps) — последний час</div><Sparkline data={linkedDev.netHistory} color="#3B82F6" /></div>
                  <div className="space-y-2">
                    {linkedDev.cpu != null && <MetricBar label="CPU" value={linkedDev.cpu} color="#00D4A8" />}
                    {linkedDev.ram != null && <MetricBar label="RAM" value={linkedDev.ram} color="#3B82F6" />}
                    {linkedDev.disk != null && <MetricBar label="Disk" value={linkedDev.disk} color="#8B5CF6" />}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                {linkedDev && <button onClick={() => { onNavigateToDevice(linkedDev.id); setDrawerNode(null); }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-sm font-medium" style={{ backgroundColor: "#00D4A8", color: "#000" }}><ExternalLink size={13} />Открыть профиль устройства</button>}
                <button className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs" style={{ backgroundColor: "#EF444415", color: "#EF4444", border: "1px solid #EF444430" }}><AlertCircle size={11} />Создать заявку для этого узла</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend (only when drawer closed) */}
      {!drawerNode && (
        <div className="w-44 flex-shrink-0 space-y-4 pl-4">
          <div>
            <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Узлы</div>
            <div className="space-y-1.5">{Object.entries(TOPO_NODE_CFG).map(([type, cfg]) => <div key={type} className="flex items-center gap-2 text-xs" style={{ color: "#94A3B8" }}><div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${cfg.color}25`, border: `1.5px solid ${cfg.color}` }} />{cfg.label}</div>)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Каналы</div>
            <div className="space-y-1.5">{[{label:"10G Uplink",color:"#00D4A8",w:2.5},{label:"1G Link",color:"#4A6070",w:1.5},{label:"WAN",color:"#EF4444",w:1},{label:"Backup",color:"#8B5CF6",w:1,dash:true}].map(e => <div key={e.label} className="flex items-center gap-2 text-xs" style={{ color: "#94A3B8" }}><svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke={e.color} strokeWidth={e.w} strokeDasharray={e.dash?"3 2":undefined} /></svg>{e.label}</div>)}</div>
          </div>
          <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="text-xs" style={{ color: "#4A6070" }}>Колесо — масштаб</div>
            <div className="text-xs mt-0.5" style={{ color: "#4A6070" }}>Клик — панель деталей</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Container Mesh Graph ─────────────────────────────────────────────────────

function ContainerMesh() {
  const [meshMode, setMeshMode] = useState<"k8s"|"docker">("k8s");
  const [hovN, setHovN] = useState<string | null>(null);
  const volW = (v: string) => v === "high" ? 2.5 : v === "medium" ? 1.5 : 0.8;
  const volO = (v: string) => v === "high" ? 0.9 : v === "medium" ? 0.65 : 0.35;
  const sCo = (s: string) => s === "running" ? "#22C55E" : s === "stopped" ? "#6B7280" : "#EF4444";
  const dockerChildren = [
    { id: "c-gitlab", label: "gitlab-ce", status: "running", x: 120, y: 200, network: "gitlab-net" },
    { id: "c-postgres", label: "postgres-15", status: "running", x: 210, y: 200, network: "db-net" },
    { id: "c-redis", label: "redis-7", status: "stopped", x: 290, y: 200, network: "db-net" },
    { id: "c-nginx", label: "nginx-proxy", status: "running", x: 420, y: 200, network: "proxy-net" },
    { id: "c-runner", label: "gitlab-runner", status: "running", x: 510, y: 200, network: "gitlab-net" },
    { id: "c-zbx", label: "zabbix-agent", status: "running", x: 600, y: 200, network: "monitor-net" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-0 rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.065)" }}>
          {([["k8s","K8s Service Mesh"],["docker","Docker Host View"]] as const).map(([v,l]) => <button key={v} onClick={() => setMeshMode(v)} className="px-4 py-2 text-xs transition-colors" style={{ backgroundColor: meshMode===v?"#00D4A815":"transparent", color: meshMode===v?"#00D4A8":"#4A6070", borderRight: v==="k8s"?"1px solid rgba(255,255,255,0.065)":"none", ...MONO }}>{l}</button>)}
        </div>
      </div>

      {meshMode === "k8s" && (
        <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.065)", backgroundColor: "#04070A" }}>
          <svg width="100%" viewBox="0 0 700 430" style={{ display: "block" }}>
            <defs>
              <marker id="arrowT" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#00D4A8" /></marker>
              <marker id="arrowB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" /></marker>
              <marker id="arrowG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#4A6070" /></marker>
              <pattern id="meshg" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="0.6" fill="rgba(255,255,255,0.025)" /></pattern>
            </defs>
            <rect width="700" height="430" fill="url(#meshg)" />
            <rect x="60" y="60" width="565" height="295" rx="4" fill="rgba(0,212,168,0.02)" stroke="rgba(0,212,168,0.15)" strokeWidth="1" strokeDasharray="6 3" />
            <text x="72" y="82" fontSize="9" fill="#00D4A870" fontFamily="JetBrains Mono,monospace">namespace: production</text>
            <rect x="200" y="295" width="240" height="70" rx="4" fill="rgba(74,96,112,0.05)" stroke="rgba(74,96,112,0.2)" strokeWidth="1" strokeDasharray="4 3" />
            <text x="212" y="313" fontSize="9" fill="#4A607070" fontFamily="JetBrains Mono,monospace">namespace: kube-system</text>
            {K8S_MESH.edges.map((edge, i) => {
              const from = K8S_MESH.nodes.find(n => n.id === edge.from)!;
              const to = K8S_MESH.nodes.find(n => n.id === edge.to)!;
              const hi = hovN === edge.from || hovN === edge.to;
              const col = edge.volume==="high"?"#00D4A8":edge.volume==="medium"?"#3B82F6":"#4A6070";
              const marker = edge.volume==="high"?"url(#arrowT)":edge.volume==="medium"?"url(#arrowB)":"url(#arrowG)";
              const dx=to.x-from.x,dy=to.y-from.y,len=Math.sqrt(dx*dx+dy*dy),r=26;
              const sx=from.x+dx/len*r,sy=from.y+dy/len*r,ex=to.x-dx/len*r,ey=to.y-dy/len*r;
              const mx=(sx+ex)/2,my=(sy+ey)/2;
              return <g key={i} opacity={hi?1:volO(edge.volume)}><line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col} strokeWidth={volW(edge.volume)} markerEnd={marker} /><text x={mx} y={my-4} textAnchor="middle" fontSize="8" fill={hi?"#94A3B8":"#2A3A44"} fontFamily="JetBrains Mono,monospace">{edge.label}</text></g>;
            })}
            {K8S_MESH.nodes.map(node => {
              const cfg = MESH_NODE_CFG[node.type] ?? { color: "#4A6070" };
              const isH = hovN===node.id;
              const sc = sCo(node.status);
              return <g key={node.id} transform={`translate(${node.x},${node.y})`} style={{ cursor:"pointer" }} onMouseEnter={() => setHovN(node.id)} onMouseLeave={() => setHovN(null)}>{isH&&<circle r={32} fill="none" stroke={`${cfg.color}20`} strokeWidth={8} />}<circle r={24} fill="#0C1117" stroke={isH?cfg.color:`${cfg.color}70`} strokeWidth={isH?2:1.5} /><circle r={5} cx={16} cy={-16} fill={sc} /><text textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={cfg.color} fontFamily="JetBrains Mono,monospace">{node.type==="web"?"⬡":node.type==="api"?"◈":node.type==="cache"?"◎":node.type==="database"?"◉":"○"}</text><text x={0} y={34} textAnchor="middle" fontSize="9" fill={isH?"#C4D2DC":"#4A6070"} fontFamily="JetBrains Mono,monospace">{node.label}</text><text x={0} y={45} textAnchor="middle" fontSize="7.5" fill="#2A3A44" fontFamily="JetBrains Mono,monospace">{node.ns}</text></g>;
            })}
          </svg>
          <div className="flex items-center gap-6 px-4 py-3" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-xs" style={{ ...MONO, color:"#4A6070" }}>Трафик:</span>
            {[{label:"Высокий",color:"#00D4A8",w:2.5},{label:"Средний",color:"#3B82F6",w:1.5},{label:"Низкий",color:"#4A6070",w:0.8}].map(e => <div key={e.label} className="flex items-center gap-2 text-xs" style={{ color:"#94A3B8" }}><svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={e.color} strokeWidth={e.w} /></svg>{e.label}</div>)}
          </div>
        </div>
      )}

      {meshMode === "docker" && (
        <div className="rounded overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.065)", backgroundColor:"#04070A" }}>
          <svg width="100%" viewBox="0 0 700 280" style={{ display:"block" }}>
            <defs><pattern id="meshg2" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="0.6" fill="rgba(255,255,255,0.025)" /></pattern></defs>
            <rect width="700" height="280" fill="url(#meshg2)" />
            <rect x="55" y="30" width="300" height="210" rx="4" fill="rgba(36,150,237,0.03)" stroke="rgba(36,150,237,0.2)" strokeWidth="1" strokeDasharray="5 3" />
            <text x="67" y="51" fontSize="9" fill="#2496ED80" fontFamily="JetBrains Mono,monospace">pve-01 (Docker host)</text>
            <rect x="375" y="30" width="280" height="210" rx="4" fill="rgba(36,150,237,0.03)" stroke="rgba(36,150,237,0.2)" strokeWidth="1" strokeDasharray="5 3" />
            <text x="387" y="51" fontSize="9" fill="#2496ED80" fontFamily="JetBrains Mono,monospace">pve-02 (Docker host)</text>
            {dockerChildren.map(cn => {
              const isH=hovN===cn.id;
              return <g key={cn.id} transform={`translate(${cn.x},${cn.y})`} style={{ cursor:"pointer" }} onMouseEnter={() => setHovN(cn.id)} onMouseLeave={() => setHovN(null)}><rect x={-40} y={-24} width={80} height={48} rx={3} fill="#0C1117" stroke={isH?"#2496ED":"rgba(36,150,237,0.3)"} strokeWidth={isH?1.5:1} /><circle r={5} cx={30} cy={-14} fill={sCo(cn.status)} /><text textAnchor="middle" y={-6} fontSize="9" fill={isH?"#C4D2DC":"#94A3B8"} fontFamily="JetBrains Mono,monospace">{cn.label.split("-")[0]}</text><text textAnchor="middle" y={8} fontSize="7.5" fill="#4A6070" fontFamily="JetBrains Mono,monospace">{cn.network}</text></g>;
            })}
            {([["gitlab-net","#F59E0B"],["db-net","#3B82F6"]] as const).map(([net,col]) => {
              const inNet = dockerChildren.filter(n => n.network === net);
              if (inNet.length < 2) return null;
              return inNet.slice(0,-1).map((a,i) => { const b=inNet[i+1]; return <line key={`${net}-${i}`} x1={a.x} y1={a.y+24} x2={b.x} y2={b.y+24} stroke={col} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="3 2" />; });
            })}
          </svg>
          <div className="flex items-center gap-5 px-4 py-3" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-xs" style={{ ...MONO, color:"#4A6070" }}>Сети:</span>
            {[{label:"gitlab-net",color:"#F59E0B"},{label:"db-net",color:"#3B82F6"},{label:"proxy-net",color:"#00D4A8"},{label:"monitor-net",color:"#8B5CF6"}].map(e => <div key={e.label} className="flex items-center gap-1.5 text-xs" style={{ color:"#94A3B8" }}><div className="w-2 h-2 rounded-full" style={{ backgroundColor:e.color }} />{e.label}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Hypervisor View ──────────────────────────────────────────────────────────

function HypervisorView() {
  const [expanded, setExpanded] = useState<Record<string,boolean>>({ "pve-01":true, "pve-02":false });
  const [selVM, setSelVM] = useState<{pveId:string;vmId:string}|null>(null);
  const toggle = (id: string) => setExpanded(e => ({...e,[id]:!e[id]}));

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-3">
        {HYPERVISORS.map(pve => (
          <Card key={pve.id} className="overflow-hidden">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-muted text-left" onClick={() => toggle(pve.id)}>
              <ChevronDown size={13} style={{ color:"#4A6070", transform:expanded[pve.id]?"none":"rotate(-90deg)", transition:"transform 0.15s" }} />
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor:"#E85D0415", border:"1px solid #E85D0440" }}><TerminalSquare size={14} style={{ color:"#E85D04" }} /></div>
              <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-foreground flex items-center gap-2">{pve.name}<span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor:"#E85D0415", color:"#E85D04", border:"1px solid #E85D0430" }}>Proxmox</span></div><div className="text-xs mt-0.5" style={{ ...MONO, color:"#4A6070" }}>{pve.version} · {pve.ip}</div></div>
              <div className="flex gap-4 text-xs flex-shrink-0" style={MONO}>
                <div className="text-right"><div style={{ color:"#94A3B8" }}>CPU</div><div style={{ color:pve.cpu>70?"#F59E0B":"#22C55E" }}>{pve.cpu}%</div></div>
                <div className="text-right"><div style={{ color:"#94A3B8" }}>RAM</div><div style={{ color:pve.ram>80?"#F59E0B":"#22C55E" }}>{pve.ram}%</div></div>
                <div className="text-right"><div style={{ color:"#94A3B8" }}>VMs</div><div style={{ color:"#C4D2DC" }}>{pve.vms.length}</div></div>
              </div>
            </button>
            {expanded[pve.id] && <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
              {pve.vms.map(vm => {
                const isSel=selVM?.pveId===pve.id&&selVM?.vmId===vm.id;
                const tc=vm.type==="vm"?"#3B82F6":"#8B5CF6";
                const running=vm.status==="running";
                return <button key={vm.id} className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-muted transition-colors" style={{ borderBottom:"1px solid rgba(255,255,255,0.03)", backgroundColor:isSel?"#00D4A808":undefined }} onClick={() => setSelVM(isSel?null:{pveId:pve.id,vmId:vm.id})}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 font-bold" style={{ ...MONO, backgroundColor:`${tc}15`, color:tc, fontSize:8 }}>{vm.type==="vm"?"VM":"LX"}</div>
                  <div className="flex-1 min-w-0"><div className="text-xs font-medium text-foreground" style={MONO}>{vm.name}</div><div className="text-xs mt-0.5" style={{ ...MONO, color:"#4A6070" }}>{vm.os} · {vm.cores} vCPU · {vm.mem}</div></div>
                  <div className="flex items-center gap-4 text-xs flex-shrink-0" style={MONO}>
                    {running?<><span style={{ color:"#4A6070" }}>CPU <span style={{ color:"#94A3B8" }}>{vm.cpu}%</span></span><span style={{ color:"#4A6070" }}>RAM <span style={{ color:"#94A3B8" }}>{vm.ram}%</span></span></>:<span style={{ color:"#4A6070" }}>—</span>}
                    <span className="flex items-center gap-1" style={{ color:running?"#22C55E":"#6B7280" }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:running?"#22C55E":"#6B7280" }} />{running?"running":"stopped"}</span>
                  </div>
                </button>;
              })}
            </div>}
          </Card>
        ))}
      </div>
      {selVM&&(()=>{
        const pve=HYPERVISORS.find(h=>h.id===selVM.pveId)!;
        const vm=pve.vms.find(v=>v.id===selVM.vmId)!;
        const running=vm.status==="running";
        const tc=vm.type==="vm"?"#3B82F6":"#8B5CF6";
        return <div className="w-64 flex-shrink-0"><Card className="p-4">
          <div className="flex items-center justify-between mb-3"><span className="text-xs font-semibold" style={{ ...MONO, color:tc }}>{vm.type==="vm"?"Virtual Machine":"LXC Container"}</span><button onClick={() => setSelVM(null)} style={{ color:"#4A6070" }}><X size={13}/></button></div>
          <div className="text-sm font-semibold mb-1" style={MONO}>{vm.name}</div>
          <div className="text-xs mb-4" style={{ ...MONO, color:"#4A6070" }}>на {pve.name}</div>
          <div className="space-y-1.5 text-xs mb-4" style={MONO}>{[["ОС",vm.os],["vCPU",String(vm.cores)],["RAM",vm.mem],["ID",vm.id],["Статус",vm.status]].map(([k,v])=><div key={k} className="flex justify-between py-1.5" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}><span style={{ color:"#4A6070" }}>{k}</span><span style={{ color:k==="Статус"?(running?"#22C55E":"#6B7280"):"#94A3B8" }}>{v}</span></div>)}</div>
          {running&&<div className="space-y-3"><MetricBar label="CPU" value={vm.cpu} color={tc}/><MetricBar label="RAM" value={vm.ram} color={tc}/><MetricBar label="Disk" value={vm.disk} color={tc}/></div>}
        </Card></div>;
      })()}
    </div>
  );
}

// ─── Containers View ──────────────────────────────────────────────────────────

function ContainersView() {
  const [tab, setTab] = useState<"docker"|"k8s"|"mesh">("docker");
  const [expNode, setExpNode] = useState<string|null>("k8s-node-01");

  return (
    <div className="space-y-4">
      <SubTabs tabs={[["docker","Docker / Podman"],["k8s","Kubernetes"],["mesh","Container Mesh"]]} active={tab} onChange={v => setTab(v as typeof tab)} />
      {tab==="mesh"&&<ContainerMesh/>}
      {tab==="docker"&&(
        <div>
          <div className="flex items-center justify-between mb-3"><div className="text-xs uppercase tracking-widest" style={{ ...MONO, color:"#4A6070" }}>Контейнеры ({DOCKER_CONTAINERS.length})</div><div className="flex gap-3 text-xs" style={MONO}><span style={{ color:"#22C55E" }}>{DOCKER_CONTAINERS.filter(c=>c.status==="running").length} running</span><span style={{ color:"#6B7280" }}>{DOCKER_CONTAINERS.filter(c=>c.status!=="running").length} stopped</span></div></div>
          <div className="space-y-2">
            {DOCKER_CONTAINERS.map(c=>{
              const running=c.status==="running";
              return <Card key={c.id} className="p-4">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor:running?"#2496ED15":"#4A607015", border:`1px solid ${running?"#2496ED30":"#4A607030"}` }}><Box size={13} style={{ color:running?"#2496ED":"#4A6070" }}/></div>
                <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="text-sm font-medium text-foreground" style={MONO}>{c.name}</span><span className="flex items-center gap-1 text-xs" style={{ ...MONO, color:running?"#22C55E":"#6B7280" }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:running?"#22C55E":"#6B7280" }}/>{c.status}</span></div><div className="text-xs mt-0.5 truncate" style={{ ...MONO, color:"#4A6070" }}>{c.image}</div></div>
                <div className="flex gap-6 text-xs flex-shrink-0" style={MONO}><div className="text-right"><div style={{ color:"#4A6070" }}>CPU</div><div>{running?`${c.cpu}%`:"—"}</div></div><div className="text-right"><div style={{ color:"#4A6070" }}>RAM</div><div>{running?(c.ram>1000?`${(c.ram/1024).toFixed(1)} GB`:`${c.ram} MB`):"—"}</div></div><div className="text-right"><div style={{ color:"#4A6070" }}>Аптайм</div><div style={{ color:"#94A3B8" }}>{c.uptime}</div></div></div></div>
                <div className="flex items-center gap-3 mt-3 pt-3 text-xs" style={{ borderTop:"1px solid rgba(255,255,255,0.04)", ...MONO, color:"#4A6070" }}><span>Порты: <span style={{ color:"#38BDF8" }}>{c.ports}</span></span><span>·</span><span>Сеть: <span style={{ color:"#8B5CF6" }}>{c.network}</span></span></div>
              </Card>;
            })}
          </div>
        </div>
      )}
      {tab==="k8s"&&(
        <div>
          <div className="flex items-center gap-3 mb-4 p-3 rounded" style={{ backgroundColor:"#0C1117", border:"1px solid rgba(255,255,255,0.065)" }}><div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor:"#326CE515" }}><Layers size={13} style={{ color:"#326CE5" }}/></div><div className="flex-1"><div className="text-sm font-semibold text-foreground">k8s-prod-01</div><div className="text-xs" style={{ ...MONO, color:"#4A6070" }}>Kubernetes v1.29.4 · 3 узла</div></div><div className="flex gap-4 text-xs" style={MONO}><span style={{ color:"#22C55E" }}>{K8S_NODES.filter(n=>n.status==="ready").length} ready</span><span style={{ color:"#EF4444" }}>{K8S_NODES.filter(n=>n.status!=="ready").length} not ready</span></div></div>
          <div className="space-y-3">
            {K8S_NODES.map(node=>{
              const ready=node.status==="ready",isExp=expNode===node.id;
              return <Card key={node.id} className="overflow-hidden"><button className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted" onClick={() => setExpNode(isExp?null:node.id)}>
                <ChevronDown size={13} style={{ color:"#4A6070", transform:isExp?"none":"rotate(-90deg)", transition:"transform 0.15s" }}/>
                <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor:ready?"#22C55E15":"#EF444415", border:`1px solid ${ready?"#22C55E30":"#EF444430"}` }}><GitBranch size={13} style={{ color:ready?"#22C55E":"#EF4444" }}/></div>
                <div className="flex-1 min-w-0"><div className="flex items-center gap-2 text-sm font-semibold text-foreground"><span style={MONO}>{node.name}</span><span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor:node.role==="master"?"#8B5CF615":"#3B82F615", color:node.role==="master"?"#8B5CF6":"#3B82F6", border:`1px solid ${node.role==="master"?"#8B5CF630":"#3B82F630"}` }}>{node.role}</span></div><div className="text-xs mt-0.5" style={{ ...MONO, color:"#4A6070" }}>{node.ip} · {node.pods.length} pods</div></div>
                <div className="flex gap-4 text-xs flex-shrink-0" style={MONO}>{ready?<><span style={{ color:"#4A6070" }}>CPU <span style={{ color:"#94A3B8" }}>{node.cpu}%</span></span><span style={{ color:"#4A6070" }}>RAM <span style={{ color:"#94A3B8" }}>{node.ram}%</span></span></>:<span style={{ color:"#EF4444" }}>NOT READY</span>}</div>
              </button>
              {isExp&&node.pods.length>0&&<div style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>{node.pods.map((pod,i)=><div key={i} className="flex items-center gap-3 px-6 py-2.5" style={{ borderBottom:i<node.pods.length-1?"1px solid rgba(255,255,255,0.03)":"none" }}><div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor:"#22C55E" }}/><div className="flex-1 min-w-0"><div className="text-xs font-medium text-foreground" style={MONO}>{pod.name}</div><div className="text-xs truncate mt-0.5" style={{ ...MONO, color:"#4A6070" }}>{pod.image}</div></div><span className="text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ ...MONO, backgroundColor:"#22C55E10", color:"#22C55E", border:"1px solid #22C55E20" }}>{pod.status}</span><span className="text-xs flex-shrink-0" style={{ ...MONO, color:"#4A6070" }}>{pod.namespace}</span></div>)}</div>}
              {isExp&&node.pods.length===0&&<div className="px-6 py-3 text-xs" style={{ ...MONO, color:"#4A6070", borderTop:"1px solid rgba(255,255,255,0.05)" }}>Узел недоступен</div>}
              </Card>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Infrastructure ───────────────────────────────────────────────────────────

function Infra({ initialDevice, onNavigateToDevice }: { initialDevice?: string|null; onNavigateToDevice: (id:string)=>void }) {
  const [subTab, setSubTab] = useState<"devices"|"topology"|"hypervisors"|"containers">("devices");
  const [selectedId, setSelectedId] = useState<string|null>(initialDevice??null);
  const [expLoc, setExpLoc] = useState("Главный офис");
  const device = selectedId ? DEVICES.find(d => d.id === selectedId) : null;
  const locations = [...new Set(DEVICES.map(d => d.location))];

  useEffect(() => { if (initialDevice) { setSelectedId(initialDevice); setSubTab("devices"); } }, [initialDevice]);

  return (
    <div className="flex flex-col h-full">
      <SubTabs tabs={[["devices","Устройства"],["topology","Топология сети"],["hypervisors","Гипервизоры"],["containers","Контейнеры / K8s"]]} active={subTab} onChange={v => { setSubTab(v as typeof subTab); setSelectedId(null); }} />
      {subTab==="topology"&&<div className="flex-1 min-h-0" style={{ height:"calc(100vh - 200px)" }}><NetworkTopology onNavigateToDevice={id=>{onNavigateToDevice(id);setSelectedId(id);setSubTab("devices");}}/></div>}
      {subTab==="hypervisors"&&<HypervisorView/>}
      {subTab==="containers"&&<ContainersView/>}
      {subTab==="devices"&&(
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-52 flex-shrink-0 space-y-0.5">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Структура</div>
            {locations.map(loc=>(
              <div key={loc}>
                <button onClick={() => setExpLoc(loc===expLoc?"":loc)} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-foreground hover:bg-muted">
                  <ChevronRight size={11} style={{ transition:"transform 0.15s", transform:expLoc===loc?"rotate(90deg)":"none" }}/><Building2 size={11} style={{ color:"#4A6070" }}/><span className="flex-1 text-left">{loc}</span>
                </button>
                {expLoc===loc&&DEVICES.filter(d=>d.location===loc).map(d=>{
                  const Icon=DEVICE_ICON[d.type]??Globe;const active=selectedId===d.id;
                  return <button key={d.id} onClick={() => setSelectedId(d.id===selectedId?null:d.id)} className="w-full flex items-center gap-2 px-4 py-1.5 rounded text-xs transition-colors" style={{ color:active?"#00D4A8":"#4A6070", backgroundColor:active?"#00D4A810":"transparent" }}><Icon size={10}/><span className="flex-1 text-left" style={MONO}>{d.name}</span><StatusDot status={d.status} size={5}/></button>;
                })}
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0 overflow-auto">
            {!device?(
              <><div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Оборудование</div>
              <div className="grid grid-cols-3 gap-3">
                {DEVICES.map(d=>{
                  const Icon=DEVICE_ICON[d.type]??Globe;const sc=STATUS_CFG[d.status];
                  return <Card key={d.id} className="p-4 hover:border-[rgba(255,255,255,0.15)] transition-colors" onClick={() => setSelectedId(d.id)}>
                    <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Icon size={15} style={{ color:sc.color }}/><span className="text-xs font-medium" style={MONO}>{d.name}</span></div><StatusDot status={d.status} size={6}/></div>
                    <div className="text-xs mb-3" style={{ color:"#4A6070" }}>{d.model}</div>
                    <div className="space-y-2">{d.cpu!=null&&<MetricBar label="CPU" value={d.cpu} color="#00D4A8"/>}{d.ram!=null&&<MetricBar label="RAM" value={d.ram} color="#3B82F6"/>}{d.disk!=null&&<MetricBar label="Disk" value={d.disk} color="#8B5CF6"/>}</div>
                    <div className="mt-3 pt-3 flex justify-between text-xs" style={{ borderTop:"1px solid rgba(255,255,255,0.05)", ...MONO, color:"#4A6070" }}><span>{d.ip}</span><span>{d.uptime}</span></div>
                  </Card>;
                })}
              </div></>
            ):(
              <div>
                <div className="flex items-center gap-2 mb-4"><button onClick={() => setSelectedId(null)} className="p-1 rounded hover:bg-muted" style={{ color:"#4A6070" }}><ChevronLeft size={15}/></button><span className="text-xs uppercase tracking-widest" style={{ ...MONO, color:"#4A6070" }}>{device.name}</span></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3">{(()=>{const Icon=DEVICE_ICON[device.type]??Globe;return <Icon size={18} style={{ color:STATUS_CFG[device.status].color }}/>;})()}<div><div className="font-semibold" style={MONO}>{device.name}</div><div className="text-sm" style={{ color:"#4A6070" }}>{device.model}</div></div></div><div className="flex items-center gap-2"><StatusDot status={device.status} size={7}/><span className="text-sm" style={{ color:STATUS_CFG[device.status].color }}>{STATUS_CFG[device.status].label}</span></div></div>
                      <div className="grid grid-cols-2 gap-x-8 text-xs" style={MONO}>{[["Серийный номер",device.serial],["IP-адрес",device.ip,"#00D4A8"],["ОС / прошивка",device.os],["Аптайм",device.uptime],["Стойка / юниты",`${device.rack} ${device.unit}`],["Гарантия до",device.warranty]].map(([k,v,clr])=><div key={String(k)} className="flex justify-between py-2" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}><span style={{ color:"#4A6070" }}>{k}</span><span style={clr?{color:clr as string}:{}}>{v}</span></div>)}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-xs mb-3" style={{ ...MONO, color:"#4A6070" }}>НАГРУЗКА CPU — ПОСЛЕДНИЕ 12 ТОЧЕК</div>
                      <ResponsiveContainer width="100%" height={72}>
                        <AreaChart data={device.cpuHistory.map((v,i)=>({v,i}))} margin={{top:4,right:4,bottom:4,left:4}}>
                          <defs><linearGradient id={`cpuG_${device.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={device.cpu>65?"#F59E0B":"#00D4A8"} stopOpacity={0.3}/><stop offset="95%" stopColor={device.cpu>65?"#F59E0B":"#00D4A8"} stopOpacity={0}/></linearGradient></defs>
                          <XAxis dataKey="i" hide/><Tooltip contentStyle={{ background:"#0C1117", border:"1px solid rgba(255,255,255,0.08)", borderRadius:2, fontSize:10, fontFamily:"'JetBrains Mono',monospace" }} formatter={(v:number)=>[`${v}%`,"CPU"]} labelFormatter={()=>""}/>
                          <Area type="monotone" dataKey="v" stroke={device.cpu>65?"#F59E0B":"#00D4A8"} strokeWidth={1.5} fill={`url(#cpuG_${device.id})`} dot={false} isAnimationActive={false}/>
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <Card className="p-4"><div className="text-xs mb-3" style={{ ...MONO, color:"#4A6070" }}>ЗАГРУЗКА</div><div className="space-y-3">{device.cpu!=null&&<MetricBar label="CPU" value={device.cpu} color="#00D4A8"/>}{device.ram!=null&&<MetricBar label="RAM" value={device.ram} color="#3B82F6"/>}{device.disk!=null&&<MetricBar label="Disk" value={device.disk} color="#8B5CF6"/>}</div></Card>
                    {device.vms.length>0&&<Card className="p-4"><div className="text-xs mb-3" style={{ ...MONO, color:"#4A6070" }}>ВИРТУАЛЬНЫЕ МАШИНЫ</div><div className="space-y-2">{device.vms.map(vm=><div key={vm} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:"#22C55E" }}/><span className="text-xs" style={MONO}>{vm}</span></div>)}</div></Card>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Finance ──────────────────────────────────────────────────────────────────

function Finance({ onSoftwareDetail }: { onSoftwareDetail: (name:string)=>void }) {
  const paid=INVOICES.filter(i=>i.status==="paid");
  const pending=INVOICES.filter(i=>i.status==="pending");
  const totalPaid=paid.reduce((s,i)=>s+i.amount,0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4"><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>АВАНС / БАЛАНС</div><div className="text-3xl font-bold" style={{ color:"#22C55E" }}>+42 000 ₽</div><div className="text-xs mt-1" style={{ ...MONO, color:"#4A6070" }}>Остаток по предоплате</div></Card>
        <Card className="p-4"><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>К ОПЛАТЕ</div><div className="text-3xl font-bold" style={{ color:pending.length?"#F59E0B":"#22C55E" }}>{pending.length?`${pending[0].amount.toLocaleString("ru-RU")} ₽`:"—"}</div><div className="text-xs mt-1" style={{ ...MONO, color:"#4A6070" }}>{pending.length?`Счёт ${pending[0].id}`:"Задолженностей нет"}</div></Card>
        <Card className="p-4"><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>ОПЛАЧЕНО В 2024</div><div className="text-3xl font-bold text-foreground">{totalPaid.toLocaleString("ru-RU")} ₽</div><div className="text-xs mt-1" style={{ ...MONO, color:"#4A6070" }}>{paid.length} закрытых счёта</div></Card>
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>История счетов</div>
        <div className="space-y-2">{INVOICES.map(inv=><Card key={inv.id} className="p-4 flex items-center gap-4"><div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor:inv.status==="paid"?"#22C55E15":"#F59E0B15" }}><Download size={13} style={{ color:inv.status==="paid"?"#22C55E":"#F59E0B" }}/></div><div className="flex-1 min-w-0"><div className="text-sm text-foreground">{inv.period}</div><div className="text-xs mt-0.5" style={{ ...MONO, color:"#4A6070" }}>{inv.id} · Выставлен {inv.issued} · Срок {inv.due}</div></div><div className="text-right flex-shrink-0"><div className="font-semibold text-sm" style={MONO}>{inv.amount.toLocaleString("ru-RU")} ₽</div><div className="text-xs mt-0.5" style={{ ...MONO, color:inv.status==="paid"?"#22C55E":"#F59E0B" }}>{inv.status==="paid"?"Оплачен":"Ожидает оплаты"}</div></div><button className="text-muted-foreground hover:text-foreground ml-2"><Download size={13}/></button></Card>)}</div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Инвентаризация ПО</div>
        <Card className="overflow-hidden">
          <table className="w-full text-xs" style={MONO}>
            <thead><tr style={{ borderBottom:"1px solid rgba(255,255,255,0.065)" }}>{["Программное обеспечение","Вендор","Мест","Использовано","Истекает","Статус"].map(h=><th key={h} className="text-left font-normal px-4 py-3" style={{ color:"#4A6070" }}>{h}</th>)}</tr></thead>
            <tbody>{LICENSES.map((l,i)=><tr key={i} className="hover:bg-muted transition-colors cursor-pointer" onClick={() => onSoftwareDetail(l.name)} style={{ borderBottom:i<LICENSES.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}><td className="px-4 py-3 text-foreground">{l.name}</td><td className="px-4 py-3" style={{ color:"#4A6070" }}>{l.vendor}</td><td className="px-4 py-3" style={{ color:"#4A6070" }}>{l.seats??"-"}</td><td className="px-4 py-3" style={{ color:"#4A6070" }}>{l.used!=null?`${l.used} / ${l.seats}`:"—"}</td><td className="px-4 py-3" style={{ color:"#4A6070" }}>{l.expires}</td><td className="px-4 py-3"><span style={{ color:l.daysLeft<90?"#F59E0B":"#22C55E" }}>{l.daysLeft<90?`${l.daysLeft} дн.`:"Активна"}</span></td></tr>)}</tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─── Software Detail ──────────────────────────────────────────────────────────

function SoftwareDetail({ name, onBack }: { name:string; onBack:()=>void }) {
  const lic=LICENSES.find(l=>l.name===name)!;
  const det=SOFTWARE_DETAILS[name]!;
  const [showKey,setShowKey]=useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2"><button onClick={onBack} className="flex items-center gap-1.5 text-xs hover:text-foreground" style={{ color:"#4A6070" }}><ArrowLeft size={13}/>Инвентаризация ПО</button><div className="w-px h-4 bg-border"/><span className="text-xs font-semibold text-foreground">{name}</span></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor:"#00D4A815", border:"1px solid #00D4A830" }}><Package size={18} style={{ color:"#00D4A8" }}/></div><div><div className="font-semibold text-foreground">{name}</div><div className="text-sm mt-0.5" style={{ color:"#4A6070" }}>{det.publisher}</div></div><div className="ml-auto"><span className="text-xs px-2 py-1 rounded" style={{ ...MONO, backgroundColor:lic.daysLeft<90?"#F59E0B15":"#22C55E15", color:lic.daysLeft<90?"#F59E0B":"#22C55E", border:`1px solid ${lic.daysLeft<90?"#F59E0B30":"#22C55E30"}` }}>{lic.daysLeft<90?`Истекает через ${lic.daysLeft} дн.`:"Активна"}</span></div></div>
            <div className="grid grid-cols-2 gap-x-8 text-xs" style={MONO}>{[["Версия",det.version],["Вендор",lic.vendor],["Дата установки",det.installed],["Истекает",lic.expires]].map(([k,v])=><div key={k} className="flex justify-between py-2" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}><span style={{ color:"#4A6070" }}>{k}</span><span style={{ color:"#94A3B8" }}>{v}</span></div>)}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Лицензионный ключ</div>
            <div className="flex items-center gap-3 p-3 rounded" style={{ backgroundColor:"#111C24", border:"1px solid rgba(255,255,255,0.065)" }}>
              <span className="flex-1 text-sm" style={{ ...MONO, color:showKey?"#00D4A8":"#4A6070", letterSpacing:"0.05em" }}>{showKey?det.key:det.key.replace(/[A-Z0-9]/g,"•")}</span>
              <button onClick={() => setShowKey(s=>!s)} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded" style={{ color:"#4A6070", backgroundColor:"#0C1117", border:"1px solid rgba(255,255,255,0.065)" }}>{showKey?<><EyeOff size={11}/>Скрыть</>:<><Eye size={11}/>Показать</>}</button>
              {showKey&&<button className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded" style={{ color:"#4A6070", backgroundColor:"#0C1117", border:"1px solid rgba(255,255,255,0.065)" }}><Copy size={11}/>Копировать</button>}
            </div>
          </Card>
          {det.notes&&<Card className="p-4" style={{ borderColor:"#F59E0B30", backgroundColor:"#F59E0B05" }}><div className="flex items-start gap-2"><AlertCircle size={13} style={{ color:"#F59E0B", flexShrink:0, marginTop:1 }}/><div><div className="text-xs font-semibold mb-1" style={{ color:"#F59E0B" }}>Внутренняя заметка</div><p className="text-sm leading-relaxed" style={{ color:"#94A3B8" }}>{det.notes}</p></div></div></Card>}
          <Card className="p-4">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Устройства с установленным ПО</div>
            <div className="space-y-1.5">{det.devices.map(d=><div key={d} className="flex items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor:"#111C24" }}><Globe size={11} style={{ color:"#4A6070" }}/><span className="text-xs flex-1" style={{ ...MONO, color:"#94A3B8" }}>{d}</span>{DEVICES.find(dev=>dev.id===d)&&<span className="text-xs" style={{ ...MONO, color:"#00D4A8" }}>↗ Профиль</span>}</div>)}</div>
          </Card>
        </div>
        <div className="space-y-4">
          {lic.seats&&lic.used!=null&&<Card className="p-4"><div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Использование</div><div className="text-3xl font-bold text-foreground mb-1" style={MONO}>{lic.used}<span className="text-base font-normal text-muted-foreground"> / {lic.seats}</span></div><div className="text-xs mb-3" style={{ ...MONO, color:"#4A6070" }}>Активировано мест</div><MetricBar label="Загруженность" value={Math.round(lic.used/lic.seats*100)} color={lic.used/lic.seats>0.9?"#EF4444":"#00D4A8"}/><div className="mt-3 text-xs" style={{ ...MONO, color:"#4A6070" }}>Свободно: {lic.seats-lic.used} мест</div></Card>}
          <Card className="p-4"><div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Документация</div><button className="w-full flex items-center gap-2 py-2 px-3 rounded text-xs" style={{ backgroundColor:"#111C24", color:"#00D4A8", border:"1px solid #00D4A820" }}><FileText size={11}/>Документы по {name.split(" ")[0]}<ExternalLink size={9} className="ml-auto"/></button></Card>
        </div>
      </div>
    </div>
  );
}

// ─── My Account ───────────────────────────────────────────────────────────────

function AccountPage() {
  const [tab, setTab] = useState<"profile"|"news"|"achievements">("profile");
  const [twoFA, setTwoFA] = useState(false);
  const totalPts = ACHIEVEMENTS.filter(a => a.earned).reduce((s, a) => s + a.points, 0);

  return (
    <div className="space-y-5">
      <SubTabs tabs={[["profile","Профиль и настройки"],["news","Лента новостей"],["achievements","Достижения"]]} active={tab} onChange={v => setTab(v as typeof tab)} />
      {tab==="profile"&&(
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-4">
            <Card className="p-5">
              <div className="text-xs uppercase tracking-widest mb-4" style={{ ...MONO, color:"#4A6070" }}>Личные данные</div>
              <div className="flex items-center gap-4 mb-5"><div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ ...MONO, backgroundColor:"#00D4A818", color:"#00D4A8", border:"2px solid #00D4A830" }}>ПА</div><div><div className="text-sm font-semibold text-foreground">Петров Андрей Сергеевич</div><div className="text-xs mt-0.5" style={{ ...MONO, color:"#4A6070" }}>Системный администратор · ООО «АльфаТрейд»</div><button className="text-xs mt-2 px-2.5 py-1 rounded" style={{ backgroundColor:"#0C1117", color:"#4A6070", border:"1px solid rgba(255,255,255,0.065)" }}>Изменить аватар</button></div></div>
              <div className="grid grid-cols-2 gap-3">{[["Имя","Андрей"],["Фамилия","Петров"],["Должность","Системный администратор"],["Email","a.petrov@alfatrade.ru"],["Телефон","+7 (926) 000-00-00"],["Отдел","ИТ-отдел"]].map(([label,val])=><div key={label}><div className="text-xs mb-1" style={{ ...MONO, color:"#4A6070" }}>{label}</div><input defaultValue={val} className="w-full rounded text-sm py-2 px-3 outline-none" style={{ backgroundColor:"#111C24", border:"1px solid rgba(255,255,255,0.065)", color:"#C4D2DC" }}/></div>)}</div>
              <button className="mt-4 px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor:"#00D4A8", color:"#000" }}>Сохранить изменения</button>
            </Card>
            <Card className="p-5">
              <div className="text-xs uppercase tracking-widest mb-4" style={{ ...MONO, color:"#4A6070" }}>Смена пароля</div>
              <div className="space-y-3">{["Текущий пароль","Новый пароль","Подтвердите пароль"].map(p=><div key={p}><div className="text-xs mb-1" style={{ ...MONO, color:"#4A6070" }}>{p}</div><input type="password" className="w-full rounded text-sm py-2 px-3 outline-none" placeholder="••••••••" style={{ backgroundColor:"#111C24", border:"1px solid rgba(255,255,255,0.065)", color:"#C4D2DC" }}/></div>)}<button className="px-4 py-2 rounded text-sm" style={{ backgroundColor:"#0C1117", color:"#4A6070", border:"1px solid rgba(255,255,255,0.065)" }}>Изменить пароль</button></div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-xs uppercase tracking-widest mb-4" style={{ ...MONO, color:"#4A6070" }}>Двухфакторная аутентификация</div>
              <div className="flex items-center justify-between mb-3"><div><div className="text-sm text-foreground">TOTP (Google Authenticator)</div><div className="text-xs mt-0.5" style={{ ...MONO, color:twoFA?"#22C55E":"#4A6070" }}>{twoFA?"Включено":"Не настроено"}</div></div><button onClick={() => setTwoFA(s=>!s)} className="relative transition-colors" style={{ width:44, height:24, borderRadius:12, backgroundColor:twoFA?"#00D4A8":"#1A2229" }}><div className="w-4 h-4 rounded-full bg-white absolute top-[4px] transition-all" style={{ left:twoFA?"24px":"4px" }}/></button></div>
              {twoFA&&<div className="p-3 rounded text-xs text-center" style={{ backgroundColor:"#111C24", color:"#4A6070" }}>QR-код для настройки появится здесь</div>}
            </Card>
            <Card className="p-4">
              <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Уведомления</div>
              {[["Email при новом тикете",true],["Telegram при критическом алерте",false],["Еженедельный отчёт SLA",true]].map(([label,on])=><div key={String(label)} className="flex items-center justify-between py-2" style={{ borderBottom:"1px solid rgba(255,255,255,0.04)" }}><span className="text-xs text-foreground">{String(label)}</span><div className="relative transition-colors" style={{ width:32, height:18, borderRadius:9, backgroundColor:on?"#00D4A830":"#1A2229" }}><div className="w-3 h-3 rounded-full absolute top-[3px] transition-all" style={{ left:on?"14px":"4px", backgroundColor:on?"#00D4A8":"#4A6070" }}/></div></div>)}
            </Card>
          </div>
        </div>
      )}
      {tab==="news"&&(
        <div className="max-w-2xl space-y-4">
          {ACTIVITY_FEED.map(item=>{
            const Icon=item.icon;
            const tc={invoice:"#F59E0B",doc:"#3B82F6",maintenance:"#8B5CF6",system:"#4A6070"}[item.type]??"#4A6070";
            return <div key={item.id} className="flex gap-4"><div className="flex flex-col items-center"><div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor:`${tc}15`, border:`1px solid ${tc}30` }}><Icon size={13} style={{ color:tc }}/></div><div className="flex-1 w-px mt-2" style={{ backgroundColor:"rgba(255,255,255,0.05)" }}/></div><div className="flex-1 pb-4"><div className="text-sm font-medium text-foreground mb-1">{item.title}</div><p className="text-sm leading-relaxed" style={{ color:"#94A3B8" }}>{item.body}</p><div className="text-xs mt-2" style={{ ...MONO, color:"#4A6070" }}>{item.date} · {item.time}</div></div></div>;
          })}
        </div>
      )}
      {tab==="achievements"&&(
        <div>
          <div className="flex items-center gap-4 mb-5 p-4 rounded" style={{ backgroundColor:"#00D4A808", border:"1px solid #00D4A820" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor:"#00D4A818", border:"2px solid #00D4A840" }}><Star size={20} style={{ color:"#00D4A8" }}/></div>
            <div><div className="text-2xl font-bold" style={{ ...MONO, color:"#00D4A8" }}>{totalPts} <span className="text-sm font-normal" style={{ color:"#4A6070" }}>очков активности</span></div><div className="text-xs mt-0.5" style={{ color:"#4A6070" }}>{ACHIEVEMENTS.filter(a=>a.earned).length} из {ACHIEVEMENTS.length} достижений получено</div></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {ACHIEVEMENTS.map(a=>(
              <Card key={a.id} className="p-4" style={{ opacity:a.earned?1:0.7 }}>
                <div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor:`${a.color}18`, border:`2px solid ${a.earned?a.color:`${a.color}40`}` }}><Award size={16} style={{ color:a.earned?a.color:`${a.color}60` }}/></div><div className="flex-1 min-w-0"><div className="text-sm font-semibold text-foreground">{a.name}</div><div className="text-xs mt-0.5" style={{ color:"#4A6070" }}>{a.desc}</div></div><span className="text-xs flex-shrink-0" style={{ ...MONO, color:a.earned?"#00D4A8":"#4A6070" }}>+{a.points}</span></div>
                <div className="space-y-1"><div className="flex justify-between text-xs" style={{ ...MONO, color:"#4A6070" }}><span>{a.earned?"Получено":"Прогресс"}</span><span style={{ color:a.earned?a.color:"#4A6070" }}>{a.earned?"✓":`${a.progress}/${a.max}`}</span></div><div className="h-1 rounded-full" style={{ backgroundColor:"#1A2229" }}><div className="h-full rounded-full" style={{ width:`${Math.min(100,Math.round(a.progress/a.max*100))}%`, backgroundColor:a.earned?a.color:`${a.color}60` }}/></div></div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SLA Dashboard ────────────────────────────────────────────────────────────

function SLADashboard() {
  const days90=Array.from({length:90},(_,i)=>{const seed=(i*137+42)%100;const u=seed>6?(seed>15?99.9+(seed%10)*0.01:99.1+(seed%9)*0.1):95+(seed%40)*0.1;return{idx:i,u};});
  const avgSLA=(days90.slice(0,31).reduce((s,d)=>s+d.u,0)/31).toFixed(2);
  const dc=(u:number)=>u>=99.9?"#22C55E":u>=99?"#F59E0B":"#EF4444";
  const services=[{name:"Серверы (srv-db-01, srv-app-01)",sla:99.92,status:"ok"},{name:"Сетевая инфраструктура",sla:99.87,status:"ok"},{name:"1С — бухгалтерия",sla:99.41,status:"warning"},{name:"Email / Exchange",sla:100.0,status:"ok"},{name:"VPN-доступ",sla:99.98,status:"ok"}];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 col-span-1"><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>SLA ЗА ИЮЛЬ 2024</div><div className="text-4xl font-bold" style={{ ...MONO, color:"#22C55E" }}>{avgSLA}%</div><div className="text-xs mt-1" style={{ ...MONO, color:"#4A6070" }}>Цель: 99.5%</div><div className="mt-3 h-1 rounded-full" style={{ backgroundColor:"#1A2229" }}><div className="h-full rounded-full" style={{ width:`${parseFloat(avgSLA)}%`, backgroundColor:"#22C55E" }}/></div></Card>
        <Card className="p-4"><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>ВРЕМЯ НЕДОСТУПНОСТИ</div><div className="text-3xl font-bold text-foreground">0ч 38м</div><div className="text-xs mt-1" style={{ ...MONO, color:"#4A6070" }}>За последние 30 дней</div></Card>
        <Card className="p-4"><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>ИНЦИДЕНТОВ</div><div className="text-3xl font-bold text-foreground">3</div><div className="text-xs mt-1" style={{ ...MONO, color:"#4A6070" }}>За последние 30 дней</div></Card>
        <Card className="p-4"><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>СРЕДНЕЕ ВРЕМЯ РЕШЕНИЯ</div><div className="text-3xl font-bold text-foreground">1ч 24м</div><div className="text-xs mt-1" style={{ ...MONO, color:"#4A6070" }}>MTTR (30 дней)</div></Card>
      </div>
      <Card className="p-4">
        <div className="text-xs uppercase tracking-widest mb-4" style={{ ...MONO, color:"#4A6070" }}>Доступность за 90 дней</div>
        <div className="flex gap-1 flex-wrap mb-3">{days90.map((d,i)=><div key={i} title={`День ${i+1}: ${d.u.toFixed(2)}%`} className="rounded-sm" style={{ width:10, height:10, backgroundColor:dc(d.u), opacity:0.85 }}/>)}</div>
        <div className="flex items-center gap-5 text-xs" style={MONO}>{[{label:"≥ 99.9% — Норма",c:"#22C55E"},{label:"99–99.9% — Деградация",c:"#F59E0B"},{label:"< 99% — Инцидент",c:"#EF4444"}].map(e=><div key={e.label} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor:e.c }}/>{e.label}</div>)}</div>
      </Card>
      <Card className="overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom:"1px solid rgba(255,255,255,0.065)" }}><div className="text-xs uppercase tracking-widest" style={{ ...MONO, color:"#4A6070" }}>SLA по сервисам — июль 2024</div></div>
        <table className="w-full text-xs" style={MONO}><tbody>{services.map((s,i)=><tr key={i} style={{ borderBottom:i<services.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}><td className="px-4 py-3 text-foreground">{s.name}</td><td className="px-4 py-3" style={{ color:s.sla>=99.9?"#22C55E":s.sla>=99?"#F59E0B":"#EF4444" }}>{s.sla.toFixed(2)}%</td><td className="px-4 py-3 w-40"><div className="h-1 rounded-full" style={{ backgroundColor:"#1A2229" }}><div className="h-full rounded-full" style={{ width:`${s.sla}%`, backgroundColor:s.sla>=99.9?"#22C55E":s.sla>=99?"#F59E0B":"#EF4444" }}/></div></td><td className="px-4 py-3"><StatusDot status={s.status} size={6}/></td></tr>)}</tbody></table>
      </Card>
    </div>
  );
}

// ─── Plan & Billing ───────────────────────────────────────────────────────────

function BillingPage() {
  const pct=(u:number,l:number)=>Math.round(u/l*100);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><Card className="p-5 h-full">
          <div className="flex items-start justify-between mb-5"><div><div className="text-xs mb-1" style={{ ...MONO, color:"#4A6070" }}>ТЕКУЩИЙ ТАРИФ</div><div className="text-2xl font-bold text-foreground">{PLAN_DATA.plan}</div><div className="text-sm mt-1" style={{ color:"#4A6070" }}>{PLAN_DATA.price.toLocaleString("ru-RU")} ₽ / месяц · следующее списание {PLAN_DATA.nextBilling}</div></div><button className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor:"#00D4A8", color:"#000" }}>Улучшить тариф</button></div>
          <div className="space-y-3"><div className="text-xs uppercase tracking-widest mb-1" style={{ ...MONO, color:"#4A6070" }}>Использование</div>
            <MetricBar label={`Устройства (${PLAN_DATA.devices.used} / ${PLAN_DATA.devices.limit})`} value={pct(PLAN_DATA.devices.used,PLAN_DATA.devices.limit)} color="#00D4A8"/>
            <MetricBar label={`Хранилище (${PLAN_DATA.storage.used} ГБ / ${PLAN_DATA.storage.limit} ГБ)`} value={pct(PLAN_DATA.storage.used,PLAN_DATA.storage.limit)} color="#3B82F6"/>
            <MetricBar label={`Пользователи (${PLAN_DATA.users.used} / ${PLAN_DATA.users.limit})`} value={pct(PLAN_DATA.users.used,PLAN_DATA.users.limit)} color="#8B5CF6"/>
            <MetricBar label={`Тикеты в месяц (${PLAN_DATA.tickets.used} / ${PLAN_DATA.tickets.limit})`} value={pct(PLAN_DATA.tickets.used,PLAN_DATA.tickets.limit)} color="#F59E0B"/>
          </div>
        </Card></div>
        <Card className="p-4"><div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Включено в Standard</div><div className="space-y-2">{PLAN_DATA.features.map((f,i)=><div key={i} className="flex items-center gap-2 text-xs" style={{ color:"#94A3B8" }}><Check size={11} style={{ color:"#22C55E", flexShrink:0 }}/>{f}</div>)}</div><div className="mt-4 pt-4" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}><div className="text-xs mb-2" style={{ ...MONO, color:"#4A6070" }}>Доступно в Premium:</div>{["Мониторинг до 50 устройств","Расширенная аналитика","API-доступ (read-write)","SLA 99.9% гарантия"].map((f,i)=><div key={i} className="flex items-center gap-2 text-xs mt-1.5" style={{ color:"#4A6070" }}><div className="w-3 h-3 rounded-full flex-shrink-0" style={{ border:"1px solid #4A6070" }}/>{f}</div>)}</div><button className="mt-4 w-full py-2 rounded text-xs font-medium" style={{ backgroundColor:"#00D4A815", color:"#00D4A8", border:"1px solid #00D4A830" }}>Связаться для обсуждения</button></Card>
      </div>
      <div><div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>История счетов</div>
        <Card className="overflow-hidden"><table className="w-full text-xs" style={MONO}><thead><tr style={{ borderBottom:"1px solid rgba(255,255,255,0.065)" }}>{["Период","Номер счёта","Сумма","Срок оплаты","Статус",""].map(h=><th key={h} className="text-left font-normal px-4 py-3" style={{ color:"#4A6070" }}>{h}</th>)}</tr></thead><tbody>{INVOICES.map((inv,i)=><tr key={i} style={{ borderBottom:i<INVOICES.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}><td className="px-4 py-3 text-foreground">{inv.period}</td><td className="px-4 py-3" style={{ color:"#4A6070" }}>{inv.id}</td><td className="px-4 py-3 text-foreground">{inv.amount.toLocaleString("ru-RU")} ₽</td><td className="px-4 py-3" style={{ color:"#4A6070" }}>{inv.due}</td><td className="px-4 py-3"><span style={{ color:inv.status==="paid"?"#22C55E":"#F59E0B" }}>{inv.status==="paid"?"Оплачен":"Ожидает"}</span></td><td className="px-4 py-3"><button style={{ color:"#4A6070" }}><Download size={11}/></button></td></tr>)}</tbody></table></Card>
      </div>
    </div>
  );
}

// ─── API & Integrations ───────────────────────────────────────────────────────

function APIPage() {
  const [showTok,setShowTok]=useState<Record<string,boolean>>({});
  const curl=`curl -H "Authorization: Bearer tc_live_a8f3b2..." \\\n  https://api.techcore.io/v1/devices`;
  const python=`import requests\nr = requests.get(\n    "https://api.techcore.io/v1/devices/fw-01/status",\n    headers={"Authorization": "Bearer tc_live_a8f3b2..."}\n)\nprint(r.json())`;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><div><div className="text-sm font-semibold text-foreground">API & Интеграции</div><div className="text-xs mt-0.5" style={{ ...MONO, color:"#4A6070" }}>Базовый URL: <span style={{ color:"#00D4A8" }}>https://api.techcore.io/v1</span></div></div><button className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor:"#00D4A8", color:"#000" }}><Plus size={13}/>Создать токен</button></div>
      <Card className="p-4"><div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>API-токены</div>
        <div className="space-y-3">{API_TOKENS.map(tok=><div key={tok.id} className="flex items-center gap-4 p-3 rounded" style={{ backgroundColor:"#111C24", border:"1px solid rgba(255,255,255,0.065)" }}>
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor:"#00D4A815" }}><Key size={12} style={{ color:"#00D4A8" }}/></div>
          <div className="flex-1 min-w-0"><div className="text-sm font-medium text-foreground">{tok.name}</div><div className="text-xs mt-0.5" style={{ ...MONO, color:"#4A6070" }}>Создан {tok.created} · Последнее использование {tok.lastUsed}</div></div>
          <span className="text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ ...MONO, backgroundColor:"#22C55E10", color:"#22C55E", border:"1px solid #22C55E20" }}>{tok.scope}</span>
          <div className="flex items-center gap-2 flex-shrink-0"><div className="px-2 py-1 rounded text-xs" style={{ ...MONO, backgroundColor:"#0C1117", color:"#4A6070", border:"1px solid rgba(255,255,255,0.04)", maxWidth:160, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{showTok[tok.id]?tok.token:tok.token.replace(/[a-z0-9]/gi,"•").slice(0,28)+"..."}</div><button onClick={() => setShowTok(s=>({...s,[tok.id]:!s[tok.id]}))} style={{ color:"#4A6070" }}>{showTok[tok.id]?<EyeOff size={11}/>:<Eye size={11}/>}</button><button style={{ color:"#4A6070" }}><Copy size={11}/></button><button style={{ color:"#4A6070" }}><Trash2 size={11}/></button></div>
        </div>)}</div>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4"><div className="flex items-center gap-2 mb-3"><Code2 size={13} style={{ color:"#4A6070" }}/><span className="text-xs uppercase tracking-widest" style={{ ...MONO, color:"#4A6070" }}>cURL — статус устройств</span></div><pre className="text-xs p-3 rounded overflow-x-auto" style={{ backgroundColor:"#06090C", color:"#00D4A8", border:"1px solid rgba(255,255,255,0.065)", fontFamily:"'JetBrains Mono',monospace", lineHeight:1.6 }}>{curl}</pre></Card>
        <Card className="p-4"><div className="flex items-center gap-2 mb-3"><Code2 size={13} style={{ color:"#4A6070" }}/><span className="text-xs uppercase tracking-widest" style={{ ...MONO, color:"#4A6070" }}>Python — мониторинг узла</span></div><pre className="text-xs p-3 rounded overflow-x-auto" style={{ backgroundColor:"#06090C", color:"#3B82F6", border:"1px solid rgba(255,255,255,0.065)", fontFamily:"'JetBrains Mono',monospace", lineHeight:1.6 }}>{python}</pre></Card>
      </div>
      <Card className="p-4"><div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color:"#4A6070" }}>Доступные эндпоинты (read-only)</div>
        <div className="space-y-0">{[["GET","/devices","Список всех устройств"],["GET","/devices/{id}","Детали устройства по ID"],["GET","/devices/{id}/metrics","Метрики CPU/RAM/Network"],["GET","/tickets","Список тикетов"],["GET","/tickets/{id}","Детали тикета"],["GET","/sla/summary","Сводка SLA за период"]].map(([m,p,d],i,arr)=><div key={i} className="flex items-center gap-4 py-2.5 text-xs" style={{ borderBottom:i<arr.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}><span className="px-1.5 py-0.5 rounded font-bold w-10 text-center flex-shrink-0" style={{ ...MONO, backgroundColor:"#22C55E15", color:"#22C55E" }}>{m}</span><span className="flex-shrink-0" style={{ ...MONO, color:"#00D4A8" }}>{p}</span><span style={{ color:"#4A6070" }}>{d}</span></div>)}</div>
      </Card>
    </div>
  );
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

function AuditPage() {
  const [search,setSearch]=useState("");
  const filtered=AUDIT_EVENTS.filter(e=>!search||e.user.toLowerCase().includes(search.toLowerCase())||e.action.toLowerCase().includes(search.toLowerCase())||e.target.toLowerCase().includes(search.toLowerCase()));
  const ac=(a:string)=>a.includes("Вход")?"#22C55E":a.includes("Создание")?"#00D4A8":a.includes("Скачивание")?"#F59E0B":"#4A6070";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3"><div className="flex-1 relative"><Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#4A6070" }}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по пользователю, действию, объекту..." className="w-full rounded text-sm pl-8 pr-3 py-2 outline-none" style={{ backgroundColor:"#0C1117", border:"1px solid rgba(255,255,255,0.065)", color:"#C4D2DC" }}/></div><button className="flex items-center gap-1.5 px-3 py-2 rounded text-xs" style={{ backgroundColor:"#0C1117", color:"#4A6070", border:"1px solid rgba(255,255,255,0.065)" }}><Download size={11}/>Экспорт CSV</button></div>
      <Card className="overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom:"1px solid rgba(255,255,255,0.065)" }}><History size={13} style={{ color:"#4A6070" }}/><div className="text-xs uppercase tracking-widest" style={{ ...MONO, color:"#4A6070" }}>Журнал действий — {filtered.length} записей</div></div>
        <table className="w-full text-xs" style={MONO}><thead><tr style={{ borderBottom:"1px solid rgba(255,255,255,0.065)" }}>{["Время","Пользователь","Действие","Объект","IP-адрес"].map(h=><th key={h} className="text-left font-normal px-4 py-2.5" style={{ color:"#4A6070" }}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map((e,i)=><tr key={e.id} className="hover:bg-muted transition-colors" style={{ borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,0.03)":"none" }}><td className="px-4 py-2.5 whitespace-nowrap" style={{ color:"#4A6070" }}>{e.time}</td><td className="px-4 py-2.5 text-foreground">{e.user}</td><td className="px-4 py-2.5"><span style={{ color:ac(e.action) }}>{e.action}</span></td><td className="px-4 py-2.5 max-w-xs truncate" style={{ color:"#94A3B8" }}>{e.target}</td><td className="px-4 py-2.5" style={{ color:"#4A6070" }}>{e.ip}</td></tr>)}</tbody></table>
      </Card>
    </div>
  );
}

// ─── Engineer Data ────────────────────────────────────────────────────────────

const TIERS = {
  Basic: { color: "#6B7280", label: "Basic", icon: "★", desc: "1 сервер, до 5 ВМ, до 5 пользователей" },
  Standard: { color: "#22C55E", label: "Standard", icon: "★★", desc: "До 5 серверов, до 20 ВМ, до 20 пользователей" },
  Premium: { color: "#3B82F6", label: "Premium", icon: "★★★", desc: "До 20 серверов, до 100 ВМ, неограниченно пользователей" },
  Enterprise: { color: "#8B5CF6", label: "Enterprise", icon: "★★★★", desc: "Без ограничений, выделенный инженер, SLA 99.9%" },
};

const CLIENTS: Array<{ id: string; name: string; industry: string; tier: keyof typeof TIERS; devices: number; tickets: number; status: string; initials: string; color: string; lastVisit: string; alerts: number; description: string }> = [
  { id: "oakwood", name: "Oakwood High School", industry: "Образование", tier: "Basic", devices: 1, tickets: 2, status: "ok", initials: "OA", color: "#6B7280", lastVisit: "Сегодня", alerts: 0, description: "1 физ. сервер, Proxmox + 4 ВМ, 10 рабочих станций" },
  { id: "riverside", name: "Riverside Academy", industry: "Образование", tier: "Standard", devices: 3, tickets: 5, status: "warning", initials: "RA", color: "#22C55E", lastVisit: "Вчера", alerts: 1, description: "3 сервера, Proxmox-кластер, 8 ВМ, базовый K8s" },
  { id: "metropolitan", name: "Metropolitan College", industry: "Образование", tier: "Premium", devices: 15, tickets: 12, status: "ok", initials: "MC", color: "#3B82F6", lastVisit: "16.07.2024", alerts: 0, description: "15 серверов, VMware-кластер, 40+ ВМ, 3 K8s-кластера" },
  { id: "stateuni", name: "State University", industry: "Образование", tier: "Enterprise", devices: 52, tickets: 31, status: "warning", initials: "SU", color: "#8B5CF6", lastVisit: "15.07.2024", alerts: 3, description: "50+ серверов, мультикластер K8s, 200+ ВМ, СХД" },
  { id: "alfatrade", name: "ООО «АльфаТрейд»", industry: "Торговля", tier: "Standard", devices: 5, tickets: 3, status: "ok", initials: "АТ", color: "#00D4A8", lastVisit: "Сегодня", alerts: 1, description: "5 устройств, Dell PowerEdge, Fortinet, Synology NAS" },
  { id: "medclinic", name: "Клиника «МедЦентр»", industry: "Медицина", tier: "Premium" as keyof typeof TIERS, devices: 12, tickets: 1, status: "warning", initials: "МЦ", color: "#F59E0B", lastVisit: "Вчера", alerts: 1, description: "12 серверов, Cisco UCS, VMware vSphere, PACS-система" },
  { id: "promtech", name: "ПромТех ООО", industry: "Производство", tier: "Premium" as keyof typeof TIERS, devices: 18, tickets: 0, status: "ok", initials: "ПТ", color: "#F59E0B", lastVisit: "15.07.2024", alerts: 0, description: "18 устройств, производственная сеть, SCADA-система" },
];

const LOGS_DATA = [
  { id: 1, time: "16.07.2024 14:22:01", host: "srv-db-01", client: "ООО «АльфаТрейд»", severity: "warning", service: "postgresql", message: "checkpoint request in progress, write rate 45 MB/s" },
  { id: 2, time: "16.07.2024 14:20:15", host: "k8s-node-01", client: "State University", severity: "error", service: "kubelet", message: "node k8s-node-03 is NotReady: container runtime is not running" },
  { id: 3, time: "16.07.2024 14:18:42", host: "fw-01", client: "ООО «АльфаТрейд»", severity: "info", service: "fortios", message: "SSL VPN session established: user=vpn_user01 src=91.234.x.x" },
  { id: 4, time: "16.07.2024 14:15:03", host: "srv-main-01", client: "Oakwood High School", severity: "critical", message: "CPU usage 97.3% for 10 minutes — threshold exceeded", service: "zabbix-agent" },
  { id: 5, time: "16.07.2024 14:10:55", host: "nginx-proxy", client: "Metropolitan College", severity: "warning", service: "nginx", message: "too many open files (ulimit), dropping connections" },
  { id: 6, time: "16.07.2024 14:08:12", host: "nas-01", client: "ООО «АльфаТрейд»", severity: "info", service: "rsync", message: "backup job completed: 14.3 GB transferred in 18m 42s" },
  { id: 7, time: "16.07.2024 13:55:30", host: "sw-core-01", client: "ООО «АльфаТрейд»", severity: "info", service: "syslog", message: "interface GigabitEthernet1/0/12 up" },
  { id: 8, time: "16.07.2024 13:45:11", host: "vm-postgres-01", client: "Riverside Academy", severity: "error", service: "postgresql", message: "FATAL: could not write to file pg_wal — disk full (98.9%)" },
  { id: 9, time: "16.07.2024 13:30:00", host: "gitlab-ce", client: "ООО «АльфаТрейд»", severity: "info", service: "gitlab", message: "CI pipeline #1087 completed successfully in 4m 12s" },
  { id: 10, time: "16.07.2024 13:15:22", host: "k8s-node-02", client: "State University", severity: "warning", service: "containerd", message: "pod app-frontend-6b8c4d OOMKilled: exceeded memory limit 2Gi" },
  { id: 11, time: "16.07.2024 13:00:44", host: "srv-db-01", client: "ООО «АльфаТрейд»", severity: "info", service: "postgresql", message: "autovacuum: processed 1243 pages in database techcore_prod" },
  { id: 12, time: "16.07.2024 12:48:03", host: "fw-clinic-01", client: "Клиника «МедЦентр»", severity: "warning", service: "fortios", message: "CPU 83%: high IPS/AV inspection load on HTTPS traffic" },
];

const NEWS_ITEMS = [
  { id: 1, type: "feature", title: "Новый модуль: Container Mesh Graph", body: "Добавлена интерактивная визуализация сервисной сетки контейнеров для Kubernetes и Docker. Отображает направленные зависимости между подами и сервисами.", date: "15.07.2024", tag: "Новое" },
  { id: 2, type: "maintenance", title: "Плановое обслуживание: 20 июля 03:00–05:00", body: "Замена ИБП в стойке Rack-A. Возможны кратковременные прерывания в мониторинге устройств, подключённых к данному сегменту.", date: "14.07.2024", tag: "Обслуживание" },
  { id: 3, type: "update", title: "Обновление агента мониторинга до v3.2.1", body: "Новая версия Zabbix Agent 2 устранила утечку памяти при долгосрочной работе. Обновление применено на всех зарегистрированных хостах.", date: "10.07.2024", tag: "Обновление" },
  { id: 4, type: "feature", title: "SLA Dashboard: 90-дневный календарь доступности", body: "Добавлен наглядный календарь доступности с цветовым кодированием по суткам. Доступен в разделе «SLA / Uptime».", date: "08.07.2024", tag: "Новое" },
  { id: 5, type: "security", title: "Критическое обновление безопасности FortiOS", body: "Fortinet выпустил патч для CVE-2024-21762. Все межсетевые экраны клиентов обновлены в течение 24 часов после публикации.", date: "05.07.2024", tag: "Безопасность" },
  { id: 6, type: "update", title: "Metropolitan College подключён к порталу", body: "Успешно завершена интеграция Metropolitan College — Premium тариф, 15 серверов, VMware-кластер, 3 K8s-кластера.", date: "01.07.2024", tag: "Клиенты" },
];

const CHANNELS = [
  { id: "general", name: "general", type: "team" as const, unread: 0, topic: "Общий чат команды TechCore" },
  { id: "alerts", name: "alerts", type: "team" as const, unread: 3, topic: "Автоматические алерты из Zabbix/Prometheus" },
  { id: "oncall", name: "on-call", type: "team" as const, unread: 0, topic: "Дежурные смены и эскалации" },
  { id: "incidents", name: "incident-response", type: "team" as const, unread: 1, topic: "Активный инцидент: srv-main-01" },
  { id: "cl-alfatrade", name: "client-alfatrade", type: "client" as const, unread: 0, topic: "ООО «АльфаТрейд»" },
  { id: "cl-oakwood", name: "client-oakwood", type: "client" as const, unread: 2, topic: "Oakwood High School" },
  { id: "cl-stateuni", name: "client-stateuni", type: "client" as const, unread: 0, topic: "State University — Миграция на K8s" },
];

const DMS = [
  { id: "dm-sidorov", name: "Сидоров С.К.", initials: "СС", color: "#3B82F6", online: true },
  { id: "dm-petrov", name: "Петров В.С.", initials: "ПВ", color: "#8B5CF6", online: false },
  { id: "dm-grigoriev", name: "Григорьев А.Е.", initials: "ГА", color: "#F59E0B", online: true },
];

const NOC_ALERTS = [
  { id: 1, client: "Школа №42", device: "srv-main-01", severity: "critical", message: "CPU > 95% на протяжении 10 мин.", time: "14:15", acked: false, suppressed: false },
  { id: 2, client: "Школа №42", device: "srv-db-02", severity: "critical", message: "Диск /var заполнен на 99.2%", time: "14:02", acked: false, suppressed: false },
  { id: 3, client: "Клиника «МедЦентр»", device: "fw-clinic-01", severity: "warning", message: "CPU FortiGate > 80% более 5 мин.", time: "13:48", acked: true, suppressed: false },
  { id: 4, client: "ПромТех ООО", device: "sw-floor-03", severity: "warning", message: "Потеря пакетов 8% на аплинке", time: "13:30", acked: false, suppressed: true },
  { id: 5, client: "МегаБанк НКО", device: "srv-app-bank", severity: "warning", message: "RAM > 85% (pgbouncer)", time: "13:11", acked: false, suppressed: false },
  { id: 6, client: "ООО «АльфаТрейд»", device: "fw-01", severity: "warning", message: "CPU FireWall 71% (порог 70%)", time: "12:55", acked: true, suppressed: false },
];

const KANBAN_TICKETS = {
  new: [
    { id: "INC-2850", client: "Школа №42", title: "Не работает проектор в 301 кабинете", priority: "medium", slaLeft: 480 },
    { id: "REQ-0415", client: "МегаБанк НКО", title: "Создать VPN-профиль для нового сотрудника", priority: "low", slaLeft: 720 },
  ],
  in_progress: [
    { id: "INC-2847", client: "ООО «АльфаТрейд»", title: "Нет доступа к 1С с рабочих станций", priority: "critical", slaLeft: 47, assignee: "Иванов И.А." },
    { id: "INC-2845", client: "Клиника «МедЦентр»", title: "Медленная работа МИС", priority: "high", slaLeft: 120, assignee: "Сидоров С.К." },
  ],
  awaiting: [
    { id: "INC-2841", client: "ООО «АльфаТрейд»", title: "Медленная работа Wi-Fi в конференц-зале", priority: "high", slaLeft: 180 },
    { id: "INC-2839", client: "ПромТех ООО", title: "Принтер не принимает задания", priority: "medium", slaLeft: 320 },
  ],
  critical: [
    { id: "INC-2848", client: "Школа №42", title: "Упал основной сервер — srv-main-01", priority: "critical", slaLeft: 12, assignee: "Иванов И.А." },
    { id: "INC-2849", client: "Школа №42", title: "БД СУБД на srv-db-02 переполнена", priority: "critical", slaLeft: 28, assignee: "Сидоров С.К." },
  ],
  closed: [
    { id: "REQ-0412", client: "ООО «АльфаТрейд»", title: "Создание пользователя в AD для Смирновой Е.В.", priority: "low", slaLeft: 0 },
    { id: "CHG-0089", client: "МегаБанк НКО", title: "Обновление антивируса на серверах", priority: "low", slaLeft: 0 },
  ],
};

const WIKI_ENTRIES = [
  { id: 1, title: "Сброс пароля AD без перезагрузки компьютера", category: "Active Directory", tags: ["AD", "PowerShell"], snippet: "Get-ADUser -Identity username | Set-ADAccountPassword -Reset -NewPassword (ConvertTo-SecureString 'NewPass123!' -AsPlainText -Force)", views: 42, updated: "10.07.2024" },
  { id: 2, title: "Очистка WAL-архивов PostgreSQL", category: "PostgreSQL", tags: ["PostgreSQL", "Bash"], snippet: "find /var/lib/postgresql/14/main/pg_wal -maxdepth 1 -name '*.history' -mtime +7 -delete", views: 28, updated: "15.07.2024" },
  { id: 3, title: "Проверка состояния Proxmox RAID", category: "Proxmox", tags: ["Proxmox", "RAID"], snippet: "pvs && vgs && lvs # then: cat /proc/mdstat", views: 19, updated: "01.07.2024" },
  { id: 4, title: "Быстрый деплой Zabbix агента (Ansible)", category: "Ansible", tags: ["Ansible", "Zabbix"], snippet: "ansible <host> -m apt -a 'name=zabbix-agent2 state=present' && ansible <host> -m service -a 'name=zabbix-agent2 state=started'", views: 35, updated: "08.07.2024" },
  { id: 5, title: "Постмортем: падение 1С 16.07.2024 (АльфаТрейд)", category: "Post-Mortem", tags: ["1С", "PostgreSQL"], snippet: "Причина: диск /var/lib/postgresql заполнен (99.8%). Решение: очистка WAL. Превентив: алерт Zabbix на 85%.", views: 7, updated: "16.07.2024" },
];

const TEAM_MESSAGES = [
  { id: 1, from: "Сидоров С.К.", initials: "СС", color: "#3B82F6", time: "14:10", text: "Иван, посмотри INC-2848 по Школе №42 — там сервер упал, нужна помощь с восстановлением." },
  { id: 2, from: "Иванов И.А.", initials: "ИИ", color: "#00D4A8", time: "14:12", text: "Вижу, уже подключился. Похоже на отказ диска в RAID. Запускаю mdadm --examine." },
  { id: 3, from: "Петров В.С.", initials: "ПВ", color: "#8B5CF6", time: "14:15", text: "Я на стороне клиента, они паникуют. Скажите примерный таймлайн восстановления?" },
  { id: 4, from: "Иванов И.А.", initials: "ИИ", color: "#00D4A8", time: "14:18", text: "Резервная копия с 03:00 ночи. Восстановление займёт 40–60 минут. Скажи им час." },
  { id: 5, from: "Сидоров С.К.", initials: "СС", color: "#3B82F6", time: "14:20", text: "Принял. @Петров В.С. — скажи директору, что плановый резерв свежий, данные не потеряем." },
];

const ENGINEER_KPI = {
  openTickets: 8,
  mttr: "1ч 24м",
  resolved30d: 47,
  avgSlaScore: 98.4,
  clients: [
    { name: "ООО «АльфаТрейд»", status: "ok", openTickets: 3, sla: 99.87 },
    { name: "Клиника «МедЦентр»", status: "warning", openTickets: 1, sla: 98.20 },
    { name: "Школа №42", status: "critical", openTickets: 9, sla: 94.50 },
    { name: "ПромТех ООО", status: "ok", openTickets: 0, sla: 99.99 },
    { name: "МегаБанк НКО", status: "ok", openTickets: 2, sla: 99.92 },
  ],
  weeklyResolved: [6, 9, 5, 12, 8, 7, 10],
};

// ─── Impersonation Banner ─────────────────────────────────────────────────────

function ImpersonationBanner({ clientName, onExit }: { clientName: string; onExit: () => void }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-2" style={{ backgroundColor: "#F59E0B", color: "#000" }}>
      <div className="flex items-center gap-2 text-xs font-semibold"><Eye size={13} />Режим просмотра: <span className="font-bold">{clientName}</span> — вы видите портал глазами клиента</div>
      <button onClick={onExit} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}><LogOut size={11} />Выйти из режима клиента</button>
    </div>
  );
}

// ─── Switch Account Page ──────────────────────────────────────────────────────

function SwitchAccountPage({ currentClientId, onSelectClient, onSelectEngineer }: { currentClientId: string | null; onSelectClient: (id: string) => void; onSelectEngineer: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = CLIENTS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()));
  const statusColor = (s: string) => s === "ok" ? "#22C55E" : s === "warning" ? "#F59E0B" : "#EF4444";

  return (
    <div className="space-y-6">
      {/* Engineer profile */}
      <div>
        <div className="text-xs uppercase tracking-widest mb-3" style={{ ...MONO, color: "#4A6070" }}>Мой инженерный профиль</div>
        <div className="p-5 rounded flex items-center gap-5" style={{ border: `2px solid ${!currentClientId ? "#00D4A8" : "rgba(255,255,255,0.065)"}`, backgroundColor: !currentClientId ? "#00D4A808" : "#0C1117" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ ...MONO, backgroundColor: "#00D4A818", color: "#00D4A8", border: "2px solid #00D4A840" }}>ИИ</div>
          <div className="flex-1">
            <div className="text-base font-semibold text-foreground">Иванов Илья Александрович</div>
            <div className="text-sm mt-0.5" style={{ color: "#4A6070" }}>Старший инженер · TechCore Systems</div>
            <div className="flex items-center gap-2 mt-2"><span className="text-xs px-2 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#00D4A815", color: "#00D4A8", border: "1px solid #00D4A830" }}>Полный доступ</span><span className="text-xs px-2 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#8B5CF615", color: "#8B5CF6", border: "1px solid #8B5CF630" }}>Инженер L2</span></div>
          </div>
          <button onClick={onSelectEngineer} className="px-5 py-2.5 rounded font-medium" style={{ backgroundColor: !currentClientId ? "#00D4A820" : "#00D4A8", color: !currentClientId ? "#00D4A8" : "#000", border: !currentClientId ? "1px solid #00D4A840" : "none" }}>
            {!currentClientId ? "✓ Активный режим" : "Вернуться как инженер"}
          </button>
        </div>
      </div>

      {/* Client list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-widest" style={{ ...MONO, color: "#4A6070" }}>Клиентские аккаунты ({CLIENTS.length})</div>
          <div className="relative"><Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#4A6070" }} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск клиента..." className="rounded text-xs pl-7 pr-3 py-1.5 outline-none" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC", width: 200 }} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(client => {
            const isActive = currentClientId === client.id;
            return (
              <div key={client.id} className="p-4 rounded transition-all" style={{ border: `2px solid ${isActive ? client.color : "rgba(255,255,255,0.065)"}`, backgroundColor: isActive ? `${client.color}08` : "#0C1117" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ ...MONO, backgroundColor: `${client.color}20`, color: client.color, border: `1.5px solid ${client.color}50` }}>{client.initials}</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-foreground truncate">{client.name}</div><div className="text-xs mt-0.5" style={{ color: "#4A6070" }}>{client.industry}</div></div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: statusColor(client.status) }} />
                </div>
                <div className="flex gap-4 text-xs mb-3" style={{ ...MONO, color: "#4A6070" }}>
                  <span>Устройств: <span style={{ color: "#94A3B8" }}>{client.devices}</span></span>
                  <span>Тикетов: <span style={{ color: client.tickets > 0 ? "#F59E0B" : "#94A3B8" }}>{client.tickets}</span></span>
                </div>
                <button onClick={() => onSelectClient(client.id)} className="w-full py-2 rounded text-xs font-semibold transition-colors" style={{ backgroundColor: isActive ? `${client.color}20` : client.color, color: isActive ? client.color : "#000", border: isActive ? `1px solid ${client.color}40` : "none" }}>
                  {isActive ? "✓ Просматриваете сейчас" : "Войти как клиент"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-center" style={{ color: "#4A6070" }}>Режим просмотра не изменяет реальные данные — только фильтрует интерфейс</div>
    </div>
  );
}

// ─── Kanban Board ─────────────────────────────────────────────────────────────

function KanbanBoard() {
  const cols = [
    { id: "new", label: "Новые", color: "#4A6070" },
    { id: "in_progress", label: "В работе", color: "#38BDF8" },
    { id: "awaiting", label: "Ожидание ответа", color: "#F59E0B" },
    { id: "critical", label: "Критические", color: "#EF4444" },
    { id: "closed", label: "Закрытые", color: "#22C55E" },
  ] as const;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-xs" style={{ ...MONO, color: "#4A6070" }}>Все клиенты · Kanban-доска</div>
        <div className="flex gap-2 ml-auto text-xs" style={MONO}>
          <span style={{ color: "#EF4444" }}>{KANBAN_TICKETS.critical.length} критических</span>
          <span style={{ color: "#4A6070" }}>·</span>
          <span style={{ color: "#38BDF8" }}>{KANBAN_TICKETS.in_progress.length} в работе</span>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cols.map(col => {
          const tickets = KANBAN_TICKETS[col.id];
          return (
            <div key={col.id} className="flex-shrink-0 w-64">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</span>
                <span className="text-xs ml-auto px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor: `${col.color}15`, color: col.color }}>{tickets.length}</span>
              </div>
              <div className="space-y-2">
                {tickets.map(t => (
                  <div key={t.id} className="p-3 rounded" style={{ backgroundColor: "#0C1117", border: t.priority === "critical" ? "1px solid #EF444440" : "1px solid rgba(255,255,255,0.065)" }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xs" style={{ ...MONO, color: PRIORITY_CFG[t.priority]?.color ?? "#4A6070" }}>●</span>
                      <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{t.id}</span>
                      {t.slaLeft > 0 && t.slaLeft < 60 && <span className="ml-auto text-xs" style={{ ...MONO, color: "#EF4444" }}><Clock size={9} className="inline" /> {t.slaLeft}м</span>}
                    </div>
                    <div className="text-xs text-foreground leading-snug mb-2">{t.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ ...MONO, color: "#4A6070", fontSize: 10 }}>{t.client}</span>
                      {"assignee" in t && t.assignee && <span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#00D4A810", color: "#00D4A8", fontSize: 9 }}>{(t.assignee as string).split(" ")[0]}</span>}
                    </div>
                    {col.id === "in_progress" && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <button className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#22C55E10", color: "#22C55E" }}><PlayCircle size={9} />Таймер</button>
                        <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>0ч 00м</span>
                      </div>
                    )}
                  </div>
                ))}
                {col.id !== "closed" && <button className="w-full py-2 rounded text-xs flex items-center justify-center gap-1" style={{ border: "1px dashed rgba(255,255,255,0.08)", color: "#4A6070" }}><Plus size={11} />Добавить</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NOC View ─────────────────────────────────────────────────────────────────

function NOCView() {
  const [alerts, setAlerts] = useState(NOC_ALERTS);
  const critical = alerts.filter(a => a.severity === "critical" && !a.acked && !a.suppressed);
  const ack = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, acked: true } : a));
  const suppress = (id: number) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, suppressed: true } : a));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded" style={{ backgroundColor: "#EF444410", border: "1px solid #EF444430" }}><div className="text-xs mb-1" style={{ ...MONO, color: "#EF4444" }}>КРИТИЧЕСКИХ</div><div className="text-3xl font-bold" style={{ color: "#EF4444" }}>{alerts.filter(a => a.severity === "critical" && !a.acked).length}</div></div>
        <div className="p-4 rounded" style={{ backgroundColor: "#F59E0B10", border: "1px solid #F59E0B30" }}><div className="text-xs mb-1" style={{ ...MONO, color: "#F59E0B" }}>ПРЕДУПРЕЖДЕНИЙ</div><div className="text-3xl font-bold" style={{ color: "#F59E0B" }}>{alerts.filter(a => a.severity === "warning" && !a.acked).length}</div></div>
        <div className="p-4 rounded" style={{ backgroundColor: "#22C55E10", border: "1px solid #22C55E30" }}><div className="text-xs mb-1" style={{ ...MONO, color: "#22C55E" }}>ПОДТВЕРЖДЕНО</div><div className="text-3xl font-bold" style={{ color: "#22C55E" }}>{alerts.filter(a => a.acked).length}</div></div>
        <div className="p-4 rounded" style={{ backgroundColor: "#4A607010", border: "1px solid #4A607030" }}><div className="text-xs mb-1" style={{ ...MONO, color: "#4A6070" }}>ЗАГЛУШЕНО</div><div className="text-3xl font-bold" style={{ color: "#4A6070" }}>{alerts.filter(a => a.suppressed).length}</div></div>
      </div>

      {critical.length > 0 && (
        <div className="p-3 rounded flex items-center gap-2" style={{ backgroundColor: "#EF444410", border: "1px solid #EF444430" }}>
          <Flame size={13} style={{ color: "#EF4444" }} /><span className="text-xs font-semibold" style={{ color: "#EF4444" }}>{critical.length} неподтверждённых критических алертов требуют немедленного внимания</span>
        </div>
      )}

      <div className="space-y-2">
        {alerts.map(alert => {
          const sc = alert.severity === "critical" ? "#EF4444" : "#F59E0B";
          const dim = alert.acked || alert.suppressed;
          return (
            <div key={alert.id} className="p-4 rounded flex items-center gap-4 transition-all" style={{ backgroundColor: "#0C1117", border: `1px solid ${dim ? "rgba(255,255,255,0.04)" : `${sc}30`}`, opacity: dim ? 0.5 : 1 }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dim ? "#4A6070" : sc, boxShadow: dim ? "none" : `0 0 8px ${sc}60` }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5"><span className="text-xs font-semibold" style={{ ...MONO, color: sc }}>{alert.client}</span><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>·</span><span className="text-xs" style={{ ...MONO, color: "#94A3B8" }}>{alert.device}</span></div>
                <div className="text-sm text-foreground">{alert.message}</div>
              </div>
              <div className="text-xs flex-shrink-0" style={{ ...MONO, color: "#4A6070" }}>{alert.time}</div>
              {alert.suppressed && <span className="text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ ...MONO, backgroundColor: "#4A607015", color: "#4A6070" }}>Заглушено 2ч</span>}
              {alert.acked && !alert.suppressed && <span className="text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ ...MONO, backgroundColor: "#22C55E10", color: "#22C55E" }}>ACK</span>}
              {!alert.acked && !alert.suppressed && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => ack(alert.id)} className="text-xs px-2.5 py-1 rounded" style={{ backgroundColor: "#22C55E15", color: "#22C55E", border: "1px solid #22C55E30" }}>ACK</button>
                  <button onClick={() => suppress(alert.id)} className="text-xs px-2.5 py-1 rounded" style={{ backgroundColor: "#4A607015", color: "#4A6070", border: "1px solid #4A607030" }}>Заглушить 2ч</button>
                  <button className="text-xs px-2.5 py-1 rounded flex items-center gap-1" style={{ backgroundColor: "#EF444415", color: "#EF4444", border: "1px solid #EF444430" }}><TicketCheck size={10} />Тикет</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Engineer KPI ─────────────────────────────────────────────────────────────

function EngineerKPI() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const sc = (s: string) => s === "ok" ? "#22C55E" : s === "warning" ? "#F59E0B" : "#EF4444";
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Открытых тикетов", value: ENGINEER_KPI.openTickets, color: "#F59E0B" },
          { label: "Решено за 30 дней", value: ENGINEER_KPI.resolved30d, color: "#22C55E" },
          { label: "MTTR", value: ENGINEER_KPI.mttr, color: "#00D4A8" },
          { label: "Средний SLA", value: `${ENGINEER_KPI.avgSlaScore}%`, color: "#3B82F6" },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
            <div className="text-xs mb-2" style={{ ...MONO, color: "#4A6070" }}>{kpi.label.toUpperCase()}</div>
            <div className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="p-4 rounded" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
          <div className="text-xs uppercase tracking-widest mb-4" style={{ ...MONO, color: "#4A6070" }}>Решено тикетов за неделю</div>
          <div className="flex items-end gap-2 h-24">
            {ENGINEER_KPI.weeklyResolved.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-sm" style={{ height: `${(v / 12) * 80}px`, backgroundColor: "#00D4A8", minHeight: 4 }} />
                <span className="text-xs" style={{ ...MONO, color: "#4A6070", fontSize: 9 }}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
          <div className="text-xs uppercase tracking-widest mb-4" style={{ ...MONO, color: "#4A6070" }}>Карта здоровья клиентов</div>
          <div className="space-y-2">
            {ENGINEER_KPI.clients.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sc(c.status) }} />
                <span className="text-xs flex-1 truncate" style={{ color: "#94A3B8" }}>{c.name}</span>
                <span className="text-xs" style={{ ...MONO, color: c.openTickets > 0 ? "#F59E0B" : "#4A6070" }}>{c.openTickets} тик.</span>
                <span className="text-xs" style={{ ...MONO, color: sc(c.status) }}>{c.sla}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Internal Wiki ────────────────────────────────────────────────────────────

function InternalWiki() {
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const entry = selected !== null ? WIKI_ENTRIES.find(w => w.id === selected) : null;
  const cats = [...new Set(WIKI_ENTRIES.map(w => w.category))];

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">{cats.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#111C24", color: "#4A6070" }}>{c}</span>)}</div>
          <button className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded" style={{ backgroundColor: "#00D4A8", color: "#000" }}><Plus size={11} />Добавить статью</button>
        </div>
        <div className="space-y-2">
          {WIKI_ENTRIES.map(w => (
            <div key={w.id} className="p-4 rounded transition-colors cursor-pointer hover:border-[rgba(255,255,255,0.15)]" style={{ backgroundColor: selected === w.id ? "#00D4A808" : "#0C1117", border: `1px solid ${selected === w.id ? "rgba(0,212,168,0.35)" : "rgba(255,255,255,0.065)"}` }} onClick={() => setSelected(w.id === selected ? null : w.id)}>
              <div className="flex items-start gap-3">
                <StickyNote size={13} style={{ color: "#4A6070", flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground mb-1">{w.title}</div>
                  <div className="flex items-center gap-3 flex-wrap text-xs" style={{ ...MONO, color: "#4A6070" }}>
                    <span style={{ color: "#3B82F6" }}>{w.category}</span>
                    {w.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded" style={{ backgroundColor: "#111C24" }}>{t}</span>)}
                    <span className="ml-auto">{w.views} просмотров · {w.updated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {entry && (
        <div className="w-80 flex-shrink-0">
          <div className="p-4 rounded sticky top-0" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
            <div className="flex items-center justify-between mb-3"><span className="text-xs font-semibold text-foreground">{entry.title}</span><button onClick={() => setSelected(null)} style={{ color: "#4A6070" }}><X size={13} /></button></div>
            <div className="text-xs mb-2" style={{ ...MONO, color: "#4A6070" }}>СНИППЕТ</div>
            <div className="relative p-3 rounded" style={{ backgroundColor: "#06090C", border: "1px solid rgba(255,255,255,0.065)" }}>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap" style={{ color: "#00D4A8", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>{entry.snippet}</pre>
              <button onClick={handleCopy} className="absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#0C1117", color: copied ? "#22C55E" : "#4A6070" }}>{copied ? <><Check size={9} />Скопировано</> : <><Copy size={9} />Копировать</>}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Team Chat ────────────────────────────────────────────────────────────────

function TeamChat() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(TEAM_MESSAGES);
  const [activeChannel, setActiveChannel] = useState("general");
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, activeChannel]);

  const ch = CHANNELS.find(c => c.id === activeChannel) ?? CHANNELS[0];
  const teamChannels = CHANNELS.filter(c => c.type === "team");
  const clientChannels = CHANNELS.filter(c => c.type === "client");

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { id: m.length + 1, from: "Иванов И.А.", initials: "ИИ", color: "#00D4A8", time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }), text: input }]);
    setInput("");
  };

  const NavCh = ({ channel }: { channel: typeof CHANNELS[number] }) => {
    const active = activeChannel === channel.id;
    return (
      <button onClick={() => setActiveChannel(channel.id)} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-left transition-colors" style={{ backgroundColor: active ? "#00D4A810" : "transparent", color: active ? "#00D4A8" : "#4A6070" }}>
        <Hash size={11} className="flex-shrink-0" />
        <span className="flex-1 truncate">{channel.name}</span>
        {channel.unread > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#EF4444", color: "#fff", fontSize: 9 }}>{channel.unread}</span>}
      </button>
    );
  };

  return (
    <div className="flex h-full gap-0" style={{ margin: "-24px", height: "calc(100% + 48px)" }}>
      {/* Channel sidebar */}
      <div className="w-52 flex-shrink-0 flex flex-col" style={{ backgroundColor: "#04070A", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="px-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="text-xs font-semibold text-foreground">Чат команды</div>
          <div className="text-xs mt-0.5" style={{ ...MONO, color: "#4A6070" }}>TechCore Systems</div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <div className="px-3 py-1 text-xs uppercase tracking-widest mb-1" style={{ ...MONO, color: "#2A3A44" }}>Каналы</div>
          {teamChannels.map(c => <NavCh key={c.id} channel={c} />)}
          <div className="px-3 py-1 text-xs uppercase tracking-widest mb-1 mt-3" style={{ ...MONO, color: "#2A3A44" }}>Клиентские</div>
          {clientChannels.map(c => <NavCh key={c.id} channel={c} />)}
          <div className="px-3 py-1 text-xs uppercase tracking-widest mb-1 mt-3" style={{ ...MONO, color: "#2A3A44" }}>Личные</div>
          {DMS.map(dm => (
            <button key={dm.id} className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-left transition-colors hover:bg-muted" style={{ color: "#4A6070" }}>
              <div className="relative flex-shrink-0">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ ...MONO, backgroundColor: `${dm.color}20`, color: dm.color, fontSize: 8 }}>{dm.initials}</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border" style={{ backgroundColor: dm.online ? "#22C55E" : "#4A6070", borderColor: "#04070A" }} />
              </div>
              <span className="truncate flex-1">{dm.name}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ ...MONO, backgroundColor: "#00D4A818", color: "#00D4A8", fontSize: 8 }}>ИИ</div>
          <div className="flex-1 min-w-0"><div className="text-xs text-foreground">Иванов И.А.</div><div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} /><span className="text-xs" style={{ ...MONO, color: "#4A6070", fontSize: 9 }}>В сети</span></div></div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Hash size={13} style={{ color: "#4A6070" }} />
          <span className="text-sm font-semibold text-foreground">{ch.name}</span>
          <span className="text-xs ml-2 truncate" style={{ color: "#4A6070" }}>{ch.topic}</span>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4 space-y-3">
          {msgs.map(msg => {
            const isMe = msg.from === "Иванов И.А.";
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ ...MONO, backgroundColor: `${msg.color}18`, color: msg.color }}>{msg.initials}</div>
                <div className={`flex flex-col gap-0.5 max-w-md ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2" style={{ flexDirection: isMe ? "row-reverse" : "row" }}><span className="text-xs font-medium text-foreground">{msg.from}</span><span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{msg.time}</span></div>
                  <div className="px-3 py-2 rounded text-sm" style={{ backgroundColor: isMe ? "#00D4A812" : "#111C24", border: `1px solid ${isMe ? "#00D4A830" : "rgba(255,255,255,0.065)"}`, color: "#C4D2DC" }}>{msg.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2 px-5 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`Сообщение в #${ch.name}...`} className="flex-1 rounded text-sm px-3 py-2 outline-none" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} />
          <button onClick={send} disabled={!input.trim()} className="px-3 py-2 rounded" style={{ backgroundColor: input.trim() ? "#00D4A8" : "#00D4A820", color: input.trim() ? "#000" : "#4A6070" }}><Send size={13} /></button>
        </div>
      </div>
    </div>
  );
}

// ─── All Organizations ────────────────────────────────────────────────────────

function AllOrgsPage({ onViewClient }: { onViewClient: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const filtered = CLIENTS.filter(c =>
    (tierFilter === "all" || c.tier === tierFilter) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  );
  const tierKeys = Object.keys(TIERS) as Array<keyof typeof TIERS>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4A6070" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск организации..." className="w-full rounded text-sm pl-8 pr-3 py-2 outline-none" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} />
        </div>
        <button onClick={() => setTierFilter("all")} className="text-xs px-3 py-1.5 rounded border transition-colors" style={{ borderColor: tierFilter === "all" ? "#00D4A8" : "rgba(255,255,255,0.065)", color: tierFilter === "all" ? "#00D4A8" : "#4A6070", backgroundColor: tierFilter === "all" ? "#00D4A808" : "transparent" }}>Все тарифы</button>
        {tierKeys.map(t => (
          <button key={t} onClick={() => setTierFilter(t)} className="text-xs px-3 py-1.5 rounded border transition-colors" style={{ borderColor: tierFilter === t ? TIERS[t].color : "rgba(255,255,255,0.065)", color: tierFilter === t ? TIERS[t].color : "#4A6070", backgroundColor: tierFilter === t ? `${TIERS[t].color}10` : "transparent" }}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(client => {
          const tier = TIERS[client.tier];
          const sc = client.status === "ok" ? "#22C55E" : client.status === "warning" ? "#F59E0B" : "#EF4444";
          return (
            <div key={client.id} className="p-5 rounded border transition-all hover:border-[rgba(255,255,255,0.15)]" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ ...MONO, backgroundColor: `${client.color}20`, color: client.color }}>{client.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{client.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#4A6070" }}>{client.industry}</div>
                </div>
                <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: sc, boxShadow: `0 0 6px ${sc}60` }} />
              </div>
              <div className="text-xs mb-4 leading-relaxed" style={{ color: "#4A6070" }}>{client.description}</div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ ...MONO, backgroundColor: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}30` }}>{tier.label}</span>
                <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{client.devices} устр.</span>
                {client.tickets > 0 && <span className="text-xs" style={{ ...MONO, color: "#F59E0B" }}>{client.tickets} тик.</span>}
                {client.alerts > 0 && <span className="text-xs" style={{ ...MONO, color: "#EF4444" }}>{client.alerts} алерт.</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onViewClient(client.id)} className="flex-1 text-xs py-1.5 rounded font-medium transition-colors" style={{ backgroundColor: "#00D4A8", color: "#000" }}>Войти как клиент</button>
                <span className="text-xs" style={{ ...MONO, color: "#2A3A44" }}>{client.lastVisit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Log Aggregator ───────────────────────────────────────────────────────────

function LogsPage() {
  const [sevFilter, setSevFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [createTicketFor, setCreateTicketFor] = useState<number | null>(null);

  const sevs = ["all", "critical", "error", "warning", "info"] as const;
  const sevColor = (s: string) => s === "critical" ? "#EF4444" : s === "error" ? "#F87171" : s === "warning" ? "#F59E0B" : "#4A6070";

  const filtered = LOGS_DATA.filter(l =>
    (sevFilter === "all" || l.severity === sevFilter) &&
    (!search || l.message.toLowerCase().includes(search.toLowerCase()) || l.host.includes(search) || l.client.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4A6070" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Хост, клиент, ключевое слово..." className="w-full rounded text-sm pl-8 pr-3 py-2 outline-none" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} />
        </div>
        {sevs.map(s => (
          <button key={s} onClick={() => setSevFilter(s)} className="text-xs px-3 py-1.5 rounded border transition-colors capitalize" style={{ borderColor: sevFilter === s ? sevColor(s === "all" ? "info" : s) : "rgba(255,255,255,0.065)", color: sevFilter === s ? sevColor(s === "all" ? "info" : s) : "#4A6070", backgroundColor: sevFilter === s ? `${sevColor(s === "all" ? "info" : s)}10` : "transparent" }}>
            {s === "all" ? "Все" : s}
          </button>
        ))}
        <span className="text-xs ml-auto" style={{ ...MONO, color: "#4A6070" }}>{filtered.length} записей</span>
      </div>

      <div className="rounded overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.065)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "#06090C", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Время", "Клиент", "Хост", "Сервис", "Сообщение", ""].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs" style={{ ...MONO, color: "#2A3A44", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => {
              const sc = sevColor(log.severity);
              return (
                <tr key={log.id} className="group" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", backgroundColor: i % 2 === 0 ? "transparent" : "#06090C20" }}>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ ...MONO, color: "#4A6070" }}>{log.time}</td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>{log.client}</td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap"><span className="px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor: "#111C24", color: "#00D4A8" }}>{log.host}</span></td>
                  <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ ...MONO, color: "#4A6070" }}>{log.service}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "#C4D2DC", maxWidth: 320 }}>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: sc }} />
                      <span className="truncate" title={log.message}>{log.message}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    <button
                      onClick={() => setCreateTicketFor(createTicketFor === log.id ? null : log.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded whitespace-nowrap"
                      style={{ backgroundColor: "#EF444415", color: "#EF4444", border: "1px solid #EF444430" }}
                    >
                      <TicketCheck size={10} />Тикет
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {createTicketFor !== null && (() => {
        const log = LOGS_DATA.find(l => l.id === createTicketFor);
        if (!log) return null;
        return (
          <div className="p-4 rounded" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(0,212,168,0.25)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: "#00D4A8" }}>Создать тикет из лог-записи</span>
              <button onClick={() => setCreateTicketFor(null)} style={{ color: "#4A6070" }}><X size={13} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><div className="text-xs mb-1" style={{ ...MONO, color: "#4A6070" }}>ЗАГОЛОВОК</div><input defaultValue={`${log.severity.toUpperCase()}: ${log.host} — ${log.service}`} className="w-full rounded text-xs px-2.5 py-2 outline-none" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} /></div>
              <div><div className="text-xs mb-1" style={{ ...MONO, color: "#4A6070" }}>КЛИЕНТ</div><input defaultValue={log.client} className="w-full rounded text-xs px-2.5 py-2 outline-none" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} /></div>
            </div>
            <div className="mb-3"><div className="text-xs mb-1" style={{ ...MONO, color: "#4A6070" }}>ОПИСАНИЕ</div><textarea defaultValue={log.message} rows={2} className="w-full rounded text-xs px-2.5 py-2 outline-none resize-none" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC", fontFamily: "inherit" }} /></div>
            <div className="flex gap-2">
              <button onClick={() => setCreateTicketFor(null)} className="flex-1 py-1.5 rounded text-xs font-medium" style={{ backgroundColor: "#00D4A8", color: "#000" }}>Создать тикет INC</button>
              <button onClick={() => setCreateTicketFor(null)} className="px-3 py-1.5 rounded text-xs" style={{ backgroundColor: "#4A607015", color: "#4A6070" }}>Отмена</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── News Feed ────────────────────────────────────────────────────────────────

function NewsPage() {
  const tagColor = (type: string) => {
    if (type === "security") return "#EF4444";
    if (type === "maintenance") return "#F59E0B";
    if (type === "feature") return "#00D4A8";
    if (type === "update") return "#3B82F6";
    return "#4A6070";
  };
  return (
    <div className="max-w-2xl space-y-4">
      {NEWS_ITEMS.map(item => {
        const tc = tagColor(item.type);
        return (
          <div key={item.id} className="p-5 rounded border transition-all hover:border-[rgba(255,255,255,0.15)]" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)" }}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ ...MONO, backgroundColor: `${tc}15`, color: tc, border: `1px solid ${tc}30` }}>{item.tag}</span>
                  <span className="text-xs" style={{ ...MONO, color: "#4A6070" }}>{item.date}</span>
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">{item.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "#4A6070" }}>{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Client Context Switcher (Header) ─────────────────────────────────────────

function ClientContextSwitcher({ currentClientId, onSwitch }: { currentClientId: string | null; onSwitch: (id: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const recent = CLIENTS.slice(0, 3);
  const filtered = search ? CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : recent;
  const current = currentClientId ? CLIENTS.find(c => c.id === currentClientId) : null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors" style={{ backgroundColor: open ? "#00D4A815" : "#0C1117", border: `1px solid ${open ? "#00D4A840" : "rgba(255,255,255,0.065)"}`, color: current ? "#F59E0B" : "#4A6070" }}>
        <ArrowRightLeft size={11} />
        <span style={MONO}>{current ? current.name : "Выбрать клиента"}</span>
        <ChevronDown size={10} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-72 rounded z-50" style={{ backgroundColor: "#0C1117", border: "1px solid rgba(255,255,255,0.065)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          <div className="p-2"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск клиента..." autoFocus className="w-full rounded text-xs px-3 py-1.5 outline-none" style={{ backgroundColor: "#111C24", border: "1px solid rgba(255,255,255,0.065)", color: "#C4D2DC" }} /></div>
          {!search && <div className="px-3 pb-1 text-xs" style={{ ...MONO, color: "#4A6070" }}>ПОСЛЕДНИЕ</div>}
          <div className="max-h-56 overflow-auto pb-2">
            {!currentClientId ? null : (
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-muted" onClick={() => { onSwitch(null); setOpen(false); }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#00D4A818", color: "#00D4A8", ...MONO, fontSize: 8 }}>ИИ</div>
                <span style={{ color: "#00D4A8" }}>Вернуться как инженер</span>
              </button>
            )}
            {filtered.map(c => (
              <button key={c.id} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-muted" style={{ backgroundColor: currentClientId === c.id ? "#F59E0B10" : undefined }} onClick={() => { onSwitch(c.id); setOpen(false); }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ ...MONO, backgroundColor: `${c.color}20`, color: c.color, fontSize: 9 }}>{c.initials}</div>
                <div className="flex-1 min-w-0"><div className="truncate" style={{ color: "#C4D2DC" }}>{c.name}</div><div style={{ color: "#4A6070" }}>{c.industry} · {c.lastVisit}</div></div>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.status === "ok" ? "#22C55E" : c.status === "warning" ? "#F59E0B" : "#EF4444" }} />
              </button>
            ))}
          </div>
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

// Engineer-mode navigation (replaces all sections)
const NAV_ENG = [
  { id: "engkpi", label: "Обзор / KPI", icon: Gauge },
  { id: "orgs", label: "Организации", icon: Building2 },
  { id: "kanban", label: "Service Desk", icon: LayoutGrid, badge: 2 },
  { id: "infra", label: "Инфраструктура", icon: Network },
  { id: "noc", label: "Алерты / NOC", icon: BellRing, badge: NOC_ALERTS.filter(a=>!a.acked&&!a.suppressed).length },
  { id: "logs", label: "Логи", icon: TerminalSquare },
  { id: "wiki", label: "Wiki / Сценарии", icon: BookMarked },
  { id: "teamchat", label: "Чат команды", icon: MessageSquare },
  { id: "news", label: "Новости", icon: Newspaper },
] as const;

// Client-mode navigation
const NAV_CLIENT_MAIN = [
  { id: "dashboard", label: "Обзор", icon: LayoutDashboard },
  { id: "servicedesk", label: "Заявки", icon: LifeBuoy, badge: 2 },
  { id: "docs", label: "Документы", icon: BookOpen },
  { id: "infra", label: "Инфраструктура", icon: Network },
  { id: "finance", label: "Финансы", icon: CreditCard },
] as const;

const NAV_CLIENT_EXT = [
  { id: "sla", label: "SLA / Uptime", icon: Radio },
  { id: "billing", label: "Тариф и оплата", icon: BarChart2 },
  { id: "api", label: "API & Интеграции", icon: Code2 },
  { id: "audit", label: "Журнал аудита", icon: History },
] as const;

function Sidebar({ view, setView, role, currentClientId, onSwitchAccount }: { view: string; setView: (v: string) => void; role: "engineer"|"client"; currentClientId: string|null; onSwitchAccount: () => void }) {
  const navView = ["fullchat","software"].includes(view) ? "servicedesk" : view === "account" ? "" : view;
  const isEngineer = role === "engineer" && !currentClientId;
  const contextClient = currentClientId ? CLIENTS.find(c => c.id === currentClientId) : null;

  const NavBtn = ({ id, label, icon: Icon, badge }: { id: string; label: string; icon: React.ElementType; badge?: number }) => {
    const active = navView === id;
    return <button onClick={() => setView(id)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-all" style={{ color:active?"#00D4A8":"#4A6070", backgroundColor:active?"#00D4A810":"transparent", borderLeft:active?"2px solid #00D4A8":"2px solid transparent", paddingLeft:active?10:12 }}><Icon size={14}/><span className="flex-1 text-left text-xs">{label}</span>{!!badge&&badge>0&&<span className="text-xs px-1.5 py-0.5 rounded" style={{ ...MONO, backgroundColor:"#EF444420", color:"#EF4444", fontSize:9 }}>{badge}</span>}</button>;
  };

  return (
    <div className="w-52 flex-shrink-0 flex flex-col" style={{ backgroundColor:"var(--sidebar)", borderRight:"1px solid var(--sidebar-border)" }}>
      {/* Logo */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom:"1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor:"#00D4A8" }}><Zap size={13} style={{ color:"#000" }}/></div><div><div className="text-sm font-semibold text-foreground">TechCore</div><div className="text-xs" style={{ ...MONO, color:"var(--muted-foreground)" }}>{isEngineer?"инженерный портал":"системная интеграция"}</div></div></div>
      </div>

      {/* Context client or org */}
      <div className="px-3 py-3" style={{ borderBottom:"1px solid var(--sidebar-border)" }}>
        {contextClient ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded" style={{ backgroundColor:"#F59E0B10", border:"1px solid #F59E0B30" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ ...MONO, backgroundColor:`${contextClient.color}20`, color:contextClient.color, fontSize:8 }}>{contextClient.initials}</div>
            <div className="min-w-0 flex-1"><div className="text-xs text-foreground truncate">{contextClient.name}</div><div className="text-xs" style={{ ...MONO, color:"#F59E0B", fontSize:10 }}>Режим клиента</div></div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2 py-2 rounded bg-card"><Building2 size={11} style={{ color:"var(--muted-foreground)", flexShrink:0 }}/><div className="min-w-0"><div className="text-xs text-foreground truncate">{isEngineer?"TechCore Systems":"ООО «АльфаТрейд»"}</div><div className="text-xs" style={{ ...MONO, color:"var(--muted-foreground)", fontSize:10 }}>{isEngineer?"Инженерный режим":"ID: ORG-0071"}</div></div></div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-auto">
        {isEngineer ? (
          NAV_ENG.map(item => <NavBtn key={item.id} {...item} />)
        ) : (<>
          {NAV_CLIENT_MAIN.map(item=><NavBtn key={item.id} {...item}/>)}
          <div className="my-2 mx-2" style={{ height:1, backgroundColor:"var(--sidebar-border)" }}/>
          <div className="text-xs px-3 py-1" style={{ ...MONO, color:"var(--muted-foreground)", opacity:0.5 }}>РАСШИРЕННЫЕ</div>
          {NAV_CLIENT_EXT.map(item=><NavBtn key={item.id} {...item}/>)}
        </>)}
      </nav>

      {/* Profile + Switch Account */}
      <div className="px-3 py-3 space-y-1.5" style={{ borderTop:"1px solid var(--sidebar-border)" }}>
        <button onClick={() => setView("account")} className="w-full flex items-center gap-2.5 px-2 py-2 rounded hover:bg-muted transition-colors" style={{ backgroundColor:view==="account"?"#00D4A810":"transparent" }}>
          {role==="engineer"
            ? <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ ...MONO, backgroundColor:"#00D4A818", color:"#00D4A8" }}>ИИ</div>
            : <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ ...MONO, backgroundColor:"#8B5CF618", color:"#8B5CF6" }}>ПА</div>}
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs text-foreground truncate">{role==="engineer"?"Иванов И.А.":"Петров А.С."}</div>
            <div className="text-xs" style={{ ...MONO, color:"var(--muted-foreground)", fontSize:10 }}>{role==="engineer"?"Инженер L2":"Администратор"}</div>
          </div>
          <Settings size={12} style={{ color:"var(--muted-foreground)" }}/>
        </button>
        {role==="engineer" && (
          <button onClick={onSwitchAccount} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-muted transition-colors" style={{ color:"var(--muted-foreground)" }}>
            <ArrowRightLeft size={11}/><span>Сменить аккаунт</span>
            {currentClientId && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor:"#F59E0B" }}/>}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string,string> = {
  dashboard:"Дашборд", servicedesk:"Служба поддержки", docs:"Документы и журнал работ",
  infra:"Инфраструктура", finance:"Финансы", fullchat:"Чат по заявке",
  account:"Мой аккаунт", sla:"SLA / Мониторинг доступности", billing:"Тариф и оплата",
  api:"API & Интеграции", audit:"Журнал аудита", software:"Программное обеспечение",
  kanban:"Service Desk — все клиенты", noc:"NOC / Активные алерты", engkpi:"Обзор и KPI",
  wiki:"Внутренняя Wiki / Сценарии", teamchat:"Чат команды", switchaccount:"Смена аккаунта",
  orgs:"Все организации", logs:"Агрегатор логов", news:"Новости и обновления",
};

export default function App() {
  const [view,setView]=useState("engkpi");
  const [chatTicketId,setChatTicketId]=useState("INC-2847");
  const [selectedTicketId,setSelectedTicketId]=useState<string|null>(null);
  const [selectedDeviceId,setSelectedDeviceId]=useState<string|null>(null);
  const [softwareName,setSoftwareName]=useState<string|null>(null);
  const [role,setRole]=useState<"engineer"|"client">("engineer");
  const [currentClientId,setCurrentClientId]=useState<string|null>(null);
  const [theme,setTheme]=useState<"dark"|"light">("dark");

  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "");
  },[theme]);

  const handleSetView=(v:string)=>{
    if(v!=="servicedesk")setSelectedTicketId(null);
    if(v!=="infra")setSelectedDeviceId(null);
    setView(v);
  };

  const navigateToTicket=(id:string)=>{setSelectedTicketId(id);setView("servicedesk");};
  const navigateToDevice=(id:string)=>{setSelectedDeviceId(id);setView("infra");};
  const navigateToSoftware=(name:string)=>{setSoftwareName(name);setView("software");};
  const openChat=(ticketId:string)=>{setChatTicketId(ticketId);setView("fullchat");};

  const handleSwitchClient=(id:string|null)=>{
    setCurrentClientId(id);
    if(id){setRole("client");setView("dashboard");}else{setRole("engineer");setView("engkpi");}
  };
  const handleExitImpersonation=()=>{ setCurrentClientId(null); setRole("engineer"); setView("engkpi"); };
  const handleViewClient=(id:string)=>{ handleSwitchClient(id); };

  const pageTitle=view==="fullchat"?`${PAGE_TITLES.fullchat} · ${chatTicketId}`:view==="software"&&softwareName?softwareName:PAGE_TITLES[view]??view;
  const contextClient=currentClientId?CLIENTS.find(c=>c.id===currentClientId):null;
  const isEngineer=role==="engineer"&&!currentClientId;
  const headerSubtitle=contextClient?`${contextClient.name} · Режим просмотра`:isEngineer?"TechCore Systems · Инженерный режим":"ООО «АльфаТрейд» · 16.07.2024";

  const isFullscreen=view==="fullchat"||view==="teamchat";

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden" style={{ fontFamily:"'Inter', -apple-system, sans-serif" }}>
      <Sidebar view={view} setView={handleSetView} role={role} currentClientId={currentClientId} onSwitchAccount={()=>setView("switchaccount")}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Impersonation banner */}
        {currentClientId && contextClient && <ImpersonationBanner clientName={contextClient.name} onExit={handleExitImpersonation}/>}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ backgroundColor:"var(--sidebar)", borderBottom:"1px solid var(--sidebar-border)" }}>
          <div><h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1><div className="text-xs mt-0.5" style={{ ...MONO, color: currentClientId?"#F59E0B":"var(--muted-foreground)" }}>{headerSubtitle}</div></div>
          <div className="flex items-center gap-2">
            {role==="engineer"&&<ClientContextSwitcher currentClientId={currentClientId} onSwitch={handleSwitchClient}/>}
            <button className="relative p-2 rounded hover:bg-muted transition-colors" style={{ color:"var(--muted-foreground)" }}><Bell size={14}/>{NOC_ALERTS.filter(a=>!a.acked&&!a.suppressed).length>0&&<span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor:"#EF4444" }}/>}</button>
            <button className="p-2 rounded hover:bg-muted transition-colors" style={{ color:"var(--muted-foreground)" }}><RefreshCw size={13}/></button>
            <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} className="p-2 rounded hover:bg-muted transition-colors" style={{ color:"var(--muted-foreground)" }} title={theme==="dark"?"Светлая тема":"Тёмная тема"}>
              {theme==="dark"?<Sun size={13}/>:<Moon size={13}/>}
            </button>
            <div className="w-px h-4 bg-border mx-1"/>
            <span className="text-xs" style={{ ...MONO, color:"var(--muted-foreground)" }}>Обновлено: 14:22</span>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-auto${isFullscreen?"":" p-6"}`}>
          {view==="dashboard"&&<Dashboard onNavigateToTicket={navigateToTicket} onNavigateToDevice={navigateToDevice}/>}
          {view==="servicedesk"&&<ServiceDesk onOpenChat={openChat} initialTicket={selectedTicketId}/>}
          {view==="docs"&&<Docs/>}
          {view==="infra"&&<Infra initialDevice={selectedDeviceId} onNavigateToDevice={navigateToDevice}/>}
          {view==="finance"&&<Finance onSoftwareDetail={navigateToSoftware}/>}
          {view==="software"&&softwareName&&<SoftwareDetail name={softwareName} onBack={() => setView("finance")}/>}
          {view==="account"&&<AccountPage/>}
          {view==="sla"&&<SLADashboard/>}
          {view==="billing"&&<BillingPage/>}
          {view==="api"&&<APIPage/>}
          {view==="audit"&&<AuditPage/>}
          {view==="fullchat"&&<div className="flex h-full overflow-hidden"><FullChat ticketId={chatTicketId} onBack={() => setView("servicedesk")}/></div>}
          {/* Engineer-only views */}
          {view==="kanban"&&role==="engineer"&&<KanbanBoard/>}
          {view==="noc"&&role==="engineer"&&<NOCView/>}
          {view==="engkpi"&&role==="engineer"&&<EngineerKPI/>}
          {view==="wiki"&&role==="engineer"&&<InternalWiki/>}
          {view==="teamchat"&&role==="engineer"&&<TeamChat/>}
          {view==="orgs"&&role==="engineer"&&<AllOrgsPage onViewClient={handleViewClient}/>}
          {view==="logs"&&role==="engineer"&&<LogsPage/>}
          {view==="news"&&<NewsPage/>}
          {view==="switchaccount"&&<SwitchAccountPage currentClientId={currentClientId} onSelectClient={id=>handleSwitchClient(id)} onSelectEngineer={()=>{handleSwitchClient(null);}}/>}
        </div>
      </div>
    </div>
  );
}
