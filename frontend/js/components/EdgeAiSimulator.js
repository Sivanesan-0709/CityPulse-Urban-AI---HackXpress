// CityPulse Urban AI - Edge AI Simulator Component
const EdgeAiSimulator = {
  activeCamera: 'FRONT',
  selectedBusId: 'BUS-01',

  render(state) {
    const buses = state.buses || [];
    const currentBus = buses.find(b => b.id === this.selectedBusId) || {
      id: "BUS-01",
      route_code: "21G",
      route_name: "Broadway ↔ Tambaram",
      speed_kmh: 32.4
    };

    return `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Onboard Edge AI Multi-Camera Simulator
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Real-Time 60 FPS
                </span>
              </h2>
              <p class="text-xs text-gray-400">Live multi-angle vision inference on mobile sensing bus fleet (Jetson / Edge NPU)</p>
            </div>
          </div>

          <!-- Bus Selector & Camera Quick Switcher -->
          <div class="flex items-center space-x-3">
            <select 
              id="ai-bus-select"
              onchange="EdgeAiSimulator.selectBus(this.value)"
              class="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono-code focus:outline-none focus:border-cyan-500"
            >
              ${buses.slice(0, 10).map(b => `
                <option value="${b.id}" ${b.id === this.selectedBusId ? 'selected' : ''}>${b.id} (${b.route_code})</option>
              `).join('')}
            </select>

            <span class="text-xs font-bold text-cyan-400 font-mono-code">${currentBus.speed_kmh} km/h</span>
          </div>
        </div>

        <!-- Multi-Camera Angle Tabs -->
        <div class="flex flex-wrap gap-2">
          <button 
            onclick="EdgeAiSimulator.selectCamera('FRONT')" 
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${this.activeCamera === 'FRONT' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}"
          >
            <span>📹 Front Camera</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-black/40">Road Defects & Signs</span>
          </button>
          
          <button 
            onclick="EdgeAiSimulator.selectCamera('REAR')" 
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${this.activeCamera === 'REAR' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}"
          >
            <span>📹 Rear Camera</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-black/40">ANPR & Hit-and-Run</span>
          </button>

          <button 
            onclick="EdgeAiSimulator.selectCamera('LEFT')" 
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${this.activeCamera === 'LEFT' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}"
          >
            <span>📹 Left Side Camera</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-black/40">Dividers & Encroachments</span>
          </button>

          <button 
            onclick="EdgeAiSimulator.selectCamera('RIGHT')" 
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${this.activeCamera === 'RIGHT' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}"
          >
            <span>📹 Right Side Camera</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-black/40">Zebra Crossings & Pedestrians</span>
          </button>

          <button 
            onclick="EdgeAiSimulator.selectCamera('CABIN')" 
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${this.activeCamera === 'CABIN' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}"
          >
            <span>📹 Cabin Camera</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-black/40">Crowd & Passenger Safety</span>
          </button>
        </div>

        <!-- Main Video Viewport & Telemetry Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left 2 Cols: High-Tech Simulated Canvas Feed with AI Overlays -->
          <div class="lg:col-span-2 glass-panel p-4 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center space-x-2">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span class="font-bold text-white font-mono-code">REC • ${this.selectedBusId} (${this.activeCamera}_CAM_1080P)</span>
              </div>
              <div class="text-cyan-400 font-mono-code">
                GPS: 13.0067°N, 80.2023°E • Anna Salai
              </div>
            </div>

            <!-- Viewport Screen -->
            <div class="h-96 rounded-xl bg-gray-950 border border-gray-800 relative overflow-hidden flex items-center justify-center select-none shadow-2xl">
              <!-- Grid overlay -->
              <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]"></div>
              
              <!-- Crosshair & Targeting Reticle -->
              <div class="absolute top-4 left-4 font-mono-code text-[11px] text-cyan-400 space-y-0.5">
                <div>AI ENGINE: YOLOv8-Urban-Nano</div>
                <div>INFERENCE LATENCY: 14.2 ms</div>
                <div>LOCAL CACHE STATUS: ACTIVE (Route 21G)</div>
              </div>

              <!-- Dynamic Bounding Boxes Based on Selected Camera -->
              ${this.renderBoundingBoxes()}

              <!-- Bottom Stream Status Bar -->
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono-code text-gray-400 bg-black/70 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-800">
                <div class="flex items-center space-x-3">
                  <span class="text-emerald-400 font-bold">● 60 FPS</span>
                  <span>BITRATE: 4.8 Mbps</span>
                  <span>ENCODER: H.265 / NvEnc</span>
                </div>
                <div class="text-cyan-300 font-bold">
                  TRANSMISSION: 1.2 KB Telemetry (Cache Hit)
                </div>
              </div>
            </div>
          </div>

          <!-- Right Col: Real-time AI Detections & Edge Metrics -->
          <div class="glass-panel p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="text-sm font-bold text-white flex items-center justify-between mb-3">
                <span>Active Target Detections</span>
                <span class="text-xs font-mono-code text-cyan-400">5 Objects in Frame</span>
              </h3>

              <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
                <div class="p-2.5 rounded-lg bg-gray-950/70 border border-rose-500/40 text-xs font-mono-code space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-rose-400">POTHOLE (PTH-001)</span>
                    <span class="text-emerald-400 font-bold">97.4% Conf</span>
                  </div>
                  <div class="text-[11px] text-gray-400">Depth: 9cm • Dia: 48cm • Severity: High</div>
                  <div class="text-[10px] text-cyan-300 font-bold">Action: Suppress Media (Cache Hit)</div>
                </div>

                <div class="p-2.5 rounded-lg bg-gray-950/70 border border-cyan-500/40 text-xs font-mono-code space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-cyan-400">VEHICLE_SEDAN</span>
                    <span class="text-emerald-400 font-bold">96.8% Conf</span>
                  </div>
                  <div class="text-[11px] text-gray-400">Speed: 42 km/h • Lane: Center</div>
                </div>

                <div class="p-2.5 rounded-lg bg-gray-950/70 border border-purple-500/40 text-xs font-mono-code space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-purple-400">ANPR LICENSE PLATE</span>
                    <span class="text-emerald-400 font-bold">94.2% Conf</span>
                  </div>
                  <div class="text-[11px] text-white font-bold">Plate: TN-09-AB-1234</div>
                </div>

                <div class="p-2.5 rounded-lg bg-gray-950/70 border border-amber-500/40 text-xs font-mono-code space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-amber-400">ROAD SIGN (SPEED_40)</span>
                    <span class="text-emerald-400 font-bold">91.5% Conf</span>
                  </div>
                  <div class="text-[11px] text-gray-400">Speed Limit Regulatory Sign</div>
                </div>
              </div>
            </div>

            <!-- Edge Hardware Diagnostics -->
            <div class="p-3 rounded-lg bg-gray-950/80 border border-gray-800 text-[11px] space-y-1.5 font-mono-code">
              <div class="text-gray-400 flex justify-between">
                <span>Edge NPU Load:</span>
                <span class="text-emerald-400 font-bold">42% (2.8 TFLOPS)</span>
              </div>
              <div class="text-gray-400 flex justify-between">
                <span>GPU Temperature:</span>
                <span class="text-emerald-400 font-bold">48°C</span>
              </div>
              <div class="text-gray-400 flex justify-between">
                <span>Memory (RAM):</span>
                <span class="text-cyan-400 font-bold">3.2 / 8.0 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderBoundingBoxes() {
    if (this.activeCamera === 'FRONT') {
      return `
        <!-- Pothole Box -->
        <div class="absolute bottom-16 left-1/3 w-36 h-20 border-2 border-rose-500 bg-rose-500/10 rounded flex flex-col justify-between p-1 z-20 animate-pulse">
          <div class="bg-rose-600 text-white text-[10px] font-mono-code font-bold px-1 rounded w-max">
            POTHOLE: 97.4%
          </div>
          <div class="text-[9px] text-rose-300 font-mono-code text-right">
            [PTH-001 (9cm)]
          </div>
        </div>

        <!-- Vehicle Box -->
        <div class="absolute top-28 right-1/4 w-44 h-32 border-2 border-cyan-400 bg-cyan-500/10 rounded flex flex-col justify-between p-1 z-20">
          <div class="bg-cyan-600 text-white text-[10px] font-mono-code font-bold px-1 rounded w-max">
            CAR: 96.8% (42 km/h)
          </div>
        </div>

        <!-- Road Sign Box -->
        <div class="absolute top-16 left-16 w-20 h-20 border-2 border-amber-400 bg-amber-500/10 rounded flex flex-col justify-between p-1 z-20">
          <div class="bg-amber-600 text-white text-[9px] font-mono-code font-bold px-1 rounded w-max">
            SIGN: 91.5%
          </div>
        </div>
      `;
    } else if (this.activeCamera === 'REAR') {
      return `
        <!-- ANPR Vehicle Box -->
        <div class="absolute top-24 left-1/3 w-56 h-44 border-2 border-purple-500 bg-purple-500/10 rounded flex flex-col justify-between p-1.5 z-20">
          <div class="bg-purple-600 text-white text-[10px] font-mono-code font-bold px-1 rounded w-max">
            VEHICLE: 98.1% (68 km/h)
          </div>
          <div class="bg-black/80 border border-purple-400 p-1 rounded text-center">
            <span class="text-xs font-mono-code font-bold text-white tracking-wider">TN-09-AB-1234</span>
            <div class="text-[9px] text-purple-300 font-mono-code">ANPR OCR: 94.2% Conf</div>
          </div>
        </div>
      `;
    } else if (this.activeCamera === 'RIGHT') {
      return `
        <!-- Zebra Crossing Box -->
        <div class="absolute bottom-12 right-1/4 w-60 h-28 border-2 border-yellow-400 bg-yellow-500/10 rounded flex flex-col justify-between p-1 z-20">
          <div class="bg-yellow-600 text-white text-[10px] font-mono-code font-bold px-1 rounded w-max">
            ZEBRA_CROSSING: 88.4% (Faded 80%)
          </div>
        </div>
        <!-- Pedestrian Box -->
        <div class="absolute top-28 right-16 w-24 h-48 border-2 border-emerald-400 bg-emerald-500/10 rounded flex flex-col justify-between p-1 z-20">
          <div class="bg-emerald-600 text-white text-[9px] font-mono-code font-bold px-1 rounded w-max">
            PEDESTRIAN: 93.2%
          </div>
        </div>
      `;
    } else {
      return `
        <div class="text-center p-6 bg-gray-900/80 rounded-xl border border-gray-800 z-10 font-mono-code text-xs text-gray-300">
          <div class="text-2xl mb-1">📹</div>
          <div>${this.activeCamera} ANGLE INFERENCE ACTIVE</div>
          <div class="text-cyan-400 text-[11px] mt-1">Edge Model: YOLOv8-Urban-Nano • Normal Operation</div>
        </div>
      `;
    }
  },

  selectCamera(camAngle) {
    this.activeCamera = camAngle;
    window.App.render(window.store.getState());
  },

  selectBus(busId) {
    this.selectedBusId = busId;
    window.App.render(window.store.getState());
  }
};

window.EdgeAiSimulator = EdgeAiSimulator;
