// CityPulse Urban AI - Road Condition Intelligence
const RoadConditions = {
  render(state) {
    const roads = [
      {
        road_name: "Anna Salai (Mount Road)",
        health_score: 54,
        status: "CRITICAL",
        potholes: 8,
        cracks: 14,
        waterlogging: "HIGH",
        pci: "Fair to Poor (PCI: 52)",
        cost: "₹ 14.5 Lakhs",
        color: "text-rose-400 border-rose-500/40 bg-rose-500/10"
      },
      {
        road_name: "Rajiv Gandhi Salai (OMR IT Corridor)",
        health_score: 78,
        status: "GOOD",
        potholes: 3,
        cracks: 6,
        waterlogging: "MEDIUM",
        pci: "Good (PCI: 78)",
        cost: "₹ 6.2 Lakhs",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      },
      {
        road_name: "Jawaharlal Nehru Road (100 Ft Rd)",
        health_score: 48,
        status: "CRITICAL",
        potholes: 11,
        cracks: 19,
        waterlogging: "HIGH",
        pci: "Poor (PCI: 46)",
        cost: "₹ 22.8 Lakhs",
        color: "text-rose-400 border-rose-500/40 bg-rose-500/10"
      },
      {
        road_name: "GST Road (Guindy - Tambaram)",
        health_score: 62,
        status: "MODERATE",
        potholes: 6,
        cracks: 10,
        waterlogging: "CRITICAL",
        pci: "Moderate (PCI: 61)",
        cost: "₹ 18.0 Lakhs",
        color: "text-amber-400 border-amber-500/40 bg-amber-500/10"
      },
      {
        road_name: "Kamarajar Salai (Marina Coastal)",
        health_score: 91,
        status: "EXCELLENT",
        potholes: 1,
        cracks: 2,
        waterlogging: "LOW",
        pci: "Excellent (PCI: 91)",
        cost: "₹ 1.8 Lakhs",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      }
    ];

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Road Condition & Pavement Quality Index (PCI)
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI Structural Analysis
                </span>
              </h2>
              <p class="text-xs text-gray-400">Automated surface roughness (IRI) and asphalt degradation index across 178 km</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-400">Citywide Road Health:</span>
            <span class="text-lg font-extrabold text-cyan-400 font-mono-code">66.6 / 100</span>
          </div>
        </div>

        <!-- Road Condition Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${roads.map(r => `
            <div class="glass-panel p-5 rounded-xl border space-y-4 hover:border-cyan-500/50 transition">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-white truncate max-w-[200px]">${r.road_name}</h3>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.color}">
                  ${r.status}
                </span>
              </div>

              <!-- Score Gauge -->
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-400">Pavement Health Score:</span>
                  <span class="font-bold font-mono-code text-white">${r.health_score} / 100</span>
                </div>
                <div class="w-full bg-gray-950 rounded-full h-2.5 overflow-hidden">
                  <div class="h-2.5 rounded-full ${r.health_score > 75 ? 'bg-emerald-500' : r.health_score > 55 ? 'bg-amber-500' : 'bg-rose-500'}" style="width: ${r.health_score}%"></div>
                </div>
              </div>

              <!-- Defect Breakdown -->
              <div class="grid grid-cols-3 gap-2 text-center text-xs font-mono-code p-2.5 rounded-lg bg-gray-950/70 border border-gray-800">
                <div>
                  <span class="text-[10px] text-gray-500 block uppercase">Potholes</span>
                  <span class="font-bold text-rose-400">${r.potholes}</span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-500 block uppercase">Cracks</span>
                  <span class="font-bold text-amber-400">${r.cracks}</span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-500 block uppercase">Inundation</span>
                  <span class="font-bold text-blue-400">${r.waterlogging}</span>
                </div>
              </div>

              <div class="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <span>Rating: <strong class="text-gray-300">${r.pci}</strong></span>
                <span>Est. Cost: <strong class="text-cyan-400 font-mono-code">${r.cost}</strong></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.RoadConditions = RoadConditions;
