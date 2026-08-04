FIGMA DESIGN PROMPT – COMPLETE PORTAL REDESIGN
(Engineer Workspace Overhaul + Client Portal Enhancements + Full Feature Set)

CONTEXT:
You are redesigning and extending an existing IT System Integrator portal (currently available at https://github.com/bysnik/contributor-web). The application serves two primary user types: Clients (schools and organizations) and Engineers (integrator staff who manage multiple clients).

GLOBAL CONSTRAINTS (MANDATORY – DO NOT BREAK):
- The existing global layout (fixed sidebar on the left, fixed top header, content area on the right) is SACRED. Do not change its structure, padding, or breakpoints.
- Do not alter existing color palettes, typography (font sizes/weights), spacing units (8px grid), shadows, border-radius, or icon sets—EXCEPT where explicitly noted below for the new light theme.
- All new screens must inherit the Master Component for the Sidebar + Header.
- All new interactive elements (modals, drawers, dropdowns) must be built as Figma Overlays or Variants.
- Existing client-facing features (Overview, Service Desk, Library, Infrastructure, Inventory) must remain fully functional and visually unchanged EXCEPT for the enhancements listed below.

---
PART 1: ENGINEER ACCOUNT – COMPLETE RESTRUCTURING

1.1 Remove "Extended" Menu Block:
- The current "Extended" menu block in the engineer's sidebar must be COMPLETELY REMOVED.
- Replace it with a fully redesigned engineer navigation structure (see 1.2 below).

1.2 New Engineer Navigation Structure:
- The engineer now has FULL ACCESS to ALL data across EVERY client organization.
- The sidebar must contain the following top-level sections:
  a) "Overview" – Engineer's personal dashboard (see 1.3).
  b) "All Organizations" – A master list of all client organizations with health status indicators (see 1.4).
  c) "Service Desk" – Kanban board and ticket management (see 1.5 & 1.12).
  d) "Infrastructure" – Global device and topology views (see 1.6, 1.7, 1.8, 1.9, 1.10).
  e) "Alerts" – Centralized alert management (see 1.13).
  f) "Wiki" – Full knowledge base (see 1.14).
  g) "Logs" – Centralized log aggregator (see 1.11).
  h) "Team Chat" – Multi-channel communication (see 1.15).

1.3 Engineer Overview Dashboard:
- The engineer's landing page must show:
  a) "My Assigned Tasks" – A list of tickets and tasks assigned specifically to this engineer, with priority indicators and SLA countdowns.
  b) "Incident Monitoring" – Real-time feed of critical alerts across ALL client organizations, color-coded by severity.
  c) "Client Health Map" – A visual grid or map showing ALL organizations with status indicators (Green = All systems operational, Yellow = Warning, Red = Critical issues).
  d) "Recent Activity" – A timeline of recent actions performed by the engineer and their team.
  e) All widgets on this page must be customizable (see Part 5).

1.4 Organization Context Switching:
- The engineer must be able to view the entire digital landscape of ANY organization at any time.
- The "All Organizations" section provides:
  a) A master list/grid of all clients with: Organization Name, Logo, Subscription Tier (see 1.17), Health Status (Green/Yellow/Red), Number of active alerts, Number of open tickets.
  b) Clicking any organization opens a DEDICATED ORGANIZATION VIEW – a full context switch where ALL data (tickets, infrastructure, documents, inventory) filters to that specific client.
  c) A persistent visual indicator (top banner or header badge) must show: "Viewing: [Organization Name]" with an "Exit" button to return to the master engineer view.
  d) The engineer's sidebar dynamically updates to show BOTH global engineer menus AND client-specific menus when viewing an organization.

1.5 Engineer Service Desk – Kanban Board:
- Full Kanban board with columns: Backlog, To Do, In Progress, Review, Done.
- Drag-and-drop cards between columns to change status.
- Each card shows: Ticket ID, Title, Client Organization, Priority, Assignee, SLA timer.
- Ability to CREATE new tasks directly on the board.
- Ability to HIDE/archive tasks (move to "Archived" column or filter out).
- Clicking a card opens the full ticket detail view.

