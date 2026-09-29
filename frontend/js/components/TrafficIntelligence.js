// CityPulse Urban AI - Traffic Intelligence Component
const TrafficIntelligence = {
  render(state) {
    const corridors = [
      { corridor: "Anna Salai (Central to Guindy)", speed: "22.4 km/h", density: "78%", status: "CONGESTED", delay: "+14 mins", color: "text-rose-400" },
      { corridor: "Rajiv Gandhi Salai (OMR IT Expressway)", speed: "34.8 km/h", density: "62%", status: "MODERATE", delay: "+6 mins", color: "text-amber-400" },
      { corridor: "Jawaharlal Nehru Salai (100 Feet Road)", speed: "18.2 km/h", density: "86%", status: "SEVERE_GRIDLOCK", delay: "+19 mins", color: "text-rose-500" },
      { corridor: "Poonamallee High Road", speed: "26.0 km/h", density: "68%", status: "MODERATE", delay: "+8 mins", color: "text-amber-400" },
      { corridor: "Kamarajar Salai (Marina Coastal Corridor)", speed: "38.5 km/h", density: "44%", status: "FREE_FLOWING", delay: "+2 mins", color: "text-emerald-400" }
    ];

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Traffic Intelligence & Congestion Analytics
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  9 Active Bottlenecks
                </span>
              </h2>
              <p class="text-xs text-gray-400">Mobile sensing bus telemetry estimating vehicular density & arterial bottlenecks</p>
            </div>
          </div>

          <div class="flex items-center space-x-4 text-xs font-mono-code">
            <div>Avg Fleet Speed: <strong class="text-emerald-400 text-sm">31.2 km/h</strong></div>
            <div>Cumulative Delay: <strong class="text-amber-400 text-sm">+49 mins</strong></div>
          </div>
        </div>

        <!-- Corridor Status Table -->
        <div class="glass-panel p-5 space-y-4">
          <h3 class="text-sm font-bold text-white flex items-center justify-between">
            <span>🚦 Arterial Corridor Congestion Matrix</span>
            <span class="text-xs text-gray-400 font-mono-code">Updated 30s ago</span>
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs font-sans">
              <thead class="bg-gray-950/80 text-gray-400 uppercase text-[10px] font-mono-code border-b border-gray-800">
                <tr>
                  <th class="p-3">Corridor</th>
                  <th class="p-3">Avg Bus Speed</th>
                  <th class="p-3">Vehicle Density</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Schedule Delay</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800/60 font-mono-code text-[11px]">
                ${corridors.map(c => `
                  <tr class="hover:bg-cyan-500/5 transition">
                    <td class="p-3 font-bold text-white font-sans">${c.corridor}</td>
                    <td class="p-3 font-bold text-cyan-300">${c.speed}</td>
                    <td class="p-3 text-amber-300 font-bold">${c.density}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${c.color} bg-gray-900 border border-gray-700">${c.status}</span></td>
                    <td class="p-3 font-bold text-rose-400">${c.delay}</td>
                    <td class="p-3 text-right">
                      <button onclick="window.store.setActiveTab('gis-map')" class="text-cyan-400 hover:text-cyan-300 font-sans font-semibold text-xs">
                        View On Map →
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

window.TrafficIntelligence = TrafficIntelligence;
