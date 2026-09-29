// CityPulse Urban AI - Infrastructure Deficiency Tracker
const InfrastructureDefects = {
  render(state) {
    const events = (state.events || []).filter(e => e.category === 'INFRASTRUCTURE' || e.category === 'ROAD_DEFECT');

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Urban Infrastructure Deficiency Tracker
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ${events.length} Deficiencies Flagged
                </span>
              </h2>
              <p class="text-xs text-gray-400">Autonomous identification of missing signboards, faded zebra crossings, broken signals & medians</p>
            </div>
          </div>
        </div>

        <!-- Deficiencies Table -->
        <div class="glass-panel p-5 space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-gray-950/80 text-gray-400 uppercase text-[10px] font-mono-code border-b border-gray-800">
                <tr>
                  <th class="p-3">Defect ID</th>
                  <th class="p-3">Deficiency Type</th>
                  <th class="p-3">Location & Segment</th>
                  <th class="p-3">Severity</th>
                  <th class="p-3">AI Confidence</th>
                  <th class="p-3">Observations</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800/60 font-mono-code text-[11px]">
                ${events.slice(0, 15).map(e => `
                  <tr class="hover:bg-cyan-500/5 transition">
                    <td class="p-3 font-bold text-cyan-400">${e.id}</td>
                    <td class="p-3 font-bold text-white font-sans">${e.type} (${e.subtype})</td>
                    <td class="p-3 text-gray-300 font-sans">${e.road_name}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${e.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}">${e.severity}</span></td>
                    <td class="p-3 font-bold text-emerald-400">${e.confidence}%</td>
                    <td class="p-3 text-gray-300">${e.observation_count} Buses</td>
                    <td class="p-3 text-right">
                      <button onclick="window.store.setActiveTab('gis-map')" class="text-cyan-400 hover:text-cyan-300 font-sans font-semibold text-xs">
                        Map Pin →
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};

window.InfrastructureDefects = InfrastructureDefects;
