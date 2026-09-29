// CityPulse Urban AI - Command Center Dashboard Overview
const DashboardOverview = {
  render(state) {
    const stats = state.stats || {};

    return `
      <div class="space-y-6">
        <!-- Quick Evaluator Scenario Action Bar -->
        <div class="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-3 border-l-4 border-l-cyan-500">
          <div class="flex items-center space-x-3">
            <span class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
              ⚡
            </span>
            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                Evaluator Quick Scenarios
                <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code font-normal">SIH 2026</span>
              </h3>
              <p class="text-xs text-gray-400">Trigger live fleet detections and test the 3 differentiators with 1-click:</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button 
              onclick="DemoControls.trigger('step1_detect')" 
              class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition"
            >
              1. Detect Pothole (BUS-01)
            </button>
            <button 
              onclick="DemoControls.trigger('step2_dedup')" 
              class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
            >
              2. Route Deduplication
            </button>
            <button 
              onclick="DemoControls.trigger('step4_repaired')" 
              class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition"
            >
              3. Mark Repaired
            </button>
            <button 
              onclick="DemoControls.trigger('step5_verify_success')" 
              class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
            >
              4. Verify via AI Re-Scan
            </button>
            <button 
              onclick="window.store.setActiveTab('demo-panel')" 
              class="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium border border-gray-700 transition"
            >
              All Scenarios →
            </button>
          </div>
        </div>

        <!-- High-Impact KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Card 1: Active Sensing Fleet -->
          <div class="glass-panel p-4 relative overflow-hidden group hover:border-cyan-500/50 transition">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-400">Active Sensing Fleet</span>
              <span class="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </span>
            </div>
            <div class="mt-2 flex items-baseline justify-between">
              <div class="text-2xl font-extrabold text-white font-mono-code">${stats.active_buses || 20} <span class="text-xs font-normal text-gray-400">/ 20</span></div>
              <span class="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 100% ONLINE
              </span>
            </div>
            <div class="text-[11px] text-gray-500 mt-1">Covering ${stats.fleet_coverage_km || 348.5} km road network</div>
          </div>

          <!-- Card 2: Bandwidth Saved (Differentiator 2) -->
          <div class="glass-panel diff-badge-2 p-4 relative overflow-hidden group hover:border-blue-500/60 transition">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-blue-300">Bandwidth Optimized</span>
              <span class="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </span>
            </div>
            <div class="mt-2 flex items-baseline justify-between">
              <div class="text-2xl font-extrabold text-blue-400 font-mono-code">${stats.bandwidth_saved_pct || 89.6}%</div>
              <span class="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                ${stats.total_bandwidth_saved_mb || 44.8} MB saved
              </span>
            </div>
            <div class="text-[11px] text-gray-400 mt-1">Route cache suppressed 92 redundant uploads</div>
          </div>

          <!-- Card 3: AI Repairs Verified (Differentiator 1) -->
          <div class="glass-panel diff-badge-1 p-4 relative overflow-hidden group hover:border-emerald-500/60 transition">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-emerald-300">Repairs Auto-Verified</span>
              <span class="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </span>
            </div>
            <div class="mt-2 flex items-baseline justify-between">
              <div class="text-2xl font-extrabold text-emerald-400 font-mono-code">${stats.repairs_verified || 15} <span class="text-xs font-normal text-gray-400">verified</span></div>
              <span class="text-xs font-semibold text-amber-400">${stats.repairs_pending || 23} pending</span>
            </div>
            <div class="text-[11px] text-gray-400 mt-1">Autonomous fleet re-scan closed-loop</div>
          </div>

          <!-- Card 4: Road Health & Defects -->
          <div class="glass-panel p-4 relative overflow-hidden group hover:border-rose-500/50 transition">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-400">Active Road Defects</span>
              <span class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </span>
            </div>
            <div class="mt-2 flex items-baseline justify-between">
              <div class="text-2xl font-extrabold text-rose-400 font-mono-code">${stats.active_road_defects || 38}</div>
              <span class="text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                ${stats.critical_events || 14} Critical
              </span>
            </div>
            <div class="text-[11px] text-gray-500 mt-1">Potholes, cracks & waterlogging</div>
          </div>
        </div>

        <!-- 3 Differentiators Spotlight Showcase -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Spotlight 1: Post-Repair AI Verification -->
          <div class="glass-panel p-5 flex flex-col justify-between space-y-4 border-t-2 border-t-emerald-500">
            <div>
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Differentiator 1
                </span>
                <span class="text-xs text-gray-400">Closed-Loop Verification</span>
              </div>
              <h4 class="text-base font-bold text-white mt-2">Automatic Post-Repair Verification</h4>
              <p class="text-xs text-gray-300 mt-1">
                Eliminates fake/incomplete contractor repair claims. When municipal authorities mark repairs complete, subsequent buses autonomously re-scan the GPS location.
              </p>

              <!-- Mini Lifecycle diagram -->
              <div class="mt-4 p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-[11px] font-mono-code space-y-1.5">
                <div class="flex items-center justify-between text-gray-400">
                  <span>DETECTED</span>
                  <span>→</span>
                  <span class="text-amber-400 font-semibold">REPAIRED</span>
                  <span>→</span>
                  <span class="text-cyan-400 font-semibold">RE-SCANNED</span>
                  <span>→</span>
                  <span class="text-emerald-400 font-bold">VERIFIED</span>
                </div>
                <div class="w-full bg-gray-800 rounded-full h-1.5">
                  <div class="bg-gradient-to-r from-cyan-500 to-emerald-500 h-1.5 rounded-full" style="width: 85%"></div>
                </div>
              </div>
            </div>

            <div class="pt-2">
              <button 
                onclick="window.store.setActiveTab('diff-repair')" 
                class="w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <span>Launch Post-Repair Workbench</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Spotlight 2: Route-Aware Deduplication & Bandwidth -->
          <div class="glass-panel p-5 flex flex-col justify-between space-y-4 border-t-2 border-t-blue-500">
            <div>
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Differentiator 2
                </span>
                <span class="text-xs text-gray-400">Bandwidth Optimization</span>
              </div>
              <h4 class="text-base font-bold text-white mt-2">Route-Aware Event Deduplication</h4>
              <p class="text-xs text-gray-300 mt-1">
                Buses maintain a route-specific active event cache. Repeated detections transmit only 1 KB lightweight telemetry instead of 5 MB redundant evidence.
              </p>

              <!-- Visual Comparison Bars -->
              <div class="mt-4 space-y-2 text-xs">
                <div>
                  <div class="flex justify-between text-[11px] text-gray-400 mb-0.5">
                    <span>Traditional System (No Cache)</span>
                    <span class="text-rose-400 font-mono-code font-bold">50.0 MB</span>
                  </div>
                  <div class="w-full bg-gray-800 rounded-full h-2">
                    <div class="bg-rose-500 h-2 rounded-full" style="width: 100%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-[11px] text-gray-400 mb-0.5">
                    <span>CityPulse Route Cache</span>
                    <span class="text-cyan-400 font-mono-code font-bold">5.2 MB (89.6% Saved)</span>
                  </div>
                  <div class="w-full bg-gray-800 rounded-full h-2">
                    <div class="bg-cyan-400 h-2 rounded-full" style="width: 10.4%"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-2">
              <button 
                onclick="window.store.setActiveTab('diff-bandwidth')" 
                class="w-full py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <span>Open Bandwidth Analytics</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Spotlight 3: Causality and Evolution Engine -->
          <div class="glass-panel p-5 flex flex-col justify-between space-y-4 border-t-2 border-t-amber-500">
            <div>
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Differentiator 3
                </span>
                <span class="text-xs text-gray-400">Urban Intelligence</span>
              </div>
              <h4 class="text-base font-bold text-white mt-2">Event Causality & Evolution Engine</h4>
              <p class="text-xs text-gray-300 mt-1">
                Connects root causes (e.g. Heavy Rain) to road conditions, vehicle density spikes, and bus delays, tracking structural degradation over days.
              </p>

              <!-- Causality Flow Pill -->
              <div class="mt-4 p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-[11px] space-y-1">
                <div class="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <span>🌧️ Heavy Rain</span>
                  <span>→</span>
                  <span>🌊 Waterlogging</span>
                  <span>→</span>
                  <span>🚗 Delay +14m</span>
                </div>
                <div class="text-[10px] text-gray-400">Affected Routes: 21G, 21A, 5C (Speed -31%)</div>
              </div>
            </div>

            <div class="pt-2">
              <button 
                onclick="window.store.setActiveTab('diff-causality')" 
                class="w-full py-2 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <span>Inspect Causality Chains</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Live GIS Map Preview & Recent High-Priority Events Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Live GIS Quick Access -->
          <div class="lg:col-span-2 glass-panel p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 pulse-dot"></span>
                  Live Fleet GIS Map
                </h3>
                <p class="text-xs text-gray-400">20 Buses continuously sensing Chennai road network</p>
              </div>
              <button 
                onclick="window.store.setActiveTab('gis-map')" 
                class="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                Full Screen Map →
              </button>
            </div>

            <div class="h-64 rounded-xl bg-gray-950/90 border border-gray-800 relative overflow-hidden flex items-center justify-center group cursor-pointer" onclick="window.store.setActiveTab('gis-map')">
              <div class="absolute inset-0 opacity-40 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <!-- Simulated Bus Nodes -->
              <div class="absolute top-1/4 left-1/3 flex items-center space-x-1.5 animate-bounce">
                <span class="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400"></span>
                <span class="px-1.5 py-0.5 rounded bg-gray-900/90 text-cyan-300 text-[10px] font-mono-code font-bold border border-cyan-500/40">BUS-01 (21G)</span>
              </div>
              <div class="absolute top-2/3 right-1/4 flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400"></span>
                <span class="px-1.5 py-0.5 rounded bg-gray-900/90 text-blue-300 text-[10px] font-mono-code font-bold border border-blue-500/40">BUS-05 (19B)</span>
              </div>
              <div class="absolute bottom-1/4 left-1/2 flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400"></span>
                <span class="px-1.5 py-0.5 rounded bg-gray-900/90 text-emerald-300 text-[10px] font-mono-code font-bold border border-emerald-500/40">BUS-15 (570)</span>
              </div>

              <!-- Center Banner -->
              <div class="z-10 text-center p-4 rounded-xl bg-gray-900/80 backdrop-blur border border-gray-700/80 shadow-2xl">
                <svg class="w-8 h-8 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div class="text-sm font-bold text-white">Interactive GIS Map Engine</div>
                <p class="text-xs text-gray-400 mt-0.5">Click to view real-time GPS coordinates, route trails & defect pins</p>
              </div>
            </div>
          </div>

          <!-- Right: Live Detected Events Ticker -->
          <div class="glass-panel p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-rose-500 pulse-dot"></span>
                  Recent Edge Detections
                </h3>
                <span class="text-[11px] text-gray-500 font-mono-code">Live Stream</span>
              </div>

              <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                <!-- Event Item 1 -->
                <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800/80 hover:border-gray-700 transition space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white font-mono-code">PTH-001 • Severe Pothole</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">High Severity</span>
                  </div>
                  <div class="text-[11px] text-gray-400 flex items-center justify-between">
                    <span>Anna Salai, Guindy</span>
                    <span class="text-cyan-400 font-mono-code font-semibold">4 Bus Obs (98%)</span>
                  </div>
                </div>

                <!-- Event Item 2 -->
                <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800/80 hover:border-gray-700 transition space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white font-mono-code">WATER-003 • Waterlogging</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Depth 15cm</span>
                  </div>
                  <div class="text-[11px] text-gray-400 flex items-center justify-between">
                    <span>OMR - Thoraipakkam</span>
                    <span class="text-cyan-400 font-mono-code font-semibold">BUS-05, BUS-09</span>
                  </div>
                </div>

                <!-- Event Item 3 -->
                <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800/80 hover:border-gray-700 transition space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-white font-mono-code">ZEB-014 • Missing Zebra Crossing</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Faded 85%</span>
                  </div>
                  <div class="text-[11px] text-gray-400 flex items-center justify-between">
                    <span>T. Nagar Panagal Park</span>
                    <span class="text-cyan-400 font-mono-code font-semibold">BUS-03 (94%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-800">
              <button 
                onclick="window.store.setActiveTab('infrastructure')" 
                class="w-full py-1.5 text-center text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View All 108 Urban Events →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

window.DashboardOverview = DashboardOverview;
