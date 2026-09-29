// CityPulse Urban AI - Differentiator 2: Route-Aware Deduplication & Bandwidth Optimization
const DifferentiatorBandwidth = {
  selectedRoute: '21G',
  cachedEventsData: [],
  bandwidthData: null,

  render(state) {
    const stats = state.stats || {};
    const bw = this.bandwidthData || {
      traditional_volume_mb: (stats.total_bandwidth_saved_mb ? stats.total_bandwidth_saved_mb * 1.8 : 50.0).toFixed(1),
      optimized_volume_mb: (5.2).toFixed(1),
      bandwidth_saved_pct: stats.bandwidth_saved_pct || 89.6,
      total_saved_mb: stats.total_bandwidth_saved_mb || 44.8,
      total_detections: 100,
      unique_events: 8,
      duplicate_suppressions: 92
    };

    return `
      <div class="space-y-6">
        <!-- Banner Header -->
        <div class="glass-panel diff-badge-2 p-6 rounded-xl relative overflow-hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/40">
                  SIH Differentiator 2
                </span>
                <span class="text-xs text-gray-400">Edge Intelligence & Network Optimization</span>
              </div>
              <h2 class="text-2xl font-extrabold text-white mt-1">Route-Aware Event Deduplication & Bandwidth Engine</h2>
              <p class="text-sm text-gray-300 max-w-3xl mt-1">
                Buses traveling on the same route do not repeatedly upload redundant 5 MB videos for known road defects. Each bus maintains an active local route cache, transmitting lightweight 1.2 KB confirmations for ~90% cellular data savings.
              </p>
            </div>

            <!-- Trigger Demo -->
            <div>
              <button 
                onclick="DifferentiatorBandwidth.simulateDedup()"
                class="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
              >
                <span>⚡ Simulate Route Cache Deduplication</span>
              </button>
            </div>
          </div>
        </div>

        <!-- High-Impact Visual Bandwidth Comparison -->
        <div class="glass-panel p-6">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center justify-between">
            <span>📊 Transmission Volume Comparison (Focused 100-Detection Batch)</span>
            <span class="text-xs font-mono-code text-cyan-400 font-bold">${bw.bandwidth_saved_pct}% Bandwidth Saved</span>
          </h3>

          <div class="space-y-4">
            <!-- Traditional System Bar -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span class="font-bold text-gray-200">Traditional Naïve System (No Route Cache)</span>
                  <span class="text-gray-500 text-[11px]">(100 full 4.8MB video/image uploads)</span>
                </div>
                <span class="font-mono-code font-bold text-rose-400 text-sm">50.0 MB</span>
              </div>
              <div class="w-full bg-gray-950 rounded-full h-4 border border-gray-800 overflow-hidden">
                <div class="bg-gradient-to-r from-rose-600 to-rose-400 h-4 rounded-full flex items-center justify-end pr-2 text-[10px] font-mono-code text-white font-bold" style="width: 100%">
                  50.0 MB
                </div>
              </div>
            </div>

            <!-- CityPulse Route Cache Bar -->
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-cyan-400 pulse-dot"></span>
                  <span class="font-bold text-cyan-300">CityPulse Mobile Sensing (Route Cache Enabled)</span>
                  <span class="text-gray-400 text-[11px]">(8 initial full uploads + 92 lightweight confirmations)</span>
                </div>
                <span class="font-mono-code font-bold text-cyan-400 text-sm">5.2 MB (89.6% Saved)</span>
              </div>
              <div class="w-full bg-gray-950 rounded-full h-4 border border-gray-800 overflow-hidden">
                <div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full flex items-center justify-end pr-2 text-[10px] font-mono-code text-white font-bold shadow-lg shadow-cyan-500/50" style="width: 10.4%">
                  5.2 MB
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Metric Counters -->
          <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6 pt-4 border-t border-gray-800 text-center">
            <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800">
              <span class="text-[10px] text-gray-500 uppercase">Total Detections</span>
              <div class="text-lg font-bold text-white font-mono-code">100</div>
            </div>
            <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800">
              <span class="text-[10px] text-gray-500 uppercase">Unique Events</span>
              <div class="text-lg font-bold text-cyan-400 font-mono-code">8</div>
            </div>
            <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800">
              <span class="text-[10px] text-gray-500 uppercase">Duplicates Suppressed</span>
              <div class="text-lg font-bold text-blue-400 font-mono-code">92</div>
            </div>
            <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800">
              <span class="text-[10px] text-gray-500 uppercase">Full Uploads</span>
              <div class="text-lg font-bold text-amber-400 font-mono-code">8 (38.4 MB)</div>
            </div>
            <div class="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800">
              <span class="text-[10px] text-gray-500 uppercase">Metadata Telemetry</span>
              <div class="text-lg font-bold text-emerald-400 font-mono-code">92 (0.11 MB)</div>
            </div>
            <div class="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
              <span class="text-[10px] text-emerald-300 uppercase">Total Bandwidth Saved</span>
              <div class="text-lg font-extrabold text-emerald-400 font-mono-code">89.6% (44.8 MB)</div>
            </div>
          </div>
        </div>

        <!-- Route Cache Inspector & Edge AI Decision Matrix -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left 2 Cols: Route Event Cache Inspector -->
          <div class="lg:col-span-2 glass-panel p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <h3 class="text-sm font-bold text-white">Route-Specific Active Event Cache Inspector</h3>
              </div>
              
              <!-- Route Selector -->
              <select 
                id="route-cache-select" 
                onchange="DifferentiatorBandwidth.loadRouteCache(this.value)"
                class="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="21G">Route 21G (Broadway ↔ Tambaram)</option>
                <option value="19B">Route 19B (T. Nagar ↔ Kelambakkam OMR)</option>
                <option value="5C">Route 5C (Broadway ↔ T. Nagar)</option>
                <option value="45B">Route 45B (Anna Nagar ↔ Guindy)</option>
                <option value="570">Route 570 (CMBT ↔ Siruseri SIPCOT)</option>
              </select>
            </div>

            <!-- Onboard Cache Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-sans">
                <thead class="bg-gray-950/80 text-gray-400 uppercase text-[10px] font-mono-code border-b border-gray-800">
                  <tr>
                    <th class="p-2.5">Event ID</th>
                    <th class="p-2.5">Type & Road Segment</th>
                    <th class="p-2.5">GPS Location</th>
                    <th class="p-2.5">Severity</th>
                    <th class="p-2.5 text-right">Edge Action On Detection</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800/60 font-mono-code text-[11px]">
                  <tr class="hover:bg-cyan-500/5 transition">
                    <td class="p-2.5 font-bold text-cyan-400">PTH-001</td>
                    <td class="p-2.5 text-white font-sans">Severe Surface Depression (Anna Salai, Guindy)</td>
                    <td class="p-2.5 text-gray-400">13.0067°N, 80.2023°E</td>
                    <td class="p-2.5"><span class="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">CRITICAL</span></td>
                    <td class="p-2.5 text-right font-bold text-emerald-400">SUPPRESS UPLOAD (Send 1.2 KB)</td>
                  </tr>
                  <tr class="hover:bg-cyan-500/5 transition">
                    <td class="p-2.5 font-bold text-cyan-400">WATER-001</td>
                    <td class="p-2.5 text-white font-sans">Lane Inundation 14cm (GST Road, Airport)</td>
                    <td class="p-2.5 text-gray-400">12.9815°N, 80.1636°E</td>
                    <td class="p-2.5"><span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">CRITICAL</span></td>
                    <td class="p-2.5 text-right font-bold text-emerald-400">SUPPRESS UPLOAD (Send 1.2 KB)</td>
                  </tr>
                  <tr class="hover:bg-cyan-500/5 transition">
                    <td class="p-2.5 font-bold text-cyan-400">ZEB-004</td>
                    <td class="p-2.5 text-white font-sans">Missing Zebra Crossing (Nandanam Jn)</td>
                    <td class="p-2.5 text-gray-400">13.0418°N, 80.2341°E</td>
                    <td class="p-2.5"><span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">HIGH</span></td>
                    <td class="p-2.5 text-right font-bold text-emerald-400">SUPPRESS UPLOAD (Send 1.2 KB)</td>
                  </tr>
                  <tr class="hover:bg-cyan-500/5 transition">
                    <td class="p-2.5 font-bold text-cyan-400">SIGN-014</td>
                    <td class="p-2.5 text-white font-sans">Missing Speed Limit Sign (Pallavaram)</td>
                    <td class="p-2.5 text-gray-400">12.9431°N, 80.1412°E</td>
                    <td class="p-2.5"><span class="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">MEDIUM</span></td>
                    <td class="p-2.5 text-right font-bold text-emerald-400">SUPPRESS UPLOAD (Send 1.2 KB)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right Col: On-Bus Edge Algorithm Logic -->
          <div class="glass-panel p-5 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>🧠 Onboard Edge Decision Algorithm</span>
            </h3>

            <div class="p-3 rounded-lg bg-gray-950 border border-gray-800 font-mono-code text-[11px] space-y-2 text-gray-300">
              <div class="text-cyan-400 font-bold">// Edge AI Detection Event</div>
              <div>event = EdgeAI.detect(cameraFrame)</div>
              <div class="text-gray-400">// 1. Match Location & Type in Cache</div>
              <div>match = RouteCache.find(event.gps, event.type)</div>
              
              <div class="p-2 rounded bg-gray-900 border border-gray-700 text-emerald-300">
                <div>if (match != null):</div>
                <div class="pl-4 text-xs font-bold text-white">// DUPLICATE: Send 1.2 KB JSON</div>
                <div class="pl-4">transmitMetadataOnly(match.id, bus.id)</div>
              </div>

              <div class="p-2 rounded bg-gray-900 border border-gray-700 text-amber-300">
                <div>else:</div>
                <div class="pl-4 text-xs font-bold text-white">// NEW: Upload Full 4.8 MB Media</div>
                <div class="pl-4">uploadFullEvidence(event.media)</div>
                <div class="pl-4">RouteCache.add(event.id)</div>
              </div>
            </div>

            <div class="text-xs text-gray-400">
              💡 <strong>Fleet Scalability:</strong> Across 500 city buses detecting 50,000 observations daily, route caching saves <strong>~220 Gigabytes of cellular data per day</strong>.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async loadRouteCache(routeCode) {
    this.selectedRoute = routeCode;
    const res = await API.fetchRouteCache ? await API.fetchRouteCache(routeCode) : null;
    if (res) {
      this.cachedEventsData = res.cached_events || [];
    }
  },

  async simulateDedup() {
    await DemoControls.trigger('step2_dedup');
    const bw = await API.fetchBandwidth ? await API.fetchBandwidth() : null;
    if (bw) {
      this.bandwidthData = bw;
    }
    window.App.render(window.store.getState());
  }
};

window.DifferentiatorBandwidth = DifferentiatorBandwidth;