1.6 Full Edit Permissions for Engineer:
- Engineers must have FULL EDIT permissions on ALL client data:
  a) Edit any device information (hostname, IP, OS, location, etc.).
  b) Edit any software/license information.
  c) Edit any documentation.
  d) ADD new service log entries (records of work performed) directly to the client's journal.
  e) All edits must be logged with engineer's name and timestamp.

---
PART 2: CLIENT ACCOUNT ENHANCEMENTS

2.1 Client Overview Dashboard – Full Customization:
- Same as Part 5 – clients can add, remove, and rearrange ANY widget on their overview page.

2.2 Ticket Creation – Device Attachment:
- When creating a new ticket (both clients and engineers), the form MUST include a field to ATTACH a device.
- The device selector must include:
  a) Servers (physical and virtual).
  b) Network equipment (switches, routers, firewalls).
  c) CABLE LINES (physical cabling infrastructure).
- The attached device is automatically linked to the ticket for context.

2.3 Client Subscription Tiers:
- Different clients have different subscription levels, which determine available features.
- Create 3–4 distinct subscription tiers (e.g., Basic, Standard, Premium, Enterprise).
- Examples of tier differences:
  a) Basic: 1 server, basic monitoring, 5 users, limited storage.
  b) Standard: Up to 5 servers, full monitoring, 20 users, standard storage.
  c) Premium: Up to 20 servers, full monitoring + advanced analytics, unlimited users, large storage, API access.
  d) Enterprise: Full DCIM, custom integrations, dedicated support, unlimited everything.
- The interface should adapt based on the client's tier (hide/show features, show usage limits).

2.4 Diverse Client Examples:
- Create a VARIETY of client profiles with different infrastructures:
  a) "Small School" – 1 physical server with 3–5 VMs, basic network.
  b) "Medium School" – 3–5 servers, 20+ VMs, hypervisor cluster (Proxmox), basic K8s.
  c) "Large School / Small Datacenter" – 20+ servers, full virtualization cluster, multiple K8s clusters, complex networking, storage arrays.
  d) "Enterprise Client" – Full datacenter with racks, multiple hypervisor clusters, multi-cluster K8s, advanced networking.
- Each client should have UNIQUE chat history, unique documents, unique device configurations.

---
PART 3: CHAT & COMMUNICATION OVERHAUL

3.1 Right Sidebar for All Chat Pages:
- On EVERY chat page (ticket chat, team chat, any messaging interface), add a RIGHT SIDEBAR (slide-out drawer, width: 300–350px).
- The sidebar must have three tabs/sections:
  a) "Attachments" – List of ALL files shared in this chat (with download icons).
  b) "Links" – List of ALL URLs shared in this chat (clickable).
  c) "Participants" – List of all users in this chat with online/offline status.

3.2 Wiki Page Attachment in Chat:
- In the chat message composer (input field), add a "Wiki" button.
- Clicking it opens a search field to FIND and ATTACH a wiki page.
- The attached wiki page appears as a rich preview card in the chat message (title, excerpt, link).

