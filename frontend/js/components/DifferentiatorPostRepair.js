// CityPulse Urban AI - Differentiator 1: Automatic Post-Repair Verification Workbench
const DifferentiatorPostRepair = {
  activeOrderId: 'WO-891',
  verificationLog: [],

  render(state) {
    const repairs = state.repairs || [];
    const activeOrder = repairs.find(r => r.id === this.activeOrderId) || repairs[0] || {
      id: "WO-891",
      event_id: "PTH-001",
      road_name: "Anna Salai, Guindy Kathipara Junction",
      issue_type: "Severe Surface Depression (Pothole)",
      severity: "CRITICAL",
      contractor: "Chennai Corporation Div-5 PWD",
      status: "DETECTED",
      verification_confidence: null,
      verification_result: null
    };

    return `
      <div class="space-y-6">
        <!-- Banner Header -->
        <div class="glass-panel diff-badge-1 p-6 rounded-xl relative overflow-hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/40">
                  SIH Differentiator 1
                </span>
                <span class="text-xs text-gray-400">Autonomous Fleet Quality Assurance</span>
              </div>
              <h2 class="text-2xl font-extrabold text-white mt-1">Automatic Post-Repair Verification Engine</h2>
              <p class="text-sm text-gray-300 max-w-3xl mt-1">
                Eliminates bogus or substandard municipal contractor repair claims. When work is marked complete, subsequent scheduled buses autonomously re-scan the GPS coordinates to verify or reopen issues without human inspectors.
              </p>
            </div>

            <!-- Quick Action Triggers -->
            <div class="flex flex-wrap items-center gap-2">
              <button 
                onclick="DifferentiatorPostRepair.triggerComplete('${activeOrder.id}')"
                class="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition"
              >
                1. [Mark as Repaired]
              </button>
              <button 
                onclick="DifferentiatorPostRepair.triggerVerify('${activeOrder.id}', true)"
                class="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
              >
                2. [Simulate Re-scan (Success 96%)]
              </button>
              <button 
                onclick="DifferentiatorPostRepair.triggerVerify('${activeOrder.id}', false)"
                class="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition"
              >
                2b. [Simulate Re-scan (Failure 91%)]
              </button>
            </div>
          </div>
        </div>

        <!-- Visual 7-Stage Closed-Loop Lifecycle Stepper -->
        <div class="glass-panel p-5">
          <h3 class="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🔄 Automated Verification Lifecycle Pipeline</span>
            <span class="text-[10px] text-cyan-400 font-mono-code font-normal">(Event ${activeOrder.event_id})</span>
          </h3>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-mono-code">
            <!-- Stage 1 -->
            <div class="p-3 rounded-lg ${this.getStepStyle(activeOrder.status, 1)}">
              <div class="text-[10px] text-gray-400">STAGE 1</div>
              <div class="font-bold text-white mt-1">DETECTED</div>
              <div class="text-[10px] text-cyan-300 mt-1">BUS-01 AI</div>
            </div>

            <!-- Stage 2 -->
            <div class="p-3 rounded-lg ${this.getStepStyle(activeOrder.status, 2)}">
              <div class="text-[10px] text-gray-400">STAGE 2</div>
              <div class="font-bold text-white mt-1">VERIFIED</div>
              <div class="text-[10px] text-cyan-300 mt-1">Multi-Bus Conf</div>
            </div>

            <!-- Stage 3 -->
            <div class="p-3 rounded-lg ${this.getStepStyle(activeOrder.status, 3)}">
              <div class="text-[10px] text-gray-400">STAGE 3</div>
              <div class="font-bold text-white mt-1">ASSIGNED</div>
              <div class="text-[10px] text-cyan-300 mt-1">Work Order Disp</div>
            </div>

            <!-- Stage 4 -->
            <div class="p-3 rounded-lg ${this.getStepStyle(activeOrder.status, 4)}">
              <div class="text-[10px] text-gray-400">STAGE 4</div>
              <div class="font-bold text-white mt-1">IN PROGRESS</div>
              <div class="text-[10px] text-cyan-300 mt-1">Contractor PWD</div>
            </div>

            <!-- Stage 5 -->
            <div class="p-3 rounded-lg ${this.getStepStyle(activeOrder.status, 5)}">
              <div class="text-[10px] text-gray-400">STAGE 5</div>
              <div class="font-bold text-white mt-1">COMPLETED</div>
              <div class="text-[10px] text-amber-300 mt-1">Authority Claim</div>
            </div>

            <!-- Stage 6 -->
            <div class="p-3 rounded-lg ${this.getStepStyle(activeOrder.status, 6)}">
              <div class="text-[10px] text-gray-400">STAGE 6</div>
              <div class="font-bold text-white mt-1">BUS RE-SCAN</div>
              <div class="text-[10px] text-cyan-300 mt-1">BUS-15 Autonomous</div>
            </div>

            <!-- Stage 7 -->
            <div class="p-3 rounded-lg ${this.getStepStyle(activeOrder.status, 7)}">
              <div class="text-[10px] text-gray-400">STAGE 7</div>
              <div class="font-bold text-white mt-1">
                ${activeOrder.status === 'REPAIR_FAILED_REOPENED' ? 'REOPENED ⚠️' : 'VERIFIED ✅'}
              </div>
              <div class="text-[10px] text-emerald-300 mt-1">
                ${activeOrder.verification_confidence ? `${activeOrder.verification_confidence}% Conf` : 'Pending Re-scan'}
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Workbench & Camera Comparison -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left 2 Cols: Before & After AI Inspection Telemetry -->
          <div class="lg:col-span-2 glass-panel p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span>📸 Onboard Edge AI Visual Inspection Analysis</span>
                <span class="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-xs font-mono-code">${activeOrder.id}</span>
              </h3>
              <span class="text-xs font-bold ${activeOrder.status === 'REPAIR_VERIFIED' ? 'text-emerald-400' : activeOrder.status === 'REPAIR_FAILED_REOPENED' ? 'text-rose-400' : 'text-amber-400'}">
                Status: ${activeOrder.status}
              </span>
            </div>

            <!-- Simulated Camera Comparison Frames -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Before Repair (Initial Detection) -->
              <div class="p-3 rounded-xl bg-gray-950/80 border border-rose-500/40 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-rose-400">BEFORE: Initial Defect Detection</span>
                  <span class="text-gray-400 font-mono-code">BUS-01 Front Cam</span>
                </div>
                <div class="h-44 rounded-lg bg-gray-900 border border-gray-800 relative overflow-hidden flex items-center justify-center">
                  <!-- Simulated Asphalt with Pothole -->
                  <div class="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-950"></div>
                  <div class="w-24 h-16 rounded-full bg-rose-950/80 border-2 border-dashed border-rose-500 flex items-center justify-center text-center p-1 z-10 animate-pulse">
                    <span class="text-[10px] font-mono-code font-bold text-rose-300">POTHOLE<br/>(97.4% Conf)</span>
                  </div>
                  <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-rose-400 text-[10px] font-mono-code">
                    13.0067°N, 80.2023°E
                  </div>
                </div>
                <div class="text-[11px] text-gray-300 flex justify-between">
                  <span>Severity: <strong class="text-rose-400">88.5/100 (Critical)</strong></span>
                  <span>Depth: <strong>9 cm</strong></span>
                </div>
              </div>

              <!-- After Repair (Autonomous Fleet Re-Scan) -->
              <div class="p-3 rounded-xl bg-gray-950/80 border ${activeOrder.status === 'REPAIR_VERIFIED' ? 'border-emerald-500/50' : activeOrder.status === 'REPAIR_FAILED_REOPENED' ? 'border-rose-500/50' : 'border-amber-500/40'} space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold ${activeOrder.status === 'REPAIR_VERIFIED' ? 'text-emerald-400' : activeOrder.status === 'REPAIR_FAILED_REOPENED' ? 'text-rose-400' : 'text-amber-400'}">
                    AFTER: Autonomous Re-Scan
                  </span>
                  <span class="text-gray-400 font-mono-code">BUS-15 Front Cam</span>
                </div>
                <div class="h-44 rounded-lg bg-gray-900 border border-gray-800 relative overflow-hidden flex items-center justify-center">
                  <div class="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
                  
                  ${activeOrder.status === 'REPAIR_VERIFIED' ? `
                    <div class="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-center z-10 shadow-lg">
                      <div class="text-xl">✅</div>
                      <div class="text-xs font-bold text-emerald-300 font-mono-code mt-0.5">SURFACE SMOOTH</div>
                      <div class="text-[10px] text-emerald-400 font-mono-code">AI Confidence: 96.4%</div>
                    </div>
                  ` : activeOrder.status === 'REPAIR_FAILED_REOPENED' ? `
                    <div class="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-center z-10 shadow-lg">
                      <div class="text-xl">⚠️</div>
                      <div class="text-xs font-bold text-rose-300 font-mono-code mt-0.5">POTHOLE DETECTED (8.5cm)</div>
                      <div class="text-[10px] text-rose-400 font-mono-code">AI Confidence: 91.2% (Failed)</div>
                    </div>
                  ` : `
                    <div class="p-3 rounded-xl bg-gray-900/90 border border-gray-700 text-center z-10">
                      <div class="text-xl animate-spin">⏳</div>
                      <div class="text-xs font-bold text-amber-300 font-mono-code mt-0.5">AWAITING BUS-15 RE-SCAN</div>
                      <div class="text-[10px] text-gray-400">Click [Simulate Re-scan] above</div>
                    </div>
                  `}

                  <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-cyan-400 text-[10px] font-mono-code">
                    13.0067°N, 80.2023°E (Re-scan)
                  </div>
                </div>
                <div class="text-[11px] text-gray-300 flex justify-between">
                  <span>Re-scan Bus: <strong>BUS-15 (Route 570)</strong></span>
                  <span>AI Result: <strong class="${activeOrder.status === 'REPAIR_VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}">${activeOrder.verification_result || 'PENDING'}</strong></span>
                </div>
              </div>
            </div>

            <!-- Details Table -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-xs">
              <div>
                <span class="text-[10px] text-gray-500 uppercase">Work Order</span>
                <div class="font-bold text-white font-mono-code">${activeOrder.id}</div>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 uppercase">Event ID</span>
                <div class="font-bold text-cyan-400 font-mono-code">${activeOrder.event_id}</div>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 uppercase">Contractor</span>
                <div class="font-medium text-gray-300 truncate">${activeOrder.contractor}</div>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 uppercase">Location</span>
                <div class="font-medium text-gray-300 truncate">${activeOrder.road_name}</div>
              </div>
            </div>
          </div>

          <!-- Right Col: Active Work Orders Queue -->
          <div class="glass-panel p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="text-sm font-bold text-white flex items-center justify-between mb-3">
                <span>Municipal Work Orders</span>
                <span class="text-xs font-mono-code text-cyan-400">${repairs.length} Orders</span>
              </h3>

              <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
                ${repairs.map(r => `
                  <div 
                    onclick="DifferentiatorPostRepair.selectOrder('${r.id}')"
                    class="p-3 rounded-lg border cursor-pointer transition ${r.id === activeOrder.id ? 'bg-cyan-500/10 border-cyan-500 text-white' : 'bg-gray-950/60 border-gray-800 hover:border-gray-700 text-gray-300'}"
                  >
                    <div class="flex items-center justify-between text-xs font-mono-code">
                      <span class="font-bold">${r.id} (${r.event_id})</span>
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${r.status === 'REPAIR_VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' : r.status === 'REPAIR_FAILED_REOPENED' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}">
                        ${r.status}
                      </span>
                    </div>
                    <div class="text-[11px] text-gray-400 mt-1 truncate">${r.road_name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="pt-3 border-t border-gray-800 text-[11px] text-gray-400">
              💡 <strong>Evaluator Tip:</strong> Click any order and use the top buttons to trigger the live automated re-scan verification workflow.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getStepStyle(status, stepIndex) {
    const statusMap = {
      'DETECTED': 1,
      'VERIFIED': 2,
      'ASSIGNED': 3,
      'REPAIR_IN_PROGRESS': 4,
      'REPAIR_COMPLETED': 5,
      'BUS_RESCAN_PENDING': 6,
      'REPAIR_VERIFIED': 7,
      'REPAIR_FAILED_REOPENED': 7
    };

    const cur = statusMap[status] || 1;
    if (stepIndex < cur) {
      return 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300';
    } else if (stepIndex === cur) {
      if (status === 'REPAIR_FAILED_REOPENED') {
        return 'bg-rose-950/80 border border-rose-500 text-rose-200 animate-pulse';
      }
      return 'bg-cyan-950/80 border border-cyan-400 text-cyan-200 animate-pulse';
    } else {
      return 'bg-gray-950/50 border border-gray-800/80 text-gray-600';
    }
  },

  selectOrder(orderId) {
    this.activeOrderId = orderId;
    window.App.render(window.store.getState());
  },

  async triggerComplete(orderId) {
    await API.triggerSimulation("step4_repaired", { work_order_id: orderId });
    window.store.addNotification(`Work order ${orderId} marked as REPAIR COMPLETED • Queued for autonomous bus re-scan`, 'info');
    const repairs = await API.fetchRepairs ? await API.fetchRepairs() : window.store.getState().repairs;
    window.store.setState({ repairs });
    window.App.render(window.store.getState());
  },

  async triggerVerify(orderId, forceSuccess) {
    const action = forceSuccess ? "step5_verify_success" : "step5_verify_failure";
    await API.triggerSimulation(action, { work_order_id: orderId });
    
    if (forceSuccess) {
      window.store.addNotification(`BUS-15 Re-Scan Result: Pothole gone (96.4% Conf) ➔ Status: REPAIR VERIFIED ✅`, 'success');
    } else {
      window.store.addNotification(`BUS-15 Re-Scan Result: Pothole still present (91.2% Conf) ➔ Status: ISSUE REOPENED ⚠️`, 'error');
    }

    // Refresh repairs and stats
    const [stats, events] = await Promise.all([
      API.fetchDashboardStats(),
      API.fetchEvents()
    ]);
    window.store.setState({ stats, events });
    window.App.render(window.store.getState());
  }
};

window.DifferentiatorPostRepair = DifferentiatorPostRepair;
