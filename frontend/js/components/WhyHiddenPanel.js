// CityPulse Urban AI - "Why Hidden?" Explainability Panel Component
const WhyHiddenPanel = {
  render(state) {
    const excluded = state.excludedBuses || [];
    const stops = state.stops || [];
    const selectedStopId = state.selectedStopId || 'STOP-21G-UP-01';
    const stop = stops.find(s => s.id === selectedStopId) || { name: "Broadway Bus Terminus", route_code: "21G", direction: "UP" };

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-bold">
              ❓
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                "Why Hidden?" Bus Explainability Panel
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Transparency AI
                </span>
              </h2>
              <p class="text-xs text-gray-400">Clear rationales for buses excluded from your stop's approaching list</p>
            </div>
          </div>

          <!-- Stop Picker -->
          <div class="flex items-center space-x-3 text-xs">
            <label class="text-gray-300 font-medium">Selected Stop:</label>
            <select 
              onchange="WhyHiddenPanel.onStopChange(this.value)"
              class="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              ${stops.map(s => `
                <option value="${s.id}" ${s.id === selectedStopId ? 'selected' : ''}>
                  ${s.name} (${s.route_code} ${s.direction})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Excluded Buses Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${excluded.length === 0 ? `
            <div class="col-span-3 glass-panel p-12 text-center text-gray-400 space-y-2">
              <span class="text-3xl">✅</span>
              <div class="text-sm font-bold text-white">No buses are hidden for this stop</div>
              <div class="text-xs">All active buses on this route corridor are currently approaching your stop in the correct direction.</div>
            </div>
          ` : excluded.map(bus => {
            const isOpposite = bus.reason === 'OPPOSITE_DIRECTION';
            const reasonBadge = isOpposite 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

            return `
              <div class="glass-panel p-4 rounded-xl border border-gray-800 space-y-3 relative overflow-hidden">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="font-extrabold text-white font-mono-code text-base">${bus.bus_id}</span>
                    <span class="px-2 py-0.5 rounded bg-gray-800 text-cyan-300 text-xs font-mono-code">
                      ${bus.route_code}
                    </span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded text-[10px] font-bold border ${reasonBadge}">
                    ${bus.reason.replace(/_/g, ' ')}
                  </span>
                </div>

                <!-- Explanation Box -->
                <div class="p-3 rounded-lg bg-gray-950/80 border border-gray-800 text-xs text-gray-300 space-y-1">
                  <div class="font-semibold text-gray-200">Exclusion Rationale:</div>
                  <p class="text-[11px] text-gray-400 leading-relaxed">${bus.explanation || 'Bus does not match approaching criteria.'}</p>
                </div>

                <!-- Telemetry Comparison -->
                <div class="grid grid-cols-2 gap-2 text-[11px] font-mono-code text-gray-400">
                  <div>Bus Progress: <span class="text-white font-bold">${bus.progress_km} km</span></div>
                  <div>Stop Dist: <span class="text-white font-bold">${bus.stop_distance_km} km</span></div>
                </div>

                <!-- Data Source Badge -->
                <div class="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px]">
                  <span class="text-gray-500">Data Feed Source:</span>
                  <span class="px-2 py-0.5 rounded font-mono-code ${bus.data_source === 'LIVE_GPS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}">
                    ${bus.data_source || 'SIMULATED'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  async onStopChange(stopId) {
    window.store.setState({ selectedStopId: stopId });
    if (window.CommuterApp && window.CommuterApp.refreshData) {
      await window.CommuterApp.refreshData();
    }
  }
};

window.WhyHiddenPanel = WhyHiddenPanel;