3.3 Team Chat – Multi-Channel System:
- Engineers have a FULL messaging system similar to Telegram/Slack.
- Structure:
  a) Left panel: List of ALL chats and channels (grouped by type).
  b) Types of chats:
     - Direct Messages (1-on-1 with other engineers).
     - Team Channels (e.g., #general, #alerts, #on-call, #incident-response).
     - Client-Specific Channels (e.g., #client-school-alpha, #client-school-beta – for team discussion about specific clients).
  c) Each channel can have its own topic/description and pinned messages.
- Chat messages support: text, emoji reactions, file attachments, code snippets, and wiki page attachments (see 3.2).

3.4 Ticket Chat – Full Page View:
- The ticket detail page must have a FULL-PAGE CHAT section (not just a small block).
- Full message history with infinite scroll.
- File attachments, emoji reactions, and wiki page attachments (see 3.2).
- Right sidebar with Attachments/Links/Participants (see 3.1).

---
PART 4: DASHBOARD CUSTOMIZATION (BOTH CLIENT & ENGINEER)

4.1 Full Widget Customization:
- REPLACE the current limited widget system with a COMPLETE drag-and-drop widget system.
- ALL blocks on the overview page must be removable and rearrangeable.

4.2 Widget Gallery:
- A modal/panel listing ALL available widgets:
  a) Recent Tickets (list).
  b) Active Alerts (list/count).
  c) Device Health (status grid).
  d) CPU/Load Graphs (sparklines).
  e) License Expiry Calendar.
  f) K8s Status (pod counts).
  g) Inventory Snapshot (counts by type).
  h) Service Log (recent entries).
  i) Team Activity Feed.
  j) Customizable RSS/News Feed.
  k) Upcoming Maintenance (calendar).
  l) SLA Performance (uptime percentage).

4.3 Drag-and-Drop Rearrangement:
- Users can drag widgets to NEW POSITIONS on the grid.
- Widgets snap to a grid (e.g., 1x1, 2x1, 2x2 units).
- Layout saves PER USER (engineers have their own layout, each client user has their own).

---
PART 5: REMOTE ACCESS – VNC & SPICE (ENGINEER ONLY)

5.1 Direct VNC/SPICE Access:
- Engineers must have DIRECT ACCESS to EVERY VM and container via VNC and SPICE protocols.
- On any VM/container detail page, add buttons: "Open VNC" and "Open SPICE".

5.2 Terminal Access:
- Clicking VNC or SPICE opens a TERMINAL WINDOW (similar to Proxmox's noVNC).
- Two display options:
  a) In-Page Modal/Overlay – terminal opens as a large modal within the current page.
  b) New Browser Window – terminal opens in a separate browser window/tab.
- The terminal must support: copy/paste, full screen mode, and keyboard shortcuts.

---
PART 6: EQUIPMENT PAGES – ENHANCED METRICS & STACK VIEW

6.1 Expanded Metrics Graphs:
- On EVERY device detail page (servers, VMs, containers), display MULTIPLE graphs:
  a) CPU Usage (%).
  b) Memory Usage (GB / %).
  c) Network Traffic (In/Out – Mbps/Gbps).
  d) Disk I/O (Read/Write – MB/s).
  e) Disk Usage (%).
  f) Temperature (if available).
- All graphs should be interactive (hover to see values, zoomable).

6.2 OS & Hypervisor Information:
- Display CLEAR information about:
  a) Installed Operating System (name, version, kernel).
  b) Hypervisor (if virtualized): Proxmox, VMware, Hyper-V, etc.
  c) Host Machine (if VM/container): link to the physical host.

6.3 Service Stack View:
- Show the COMPLETE STACK of services running on the server/VM:
  a) For physical servers: list all VMs and containers running on this host.
  b) For VMs: list all applications/services installed (e.g., nginx, MySQL, Redis, custom apps).
  c) For containers: show the container image, running processes, exposed ports.
- Each service/VM/container in the stack is CLICKABLE and navigates to its own detail page.

---
PART 7: CONTAINER MAPS (GRAPH VIEWS)

7.1 Container Graph (Similar to Network Topology):
- The container visualization must be STRUCTURALLY IDENTICAL to the existing network topology graph.
- Nodes represent: Pods (K8s), Containers (Docker/Podman), Services.
- Edges represent: network traffic, service dependencies, API calls.
- Color-coding: by status (Running, Stopped, CrashLoopBackOff, Pending).

7.2 Node Click – Right Sidebar:
- Clicking ANY container/pod node opens a RIGHT SIDEBAR (width: 400px).
- Sidebar content:
  a) Container/Pod Name.
  b) Status Badge.
  c) Host Information (which hypervisor/physical host is this running on?).
  d) Image Name & Version.
  e) Resource Usage (CPU, RAM – mini graphs).
  f) Environment Variables (masked for security).
  g) Cross-links: link to the host server, link to the hypervisor, link to the cluster.
  h) Button: "Open VNC/SPICE" (see Part 5).
  i) Button: "View Logs" (opens log aggregator filtered for this container – see Part 8).

