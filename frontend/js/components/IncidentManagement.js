// CityPulse Urban AI - Incident Management & ANPR Component
const IncidentManagement = {
  render(state) {
    const incidents = state.incidents || [
      {
        id: "INC-001",
        timestamp: "09:12:44 IST",
        location: "Anna Salai near DMS Metro",
        type: "HIT_AND_RUN",
        vehicle_type: "WHITE SUV (Creta)",
        plate_number: "TN-09-AB-1234",
        plate_confidence: 94.2,
        speed_kmh: 68.5,
        detecting_bus_id: "BUS-04",
        camera_angle: "REAR",
        status: "DISPATCHED_TO_POLICE"
      },
      {
        id: "INC-002",
        timestamp: "07:34:10 IST",
        location: "OMR SRP Tools Junction",
        type: "RASH_DRIVING",
        vehicle_type: "SEDAN (Honda City)",
        plate_number: "TN-22-CX-8890",
        plate_confidence: 96.0,
        speed_kmh: 74.0,
        detecting_bus_id: "BUS-07",
        camera_angle: "FRONT",
        status: "UNDER_REVIEW"
      },
      {
        id: "INC-003",
        timestamp: "05:48:22 IST",
        location: "Guindy Kathipara Slip Road",
        type: "RED_LIGHT_VIOLATION",
        vehicle_type: "COMMERCIAL TRUCK",
        plate_number: "TN-10-H-4412",
        plate_confidence: 91.5,
        speed_kmh: 52.0,
        detecting_bus_id: "BUS-15",
        camera_angle: "RIGHT",
        status: "DISPATCHED_TO_POLICE"
      }
    ];

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-rose-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Incident Management & Edge ANPR OCR
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Hit-and-Run Tracker
                </span>
              </h2>
              <p class="text-xs text-gray-400">Mobile sensing bus rear/front cameras capturing hit-and-run incidents with instant license plate recognition</p>
            </div>
          </div>

          <button 
            onclick="DemoControls.trigger('simulate_hit_and_run')"
            class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-2"
          >
            <span>🚨 Simulate Hit-and-Run Incident</span>
          </button>
        </div>

        <!-- Incidents Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          ${incidents.map(inc => `
            <div class="glass-panel p-5 rounded-xl border border-purple-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white font-mono-code">${inc.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  ${inc.type}
                </span>
              </div>

              <!-- ANPR Plate Visual Card -->
              <div class="p-3 rounded-lg bg-black border-2 border-yellow-400/80 text-center space-y-1">
                <span class="text-xs text-yellow-300 font-mono-code block">IND</span>
                <span class="text-lg font-extrabold text-white font-mono-code tracking-widest">${inc.plate_number}</span>
                <div class="text-[10px] text-emerald-400 font-mono-code">ANPR Confidence: ${inc.plate_confidence}%</div>
              </div>

              <div class="space-y-1 text-xs text-gray-300">
                <div class="flex justify-between">
                  <span class="text-gray-500">Vehicle:</span>
                  <span class="font-semibold text-white">${inc.vehicle_type}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Speed:</span>
                  <span class="font-mono-code text-rose-400 font-bold">${inc.speed_kmh} km/h</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Detecting Unit:</span>
                  <span class="font-mono-code text-cyan-300">${inc.detecting_bus_id} (${inc.camera_angle} CAM)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Location:</span>
                  <span class="truncate max-w-[160px]">${inc.location}</span>
                </div>
              </div>

              <div class="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px]">
                <span class="text-emerald-400 font-semibold">${inc.status}</span>
                <span class="text-gray-500 font-mono-code">${inc.timestamp}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.IncidentManagement = IncidentManagement;
