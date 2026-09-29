// CityPulse Urban AI - Alert Dispatch Center Component
const AlertCenter = {
  render(state) {
    const alerts = [
      {
        id: "ALT-001",
        title: "🚨 Hit-and-Run Incident Auto-Dispatched",
        priority: "CRITICAL",
        location: "Anna Salai near DMS Metro",
        time: "10 mins ago",
        detail: "BUS-04 Rear Camera captured white SUV (TN-09-AB-1234) overtaking rashly and hitting barrier at 68 km/h.",
        action: "Transmitted to Greater Chennai Traffic Police Control Room"
      },
      {
        id: "ALT-002",
        title: "🌊 Critical Waterlogging Inundation",
        priority: "CRITICAL",
        location: "GST Road, Near Airport Subway",
        time: "24 mins ago",
        detail: "Water depth 14cm across center lanes. 3 buses confirmed. Vehicle speed reduced by 48%.",
        action: "PWD Emergency De-watering Pumps Dispatched"
      },
      {
        id: "ALT-003",
        title: "⚠️ Severe 9cm Pothole (High Near-Miss Risk)",
        priority: "HIGH",
        location: "Anna Salai, Guindy Kathipara Junction",
        time: "45 mins ago",
        detail: "PTH-001 confirmed by 4 buses (97.4% AI Conf). Vehicles swerving abruptly.",
        action: "Work Order WO-891 issued for rapid asphalt patching"
      },
      {
        id: "ALT-004",
        title: "🚦 Malfunctioning Traffic Signal",
        priority: "HIGH",
        location: "T. Nagar Panagal Park Signal",
        time: "1 hour ago",
        detail: "Signal blinking yellow. 88% intersection density bottleneck.",
        action: "Traffic Signal Maintenance Crew en route"
      }
    ];

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Emergency Alert Dispatch Center
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Priority Dispatch Queue
                </span>
              </h2>
              <p class="text-xs text-gray-400">Automated routing of high-severity urban hazards to police, municipal PWD, and emergency services</p>
            </div>
          </div>
        </div>

        <!-- Alerts List -->
        <div class="space-y-3">
          ${alerts.map(a => `
            <div class="glass-panel p-5 rounded-xl border ${a.priority === 'CRITICAL' ? 'border-rose-500/40' : 'border-amber-500/40'} space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center space-x-2">
                  <span class="w-2.5 h-2.5 rounded-full ${a.priority === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}"></span>
                  <h3 class="text-sm font-bold text-white">${a.title}</h3>
                </div>
                <div class="flex items-center space-x-2 text-xs">
                  <span class="px-2 py-0.5 rounded font-bold font-mono-code ${a.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}">
                    ${a.priority}
                  </span>
                  <span class="text-gray-400 font-mono-code">${a.time}</span>
                </div>
              </div>

              <p class="text-xs text-gray-300">${a.detail}</p>

              <div class="p-2.5 rounded-lg bg-gray-950/80 border border-gray-800 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-2 text-gray-400">
                  <span>📍 <strong>Location:</strong> ${a.location}</span>
                </div>
                <div class="text-cyan-300 font-semibold font-mono-code">
                  Action: ${a.action}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.AlertCenter = AlertCenter;
