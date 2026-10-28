import os
import subprocess
import shutil

with open('mits_logo_b64.txt', 'r', encoding='utf-8') as f:
    logo_b64 = f.read().strip()

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Milestone 4 Progress Report - Smart Civic System</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    @page {{
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}

    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 8.5pt;
      line-height: 1.42;
    }}

    .page {{
      width: 100%;
      min-height: 275mm;
      max-height: 275mm;
      page-break-after: always;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }}

    .page:last-child {{
      page-break-after: avoid;
    }}

    .page-content {{
      flex: 1;
    }}

    /* Page Footer */
    .page-footer {{
      border-top: 1px solid #e2e8f0;
      padding-top: 5px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.2pt;
      color: #64748b;
    }}

    .page-footer .system-tag {{
      font-weight: 600;
      color: #0f172a;
    }}

    /* College Header with Logo */
    .clg-header {{
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 2px solid #1e3a8a;
    }}

    .clg-logo {{
      width: 54px;
      height: 54px;
      object-fit: contain;
      flex-shrink: 0;
    }}

    .clg-details {{
      flex: 1;
    }}

    .clg-name {{
      font-size: 9.8pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.2px;
      text-transform: uppercase;
      line-height: 1.2;
    }}

    .clg-sub {{
      font-size: 7.2pt;
      color: #475569;
      font-weight: 500;
      margin-top: 1px;
    }}

    .clg-dept {{
      font-size: 7.8pt;
      color: #1e3a8a;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 2px;
    }}

    /* Header styling */
    .header-banner {{
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      color: #ffffff;
      padding: 11px 15px;
      border-radius: 6px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    }}

    .header-banner .title-group h1 {{
      font-size: 12pt;
      font-weight: 800;
      letter-spacing: -0.3px;
      line-height: 1.25;
      color: #f8fafc;
      margin-bottom: 2px;
    }}

    .header-banner .title-group p {{
      font-size: 7.8pt;
      color: #93c5fd;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }}

    .header-banner .badge-box {{
      text-align: right;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(4px);
      padding: 6px 10px;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }}

    .header-banner .badge-box .badge-title {{
      font-size: 6.8pt;
      color: #cbd5e1;
      text-transform: uppercase;
      font-weight: 600;
    }}

    .header-banner .badge-box .badge-value {{
      font-size: 10.5pt;
      color: #38bdf8;
      font-weight: 800;
    }}

    /* Metadata Bar */
    .meta-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 10px;
    }}

    .meta-item .meta-label {{
      font-size: 6.8pt;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.3px;
    }}

    .meta-item .meta-val {{
      font-size: 8.2pt;
      color: #0f172a;
      font-weight: 600;
      margin-top: 1px;
    }}

    /* Metric KPI Cards */
    .kpi-row {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
      margin-bottom: 10px;
    }}

    .kpi-card {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #2563eb;
      border-radius: 5px;
      padding: 7px 9px;
    }}

    .kpi-card.green {{
      border-left-color: #10b981;
    }}

    .kpi-card.purple {{
      border-left-color: #8b5cf6;
    }}

    .kpi-card.amber {{
      border-left-color: #f59e0b;
    }}

    .kpi-title {{
      font-size: 6.8pt;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
    }}

    .kpi-val {{
      font-size: 13.5pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      margin-top: 1px;
    }}

    .kpi-sub {{
      font-size: 6.8pt;
      color: #475569;
      margin-top: 1px;
    }}

    /* Section Headings */
    .section-head {{
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 8px;
      margin-bottom: 5px;
      padding-bottom: 2px;
      border-bottom: 1.5px solid #e2e8f0;
    }}

    .section-head .num-pill {{
      background: #2563eb;
      color: #ffffff;
      font-size: 7.2pt;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
    }}

    .section-head h2 {{
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.2px;
    }}

    .section-head .sub-note {{
      margin-left: auto;
      font-size: 7.2pt;
      color: #64748b;
      font-weight: 500;
    }}

    p.lead-text {{
      font-size: 8.2pt;
      color: #334155;
      margin-bottom: 7px;
      text-align: justify;
    }}

    /* Two column grid */
    .two-col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 7px;
    }}

    .three-col {{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 7px;
      margin-bottom: 7px;
    }}

    .box-panel {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 7px 9px;
    }}

    .box-panel h3 {{
      font-size: 8.2pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 4px;
    }}

    .box-panel ul {{
      padding-left: 13px;
      font-size: 7.5pt;
      color: #334155;
    }}

    .box-panel li {{
      margin-bottom: 2.5px;
    }}

    /* Architecture Flow Box */
    .arch-flow-box {{
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 7px 9px;
      margin-bottom: 7px;
    }}

    .tier-container {{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 5px;
      margin-top: 3px;
    }}

    .tier-item {{
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 5px 6px;
    }}

    .tier-item .tier-name {{
      font-size: 7pt;
      font-weight: 700;
      color: #1e3a8a;
      text-transform: uppercase;
    }}

    .tier-item .tier-tech {{
      font-size: 7.2pt;
      color: #0f172a;
      font-weight: 600;
      margin-top: 1px;
    }}

    .tier-item .tier-desc {{
      font-size: 6.8pt;
      color: #64748b;
      margin-top: 1px;
      line-height: 1.25;
    }}

    /* Tables */
    table.data-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 7.3pt;
      margin-top: 3px;
      margin-bottom: 5px;
    }}

    table.data-table th {{
      background: #0f172a;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 4.5px 5.5px;
      font-size: 7pt;
      letter-spacing: 0.2px;
    }}

    table.data-table td {{
      padding: 4px 5.5px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      vertical-align: middle;
    }}

    table.data-table tr:nth-child(even) td {{
      background: #f8fafc;
    }}

    /* Status Pills */
    .status-badge {{
      display: inline-block;
      padding: 1.5px 5px;
      border-radius: 9999px;
      font-size: 6.5pt;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}

    .status-completed {{
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }}

    .status-progress {{
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fcd34d;
    }}

    .status-planned {{
      background: #e0e7ff;
      color: #4338ca;
      border: 1px solid #a5b4fc;
    }}

    .code-tag {{
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 6.8pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 3.5px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }}

    .method-badge {{
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 6.2pt;
      font-weight: 700;
      padding: 1px 3px;
      border-radius: 3px;
      display: inline-block;
      text-align: center;
      min-width: 28px;
    }}

    .m-get {{ background: #dbeafe; color: #1e40af; }}
    .m-post {{ background: #dcfce7; color: #166534; }}
    .m-put {{ background: #fef3c7; color: #92400e; }}
    .m-delete {{ background: #fee2e2; color: #991b1b; }}

    /* Progress bar in table */
    .bar-container {{
      width: 44px;
      height: 5px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
      margin-right: 3px;
    }}

    .bar-fill {{
      height: 100%;
      background: #10b981;
      border-radius: 3px;
    }}

    .bar-fill.prog {{
      background: #f59e0b;
    }}

    /* Key features callouts */
    .feature-card {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 5.5px 7px;
      margin-bottom: 5px;
    }}

    .feature-card .feat-title {{
      font-size: 7.7pt;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5px;
    }}

    .feature-card .feat-desc {{
      font-size: 7pt;
      color: #475569;
      line-height: 1.32;
    }}

    /* Timeline sprint pills */
    .timeline-strip {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
      margin-top: 3px;
      margin-bottom: 7px;
    }}

    .timeline-step {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-top: 2.5px solid #cbd5e1;
      border-radius: 4px;
      padding: 5px 6px;
    }}

    .timeline-step.done {{
      border-top-color: #10b981;
      background: #f0fdf4;
    }}

    .timeline-step.active {{
      border-top-color: #2563eb;
      background: #eff6ff;
    }}

    .timeline-step.future {{
      border-top-color: #94a3b8;
    }}

    .timeline-step .t-title {{
      font-size: 7pt;
      font-weight: 700;
      color: #0f172a;
    }}

    .timeline-step .t-status {{
      font-size: 6.2pt;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 1px;
    }}

    .timeline-step .t-desc {{
      font-size: 6.6pt;
      color: #475569;
      line-height: 1.22;
    }}

    .test-badge {{
      display: inline-block;
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 6.2pt;
      font-weight: 700;
      text-transform: uppercase;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }}
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page">
    <div class="page-content">
      
      <!-- College Header with Logo -->
      <div class="clg-header">
        <img class="clg-logo" src="{logo_b64}" alt="MITS Gwalior Logo">
        <div class="clg-details">
          <div class="clg-name">Madhav Institute of Technology & Science, Gwalior (M.P.), India</div>
          <div class="clg-sub">(Deemed to be University) • NAAC Accredited with A++ Grade</div>
          <div class="clg-dept">Department of Computer Science & Design • Cornerstone Project (29243110)</div>
        </div>
      </div>

      <!-- Header Banner -->
      <div class="header-banner">
        <div class="title-group">
          <h1>Development of an AI-Enabled Civic Issue Reporting and Resolution Management System</h1>
          <p>Cornerstone Project Milestone 4 Progress & Operational Integration Report</p>
        </div>
        <div class="badge-box">
          <div class="badge-title">Milestone 4 Status</div>
          <div class="badge-value">82% Complete</div>
        </div>
      </div>

      <!-- Metadata Grid -->
      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Team Members</div>
          <div class="meta-val">Udit Sahu (BTCD24O1071)<br>Raj Shrivas (BTCD25O3D03)</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Project Mentor</div>
          <div class="meta-val">Prof. Jigyasa Mishra<br><span style="font-size: 7pt; font-weight: 500; color: #475569;">Assistant Professor, CSD</span></div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Evaluation Stage</div>
          <div class="meta-val">Milestone 4 Review<br><span style="font-size: 7pt; font-weight: 500; color: #475569;">Session: July–Dec 2026</span></div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Code Repository</div>
          <div class="meta-val"><span class="code-tag">main (Commit d0c5cac)</span><br><span style="font-size: 7pt; font-weight: 500; color: #475569;">Date: October 12, 2026</span></div>
        </div>
      </div>

      <!-- Executive Metric KPI Cards -->
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-title">System Integration</div>
          <div class="kpi-val">82%</div>
          <div class="kpi-sub">End-to-end operational flow</div>
        </div>
        <div class="kpi-card green">
          <div class="kpi-title">Backend API Ready</div>
          <div class="kpi-val">88%</div>
          <div class="kpi-sub">22+ verified REST routes</div>
        </div>
        <div class="kpi-card purple">
          <div class="kpi-title">Frontend Workspaces</div>
          <div class="kpi-val">80%</div>
          <div class="kpi-sub">Citizen, Dept & Admin views</div>
        </div>
        <div class="kpi-card amber">
          <div class="kpi-title">Mongoose Models</div>
          <div class="kpi-val">95%</div>
          <div class="kpi-sub">8 Collections & Seeders</div>
        </div>
      </div>

      <!-- 1.0 Executive Summary -->
      <div class="section-head">
        <span class="num-pill">1.0</span>
        <h2>Executive Summary & Problem Statement</h2>
      </div>
      <p class="lead-text">
        Municipal complaint handling mechanisms in urban centers predominantly rely on fragmented walk-in or manual procedures, resulting in delayed prioritization, lack of citizen visibility, unverified closures, and record duplication. The <strong>AI-Enabled Civic Issue Reporting and Resolution Management System</strong> delivers a unified, role-governed web application connecting citizens, departmental response teams (Road Maintenance, Sanitation, Water Works, Street Lighting), and administrative leadership.
        In this <strong>Milestone 4</strong> phase, the platform has completed the core lifecycle: <strong>multi-role authentication & Google OAuth 2.0 with role onboarding</strong>, <strong>automated sequential complaint identification (<span class="code-tag">SC-2026-XXXX</span>)</strong>, <strong>AI-driven heuristic classification & urgency scoring</strong>, <strong>multipart media evidence ingestion</strong>, <strong>department SLA computation</strong>, and <strong>in-app status change notifications</strong>.
      </p>

      <!-- 2.0 System Architecture -->
      <div class="section-head">
        <span class="num-pill">2.0</span>
        <h2>Modular System Architecture</h2>
        <span class="sub-note">Client-Server Microservice Architecture</span>
      </div>

      <div class="arch-flow-box">
        <div class="tier-container">
          <div class="tier-item">
            <div class="tier-name">1. Presentation Tier</div>
            <div class="tier-tech">React 19 • Vite • Tailwind CSS</div>
            <div class="tier-desc">Role-gated dashboards for Citizens, Department Staff, and Admins. Protected routing, session timer & Recharts.</div>
          </div>
          <div class="tier-item">
            <div class="tier-name">2. Application API Tier</div>
            <div class="tier-tech">Node.js • Express • Multer • JWT</div>
            <div class="tier-desc">Stateless REST APIs, role authorization, sequential ID generation (<span class="code-tag">SC-2026-XXXX</span>), and audit logging.</div>
          </div>
          <div class="tier-item">
            <div class="tier-name">3. AI Triage Engine</div>
            <div class="tier-tech">NLP Keywords • Severity Scorer</div>
            <div class="tier-desc">Natural-language category prediction, emergency hazard detection (wires, floods), and discrepancy flags.</div>
          </div>
          <div class="tier-item">
            <div class="tier-name">4. Data Persistence</div>
            <div class="tier-tech">MongoDB Atlas • Mongoose ODM</div>
            <div class="tier-desc">Compound indexed documents for complaints, status timelines, notifications, departments, and seeders.</div>
          </div>
        </div>
      </div>

      <!-- 3.0 Milestone Scope & Target Achievements -->
      <div class="section-head">
        <span class="num-pill">3.0</span>
        <h2>Milestone 4 Accomplishments & Project Scope</h2>
      </div>

      <div class="two-col">
        <div class="box-panel">
          <h3>✅ Key Milestone 4 Accomplishments</h3>
          <ul>
            <li><strong>Dual Auth with Role Gating:</strong> JWT email/password auth plus Google OAuth with interactive role onboarding modal.</li>
            <li><strong>Complaint Lifecycle Pipeline:</strong> Submission → Under Review → Assigned → In Progress → Resolved with citizen rating (1–5★).</li>
            <li><strong>AI Severity & Discrepancy Detection:</strong> Urgency keyword weighting and automatic flagging when citizen category diverges from AI prediction.</li>
            <li><strong>Multipart Proof Ingestion:</strong> Multer upload validating 5MB size limits, JPEG/PNG/WEBP MIME types, and before/after photo proof.</li>
          </ul>
        </div>
        <div class="box-panel">
          <h3>🎯 Final Sprint Deliverables</h3>
          <ul>
            <li><strong>Interactive GIS Hotspot Canvas:</strong> Live MongoDB coordinates rendered to cluster pins on Google Maps / Leaflet.</li>
            <li><strong>Trained Machine Learning Model:</strong> Transitioning from heuristic engine to TF-IDF / Transformer & CNN microservice.</li>
            <li><strong>Aggregated Ward Analytics:</strong> MongoDB aggregation pipeline for monthly resolution curves and ward density distribution.</li>
            <li><strong>Admin User Governance:</strong> Global user control table (<span class="code-tag">/api/users</span>) for account auditing and suspension.</li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="page-footer">
      <div><span class="system-tag">MITS Gwalior • Department of Computer Science & Design</span> • Cornerstone Project Report</div>
      <div>Page 1 of 4</div>
    </div>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    <div class="page-content">

      <!-- 4.0 Module Progress Breakdown -->
      <div class="section-head">
        <span class="num-pill">4.0</span>
        <h2>Comprehensive Module Progress Breakdown</h2>
        <span class="sub-note">Verified against live codebase & test suites</span>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 20px;">#</th>
            <th style="width: 135px;">Module / Subsystem</th>
            <th style="width: 55px;">Backend</th>
            <th style="width: 55px;">Frontend</th>
            <th style="width: 75px;">Overall</th>
            <th style="width: 70px;">Status</th>
            <th>Implementation Details & Codebase Artifacts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td>
            <td><strong>Authentication & RBAC</strong></td>
            <td>95%</td>
            <td>95%</td>
            <td>
              <div class="bar-container"><div class="bar-fill" style="width: 95%;"></div></div>
              <strong>95%</strong>
            </td>
            <td><span class="status-badge status-completed">Completed</span></td>
            <td>JWT stateless auth (<span class="code-tag">citizen</span>, <span class="code-tag">department</span>, <span class="code-tag">admin</span>), Google OAuth token verification, role selection modal, and session timeout handlers.</td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td><strong>Complaint Lifecycle</strong></td>
            <td>92%</td>
            <td>90%</td>
            <td>
              <div class="bar-container"><div class="bar-fill" style="width: 91%;"></div></div>
              <strong>91%</strong>
            </td>
            <td><span class="status-badge status-completed">Completed</span></td>
            <td>Sequential tracking ID generator (<span class="code-tag">SC-2026-XXXX</span>), category auto-router, 5-stage status lifecycle, chronological audit trail, and citizen 1–5★ rating submission.</td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td><strong>AI Triage & Severity Scorer</strong></td>
            <td>85%</td>
            <td>85%</td>
            <td>
              <div class="bar-container"><div class="bar-fill" style="width: 85%;"></div></div>
              <strong>85%</strong>
            </td>
            <td><span class="status-badge status-completed">Completed</span></td>
            <td>Natural-language category prediction, hazard keyword urgency assessment (floods, live wires), and discrepancy flag when citizen input differs from AI prediction.</td>
          </tr>
          <tr>
            <td><strong>4</strong></td>
            <td><strong>Media & Photo Ingestion</strong></td>
            <td>90%</td>
            <td>90%</td>
            <td>
              <div class="bar-container"><div class="bar-fill" style="width: 90%;"></div></div>
              <strong>90%</strong>
            </td>
            <td><span class="status-badge status-completed">Completed</span></td>
            <td>Multer storage engine with 5MB validation, MIME filtering (JPEG/PNG/WEBP), submission attachment previews, and resolution verification photo evidence.</td>
          </tr>
          <tr>
            <td><strong>5</strong></td>
            <td><strong>In-App Notification Hub</strong></td>
            <td>85%</td>
            <td>85%</td>
            <td>
              <div class="bar-container"><div class="bar-fill" style="width: 85%;"></div></div>
              <strong>85%</strong>
            </td>
            <td><span class="status-badge status-completed">Completed</span></td>
            <td>Event-driven triggers on status mutation, real-time unread badge counter, <span class="code-tag">/api/notifications</span> feed, and mark-as-read individual/bulk endpoints.</td>
          </tr>
          <tr>
            <td><strong>6</strong></td>
            <td><strong>Department Operations</strong></td>
            <td>85%</td>
            <td>75%</td>
            <td>
              <div class="bar-container"><div class="bar-fill" style="width: 80%;"></div></div>
              <strong>80%</strong>
            </td>
            <td><span class="status-badge status-completed">Completed</span></td>
            <td>Real-time SLA resolution calculation API, department officer portal, issue inspection modal, and resolution comment logs. Admin reassignment UI integrated.</td>
          </tr>
          <tr>
            <td><strong>7</strong></td>
            <td><strong>GIS Mapping & Hotspots</strong></td>
            <td>65%</td>
            <td>60%</td>
            <td>
              <div class="bar-container"><div class="bar-fill prog" style="width: 62%;"></div></div>
              <strong>62%</strong>
            </td>
            <td><span class="status-badge status-progress">In Progress</span></td>
            <td>Latitude and Longitude schema fields persisted on all complaints; Google Maps / Leaflet component canvas created. Live database geo-pin binding in progress.</td>
          </tr>
          <tr>
            <td><strong>8</strong></td>
            <td><strong>Admin User Governance</strong></td>
            <td>60%</td>
            <td>60%</td>
            <td>
              <div class="bar-container"><div class="bar-fill prog" style="width: 60%;"></div></div>
              <strong>60%</strong>
            </td>
            <td><span class="status-badge status-progress">In Progress</span></td>
            <td>Schemas exist for Citizen, Admin, and Department collections; Frontend tables created. Global <span class="code-tag">/api/users</span> CRUD and suspension toggles in progress.</td>
          </tr>
          <tr>
            <td><strong>9</strong></td>
            <td><strong>Analytics & Ward Metrics</strong></td>
            <td>60%</td>
            <td>55%</td>
            <td>
              <div class="bar-container"><div class="bar-fill prog" style="width: 58%;"></div></div>
              <strong>58%</strong>
            </td>
            <td><span class="status-badge status-progress">In Progress</span></td>
            <td>High-level KPI statistics endpoint active (<span class="code-tag">/api/complaints/stats</span>); Recharts visual templates designed. MongoDB aggregation pipelines for ward trends in progress.</td>
          </tr>
        </tbody>
      </table>

      <!-- 5.0 Core Technical Implementations Completed in Milestone 4 -->
      <div class="section-head">
        <span class="num-pill">5.0</span>
        <h2>Core Technical Capabilities Implemented in Milestone 4</h2>
      </div>

      <div class="two-col">
        <div class="feature-card">
          <div class="feat-title">
            <span>1. Auto-Sequenced Complaint Lifecycle</span>
            <span class="code-tag">complaintController.js</span>
          </div>
          <div class="feat-desc">
            Issues filed through the API are assigned atomic, human-readable IDs formatted as <span class="code-tag">SC-YYYY-XXXX</span>. The system parses issue categories (e.g., Pothole, Water Leakage, Garbage) and automatically assigns jurisdiction to the responsible municipal department. Each state update generates an immutable timeline entry recording timestamp, actor, status delta, and remarks.
          </div>
        </div>

        <div class="feature-card">
          <div class="feat-title">
            <span>2. Dual Authentication with Role Onboarding</span>
            <span class="code-tag">authController.js</span>
          </div>
          <div class="feat-desc">
            The platform provides standard JWT-based email/password authentication backed by bcrypt hashing alongside Google OAuth 2.0. Users authenticating via Google OAuth are routed through a dedicated onboarding modal (<span class="code-tag">GoogleRoleModal.jsx</span>) enabling explicit selection between Citizen, Department Officer, or Administrator privileges before session token creation.
          </div>
        </div>

        <div class="feature-card">
          <div class="feat-title">
            <span>3. AI Classification & Discrepancy Detection</span>
            <span class="code-tag">NLP Urgency Engine</span>
          </div>
          <div class="feat-desc">
            Evaluates complaint natural-language text against category lexicons and hazard keywords (e.g., exposed wires, severe flooding near schools). Computes priority levels (Low, Medium, High, Critical). If citizen manual selection conflicts with AI prediction, the discrepancy is automatically flagged for administrative review.
          </div>
        </div>

        <div class="feature-card">
          <div class="feat-title">
            <span>4. Evidence Ingestion & Inspection Flow</span>
            <span class="code-tag">uploadMiddleware.js</span>
          </div>
          <div class="feat-desc">
            Implemented a robust file upload middleware powered by Multer with strict disk storage limits (5MB) and MIME-type filtering. Supports initial citizen photo submission during complaint creation as well as post-resolution proof photo attachments uploaded by municipal officers during the closure transition.
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="page-footer">
      <div><span class="system-tag">MITS Gwalior • Department of Computer Science & Design</span> • Cornerstone Project Report</div>
      <div>Page 2 of 4</div>
    </div>
  </div>

  <!-- ==================== PAGE 3 ==================== -->
  <div class="page">
    <div class="page-content">

      <!-- 6.0 REST API Service Catalog -->
      <div class="section-head">
        <span class="num-pill">6.0</span>
        <h2>Operational REST API Endpoint Inventory</h2>
        <span class="sub-note">22+ Endpoints Active, Authenticated & Verified</span>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 45px;">Method</th>
            <th style="width: 165px;">Route Path</th>
            <th style="width: 70px;">Access Level</th>
            <th>Functional Purpose & Response Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="method-badge m-post">POST</span></td>
            <td><span class="code-tag">/api/auth/register</span></td>
            <td>Public</td>
            <td>Registers new user account with hashed password and role assignment.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-post">POST</span></td>
            <td><span class="code-tag">/api/auth/login</span></td>
            <td>Public</td>
            <td>Authenticates user credentials and returns signed JWT access token.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-post">POST</span></td>
            <td><span class="code-tag">/api/auth/google</span></td>
            <td>Public</td>
            <td>Verifies Google OAuth ID token and binds user profile with role onboarding.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-get">GET</span></td>
            <td><span class="code-tag">/api/auth/me</span></td>
            <td>Authenticated</td>
            <td>Fetches current authenticated profile from User, Citizen, or Department schema.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-get">GET</span></td>
            <td><span class="code-tag">/api/complaints</span></td>
            <td>Role-Scoped</td>
            <td>Paginated complaint registry filtered automatically by user role and department.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-post">POST</span></td>
            <td><span class="code-tag">/api/complaints</span></td>
            <td>Citizen</td>
            <td>Ingests new complaint with location, category, and optional Multer photo upload.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-get">GET</span></td>
            <td><span class="code-tag">/api/complaints/my</span></td>
            <td>Citizen</td>
            <td>Returns complaint history filed by the logged-in citizen with status breakdown.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-get">GET</span></td>
            <td><span class="code-tag">/api/complaints/stats</span></td>
            <td>Authenticated</td>
            <td>Computes live aggregated metrics: total, pending, in-progress, resolved, and SLA %.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-get">GET</span></td>
            <td><span class="code-tag">/api/complaints/:id</span></td>
            <td>Authenticated</td>
            <td>Retrieves complete complaint entity including audit trail and feedback details.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-put">PUT</span></td>
            <td><span class="code-tag">/api/complaints/:id/status</span></td>
            <td>Dept / Admin</td>
            <td>Updates status pipeline with remarks and resolution verification photo evidence.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-put">PUT</span></td>
            <td><span class="code-tag">/api/complaints/:id/assign</span></td>
            <td>Admin Only</td>
            <td>Reassigns complaint to a different municipal department with audit entry.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-post">POST</span></td>
            <td><span class="code-tag">/api/complaints/:id/feedback</span></td>
            <td>Citizen</td>
            <td>Records citizen resolution satisfaction rating (1–5 stars) and review comments.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-get">GET</span></td>
            <td><span class="code-tag">/api/departments</span></td>
            <td>Authenticated</td>
            <td>Lists municipal departments along with dynamic real-time resolution metrics.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-get">GET</span></td>
            <td><span class="code-tag">/api/notifications</span></td>
            <td>Authenticated</td>
            <td>Retrieves chronologically sorted in-app alert notifications for current user.</td>
          </tr>
          <tr>
            <td><span class="method-badge m-put">PUT</span></td>
            <td><span class="code-tag">/api/notifications/read-all</span></td>
            <td>Authenticated</td>
            <td>Updates all unread notifications for active user to read status simultaneously.</td>
          </tr>
        </tbody>
      </table>

      <!-- 7.0 Error Handling & Edge-Case Safeguards -->
      <div class="section-head">
        <span class="num-pill">7.0</span>
        <h2>Edge-Case Hardening & Failure Recovery Mechanisms</h2>
        <span class="sub-note">Fault-Tolerant System Engineering</span>
      </div>

      <div class="three-col">
        <div class="box-panel">
          <h3>⚡ AI Engine Downtime</h3>
          <p style="font-size: 6.9pt; color: #475569;">If classification microservice times out, the submission is saved with manual category and flagged as <span class="code-tag">pending_classification</span>. A background retry job triages without blocking the citizen.</p>
        </div>
        <div class="box-panel">
          <h3>📍 Missing Location Access</h3>
          <p style="font-size: 6.9pt; color: #475569;">If browser GPS is blocked, system avoids corrupting database with dummy (0,0) coordinates. Accepts manual address while keeping coordinates null to protect duplicate geo-clustering.</p>
        </div>
        <div class="box-panel">
          <h3>🔄 Rapid Double-Submission</h3>
          <p style="font-size: 6.9pt; color: #475569;">Debounce guards and client-side lockouts detect rapid duplicate button taps, binding the user to the existing registered ticket instead of inserting duplicate database records.</p>
        </div>
      </div>

      <!-- 8.0 Database Architecture -->
      <div class="section-head">
        <span class="num-pill">8.0</span>
        <h2>Database Architecture & Schema Collections</h2>
        <span class="sub-note">MongoDB / Mongoose ODM Schemas</span>
      </div>

      <div class="two-col">
        <div class="box-panel">
          <h3>📦 Complaint Entity Schema</h3>
          <ul style="font-size: 7pt;">
            <li><span class="code-tag">complaintId</span>: Unique sequential string (<span class="code-tag">SC-2026-0001</span>).</li>
            <li><span class="code-tag">title, description, category</span>: Indexed civic descriptors.</li>
            <li><span class="code-tag">status</span>: Enum [<span class="code-tag">Submitted</span>, <span class="code-tag">Under Review</span>, <span class="code-tag">Assigned</span>, <span class="code-tag">In Progress</span>, <span class="code-tag">Resolved</span>, <span class="code-tag">Closed</span>].</li>
            <li><span class="code-tag">location</span>: Ward, address, and GeoJSON coordinates (<span class="code-tag">lat/lng</span>).</li>
            <li><span class="code-tag">images, resolutionImages</span>: Paths to verified evidence files.</li>
            <li><span class="code-tag">timeline[]</span>: Chronological audit transitions with actors and remarks.</li>
            <li><span class="code-tag">feedback</span>: Rating (1-5★), review text, and citizen submission date.</li>
          </ul>
        </div>

        <div class="box-panel">
          <h3>👥 Supporting Collections & Relations</h3>
          <ul style="font-size: 7pt;">
            <li><span class="code-tag">User</span>: Base identity with email, bcrypt password hash, and role type.</li>
            <li><span class="code-tag">Citizen</span>: Profile extended with ward, phone number, address, and history.</li>
            <li><span class="code-tag">Department</span>: Name, department code, nodal officer, and SLA targets.</li>
            <li><span class="code-tag">Notification</span>: Recipient reference, complaint link, unread boolean flag.</li>
            <li><span class="code-tag">Setting & SupportTicket</span>: Configuration baselines and helpdesk tickets.</li>
            <li><span class="code-tag">seed.js</span>: Automated database initialization for test and demo data.</li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="page-footer">
      <div><span class="system-tag">MITS Gwalior • Department of Computer Science & Design</span> • Cornerstone Project Report</div>
      <div>Page 3 of 4</div>
    </div>
  </div>

  <!-- ==================== PAGE 4 ==================== -->
  <div class="page">
    <div class="page-content">

      <!-- 9.0 Milestone Schedule & Phased Implementation Timeline -->
      <div class="section-head">
        <span class="num-pill">9.0</span>
        <h2>Milestone Schedule & Phased Implementation Timeline</h2>
        <span class="sub-note">Milestone 4: Operational Integration Phase</span>
      </div>

      <div class="timeline-strip">
        <div class="timeline-step done">
          <div class="t-status" style="color: #15803d;">Milestone 1: Complete</div>
          <div class="t-title">Architecture & Models</div>
          <div class="t-desc">Mongoose schemas, Express base routing, and modular architecture.</div>
        </div>
        <div class="timeline-step done">
          <div class="t-status" style="color: #15803d;">Milestone 2: Complete</div>
          <div class="t-title">Authentication & Security</div>
          <div class="t-desc">JWT verification, Google OAuth 2.0 onboarding modal, and RBAC.</div>
        </div>
        <div class="timeline-step done">
          <div class="t-status" style="color: #15803d;">Milestone 3: Complete</div>
          <div class="t-title">Lifecycle & Media</div>
          <div class="t-desc">Complaint auto-IDs, Multer storage, and status notification hub.</div>
        </div>
        <div class="timeline-step active">
          <div class="t-status" style="color: #2563eb;">Milestone 4: Current</div>
          <div class="t-title">Department & Workflows</div>
          <div class="t-desc">SLA metrics, status modals, feedback ratings, and integration testing.</div>
        </div>
      </div>

      <!-- 10.0 Milestone 4 Technical Verification & Testing Matrix -->
      <div class="section-head">
        <span class="num-pill">10.0</span>
        <h2>Milestone 4 Quality Assurance & Verification Matrix</h2>
        <span class="sub-note">Verified through automated and manual test routines</span>
      </div>

      <table class="data-table" style="margin-top: 3px; margin-bottom: 6px;">
        <thead>
          <tr>
            <th style="width: 130px;">Subsystem Test Scope</th>
            <th style="width: 75px;">Verification Result</th>
            <th>Observed Behavior & Test Assessment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Authentication & RBAC</strong></td>
            <td><span class="test-badge">Passed (100%)</span></td>
            <td>Token validation checks enforce route isolation. Google OAuth role modal cleanly assigns Citizen/Dept/Admin credentials.</td>
          </tr>
          <tr>
            <td><strong>Complaint Ingestion & ID</strong></td>
            <td><span class="test-badge">Passed (100%)</span></td>
            <td>Sequential IDs (<span class="code-tag">SC-2026-XXXX</span>) generate deterministically without collisions. Automatic department category mapping verified.</td>
          </tr>
          <tr>
            <td><strong>Multer Media Ingestion</strong></td>
            <td><span class="test-badge">Passed (100%)</span></td>
            <td>Files exceeding 5MB or non-image MIME types are rejected with clean 400 error codes. Valid images persist to <span class="code-tag">/uploads</span>.</td>
          </tr>
          <tr>
            <td><strong>Notification Dispatcher</strong></td>
            <td><span class="test-badge">Passed (100%)</span></td>
            <td>Status changes trigger asynchronous notification documents. Unread badge reflects active count and toggles upon bulk read.</td>
          </tr>
          <tr>
            <td><strong>Department SLA Calculation</strong></td>
            <td><span class="test-badge">Passed (100%)</span></td>
            <td>Dynamic resolution percentage and active complaint breakdown computed accurately across all municipal departments.</td>
          </tr>
        </tbody>
      </table>

      <!-- 11.0 ML Model Transition & Dataset Baseline Evaluation Plan -->
      <div class="section-head">
        <span class="num-pill">11.0</span>
        <h2>Machine Learning Transition & Dataset Baseline Plan</h2>
        <span class="sub-note">Roadmap for Heuristic-to-Trained Model Evolution</span>
      </div>

      <table class="data-table" style="margin-top: 3px; margin-bottom: 6px;">
        <thead>
          <tr>
            <th style="width: 50px;">ML Phase</th>
            <th style="width: 220px;">Target Objective & Technical Activity</th>
            <th style="width: 80px;">Duration</th>
            <th>Success Benchmark Metric</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Phase 1</strong></td>
            <td>Curate and label evaluation dataset (350+ examples, 50 per category); compute baseline accuracy of heuristic engine.</td>
            <td>2 Weeks</td>
            <td>Ground-truth labeled test split across 7 civic categories.</td>
          </tr>
          <tr>
            <td><strong>Phase 2</strong></td>
            <td>Feature engineering & model exploration (TF-IDF + Classical ML vs Lightweight Transformer text classifier + MobileNet CNN for photos).</td>
            <td>2 Weeks</td>
            <td>Category Accuracy & Severity Score within ±1 level tolerance.</td>
          </tr>
          <tr>
            <td><strong>Phase 3</strong></td>
            <td>Model training, validation, and head-to-head comparison against rule-based baseline on held-out split.</td>
            <td>2 Weeks</td>
            <td>Trained model exceeds heuristic baseline by >15% accuracy.</td>
          </tr>
          <tr>
            <td><strong>Phase 4</strong></td>
            <td>Staged FastAPI microservice deployment behind feature flag with rule-based engine retained as fallback.</td>
            <td>1 Week</td>
            <td>Zero-downtime inference with fallback latency <200ms.</td>
          </tr>
        </tbody>
      </table>

      <!-- 12.0 Final Phase Deliverables & Architectural Safeguards -->
      <div class="section-head">
        <span class="num-pill">12.0</span>
        <h2>Final Phase Deliverables & Technical Risk Mitigations</h2>
      </div>

      <div class="two-col" style="margin-top: 3px;">
        <div class="box-panel">
          <h3>📌 Deliverables for Final Submission</h3>
          <ul>
            <li><strong>Interactive GIS Map:</strong> Bind live MongoDB complaint coordinates into <span class="code-tag">ComplaintMap.jsx</span> with cluster pins and department filters.</li>
            <li><strong>AI Duplicate Detection Service:</strong> Fast-API Python microservice using vector embeddings to flag duplicate civic complaints.</li>
            <li><strong>Admin User Governance:</strong> Global user control table (<span class="code-tag">/api/users</span>) to inspect, suspend, or update roles.</li>
            <li><strong>Ward Analytics Aggregation:</strong> MongoDB pipeline generating monthly resolution charts and ward-level issue distribution.</li>
          </ul>
        </div>
        <div class="box-panel">
          <h3>🛡️ Technical Risks & Architectural Mitigations</h3>
          <ul>
            <li><strong>Risk: Spatial Query Latency on Map Pins</strong><br>
            <em>Mitigation:</em> 2dsphere indexing on MongoDB coordinates combined with viewport bounding-box query limits.</li>
            <li><strong>Risk: High Volume Submission Collisions</strong><br>
            <em>Mitigation:</em> Atomic counter sequences and optimistic retry handlers guarantee ID uniqueness.</li>
            <li><strong>Risk: Storage Overhead from Proof Photos</strong><br>
            <em>Mitigation:</em> Strict 5MB Multer caps with sharp image optimization pipeline scheduled before cloud backup.</li>
            <li><strong>Risk: Unhandled Client Token Expiration</strong><br>
            <em>Mitigation:</em> Centralized Axios/Fetch interceptor triggers automated logout and session modal prompt.</li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="page-footer">
      <div><span class="system-tag">MITS Gwalior • Department of Computer Science & Design</span> • Cornerstone Project Report</div>
      <div>Page 4 of 4</div>
    </div>
  </div>

</body>
</html>
"""

html_path = r'c:\Users\udits\smart-civic-complaint-system\milestone_report_template.html'
pdf_path = r'c:\Users\udits\smart-civic-complaint-system\Milestone_Progress_Report_Smart_Civic_System.pdf'

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print('Wrote HTML template.')

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
args = [
    edge_path,
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={pdf_path}',
    html_path
]

res = subprocess.run(args, capture_output=True, text=True)
print('Edge exit code:', res.returncode)

if os.path.exists(pdf_path):
    print(f'PDF generated successfully ({os.path.getsize(pdf_path)} bytes).')
    
    # Copy to Desktop & Downloads
    desktop = os.path.join(os.path.expanduser('~'), 'OneDrive', 'Desktop')
    if not os.path.exists(desktop):
        desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
    
    downloads = os.path.join(os.path.expanduser('~'), 'Downloads')
    
    if os.path.exists(desktop):
        shutil.copy2(pdf_path, os.path.join(desktop, 'Milestone_Progress_Report_Smart_Civic_System.pdf'))
        print('Copied to Desktop.')
    if os.path.exists(downloads):
        shutil.copy2(pdf_path, os.path.join(downloads, 'Milestone_Progress_Report_Smart_Civic_System.pdf'))
        print('Copied to Downloads.')
else:
    print('Failed to generate PDF.')
