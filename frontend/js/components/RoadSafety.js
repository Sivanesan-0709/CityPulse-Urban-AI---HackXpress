// CityPulse Urban AI - Road Safety Intelligence Component
const RoadSafety = {
  render(state) {
    const safetyStats = [
      { metric: "Unsafe Pedestrian Crossings", count: 18, severity: "High Risk", color: "text-amber-400" },
      { metric: "Near-Miss Swerving Events", count: 24, severity: "Critical Risk", color: "text-rose-400" },
      { metric: "Rash Driving Incidents (ANPR)", count: 7, severity: "Dispatched to Police", color: "text-purple-400" },
      { metric: "High-Risk Blind Intersections", count: 5, severity: "Action Recommended", color: "text-cyan-400" }
    ];

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Road Safety & Vulnerable Road User (VRU) Analytics
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Vision AI Powered
                </span>
              </h2>
              <p class="text-xs text-gray-400">Autonomous detection of pedestrian conflicts, jaywalking hazards, and aggressive driving</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-400">Fleet Safety Index:</span>
            <span class="text-lg font-extrabold text-emerald-400 font-mono-code">88.4 / 100</span>
          </div>
        </div>

        <!-- Safety KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${safetyStats.map(s => `
            <div class="glass-panel p-4 rounded-xl border border-gray-800 space-y-2">
              <span class="text-xs text-gray-400 font-medium">${s.metric}</span>
              <div class="flex items-baseline justify-between">
                <span class="text-2xl font-extrabold text-white font-mono-code">${s.count}</span>
                <span class="text-xs font-bold ${s.color}">${s.severity}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- High-Risk Intersections Table -->
        <div class="glass-panel p-5 space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center justify-between">
            <span>⚠️ Identified High-Risk Urban Intersections</span>
            <span class="text-xs text-cyan-400 font-mono-code">AI Risk Scored</span>
          </h3>

          <div class="space-y-2">
            <div class="p-3 rounded-lg bg-gray-950/60 border border-gray-800 flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-white">Guindy Kathipara Junction (Slip Road)</span>
                <div class="text-[11px] text-gray-400">Potholes near merging lane cause vehicles to swerve abruptly into bus lane</div>
              </div>
              <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold font-mono-code">RISK SCORE: 92/100</span>
            </div>

            <div class="p-3 rounded-lg bg-gray-950/60 border border-gray-800 flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-white">T. Nagar Panagal Park Pedestrian Zone</span>
                <div class="text-[11px] text-gray-400">Missing zebra crossings & high pedestrian footfall create severe conflict zones</div>
              </div>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono-code">RISK SCORE: 84/100</span>
            </div>

            <div class="p-3 rounded-lg bg-gray-950/60 border border-gray-800 flex items-center justify-between text-xs">
              <div>
                <span class="font-bold text-white">OMR Sholinganallur Signal</span>
                <div class="text-[11px] text-gray-400">High speed IT corridor overtaking near signal approach</div>
              </div>
              <span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold font-mono-code">RISK SCORE: 76/100</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

window.RoadSafety = RoadSafety;
