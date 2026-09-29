// CityPulse Urban AI - Dashcam Pothole Detector Component
const DashcamUpload = {
  resultData: null,
  isProcessing: false,

  render(state) {
    const res = this.resultData;

    return `
      <div class="space-y-6 max-w-4xl mx-auto">
        <!-- Top Banner -->
        <div class="glass-panel p-5 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
              📹
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Dashcam Road Defect Intelligence
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Pretrained AI Pipeline
                </span>
              </h2>
              <p class="text-xs text-gray-400">Upload vehicle dashcam video/image frames to detect potholes & automatically generate repair work orders</p>
            </div>
          </div>
        </div>

        <!-- Upload Form Card -->
        <div class="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider">Upload Dashcam Image or Video Frame</h3>

          <form id="dashcam-form" onsubmit="DashcamUpload.handleSubmit(event)" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-300 mb-1 font-semibold">Bus Unit ID</label>
                <input id="dash-bus-id" type="text" value="BUS-01" class="w-full bg-gray-950 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs font-mono" />
              </div>
              <div>
                <label class="block text-xs text-gray-300 mb-1 font-semibold">Route Code</label>
                <input id="dash-route-code" type="text" value="21G" class="w-full bg-gray-950 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs font-mono" />
              </div>
              <div>
                <label class="block text-xs text-gray-300 mb-1 font-semibold">Coordinates (Lat, Lng)</label>
                <input id="dash-coords" type="text" value="13.0067, 80.2023" class="w-full bg-gray-950 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs font-mono" />
              </div>
            </div>

            <div>
              <label class="block text-xs text-gray-300 mb-1 font-semibold">Select Dashcam Image / Video File</label>
              <input id="dash-file-input" type="file" accept="image/*,video/*" required class="w-full bg-gray-950 border border-gray-700 text-gray-300 rounded-xl px-3 py-2 text-xs cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500" />
            </div>

            <button 
              type="submit" 
              ${this.isProcessing ? 'disabled' : ''}
              class="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              ${this.isProcessing ? '⏳ Running Pretrained Model Pipeline...' : '🔍 Run Pothole Detection Pipeline'}
            </button>
          </form>
        </div>

        <!-- Detection Results Panel -->
        ${res ? `
          <div class="glass-panel p-6 rounded-2xl border border-emerald-500/50 space-y-4 animate-fade-in">
            <div class="flex items-center justify-between border-b border-gray-800 pb-3">
              <span class="text-sm font-bold text-white flex items-center gap-2">
                Detection Results
                <span class="px-2.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ${res.pothole_detected ? '⚠️ DEFECT DETECTED' : 'CLEAN ROAD'}
                </span>
              </span>
              <span class="text-xs font-mono-code text-cyan-400 font-bold">${res.data_source}</span>
            </div>

            <!-- Measured Performance Metrics Table (No unmeasured hardcoding) -->
            <div class="grid grid-cols-3 gap-3 text-xs font-mono-code p-3 rounded-xl bg-gray-950/80 border border-gray-800">
              <div>
                <span class="text-[10px] text-gray-500 block uppercase">Measured FPS</span>
                <span class="text-cyan-400 font-bold text-sm">${res.measured_fps} FPS</span>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 block uppercase">Inference Latency</span>
                <span class="text-emerald-400 font-bold text-sm">${res.measured_latency_ms} ms</span>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 block uppercase">Defect Count</span>
                <span class="text-amber-400 font-bold text-sm">${res.detection_count} defects</span>
              </div>
            </div>

            ${res.created_event ? `
              <div class="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2 text-xs">
                <div class="font-bold text-white text-sm flex items-center gap-2">
                  Created Urban Event: <span class="text-cyan-400 font-mono-code">${res.created_event.id}</span>
                </div>
                <div class="text-gray-300"><strong>Type:</strong> ${res.created_event.type} (${res.created_event.subtype})</div>
                <div class="text-gray-300"><strong>Location:</strong> ${res.created_event.road_name}</div>
                <div class="text-gray-300"><strong>Repair Status:</strong> <span class="text-emerald-400 font-bold">${res.created_event.repair_status}</span> (Work order dispatched to PWD)</div>
                <div class="text-[10px] text-gray-400 pt-2 border-t border-gray-800">
                  Auto-added to Route 21G Deduplication Cache & Repair Verification Pipeline.
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  },

  async handleSubmit(event) {
    event.preventDefault();
    const fileInput = document.getElementById('dash-file-input');
    if (!fileInput || !fileInput.files.length) return;

    this.isProcessing = true;
    window.App.render(window.store.getState());

    const coordsStr = document.getElementById('dash-coords')?.value || '13.0067, 80.2023';
    const [lat, lng] = coordsStr.split(',').map(s => parseFloat(s.trim()));

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('lat', lat || 13.0067);
    formData.append('lng', lng || 80.2023);
    formData.append('bus_id', document.getElementById('dash-bus-id')?.value || 'BUS-01');
    formData.append('route_code', document.getElementById('dash-route-code')?.value || '21G');

    const res = await API.uploadDashcamFrame(formData);
    this.resultData = res;
    this.isProcessing = false;

    // Refresh state
    const [events, repairs] = await Promise.all([API.fetchEvents(), API.fetchRepairs()]);
    window.store.setState({ events, repairs });
    window.App.render(window.store.getState());
  }
};

window.DashcamUpload = DashcamUpload;
