FIGMA DESIGN PROMPT – EXTENDED SAAS PORTAL FOR IT SYSTEM INTEGRATOR

CONTEXT & CONSTRAINTS:
You are extending an existing, already well-designed web application (IT System Integrator portal). 
CRITICAL RULES:
- DO NOT alter the current global layout (header, sidebar navigation, content padding, or footer).
- DO NOT change existing color palettes, typography scales, spacing units (8px grid), shadow variables, or icon libraries.
- All new screens and components must use Auto Layout and inherit existing component variants (buttons, inputs, cards, badges, tables).
- New features must be added as additional frames (pages) or overlays, seamlessly integrated into the current navigation structure.

---
FEATURE SET 1: INFRASTRUCTURE – NETWORK TOPOLOGY & CONTAINER GRAPHS

1.1. Infrastructure → Network Graph (Server Topology):
- Add a new sub-tab/screen inside "Infrastructure" called "Network Graph".
- Visualize server-to-server network interactions as an interactive node-link diagram.

1.2. Infrastructure → Service Mesh Graph (Containers/K8s):
- Adjacent to the server graph, add a second graph tab called "Container Mesh".
- For Kubernetes: Represent the Cluster as a large bounding box (Namespace). Inside, display Pods as nodes. Draw directed arrows (edges) representing service-to-service traffic (e.g., Frontend → Backend → Redis → DB).
- For Docker/Podman: Add a "Host View" toggle. Display the host machine as a parent node, with child containers nested inside, connected via virtual network bridges.
- Color-code nodes by status (Running, Stopped, CrashLoopBackOff) and edge thickness by traffic volume.

---
FEATURE SET 2: EXPANDED NODE DETAILS (INTERACTIVE OVERLAY)

2.1. Node Click Interaction:
- Currently, clicking a graph node shows a small tooltip with Hostname, Type, and IP.
- REPLACE this with a Slide-out Right Drawer (width: ~400px) that appears on the right side of the screen, overlapping the graph without pushing the layout.

2.2. Drawer Content:
- Header: Node Name + large Status Badge (Online/Offline).
- Fast Facts: OS, CPU Cores, RAM, Uptime.
- Mini Sparklines: Small inline charts for CPU and Network traffic over the last hour (fetched from Zabbix/Prometheus).
- Primary Action: A prominent button labeled "View Full Device Profile". Clicking it navigates to Infrastructure → Devices → [Specific Device] with a deep link to that exact asset.
- Secondary Action: A button "Create Ticket for this Node" that pre-fills the Service Desk form with the device context.

---
FEATURE SET 3: USER PROFILE, SETTINGS, & GAMIFICATION

3.1. Profile Entry Point:
- Currently, the user avatar and "Settings" are located at the bottom left of the sidebar.
- Create a new dedicated full-page screen accessible from here, titled "My Account".

3.2. Tabs inside "My Account":
- Tab A: "Profile & Settings" – Edit avatar, Full name, Job title, Contact info, Change password, Enable 2FA (TOTP).
- Tab B: "News & Activity Feed" – A scrolling timeline of portal updates, new documentation releases, and personalized system notifications (e.g., "New contract signed", "Maintenance window rescheduled").
- Tab C: "Gamification & Achievements" – Display "Activity Points". Create a gallery of Badges (e.g., "Support Hero" for resolving 10 tickets without escalation, "Scholar" for viewing 50 documents, "Keeper" for adding comments to the Service Log). Include progress bars indicating how close the user is to unlocking the next achievement.

---
FEATURE SET 4: INTERACTIVE OVERVIEW DASHBOARD (CLICKABLE WIDGETS)

4.1. Live Links on Overview:
- The "Overview" (Home) dashboard currently displays static data. Make every widget row/entry clickable.
- "Recent Tickets" widget: Clicking on a specific ticket row navigates to Service Desk → Ticket Detail (specific ID).
- "Recent Service Logs" widget: Clicking a log entry navigates to Library → Service Log Journal, automatically scrolling to and highlighting the selected entry.
- "Monitoring Alerts" widget: Clicking a device with a critical alert navigates to Infrastructure → Network Graph / Device Card, with the problematic node highlighted or selected.

