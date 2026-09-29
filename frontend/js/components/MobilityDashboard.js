// CityPulse Urban AI - Transit Authority Mobility & Operations Dashboard
const MobilityDashboard = {
  data: null,
  reports: [],
  isLoading: false,

  render(state) {
    const stats = this.data || {
      fleet_punctuality_pct: 85.0,
      low_floor_availability_ratio: 0.35,
      low_floor_buses_active: 7,
      total_active_buses: 20,
      average_wait_time_min: 7.5,
      active_safety_reports: 0,
      total_estimated_passengers: 12450,
      route_travel_times: [
        { route_code: "21G", avg_travel_time_min: 44.5, scheduled_travel_time_min: 38.0, delay_min: 6.5, status: "MODERATE_DELAY", avg_speed_kmh: 27.2 },
        { route_code: "19B", avg_travel_time_min: 52.0, scheduled_travel_time_min: 45.0, delay_min: 7.0, status: "MODERATE_DELAY", avg_speed_kmh: 24.5 },
        { route_code: "5C", avg_travel_time_min: 28.0, scheduled_travel_time_min: 26.0, delay_min: 2.0, status: "ON_TIME", avg_speed_kmh: 31.0 },
        { route_code: "45B", avg_travel_time_min: 35.5, scheduled_travel_time_min: 32.0, delay_min: 3.5, status: "ON_TIME", avg_speed_kmh: 29.8 },
        { route_code: "570", avg_travel_time_min: 64.0, scheduled_travel_time_min: 55.0, delay_min: 9.0, status: "HEAVY_DELAY", avg_speed_kmh: 21.4 }
      ],
      hourly_passenger_load: [
        { hour: 6, formatted_hour: "06:00", passenger_volume: 420, avg_load_pct: 35.0 },
        { hour: 7, formatted_hour: "07:00", passenger_volume: 890, avg_load_pct: 62.0 },
        { hour: 8, formatted_hour: "08:00", passenger_volume: 1450, avg_load_pct: 88.0 },
        { hour: 9, formatted_hour: "09:00", passenger_volume: 1680, avg_load_pct: 94.0 },
        { hour: 10, formatted_hour: "10:00", passenger_volume: 1120, avg_load_pct: 70.0 },
        { hour: 12, formatted_hour: "12:00", passenger_volume: 850, avg_load_pct: 55.0 },
        { hour: 14, formatted_hour: "14:00", passenger_volume: 780, avg_load_pct: 50.0 },
        { hour: 16, formatted_hour: "16:00", passenger_volume: 1200, avg_load_pct: 75.0 },
        { hour: 17, formatted_hour: "17:00", passenger_volume: 1750, avg_load_pct: 96.0 },
        { hour: 18, formatted_hour: "18:00", passenger_volume: 1890, avg_load_pct: 98.0 },
        { hour: 19, formatted_hour: "19:00", passenger_volume: 1350, avg_load_pct: 82.0 },
        { hour: 21, formatted_hour: "21:00", passenger_volume: 580, avg_load_pct: 40.0 }
      ],
      corridor_bottlenecks: [
        { corridor: "Anna Salai (Central ↔ Guindy)", route_code: "21G", congestion_index: 78.5, status: "CONGESTED", high_occupancy_buses: 2 },
        { corridor: "Rajiv Gandhi Salai (OMR IT Corridor)", route_code: "19B", congestion_index: 68.0, status: "MODERATE", high_occupancy_buses: 1 },
        { corridor: "100 Feet Road (CMBT ↔ Velachery)", route_code: "570", congestion_index: 86.2, status: "SEVERE_GRIDLOCK", high_occupancy_buses: 3 }
      ]
    };

    const reports = this.reports || [];

    return `
      <div class="space-y-6">
        
        <!-- Top Authority Header -->
        <div class="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-cyan-500">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-2xl">
              📊
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/40 font-mono">
                  MTC Command Center
                </span>
                <span class="text-xs text-gray-400">Authority View • SIH 2026 Problem ID 26124</span>
              </div>
              <h2 class="text-xl font-extrabold text-white mt-0.5">Mobility Data & Fleet Analytics Dashboard</h2>
              <p class="text-xs text-gray-300">Live arterial punctuality, low-floor accessibility equity, passenger demand trends, and anonymous safety dispatch.</p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button 
              onclick="MobilityDashboard.refresh()"
              class="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔄 Refresh Data</span>
            </button>
            <button 
              onclick="window.store.setActiveTab('commuter-app')"
              class="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>📱 Commuter View →</span>
            </button>
          </div>
        </div>

        <!-- KPI SUMMARY CARDS (Exact Formulas - Amendment 4) -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <!-- KPI 1: Fleet Punctuality -->
          <div class="glass-panel p-4 space-y-1.5 border-t-2 border-t-emerald-500 relative overflow-hidden">
            <div class="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase">
              <span>Fleet Punctuality</span>
              <span class="text-emerald-400">⏱️</span>
            </div>
            <div class="text-2xl font-extrabold text-emerald-400 font-mono">
              ${stats.fleet_punctuality_pct.toFixed(1)}%
            </div>
            <p class="text-[10px] text-gray-400">Buses maintaining nominal speed & on schedule</p>
          </div>

          <!-- KPI 2: Low-Floor Accessibility Ratio -->
          <div class="glass-panel p-4 space-y-1.5 border-t-2 border-t-purple-500 relative overflow-hidden">
            <div class="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase">
              <span>Low-Floor Ratio</span>
              <span class="text-purple-400">♿</span>
            </div>
            <div class="text-2xl font-extrabold text-purple-400 font-mono">
              ${(stats.low_floor_availability_ratio * 100).toFixed(0)}%
            </div>
            <p class="text-[10px] text-gray-400">${stats.low_floor_buses_active} of ${stats.total_active_buses} in active service</p>
          </div>

          <!-- KPI 3: Average Commuter Wait Time -->
          <div class="glass-panel p-4 space-y-1.5 border-t-2 border-t-cyan-500 relative overflow-hidden">
            <div class="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase">
              <span>Avg Wait Time</span>
              <span class="text-cyan-400">⏳</span>
            </div>
            <div class="text-2xl font-extrabold text-cyan-400 font-mono">
              ${stats.average_wait_time_min.toFixed(1)} <span class="text-xs font-normal text-gray-400">min</span>
            </div>
            <p class="text-[10px] text-gray-400">Arterial corridor stop headway</p>
          </div>

          <!-- KPI 4: Active Safety Reports -->
          <div class="glass-panel p-4 space-y-1.5 border-t-2 border-t-rose-500 relative overflow-hidden">
            <div class="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase">
              <span>Safety Reports</span>
              <span class="text-rose-400">🚨</span>
            </div>
            <div class="text-2xl font-extrabold text-rose-400 font-mono">
              ${stats.active_safety_reports} <span class="text-xs font-normal text-gray-400">Open</span>
            </div>
            <p class="text-[10px] text-gray-400">Anonymous commuter dispatches</p>
          </div>

          <!-- KPI 5: Estimated Corridor Ridership -->
          <div class="glass-panel p-4 space-y-1.5 border-t-2 border-t-amber-500 relative overflow-hidden">
            <div class="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase">
              <span>Daily Ridership</span>
              <span class="text-amber-400">👥</span>
            </div>
            <div class="text-2xl font-extrabold text-amber-400 font-mono">
              ${stats.total_estimated_passengers.toLocaleString()}
            </div>
            <p class="text-[10px] text-gray-400">Cumulative estimated passengers</p>
          </div>

        </div>

        <!-- 2-COLUMN ANALYTICS SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Column 1: Route Travel Times & Schedule Variance -->
          <div class="glass-panel p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <span>🚌 Corridor Travel Times & Schedule Variance</span>
                </h3>
                <p class="text-[11px] text-gray-400">Actual vs Scheduled completion time per arterial route</p>
              </div>
              <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">5 Arterials</span>
            </div>

            <div class="space-y-3">
              ${stats.route_travel_times.map(r => {
                const statusColor = r.status === 'ON_TIME' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                                   r.status === 'MODERATE_DELAY' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                                   'text-rose-400 bg-rose-500/10 border-rose-500/30';
                
                const pctOfSched = Math.min(100, Math.round((r.scheduled_travel_time_min / r.avg_travel_time_min) * 100));

                return `
                  <div class="p-3 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <span class="px-2 py-0.5 rounded bg-cyan-600 text-white font-mono font-bold text-xs">
                          ${r.route_code}
                        </span>
                        <span class="text-xs font-semibold text-white">Route ${r.route_code} Corridor</span>
                      </div>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor} font-mono">
                        ${r.delay_min > 0 ? `+${r.delay_min} min delay` : 'On Schedule'}
                      </span>
                    </div>

                    <div class="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1 text-gray-300">
                      <div>Actual: <strong class="text-white">${r.avg_travel_time_min}m</strong></div>
                      <div>Scheduled: <strong class="text-gray-400">${r.scheduled_travel_time_min}m</strong></div>
                      <div>Avg Speed: <strong class="text-cyan-300">${r.avg_speed_kmh} km/h</strong></div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden flex">
                      <div class="bg-emerald-500 h-2" style="width: ${pctOfSched}%" title="Scheduled Base"></div>
                      <div class="${r.delay_min > 5 ? 'bg-rose-500' : 'bg-amber-500'} h-2" style="width: ${100 - pctOfSched}%" title="Traffic Delay"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Column 2: Hourly Passenger Load & Demand Curve -->
          <div class="glass-panel p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <span>📈 Hourly Passenger Volume & Load Curve</span>
                </h3>
                <p class="text-[11px] text-gray-400">Peak hour passenger surge across morning & evening peaks</p>
              </div>
              <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">Real-Time Sensor</span>
            </div>

            <!-- Visual Bar / Load Curve -->
            <div class="space-y-2 pt-2">
              <div class="grid grid-cols-6 gap-2 text-center text-[10px]">
                ${stats.hourly_passenger_load.slice(0, 6).map(h => `
                  <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-2 space-y-1">
                    <div class="text-gray-400 font-mono">${h.formatted_hour}</div>
                    <div class="h-16 flex items-end justify-center">
                      <div 
                        class="w-5 rounded-t transition-all ${h.avg_load_pct >= 85 ? 'bg-rose-500' : (h.avg_load_pct >= 60 ? 'bg-amber-500' : 'bg-cyan-500')}"
                        style="height: ${Math.max(12, h.avg_load_pct)}%"
                        title="${h.passenger_volume} passengers (${h.avg_load_pct}% load)"
                      ></div>
                    </div>
                    <div class="font-bold text-white font-mono text-[9px]">${h.avg_load_pct}%</div>
                  </div>
                `).join('')}
              </div>

              <div class="grid grid-cols-6 gap-2 text-center text-[10px]">
                ${stats.hourly_passenger_load.slice(6, 12).map(h => `
                  <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-2 space-y-1">
                    <div class="text-gray-400 font-mono">${h.formatted_hour}</div>
                    <div class="h-16 flex items-end justify-center">
                      <div 
                        class="w-5 rounded-t transition-all ${h.avg_load_pct >= 85 ? 'bg-rose-500' : (h.avg_load_pct >= 60 ? 'bg-amber-500' : 'bg-cyan-500')}"
                        style="height: ${Math.max(12, h.avg_load_pct)}%"
                        title="${h.passenger_volume} passengers (${h.avg_load_pct}% load)"
                      ></div>
                    </div>
                    <div class="font-bold text-white font-mono text-[9px]">${h.avg_load_pct}%</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Corridor Bottleneck Highlight -->
            <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 space-y-1 text-xs">
              <div class="text-amber-300 font-bold flex items-center gap-1">
                <span>⚠️</span>
                <span>Active Demand Congestion Hotspot</span>
              </div>
              <p class="text-[11px] text-amber-200">
                Evening Peak (17:00 - 19:00): Anna Salai & 100 Feet Road corridor buses are at 96-98% capacity. Additional headway frequency injection recommended.
              </p>
            </div>
          </div>

        </div>

        <!-- ANONYMOUS SAFETY INCIDENT REPORTS AUDIT LOG (Feature B Authority Log) -->
        <div class="glass-panel p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-base">
                🚨
              </span>
              <div>
                <h3 class="text-sm font-bold text-white">Anonymous Commuter Safety Incident Log</h3>
                <p class="text-[11px] text-gray-400">Zero-PII crowd-sourced safety and driver accountability audit stream</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1 font-mono">
                <span>🛡️ ZERO PII RETAINED</span>
              </span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-gray-950/80 text-gray-400 uppercase text-[10px] font-mono border-b border-gray-800">
                <tr>
                  <th class="p-3">Report ID</th>
                  <th class="p-3">Vehicle ID</th>
                  <th class="p-3">Incident Category</th>
                  <th class="p-3">Details / Observations</th>
                  <th class="p-3">Timestamp</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">PII Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800/60 font-mono text-[11px]">
                ${reports.length === 0 ? `
                  <tr>
                    <td colspan="7" class="p-6 text-center text-gray-400 font-sans">
                      No safety reports filed yet in this session. Use the "🚨 Report Safety" button in the Commuter App to file a simulated report.
                    </td>
                  </tr>
                ` : reports.map(rep => `
                  <tr class="hover:bg-rose-500/5 transition">
                    <td class="p-3 font-bold text-gray-300 font-mono">${rep.id}</td>
                    <td class="p-3 font-bold text-cyan-300">${rep.bus_id}</td>
                    <td class="p-3 text-rose-300 font-semibold font-sans">${rep.incident_type}</td>
                    <td class="p-3 text-gray-300 max-w-xs truncate font-sans">${rep.description || 'No additional comment'}</td>
                    <td class="p-3 text-gray-400 text-[10px]">${rep.timestamp ? new Date(rep.timestamp).toLocaleTimeString() : 'Just now'}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ${rep.status || 'UNDER_INVESTIGATION'}
                      </span>
                    </td>
                    <td class="p-3 text-right">
                      <span class="text-emerald-400 text-[10px] font-bold font-mono">
                        ${rep.pii_retained ? 'RETAINED' : '✓ ZERO PII'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  async init() {
    await this.refresh();
  },

  async refresh() {
    this.isLoading = true;
    try {
      const [stats, reports] = await Promise.all([
        API.fetchMobilityDashboardStats(),
        API.fetchSafetyReports()
      ]);
      this.data = stats;
      this.reports = reports || [];
      if (window.App) window.App.render(window.store.getState());
    } catch (e) {
      console.warn("Mobility dashboard refresh error:", e);
    } finally {
      this.isLoading = false;
    }
  }
};

window.MobilityDashboard = MobilityDashboard;
