FIGMA DESIGN PROMPT – COMPLETE PORTAL UPGRADE
(Client Portal + SaaS Extensions + Engineer Workspace + Account Switching)

CONTEXT & GLOBAL CONSTRAINTS:
You are extending an existing, fully functional web application for an IT System Integrator.
CRITICAL RULES (DO NOT BREAK):
- The existing global layout (fixed sidebar on the left, fixed top header, content area on the right) is MANDATORY. Do not change its structure, padding, or breakpoints.
- Do not alter existing color palettes, typography (font sizes/weights), spacing units (8px grid), shadows, border-radius, or icon sets.
- All new screens must inherit the Master Component for the Sidebar + Header.
- All new interactive elements (modals, drawers, dropdowns) must be built as Figma Overlays or Variants to avoid destroying the master frames.

---
PART 1: CLIENT PORTAL UPGRADES (Existing User Features)

1.1 Infrastructure – Network Topology & Container Graphs:
- Add two new sub-tabs inside "Infrastructure": "Server Topology" (node-link graph for physical/virtual servers) and "Container Mesh" (graph for Kubernetes Pods/Services and Docker/Podman containers with traffic arrows).
- Color-code nodes by status; edge thickness represents traffic volume.

1.2 Expanded Node Details (Graph Interaction):
- Replace the small tooltip on node click with a Right Slide-out Drawer (width: 400px).
- Drawer content: Node Name, Status Badge, Fast Facts (OS, CPU, RAM), Mini Sparklines for CPU/Network, a primary button "View Full Device Profile" (links to Infrastructure → Devices → Specific Device), and a secondary "Create Ticket for this Node" button.

1.3 Interactive Overview Dashboard (Clickable Widgets):
- Make all widgets on the "Overview" page clickable.
- Clicking a ticket row → navigates to Service Desk → Ticket Detail.
- Clicking a log entry → navigates to Library → Service Log with that entry highlighted.
- Clicking an alerting device → navigates to Infrastructure → Device Card with that node selected.

1.4 Fully Customizable Dashboard (Widget System):
- Add an "Edit Dashboard" toggle. In Edit Mode, users can open a Widget Gallery (Tickets, Graphs, Licenses, K8s Status, Inventory) and drag/drop widgets onto the canvas.
- Allow resizing (1x1, 2x1, 2x2) and removal (hover close button). Layouts must save per user.

1.5 Software Inventory – Detailed License View:
- Make every software row clickable, leading to a Software Detail Page.
- This page must contain: General Info, License Key (show/hide), Used/Remaining seats, Associated Devices (linked), Documentation references, and Internal Notes (warnings).

1.6 Service Desk – Full-Page Chat:
- In the ticket detail view, add a button "Open Full Chat" that navigates to a dedicated full-screen chat page (retaining the same bubble/avatar style, with file attachments and typing indicators).

---
PART 2: EXTENDED SAAS FEATURES (Subscription Model)

Add the following new pages to the main navigation to support "Everything-as-a-Service":
- Service Health / Uptime: 30/90-day SLA availability calendar with green/red blocks.
- Plan & Billing: Current tariff, usage metrics (devices, storage, users), and an "Upgrade Plan" CTA.
- API & Integrations: Page to generate API Tokens with cURL/Python snippets.
- Onboarding Checklist: Persistent widget for new clients (steps: sign contract, install agent, create first ticket).
- Smart Alert Center: UI for users to create custom alert rules (e.g., mute alerts at night).
- Client Audit Log: History of actions performed by the client's own employees.

---
PART 3: ENGINEER’S PERSONAL CABINET (Internal Workspace)

This section adds new screens and tools visible ONLY to Integrator engineers (role-based access).

3.1 Global Multi-Tenancy Context Switcher:
- In the top header bar, add a "Quick Client Search" dropdown. Engineers can type a school name to instantly switch the entire portal context (data, tickets, infrastructure) to that client without reloading.
- Add a "Recent Clients" widget showing the last 5 accessed clients.

3.2 Service Desk Pro (Kanban View):
- Add a Kanban board view for tickets (New / In Progress / Awaiting Reply / Critical / Closed).
- Display SLA countdown timers directly on ticket cards.
- Add an "Internal Notes" field (visible ONLY to engineers, hidden from clients).
- Allow linking multiple tickets from different clients to a single parent incident.