7.3 Docker Host View:
- For Docker/Podman hosts, the graph view must show:
  a) The HOST MACHINE as a parent node.
  b) All CONTAINERS as child nodes NESTED inside the host.
  c) Virtual networks (bridge, host, overlay) connecting containers.
- Clicking any container opens the same right sidebar (see 7.2).

---
PART 8: CENTRALIZED LOG AGGREGATOR (ENGINEER + PREMIUM CLIENTS)

8.1 Log Collection:
- A dedicated "Logs" section that aggregates logs from ALL devices (servers, VMs, containers, network equipment).
- Logs are streamed in real-time (or near-real-time).

8.2 Log Filtering:
- Powerful filtering capabilities:
  a) By Device / Hostname.
  b) By Severity (Info, Warning, Error, Critical).
  c) By Time Range (presets: Last Hour, Last 24h, Last 7 Days, Custom).
  d) By Keyword / Regex search.
  e) By Service / Application name.

8.3 Log Comments & Annotations:
- Engineers can ADD COMMENTS to individual log lines.
- Comments are visible to other engineers (team collaboration).

8.4 Log → Ticket Creation:
- From ANY log line (or group of selected log lines), engineers can:
  a) Create a NEW TICKET – the log lines are automatically attached as context.
  b) Attach logs to an EXISTING ticket.
- The "Create Ticket" button appears on hover/selection of log lines.

---
PART 9: KANBAN BOARD – TASK MANAGEMENT (ENGINEER)

9.1 Task Creation:
- On the Kanban board, engineers can CREATE new tasks directly.
- Task form includes: Title, Description, Priority, Assignee, Due Date, Client Organization (if applicable), Labels/Tags.

9.2 Task Visibility Control:
- Engineers can HIDE tasks (archive them) without deleting.
- Hidden tasks are moved to an "Archived" column or filter.
- A toggle "Show Archived" reveals hidden tasks.

9.3 Status Changes:
- Drag-and-drop cards between columns to change status.
- Statuses: Backlog → To Do → In Progress → Review → Done.
- Status changes are logged with timestamp and user.

---
PART 10: ALERT MANAGEMENT – TICKET CREATION & CROSS-LINKS (ENGINEER)

10.1 Alert → Ticket Creation:
- On the Alerts page, each alert has a button "Create Ticket".
- Clicking creates a new ticket with the alert details pre-filled (title, description, severity, affected device).

10.2 Cross-Links on Alerts:
- Each alert displays CROSS-LINKS to:
  a) The affected Device (server, VM, container, network equipment).
  b) The affected Container/Pod (if applicable).
  c) The affected Service/Application.
  d) Related Alerts (grouping by root cause).
- Clicking any cross-link navigates to the corresponding detail page.

---
PART 11: WIKI – FULL KNOWLEDGE BASE

11.1 Complete Wiki System:
- REPLACE the current mini-wiki blocks with a FULL wiki system.
- The wiki must be similar to VitePress, MediaWiki, or Notion – with:
  a) Full pages with rich content (Markdown or WYSIWYG editor).
  b) Nested page hierarchy (folders/sub-pages).
  c) Table of Contents (auto-generated from headings).
  d) Search functionality (search across all pages).
  e) Page history / version control.
  f) Internal linking between pages.

11.2 Wiki Structure:
- Categories: Onboarding, Infrastructure Guides, Troubleshooting, Service Catalogs, Incident Playbooks, API Documentation.
- Engineers can create, edit, and delete pages.
- Some pages may be client-facing (visible in client Library), some internal-only.

---
PART 12: NEWS FEED – RELOCATED

12.1 News Feed Location:
- MOVE the News Feed/Activity Feed from the Profile page to a DEDICATED main section.
- Add a new navigation item: "News" or "Feed" in the main sidebar (for both clients and engineers).
- The feed shows:
  a) System announcements (new features, maintenance).
  b) Client-specific updates (new documents, completed work).
  c) Team activity (for engineers).

