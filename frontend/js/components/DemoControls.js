// CityPulse Urban AI - Demo Controls & Evaluator Scenarios
const DemoControls = {
  render(state) {
    const scenarioLog = state.scenarioLog || [];

    return `
      <div class="space-y-6">
        <!-- Top Banner -->
        <div class="glass-panel-glow p-6 rounded-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/40">
                  SIH 2026 Evaluator Console
                </span>
                <span class="text-xs text-gray-400">Interactive Simulation Engine</span>
              </div>
              <h2 class="text-2xl font-extrabold text-white mt-1">Live Scenario & Differentiator Demonstrator</h2>
              <p class="text-sm text-gray-300 max-w-3xl mt-1">
                Execute end-to-end urban sensing workflows with 1-click triggers. Test our 3 key differentiators: 
                <strong class="text-emerald-400">Automatic Post-Repair Verification</strong>, 
                <strong class="text-cyan-400">Route-Aware Bandwidth Optimization</strong>, and 
                <strong class="text-amber-400">Event Causality Chains</strong>.
              </p>
            </div>
            
            <div class="flex items-center space-x-3">
              <button 
                onclick="DemoControls.resetDemo()"
                class="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-all flex items-center gap-2"
              >
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Demo
              </button>
            </div>
          </div>
        </div>

        <!-- Commuter Mobility & Live Intelligence Scenarios -->
        <div class="glass-panel p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <span>🚌 Commuter Mobility & Dynamic Weather Controls</span>
                <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Live Intelligence</span>
              </h3>
              <p class="text-xs text-gray-400">Trigger live weather cascades, fleet breakdowns, and bunching alerts to see Commuter App ETAs adapt in real-time.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <button 
              onclick="DemoControls.triggerCommuteScenario('rain_on')" 
              class="p-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 text-left space-y-1 transition cursor-pointer"
            >
              <div class="font-bold text-white flex items-center gap-1.5">
                <span>🌧️ Heavy Rain</span>
              </div>
              <p class="text-[10px] text-gray-300">+40% ETA penalty on Route 21G due to waterlogging.</p>
            </button>

            <button 
              onclick="DemoControls.triggerCommuteScenario('disaster_flood')" 
              class="p-3 rounded-xl bg-gradient-to-r from-rose-950/80 to-red-900/80 border border-rose-500/50 hover:border-rose-400 text-left space-y-1 transition cursor-pointer shadow-md"
            >
              <div class="font-bold text-rose-200 flex items-center gap-1.5">
                <span>🌊 Flood Disruption</span>
              </div>
              <p class="text-[10px] text-gray-300">Severity 95 waterlogging triggers Disaster Rerouting banner.</p>
            </button>

            <button 
              onclick="DemoControls.triggerCommuteScenario('breakdown')" 
              class="p-3 rounded-xl bg-gradient-to-r from-rose-900/60 to-red-900/60 border border-rose-500/40 hover:border-rose-400 text-left space-y-1 transition cursor-pointer"
            >
              <div class="font-bold text-white flex items-center gap-1.5">
                <span>⚠️ Bus Breakdown</span>
              </div>
              <p class="text-[10px] text-gray-300">Sets BUS-01 to MAINTENANCE & alerts fleet dispatcher.</p>
            </button>

            <button 
              onclick="DemoControls.triggerCommuteScenario('bunching')" 
              class="p-3 rounded-xl bg-gradient-to-r from-amber-900/60 to-yellow-900/60 border border-amber-500/40 hover:border-amber-400 text-left space-y-1 transition cursor-pointer"
            >
              <div class="font-bold text-white flex items-center gap-1.5">
                <span>🚌 Fleet Bunching</span>
              </div>
              <p class="text-[10px] text-gray-300">Moves BUS-03 close to BUS-01 (<0.8km gap).</p>
            </button>

            <button 
              onclick="DemoControls.triggerCommuteScenario('clear_rain')" 
              class="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-left space-y-1 transition cursor-pointer"
            >
              <div class="font-bold text-gray-200 flex items-center gap-1.5">
                <span>☀️ Clear Weather</span>
              </div>
              <p class="text-[10px] text-gray-400">Clears waterlogging & restores standard ETAs.</p>
            </button>
          </div>
        </div>

        <!-- Guided 6-Step Evaluator Story -->
        <div class="glass-panel p-6">

          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <span>🎯 Complete End-to-End Evaluator Walkthrough</span>
                <span class="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Recommended</span>
              </h3>
              <p class="text-xs text-gray-400">Follow the numbered sequence to test all three differentiators simultaneously.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <!-- Step 1 -->
            <div class="p-3 rounded-lg bg-gray-800/80 border border-gray-700/80 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between text-xs font-mono-code font-bold text-cyan-400">
                  <span>STEP 1</span>
                  <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                </div>
                <h4 class="text-xs font-bold text-white mt-1">BUS-01 Initial Detection</h4>
                <p class="text-[11px] text-gray-400 mt-0.5">Detects PTH-001 on Route 21G with full evidence upload.</p>
              </div>
              <button 
                onclick="DemoControls.trigger('step1_detect')"
                class="w-full py-1.5 px-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold transition shadow"
              >
                1. Detect Pothole
              </button>
            </div>

            <!-- Step 2 -->
            <div class="p-3 rounded-lg bg-gray-800/80 border border-gray-700/80 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between text-xs font-mono-code font-bold text-blue-400">
                  <span>STEP 2</span>
                  <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                </div>
                <h4 class="text-xs font-bold text-white mt-1">BUS-05 Route Cache</h4>
                <p class="text-[11px] text-gray-400 mt-0.5">Recognizes PTH-001 in cache & suppresses 4.8MB upload.</p>
              </div>
              <button 
                onclick="DemoControls.trigger('step2_dedup')"
                class="w-full py-1.5 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition shadow"
              >
                2. Deduplicate (Cache)
              </button>
            </div>

            <!-- Step 3 -->
            <div class="p-3 rounded-lg bg-gray-800/80 border border-gray-700/80 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between text-xs font-mono-code font-bold text-purple-400">
                  <span>STEP 3</span>
                  <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                </div>
                <h4 class="text-xs font-bold text-white mt-1">Multi-Bus Confirmation</h4>
                <p class="text-[11px] text-gray-400 mt-0.5">BUS-08 & 12 confirm. Confidence rises to 98%.</p>
              </div>
              <button 
                onclick="DemoControls.trigger('step3_multibus')"
                class="w-full py-1.5 px-2 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition shadow"
              >
                3. Multi-Bus Confirm
              </button>
            </div>

            <!-- Step 4 -->
            <div class="p-3 rounded-lg bg-gray-800/80 border border-gray-700/80 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between text-xs font-mono-code font-bold text-amber-400">
                  <span>STEP 4</span>
                  <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
                <h4 class="text-xs font-bold text-white mt-1">Mark as Repaired</h4>
                <p class="text-[11px] text-gray-400 mt-0.5">Municipal authority changes status to REPAIR COMPLETED.</p>
              </div>
              <button 
                onclick="DemoControls.trigger('step4_repaired')"
                class="w-full py-1.5 px-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold transition shadow"
              >
                4. Mark Repaired
              </button>
            </div>

            <!-- Step 5 -->
            <div class="p-3 rounded-lg bg-gray-800/80 border border-gray-700/80 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between text-xs font-mono-code font-bold text-emerald-400">
                  <span>STEP 5</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <h4 class="text-xs font-bold text-white mt-1">BUS-15 Re-Scan (Success)</h4>
                <p class="text-[11px] text-gray-400 mt-0.5">AI detects no defect (96% conf). Status → REPAIR VERIFIED.</p>
              </div>
              <button 
                onclick="DemoControls.trigger('step5_verify_success')"
                class="w-full py-1.5 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition shadow"
              >
                5. Verify Success
              </button>
            </div>

            <!-- Step 6 (Alternate Failure) -->
            <div class="p-3 rounded-lg bg-gray-800/80 border border-gray-700/80 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between text-xs font-mono-code font-bold text-rose-400">
                  <span>ALT STEP 5</span>
                  <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                </div>
                <h4 class="text-xs font-bold text-white mt-1">BUS-15 Re-Scan (Failed)</h4>
                <p class="text-[11px] text-gray-400 mt-0.5">Pothole still present (91% conf). Status → ISSUE REOPENED.</p>
              </div>
              <button 
                onclick="DemoControls.trigger('step5_verify_failure')"
                class="w-full py-1.5 px-2 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition shadow"
              >
                5b. Verify Failure
              </button>
            </div>
          </div>
        </div>

        <!-- Standalone Urban Hazard Scenarios -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Heavy Rain & Waterlogging Causality -->
          <div class="glass-panel p-5 space-y-3">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">🌧️</span>
              <div>
                <h4 class="text-sm font-bold text-white">Weather Causality Chain</h4>
                <p class="text-[11px] text-gray-400">Trigger Heavy Rain → Waterlogging → Speed Drop</p>
              </div>
            </div>
            <p class="text-xs text-gray-300">
              Demonstrates <strong>Differentiator 3</strong>: Heavy rainfall triggers waterlogging on Anna Salai, causing a 42% density spike and 14 min route delay.
            </p>
            <button 
              onclick="DemoControls.trigger('simulate_rain')"
              class="w-full py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold transition"
            >
              Trigger Heavy Rain & Waterlogging Cascade
            </button>
          </div>

          <!-- Traffic Congestion Surge -->
          <div class="glass-panel p-5 space-y-3">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">🚗</span>
              <div>
                <h4 class="text-sm font-bold text-white">Traffic Congestion Grid</h4>
                <p class="text-[11px] text-gray-400">Trigger Multi-Route Congestion Cascade</p>
              </div>
            </div>
            <p class="text-xs text-gray-300">
              Simulates peak vehicle bottleneck in T. Nagar & Guindy, triggering rerouting suggestions and heat map updates.
            </p>
            <button 
              onclick="DemoControls.trigger('simulate_traffic')"
              class="w-full py-2 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-semibold transition"
            >
              Trigger Traffic Congestion Spike
            </button>
          </div>

          <!-- Hit-and-Run / Rash Driving ANPR -->
          <div class="glass-panel p-5 space-y-3">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">🚨</span>
              <div>
                <h4 class="text-sm font-bold text-white">Incident & ANPR Alert</h4>
                <p class="text-[11px] text-gray-400">Simulate Hit-and-Run Detection</p>
              </div>
            </div>
            <p class="text-xs text-gray-300">
              Bus rear camera captures rash overtaking and bumper contact, extracting vehicle plate <strong>TN-09-AB-1234 (94% conf)</strong>.
            </p>
            <button 
              onclick="DemoControls.trigger('simulate_hit_and_run')"
              class="w-full py-2 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 text-xs font-semibold transition"
            >
              Trigger Hit-and-Run ANPR Incident
            </button>
          </div>
        </div>

        <!-- Real-time Action Telemetry Log -->
        <div class="glass-panel p-5">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 pulse-dot"></span>
              Live Simulation Telemetry Log
            </h4>
            <span class="text-[11px] text-gray-500 font-mono-code">${scenarioLog.length} events recorded</span>
          </div>

          <div class="space-y-2 max-h-48 overflow-y-auto font-mono-code text-xs">
            ${scenarioLog.length === 0 ? `
              <div class="text-gray-500 text-center py-6">No scenario events triggered yet. Click any button above to begin.</div>
            ` : scenarioLog.map(item => `
              <div class="p-2 rounded bg-gray-900/80 border border-gray-800 flex items-center justify-between text-gray-300">
                <div class="flex items-center space-x-2">
                  <span class="text-cyan-400 font-bold">${item.time}</span>
                  <span class="text-xs font-semibold text-white">[${item.action}]</span>
                  <span class="text-xs text-gray-400">${item.detail}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] ${item.statusColor || 'bg-cyan-500/20 text-cyan-300'}">${item.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  async trigger(actionName) {
    // 1. Trigger backend action
    const res = await API.triggerSimulation(actionName);
    
    // 2. Fetch fresh synchronized backend state
    const [stats, events, repairs, bandwidth, causality, incidents] = await Promise.all([
      API.fetchDashboardStats(),
      API.fetchEvents(),
      API.fetchRepairs(),
      API.fetchBandwidth(),
      API.fetchCausality(),
      API.fetchIncidents()
    ]);

    let toastMsg = res.description || `Executed: ${actionName}`;
    let toastType = 'success';
    let scenarioTitle = 'Scenario Active';

    if (actionName === 'step1_detect') {
      toastMsg = 'BUS-01 detected PTH-001 (High Severity, Anna Salai) • Full 4.8 MB video uploaded';
      scenarioTitle = 'Step 1: Pothole Detected (BUS-01)';
    } else if (actionName === 'step2_dedup') {
      toastMsg = 'Route Cache Hit: BUS-05 suppressed 4.8 MB upload! (1.2 KB confirmation sent)';
      scenarioTitle = 'Step 2: Route Deduplication (BUS-05)';
    } else if (actionName === 'step3_multibus') {
      toastMsg = 'Multi-Bus Cross-Verification: Confirmed by 4 buses (98.4% Confidence)';
      scenarioTitle = 'Step 3: Multi-Bus Confirmation';
    } else if (actionName === 'step4_repaired') {
      toastMsg = 'PTH-001 / WO-891 marked REPAIR COMPLETED • Queued for BUS-15 Re-scan';
      scenarioTitle = 'Step 4: Authority Marked Repaired';
    } else if (actionName === 'step5_verify_success') {
      toastMsg = 'AI Autonomous Re-Scan: REPAIR VERIFIED (96.4% Confidence) ✅';
      scenarioTitle = 'Step 5: Repair Successfully Verified';
      toastType = 'success';
    } else if (actionName === 'step5_verify_failure') {
      toastMsg = 'AI Autonomous Re-Scan: REPAIR FAILED (91.2% Confidence) • Issue Reopened ⚠️';
      scenarioTitle = 'Step 5b: Repair Failed / Issue Reopened';
      toastType = 'error';
    } else if (actionName === 'simulate_rain') {
      toastMsg = 'Causality Engine: Heavy Rain (45mm/h) → Waterlogging (+42% Density Spike)';
      scenarioTitle = 'Weather Causality: Rain & Waterlogging';
    } else if (actionName === 'simulate_traffic') {
      toastMsg = 'Traffic Congestion Surge: Route 21G delay +16 mins (Speed 14 km/h)';
      scenarioTitle = 'Traffic Congestion Surge';
    } else if (actionName === 'simulate_hit_and_run') {
      toastMsg = 'Incident Alert: Hit-and-Run Detected • Plate: TN-09-AB-1234 (94.2%)';
      scenarioTitle = 'Incident: Hit-and-Run ANPR';
      toastType = 'error';
    }

    const curLog = window.store.getState().scenarioLog || [];
    const newLogItem = {
      time: new Date().toLocaleTimeString(),
      action: actionName,
      detail: toastMsg,
      status: actionName.includes('fail') ? 'REOPENED' : 'EXECUTED / SYNCED',
      statusColor: actionName.includes('fail') ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
    };

    // Update DifferentiatorBandwidth cache if open
    if (window.DifferentiatorBandwidth && bandwidth) {
      window.DifferentiatorBandwidth.bandwidthData = bandwidth;
    }

    window.store.setState({
      stats,
      events,
      repairs,
      bandwidth,
      causality,
      incidents,
      activeScenario: { title: scenarioTitle, id: actionName },
      scenarioLog: [newLogItem, ...curLog].slice(0, 15)
    });

    window.store.addNotification(toastMsg, toastType);
  },

  async resetDemo() {
    await API.triggerSimulation("reset");
    const [stats, events, repairs, bandwidth, causality, incidents] = await Promise.all([
      API.fetchDashboardStats(),
      API.fetchEvents(),
      API.fetchRepairs(),
      API.fetchBandwidth(),
      API.fetchCausality(),
      API.fetchIncidents()
    ]);

    if (window.DifferentiatorBandwidth) {
      window.DifferentiatorBandwidth.bandwidthData = bandwidth;
    }

    window.store.setState({
      activeScenario: null,
      scenarioLog: [],
      stats,
      events,
      repairs,
      bandwidth,
      causality,
      incidents
    });
    window.store.addNotification("Demo environment reset to baseline state.", "info");
  },

  async triggerCommuteScenario(scenario) {
    const res = await API.triggerCommuteScenario(scenario);
    window.store.addNotification(res.message || `Scenario ${scenario} executed.`, 'info');
    const [events, buses, alerts] = await Promise.all([API.fetchEvents(), API.fetchBuses(), API.fetchAlerts()]);
    window.store.setState({ events, buses, alerts });
    if (window.CommuterApp && window.CommuterApp.refreshData) {
      await window.CommuterApp.refreshData();
    }
  }
};

window.DemoControls = DemoControls;

