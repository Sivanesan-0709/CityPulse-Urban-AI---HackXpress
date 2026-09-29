// CityPulse Urban AI - Sidebar Navigation Component
const Sidebar = {
  render(state) {
    const active = state.activeTab || 'dashboard';

    const navSections = [
      {
        title: "COMMUTER MOBILITY (LIVE ENGINE)",
        highlight: true,
        items: [
          { id: "commuter-app", label: "Commuter App View", icon: "smartphone", badge: "Mobile UI", badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
          { id: "mobility-dashboard", label: "Authority Mobility Data", icon: "activity", badge: "Authority", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
          { id: "why-hidden", label: "Why Hidden? Panel", icon: "help-circle", badge: "AI Filter", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
          { id: "headway-dash", label: "Fleet Headway & Bunching", icon: "rss", badge: "Alerts", badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
          { id: "dashcam-upload", label: "Dashcam Road Intelligence", icon: "video", badge: "Road AI", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
          { id: "models-panel", label: "Pretrained Model Registry", icon: "cpu", badge: "3 Models", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
        ]
      },
      {
        title: "CORE OPERATIONS",
        items: [
          { id: "dashboard", label: "Command Center", icon: "layout-dashboard", badge: null },
          { id: "gis-map", label: "Live GIS Map", icon: "map-pin", badge: "Live" },
          { id: "fleet", label: "Bus Fleet (20)", icon: "bus", badge: "20 Active" },
          { id: "edge-ai", label: "Edge AI Simulator", icon: "scan", badge: "5 Cams" },
        ]
      },
      {
        title: "CORE DIFFERENTIATORS (SIH)",
        highlight: true,
        items: [
          { id: "diff-repair", label: "Post-Repair Verification", icon: "check-circle-2", badge: "Diff 1", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
          { id: "diff-bandwidth", label: "Route Deduplication", icon: "zap", badge: "Diff 2", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
          { id: "diff-causality", label: "Causality & Evolution", icon: "git-merge", badge: "Diff 3", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
        ]
      },
      {
        title: "URBAN INTELLIGENCE",
        items: [
          { id: "road-conditions", label: "Road Health Index", icon: "activity", badge: null },
          { id: "traffic", label: "Traffic Congestion", icon: "gauge", badge: "9 Zones" },
          { id: "safety", label: "Road Safety Analytics", icon: "shield-alert", badge: null },
          { id: "infrastructure", label: "Infra Deficiencies", icon: "alert-triangle", badge: "38 Open" },
          { id: "incidents", label: "Incident / ANPR Logs", icon: "camera", badge: "4 New" },
          { id: "repairs", label: "Repair Work Orders", icon: "wrench", badge: "23 Pending" },
          { id: "alerts", label: "Alert Dispatch Center", icon: "bell", badge: "14 Crit", badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
        ]
      },
      {
        title: "EVALUATOR TOOLS",
        items: [
          { id: "demo-health", label: "Demo Health & System Check", icon: "activity", badge: "Green/Red", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
          { id: "demo-panel", label: "Demo Scenario Controls", icon: "sliders", badge: "Interactive", badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" }
        ]
      }
    ];

    // Icons SVG mapping for standalone rendering
    const getSvg = (iconName) => {
      const svgs = {
        "smartphone": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>`,
        "help-circle": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
        "rss": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"/>`,
        "video": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>`,
        "cpu": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>`,

        "layout-dashboard": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>`,
        "map-pin": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>`,
        "bus": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-3h.01M16 18h.01"/>`,
        "scan": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4v8zM4 8V4a2 2 0 012-2h4v8H4zm0 8v4a2 2 0 002 2h4v-8H4z"/>`,
        "check-circle-2": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
        "zap": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
        "git-merge": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1m0 8a2 2 0 002 2h1m8 0a2 2 0 002-2v-1m0-8a2 2 0 00-2-2h-1"/>`,
        "activity": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>`,
        "gauge": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
        "shield-alert": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>`,
        "alert-triangle": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>`,
        "camera": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>`,
        "wrench": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>`,
        "bell": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>`,
        "sliders": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>`
      };
      return svgs[iconName] || svgs["layout-dashboard"];
    };

    let html = `<nav class="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 flex flex-col py-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-61px)] relative z-30 select-none">`;

    navSections.forEach(section => {
      html += `
        <div>
          <div class="px-3 mb-2 flex items-center justify-between">
            <span class="text-[10px] font-bold tracking-wider uppercase ${section.highlight ? 'text-cyan-400' : 'text-gray-500'}">
              ${section.title}
            </span>
            ${section.highlight ? `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>` : ''}
          </div>
          <div class="space-y-1">
      `;

      section.items.forEach(item => {
        const isActive = active === item.id;
        const activeClass = isActive 
          ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-inner' 
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 font-medium';

        html += `
          <button 
            onclick="window.store.setActiveTab('${item.id}')"
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors duration-150 cursor-pointer ${activeClass}"
          >
            <div class="flex items-center space-x-2.5">
              <svg class="w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${getSvg(item.icon)}
              </svg>
              <span class="truncate">${item.label}</span>
            </div>
            ${item.badge ? `
              <span class="px-1.5 py-0.5 text-[10px] font-semibold rounded border ${item.badgeColor || 'bg-gray-800 text-gray-300 border-gray-700'}">
                ${item.badge}
              </span>
            ` : ''}
          </button>
        `;
      });

      html += `</div></div>`;
    });

    html += `
      <div class="mt-auto pt-4 border-t border-gray-800 px-3">
        <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800">
          <div class="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>Edge Fleet AI</span>
            <span class="text-emerald-400 font-semibold">ONLINE (100%)</span>
          </div>
          <div class="w-full bg-gray-800 rounded-full h-1.5">
            <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 100%"></div>
          </div>
        </div>
      </div>
    </nav>`;

    return html;
  }
};

window.Sidebar = Sidebar;