3.3 Advanced Device Management:
- Enable Inline Editing in the device table (edit IP/Hostname directly).
- Add Bulk Operations: checkboxes to select multiple devices and trigger "Update OS" or "Reboot" (via Ansible integration).
- Show a Device Audit Log (who changed what and when).

3.4 Integrated Remote Access (Jump Box):
- On any server/device card, add buttons: "Web-SSH" (opens a browser-based terminal) and "kubectl" (for K8s clusters).

3.5 Change Management (Maintenance Windows):
- Create a "Request for Change (RFC)" wizard for engineers to schedule maintenance.
- Automatically push these maintenance windows to the client's "Upcoming Works" widget.
- Include an internal checklist for the engineer (Backup, Stop Service, Check Logs).

3.6 Centralized Alert Management (NOC View):
- Create a dedicated "Active Alerts" screen showing critical Zabbix/Prometheus alerts across ALL clients.
- Add "Acknowledge (Ack)" and "Suppress for 2 hours" buttons (for planned maintenance).

3.7 Engineer's Performance Dashboard:
- A personal KPI dashboard showing: My Open Tickets, MTTR (Mean Time to Resolve) per week/month, and a "Client Health Map" (Green/Yellow/Red statuses for all assigned schools).

3.8 Internal Wiki / Playbook:
- Add a hidden section (client-invisible) for storing script snippets (one-click copy) and Post-Mortem incident reports.

3.9 Time Tracking & Billing:
- Add a "Start/Stop Timer" button inside each ticket to log engineering hours (for billing and salary calculations).
- Display a "Resources Spent" block per client (hours/traffic) to check profitability.

3.10 Internal Team Chat:
- Add a side widget or dedicated page for real-time engineer-to-engineer messaging with @mentions.

---
PART 4: NEW ACCOUNT SWITCHING (IMPERSONATION) – CRITICAL ADDITION

4.1 Profile Entry Point (Bottom-Left Sidebar):
- Currently, the user's avatar and name are located at the bottom left of the fixed sidebar.
- ADD a new action element here: a clearly labeled button/icon called "Switch Account" (or a dropdown trigger) placed directly below or beside the user's profile info.

4.2 The "Switch Account" Selection Screen:
- Clicking "Switch Account" must open a NEW dedicated full-page frame (or a large full-screen overlay modal, maintaining the global header for navigation context).
- This screen is titled "Switch Workspace" / "Select Account".

4.3 Layout of the Selection Screen:
- Split the screen into two clear, visually distinct sections (using cards or grids):
  a) "My Engineer Profile" – Display the engineer's own avatar, full name, and role. Include a large button "Continue as Engineer" (this is the default active state, greyed out or highlighted if currently active).
  b) "Client Accounts" – Display a scrollable list/grid of ALL client organizations (schools) that this engineer is permitted to support/impersonate. Each client tile must show:
     - Client Logo / Avatar
     - Client Name
     - A prominent button "View as Client" or "Impersonate".

4.4 Post-Switching Behavior (Crucial UX):
- When the engineer selects a client and clicks "View as Client":
  - The entire portal context switches to that specific client's data (tickets, infrastructure, documents).
  - The sidebar navigation updates dynamically to show ONLY the client-visible menu items (Overview, Tickets, Library, Infrastructure, Inventory). All engineer-only menus (Kanban, Alert Center, Internal Wiki, Billing) must be HIDDEN.
  - A persistent, highly visible visual indicator (e.g., a colored top banner or a pill-shaped badge in the header) MUST appear, stating: "Viewing as [Client Name]". This banner must include an "Exit" or "Return to Engineer" button.
- Clicking "Exit" instantly reverts the context back to the engineer's default full-access workspace.

4.5 Constraint for this Feature:
- This switching mechanism must ONLY change the data payload and menu visibility. The underlying global layout (sidebar, header, content area) must remain structurally identical to avoid breaking any existing prototype flows or auto-layout constraints.

---
FINAL TECHNICAL NOTES FOR FIGMA:
- Use Variants for all new buttons (Engineer/Client toggles, Impersonation badges).
- Use Auto-Layout for the "Switch Account" grid to handle variable numbers of clients.
- All new frames (Engineer Dashboard, Switch Account screen, Software Detail page) must be inserted as separate pages in the Figma file but linked via Prototype interactions (On Click → Navigate To) to the existing sidebar menu items.
- Ensure Dark/Light mode compatibility (if previously designed) for the engineer-specific screens, as engineers often work at night.