---
PART 13: LIGHT THEME – COMFORTABLE & EYE-FRIENDLY

13.1 New Light Theme:
- Add a FULL LIGHT THEME toggle (sun/moon icon in the header).
- The light theme must NOT be pure white (#FFFFFF) – it should be a SOFT, WARM, or COOL LIGHT color.
- Recommended background: #F5F7FA, #F0F2F5, #F8F9FB, or #EEF0F4 (soft gray/blue-gray).
- Text colors: dark gray (#2D3748 or #1A202C) for readability.
- Cards and panels: white (#FFFFFF) with soft shadows.
- All components (buttons, inputs, tables, charts) must have light theme variants.

---
PART 14: HOVER EFFECTS – ALL BUTTONS

14.1 Universal Hover States:
- EVERY interactive element (buttons, links, clickable cards, menu items) must have a VISUAL HOVER effect.
- Hover effects:
  a) Buttons: background color darkens by 10–15%, subtle shadow increase.
  b) Links: underline appears or color changes.
  c) Cards: subtle lift (shadow increases) or border highlight.
  d) Menu items: background highlight.
- All hover transitions should be smooth (200–300ms).

---
PART 15: ENGINEER AVATAR ICON

15.1 Custom Engineer Icon:
- The default avatar/icon for engineer accounts must be a CUSTOM-DRAWN "HUMAN FIGURE" icon.
- The icon should represent a technical professional (not a generic user silhouette).
- Style: clean, modern, vector illustration – matching the existing icon style.
- The icon appears:
  a) In the sidebar (bottom-left user profile).
  b) In chat messages (engineer avatars).
  c) In user lists and mentions.

---
PART 16: DIVERSE CLIENT DATA – REALISTIC EXAMPLES

16.1 Varied Client Infrastructures:
- Populate the design with DIVERSE, REALISTIC client examples:
  a) "Oakwood High School" – 1 physical server, Proxmox with 4 VMs (AD, File Server, Web Server, DB), 10 workstations.
  b) "Riverside Academy" – 3 servers, Proxmox cluster (8 VMs total), basic networking, 1 K8s node (3 pods).
  c) "Metropolitan College" – 15 servers, VMware cluster (40+ VMs), 3 K8s clusters (50+ pods), complex networking, SAN storage.
  d) "State University" – Full datacenter: 50+ servers, multiple hypervisor clusters, multi-cluster K8s, advanced networking (firewalls, load balancers), 200+ VMs.

16.2 Varied Subscription Tiers:
- Each client example should have a DIFFERENT subscription tier:
  a) Oakwood High: "Basic" – limited features.
  b) Riverside: "Standard" – mid-range features.
  c) Metropolitan: "Premium" – full features.
  d) State University: "Enterprise" – all features + custom integrations.

16.3 Unique Chat & Document History:
- Each client example must have UNIQUE:
  a) Chat history (different conversations, different participants).
  b) Document libraries (different contracts, different technical docs).
  c) Service log entries (different work records).
  d) Device configurations (different IPs, different OS versions).

---
TECHNICAL IMPLEMENTATION NOTES FOR FIGMA:

- Use VARIANTs for all new buttons (primary, secondary, tertiary, disabled, hover states).
- Use AUTO-LAYOUT for all widget grids, lists, and dashboards.
- Create new FRAMES for each major section (Engineer Overview, All Organizations, Organization Detail, Kanban Board, Logs, Wiki, Alerts, Team Chat).
- Use OVERLAYS for: right sidebars, modals, VNC/SPICE terminal windows.
- All new frames must INHERIT from the Master Component for Sidebar + Header.
- Ensure DARK/LIGHT theme compatibility – use Figma's "Swap Theme" or variable-based colors.
- All hover states should be documented in the component library.
- Prototype interactions: On Click → Navigate To (for page transitions), On Click → Open Overlay (for modals/sidebars).