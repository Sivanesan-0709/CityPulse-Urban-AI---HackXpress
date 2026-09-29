// CityPulse Urban AI - Differentiator 3: Urban Event Causality and Evolution Engine
const DifferentiatorCausality = {
  currentRainfall: 45,
  weatherSimulation: {
    root_cause: "Heavy Precipitation (45 mm/h)",
    road_condition: "Multi-point Waterlogging (Anna Salai & Guindy)",
    traffic_density_increase_pct: "+42%",
    bus_average_speed_impact: "-32%",
    cumulative_route_delay: "+15 minutes",
    affected_routes: ["21G", "21A", "5C", "45B", "570"],
    recommended_action: "Reroute 21G via Mount-Poonamallee Road; Dispatch drainage de-watering pumps to Guindy Kathipara."
  },

  render(state) {
    const sim = this.weatherSimulation;

    return `
      <div class="space-y-6">
        <!-- Banner Header -->
        <div class="glass-panel diff-badge-3 p-6 rounded-xl relative overflow-hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/40">
                  SIH Differentiator 3
                </span>
                <span class="text-xs text-gray-400">Urban Intelligence & Root Cause Analysis</span>
              </div>
              <h2 class="text-2xl font-extrabold text-white mt-1">Urban Event Causality & Evolution Engine</h2>
              <p class="text-sm text-gray-300 max-w-3xl mt-1">
                Transcend isolated object detection. Understand <strong>what caused the problem</strong>, <strong>how it evolved over time</strong>, <strong>what was its ripple impact across the city</strong>, and <strong>how it was resolved</strong>.
              </p>
            </div>

            <!-- Quick Trigger -->
            <div>
              <button 
                onclick="DemoControls.trigger('simulate_rain')"
                class="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25 transition flex items-center gap-2"
              >
                <span>🌧️ Trigger Weather Causality Surge</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Causality Chain 1: Monsoon Inundation & Ripple Impact -->
        <div class="glass-panel p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>🌧️ Causality Chain: Meteorological Inundation & Traffic Cascade</span>
              <span class="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono-code font-normal">Active Scenario</span>
            </h3>
            <span class="text-xs text-gray-400 font-mono-code">Guindy - Anna Salai Arterial Corridor</span>
          </div>

          <!-- 5-Node Interactive Causality Flow -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
            <!-- Node 1: Root Cause -->
            <div class="p-3.5 rounded-xl bg-gray-950/80 border border-blue-500/40 flex flex-col justify-between space-y-2">
              <span class="text-[10px] font-bold text-blue-400 uppercase font-mono-code">1. ROOT CAUSE</span>
              <div class="text-2xl">🌧️</div>
              <div class="font-bold text-white text-xs">${sim.root_cause}</div>
              <div class="text-[10px] text-gray-400">South Chennai Corridor</div>
            </div>

            <!-- Node 2: Road Condition -->
            <div class="p-3.5 rounded-xl bg-gray-950/80 border border-cyan-500/40 flex flex-col justify-between space-y-2">
              <span class="text-[10px] font-bold text-cyan-400 uppercase font-mono-code">2. ROAD CONDITION</span>
              <div class="text-2xl">🌊</div>
              <div class="font-bold text-white text-xs">${sim.road_condition}</div>
              <div class="text-[10px] text-gray-400">Center lanes submerged</div>
            </div>

            <!-- Node 3: Traffic Density Impact -->
            <div class="p-3.5 rounded-xl bg-gray-950/80 border border-amber-500/40 flex flex-col justify-between space-y-2">
              <span class="text-[10px] font-bold text-amber-400 uppercase font-mono-code">3. TRAFFIC DENSITY</span>
              <div class="text-2xl">🚗</div>
              <div class="font-extrabold text-amber-400 text-lg font-mono-code">${sim.traffic_density_increase_pct}</div>
              <div class="text-[10px] text-gray-400">Vehicles bottlenecked</div>
            </div>

            <!-- Node 4: Bus Fleet Impact -->
            <div class="p-3.5 rounded-xl bg-gray-950/80 border border-rose-500/40 flex flex-col justify-between space-y-2">
              <span class="text-[10px] font-bold text-rose-400 uppercase font-mono-code">4. BUS FLEET SPEED</span>
              <div class="text-2xl">📉</div>
              <div class="font-extrabold text-rose-400 text-lg font-mono-code">${sim.bus_average_speed_impact}</div>
              <div class="text-[10px] text-gray-400">Drops to 14.2 km/h</div>
            </div>

            <!-- Node 5: Route Cumulative Delay -->
            <div class="p-3.5 rounded-xl bg-gray-950/80 border border-purple-500/40 flex flex-col justify-between space-y-2">
              <span class="text-[10px] font-bold text-purple-400 uppercase font-mono-code">5. ROUTE DELAY</span>
              <div class="text-2xl">⏱️</div>
              <div class="font-extrabold text-purple-400 text-lg font-mono-code">${sim.cumulative_route_delay}</div>
              <div class="text-[10px] text-gray-400">Routes: ${sim.affected_routes.slice(0, 3).join(', ')}</div>
            </div>
          </div>

          <!-- Interactive Rainfall Slider & AI Action Recommendation -->
          <div class="p-4 rounded-xl bg-gray-950/90 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="w-full md:w-1/2 space-y-1">
              <div class="flex justify-between text-xs font-bold text-gray-300">
                <span>Interactive Weather Simulator:</span>
                <span class="text-cyan-400 font-mono-code" id="rain-label">${this.currentRainfall} mm/h Precipitation</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value="${this.currentRainfall}" 
                oninput="DifferentiatorCausality.onRainChange(this.value)"
                class="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div class="w-full md:w-1/2 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs">
              <span class="font-bold text-cyan-300">🤖 AI Recommendation:</span>
              <p class="text-gray-300 text-[11px] mt-0.5">${sim.recommended_action}</p>
            </div>
          </div>
        </div>

        <!-- Event Evolution Timeline: PTH-001 (Day 1 to Day 15 Lifecycle) -->
        <div class="glass-panel p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <span>📈 Multi-Day Structural Evolution Timeline</span>
                <span class="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code font-normal">PTH-001 Lifecycle</span>
              </h3>
              <p class="text-xs text-gray-400">Tracking micro-crack formation to critical pothole crater and post-repair verification</p>
            </div>
            <span class="text-xs font-bold text-emerald-400 font-mono-code">Status: REPAIR VERIFIED</span>
          </div>

          <!-- Timeline Stepper -->
          <div class="relative border-l-2 border-cyan-500/40 ml-4 pl-6 space-y-6">
            <!-- Day 1 -->
            <div class="relative group">
              <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-gray-900 shadow"></div>
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span class="text-xs font-bold text-cyan-400 font-mono-code">DAY 1 (Initial Formation)</span>
                <span class="text-[11px] text-gray-400 font-mono-code">Observed by BUS-01</span>
              </div>
              <div class="text-sm font-semibold text-white mt-0.5">Minor Surface Asphalt Micro-Crack</div>
              <p class="text-xs text-gray-400">Severity: 32% • Diameter: 14 cm, Depth: 2 cm • Traffic Stress: Moderate</p>
            </div>

            <!-- Day 5 -->
            <div class="relative group">
              <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-900 shadow"></div>
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span class="text-xs font-bold text-blue-400 font-mono-code">DAY 5 (Cavity Expansion)</span>
                <span class="text-[11px] text-gray-400 font-mono-code">Observed by BUS-05</span>
              </div>
              <div class="text-sm font-semibold text-white mt-0.5">Asphalt Depression & Edge Erosion</div>
              <p class="text-xs text-gray-400">Severity: 51% • Diameter: 28 cm, Depth: 5 cm • Monsoon rain water ingress accelerates degradation</p>
            </div>

            <!-- Day 10 -->
            <div class="relative group">
              <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-rose-500 border-4 border-gray-900 shadow"></div>
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span class="text-xs font-bold text-rose-400 font-mono-code">DAY 10 (Critical Defect)</span>
                <span class="text-[11px] text-gray-400 font-mono-code">Observed by BUS-08 & BUS-12</span>
              </div>
              <div class="text-sm font-semibold text-white mt-0.5">Severe 9cm Pothole Crater (Near-Miss Swerving Risk)</div>
              <p class="text-xs text-gray-400">Severity: 84% (Critical) • Diameter: 48 cm, Depth: 9 cm • System auto-flags critical safety alert</p>
            </div>

            <!-- Day 12 -->
            <div class="relative group">
              <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-gray-900 shadow"></div>
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span class="text-xs font-bold text-amber-400 font-mono-code">DAY 12 (Work Order Dispatched)</span>
                <span class="text-[11px] text-gray-400 font-mono-code">Municipal Authority</span>
              </div>
              <div class="text-sm font-semibold text-white mt-0.5">Assigned to Chennai Corporation Div-5 PWD</div>
              <p class="text-xs text-gray-400">Work order WO-891 issued for urgent bituminized cold-mix patch repair</p>
            </div>

            <!-- Day 14 -->
            <div class="relative group">
              <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-400 border-4 border-gray-900 shadow"></div>
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span class="text-xs font-bold text-amber-300 font-mono-code">DAY 14 (Contractor Claim)</span>
                <span class="text-[11px] text-gray-400 font-mono-code">PWD Portal</span>
              </div>
              <div class="text-sm font-semibold text-white mt-0.5">Contractor Marked: REPAIR COMPLETED</div>
              <p class="text-xs text-gray-400">Platform queues automated verification on next scheduled bus pass</p>
            </div>

            <!-- Day 15 -->
            <div class="relative group">
              <div class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-400 border-4 border-gray-900 shadow shadow-emerald-400"></div>
              <div class="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span class="text-xs font-bold text-emerald-400 font-mono-code">DAY 15 (Autonomous Re-Scan Verification)</span>
                <span class="text-[11px] text-emerald-300 font-mono-code">BUS-15 Edge AI</span>
              </div>
              <div class="text-sm font-semibold text-white mt-0.5">AI Confirmed: Pothole Resolved (96.4% Confidence)</div>
              <p class="text-xs text-gray-400">Status ➔ <strong class="text-emerald-400">REPAIR VERIFIED</strong> • Work order closed autonomously without manual inspection</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async onRainChange(val) {
    this.currentRainfall = parseInt(val);
    const label = document.getElementById('rain-label');
    if (label) label.innerText = `${val} mm/h Precipitation`;

    const sim = await API.fetchWeatherSimulation ? await API.fetchWeatherSimulation(val) : {
      root_cause: `Heavy Precipitation (${val} mm/h)`,
      road_condition: "Multi-point Waterlogging (Anna Salai & Guindy)",
      traffic_density_increase_pct: `+${Math.min(65, Math.floor(val * 0.95))}%`,
      bus_average_speed_impact: `-${Math.min(55, Math.floor(val * 0.72))}%`,
      cumulative_route_delay: `+${Math.min(30, Math.floor(val * 0.35))} minutes`,
      affected_routes: ["21G", "21A", "5C", "45B", "570"],
      recommended_action: "Reroute 21G via Mount-Poonamallee Road; Dispatch drainage de-watering pumps to Guindy Kathipara."
    };

    this.weatherSimulation = sim;
    window.App.render(window.store.getState());
  }
};

window.DifferentiatorCausality = DifferentiatorCausality;