---
FEATURE SET 5: CUSTOMIZABLE OVERVIEW DASHBOARD (WIDGET SYSTEM)

5.1. Edit Mode:
- Add an "Edit Dashboard" toggle/button in the top-right corner of the Overview page.

5.2. Widget Library:
- When Edit Mode is active, display an "Add Widget" button. Clicking it opens a modal gallery of available widgets: Ticket List, CPU/Load Graphs, License Expiry Calendar, K8s Status, Inventory Snapshot, RSS News, etc.
- Users can drag and drop widgets from the gallery onto the dashboard canvas.

5.3. Resizing & Removal:
- Allow widgets to be resized (e.g., 1x1, 2x1, 2x2 grid units) using drag handles.
- Each widget must have a "Remove" (close/X) button visible on hover.
- Save the custom layout per user (not globally) so the School Director sees a different dashboard than the System Administrator.

---
FEATURE SET 6: SOFTWARE INVENTORY – DETAILED LICENSE VIEW

6.1. Clickable Inventory Rows:
- In the "Inventory" section, make each software/product row a clickable link.

6.2. Software Detail Page:
- Create a new detail page for individual software entries containing:
  - General Info: Name, Version, Publisher, Installation Date.
  - License Block: Activation Key (with Show/Hide toggle), Total purchased seats, Used/Remaining seats.
  - Associated Devices: A list of servers/PCs where this software is installed (with links to their device profiles).
  - Documentation: A direct link/button to the Library section filtering documents related to this specific software.
  - Internal Notes: A rich-text field visible to both the client and integrator for important warnings (e.g., "Do not update to v3.0 before 2026 due to 1C integration conflict").

---
EXTENDED SAAS FEATURES (ADD-ON SECTIONS)

Add the following new sections/pages to the main navigation to support the "Everything-as-a-Service" subscription model:

7.1. Service Health / Uptime (SLA Dashboard):
- Create a page showing a 30/90-day uptime calendar or timeline specifically for the client's infrastructure. Use green/red color blocks to visualize availability. Show the current month's SLA percentage achieved.

7.2. Subscription & Plan Management:
- Add a section (e.g., "Plan & Billing") showing the current tariff (e.g., "Standard", "Premium").
- Display usage metrics: Monitored devices used vs. included limit, Storage used for logs/backups, Active users.
- Include a primary CTA button: "Upgrade Plan" or "Purchase Additional Licenses" to facilitate upselling directly within the portal.

7.3. API & Integrations Center:
- Add a page for advanced users to generate and manage API Tokens (read-only or read-write).
- Provide code snippets (cURL/Python) so the client can pull monitoring statuses into their own internal Telegram bots or systems.

7.4. Interactive Onboarding Checklist (Welcome Wizard):
- For new clients (first login), display a persistent, dismissible progress widget/checklist:
  - Step 1: Sign the contract (automatically checked if signed).
  - Step 2: Download and install the monitoring agent (button to download script).
  - Step 3: Create your first test support ticket (link to Service Desk).
  - Step 4: Assign responsible staff roles.

7.5. Smart Alert Center (Notification Rules):
- Move beyond a simple list. Allow users to create custom alert rules: "Send Telegram notification if CPU > 90% for 5 minutes, but mute alerts between 00:00 – 06:00 AM."

7.6. Client Audit Log:
- Add a page showing the history of actions performed *by the client's own employees* (e.g., User X logged in at Y time, User Z viewed Document W). This provides transparency and is critical for schools handling sensitive data.

---
TECHNICAL IMPLEMENTATION NOTES FOR FIGMA:
- Use Overlays (Modal/Drawer) for Feature 2 (Node Detail) to avoid destroying the graph frame structure.
- Create new Frames for Features 3, 6, and all Extended SaaS pages (7.1–7.6). Ensure they all inherit from the main "Master Component" for the Sidebar + Header.
- Use Variants for the new badges (achievements), statuses, and widget cards to maintain consistency.
- All new tables (Software Inventory, Audit Log) must match the exact column styles, fonts, and hover states of the existing tables in the current design.