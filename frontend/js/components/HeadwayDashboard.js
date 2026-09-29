// CityPulse Urban AI - Fleet Headway & Bunching Dashboard Component
const HeadwayDashboard = {
  render(state) {
    const headwayStats = (state.headwayData && state.headwayData.headway_stats) ? state.headwayData.headway_stats : [];
    const alerts = state.alerts || [];

    const bunchingStats = headwayStats.filter(s => s.bunching_detected);

    return `
      <div class="space-y-6">
        <!-- Top Banner -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold">
              📡
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Fleet Headway & Bunching Monitor
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  ${bunchingStats.length} Bunching Incidents
                </span>
              </h2>
              <p class="text-xs text-gray-400">Real-time spacing metrics between consecutive buses on same route corridors</p>
            </div>
          </div>

          <!-- Refresh Button -->
          <button 
            onclick="HeadwayDashboard.refresh()"
            class="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition cursor-pointer"
          >
            ↻ Refresh Headway
          </button>
        </div>

        <!-- Headway Corridors Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${headwayStats.length === 0 ? `
            <div class="col-span-3 glass-panel p-8 text-center text-gray-400">Loading fleet headway telemetry...</div>
          ` : headwayStats.map(stat => {
            const isBunched = stat.bunching_detected;
            const borderClass = isBunched ? 'border-rose-500/80 bg-rose-950/20' : 'border-gray-800 bg-gray-900/60';

            return `
              <div class="glass-panel p-4 rounded-xl border ${borderClass} space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code font-bold text-xs border border-cyan-500/40">
                      ${stat.route_code}
                    </span>
                    <span class="font-bold text-white text-xs">${stat.direction} Direction</span>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isBunched ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 pulse-dot' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}">
                    ${isBunched ? '🚨 BUNCHING DETECTED' : 'NORMAL HEADWAY'}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-xs text-center font-mono-code">
                  <div>
                    <span class="text-[9px] text-gray-500 block uppercase">Buses</span>
                    <span class="text-white font-bold">${stat.buses_count}</span>
                  </div>
                  <div>
                    <span class="text-[9px] text-gray-500 block uppercase">Avg Gap</span>
                    <span class="text-cyan-400 font-bold">${stat.avg_gap_km} km</span>
                  </div>
                  <div>
                    <span class="text-[9px] text-gray-500 block uppercase">Min Gap</span>
                    <span class="${isBunched ? 'text-rose-400 font-extrabold' : 'text-emerald-400'}">${stat.min_gap_km} km</span>
                  </div>
                </div>

                ${isBunched ? `
                  <div class="p-2 rounded-lg bg-rose-950/80 border border-rose-800 text-[11px] text-rose-200 space-y-1">
                    <div class="font-bold">Bunched Fleet Units:</div>
                    <div class="font-mono-code text-white">${(stat.bunching_buses || []).join(', ')}</div>
                    <div class="text-[10px] text-rose-300">Gap < 0.8 km threshold. Dispatch advisory: Hold trailing bus.</div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  async refresh() {
    try {
      const headwayData = await API.fetchHeadway();
      window.store.setState({ headwayData });
    } catch (err) {
      console.warn("Error refreshing headway:", err);
    }
  }
};

window.HeadwayDashboard = HeadwayDashboard;
