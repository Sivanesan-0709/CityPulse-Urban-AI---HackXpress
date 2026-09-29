// CityPulse Urban AI - Fleet Monitoring Component
const FleetMonitoring = {
  selectedRouteFilter: 'ALL',

  render(state) {
    const buses = state.buses || [];
    const filteredBuses = this.selectedRouteFilter === 'ALL' 
      ? buses 
      : buses.filter(b => b.route_code === this.selectedRouteFilter);

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-3h.01M16 18h.01" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Mobile Sensing Bus Fleet (20 Units)
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Edge AI Online
                </span>
              </h2>
              <p class="text-xs text-gray-400">Continuous onboard multi-camera urban surveillance & autonomous route caching</p>
            </div>
          </div>

          <!-- Quick Metrics & Filter -->
          <div class="flex items-center space-x-3">
            <select 
              id="fleet-route-select"
              onchange="FleetMonitoring.filterByRoute(this.value)"
              class="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Routes (${buses.length} Buses)</option>
              <option value="21G">Route 21G (Broadway ↔ Tambaram)</option>
              <option value="19B">Route 19B (T. Nagar ↔ Kelambakkam OMR)</option>
              <option value="5C">Route 5C (Broadway ↔ T. Nagar)</option>
              <option value="45B">Route 45B (Anna Nagar ↔ Guindy)</option>
              <option value="570">Route 570 (CMBT ↔ Siruseri SIPCOT)</option>
            </select>

            <button 
              onclick="window.store.setActiveTab('gis-map')"
              class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
            >
              <span>View On GIS Map</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- 20-Bus Grid Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${filteredBuses.length === 0 ? `
            <div class="col-span-4 text-center py-12 glass-panel text-gray-400">No buses matching filter.</div>
          ` : filteredBuses.map(bus => `
            <div class="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-cyan-500/60 transition flex flex-col justify-between space-y-3">
              <!-- Top Header: Bus ID & Route Badge -->
              <div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 pulse-dot"></span>
                    <span class="text-base font-extrabold text-white font-mono-code">${bus.id}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono-code font-bold border border-cyan-500/40">
                    ${bus.route_code}
                  </span>
                </div>
                <div class="text-[11px] text-gray-400 truncate mt-0.5">${bus.route_name}</div>
              </div>

              <!-- Key Telemetry Gauges -->
              <div class="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-950/70 border border-gray-800 text-xs">
                <div>
                  <span class="text-[10px] text-gray-500 uppercase">Speed</span>
                  <div class="font-bold text-white font-mono-code">${bus.speed_kmh} <span class="text-[10px] text-gray-400">km/h</span></div>
                </div>
                <div>
                  <span class="text-[10px] text-gray-500 uppercase">Detections</span>
                  <div class="font-bold text-cyan-400 font-mono-code">${bus.events_detected_count || 18} <span class="text-[10px] text-gray-400">events</span></div>
                </div>
                <div>
                  <span class="text-[10px] text-gray-500 uppercase">Network</span>
                  <div class="font-semibold text-emerald-400 text-[11px]">${bus.network_status}</div>
                </div>
                <div>
                  <span class="text-[10px] text-gray-500 uppercase">Data Used</span>
                  <div class="font-mono-code text-blue-300">${bus.bandwidth_used_mb || 1.4} MB</div>
                </div>
              </div>

              <!-- 5 Camera Feeds Status Light Indicators -->
              <div>
                <div class="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>Camera Array (5/5)</span>
                  <span class="text-emerald-400 font-semibold font-mono-code">ONLINE</span>
                </div>
                <div class="grid grid-cols-5 gap-1 text-[9px] font-mono-code text-center">
                  <div class="py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">FRONT</div>
                  <div class="py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">REAR</div>
                  <div class="py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">LEFT</div>
                  <div class="py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">RIGHT</div>
                  <div class="py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">CABIN</div>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                <button 
                  onclick="window.store.setActiveTab('edge-ai')" 
                  class="text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] flex items-center gap-1"
                >
                  <span>Camera Feeds</span>
                  <span>→</span>
                </button>
                <span class="text-[10px] text-gray-500 font-mono-code">Edge Node v2.4</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  filterByRoute(routeCode) {
    this.selectedRouteFilter = routeCode;
    const state = window.store.getState();
    const appEl = document.getElementById('app');
    if (appEl && state.activeTab === 'fleet') {
      window.App.render(state);
    }
  }
};

window.FleetMonitoring = FleetMonitoring;
