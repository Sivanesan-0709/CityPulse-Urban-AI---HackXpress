// CityPulse Urban AI - Single Demo Health & Diagnostic View
const DemoHealthPanel = {
  healthData: null,
  isLoading: false,

  async fetchHealth() {
    this.isLoading = true;
    if (window.App) window.App.render(window.store.getState());
    try {
      const data = await window.API.fetchDemoHealth();
      this.healthData = data;
    } catch (err) {
      console.error("Demo health fetch error:", err);
      this.healthData = null;
    } finally {
      this.isLoading = false;
      if (window.App) window.App.render(window.store.getState());
    }
  },

  render(state) {
    if (!this.healthData && !this.isLoading) {
      setTimeout(() => this.fetchHealth(), 50);
    }

    const data = this.healthData;
    const checks = data ? data.checks : {};
    const overallGreen = data && data.overall_status === "GREEN";

    return `
      <div class="space-y-6 max-w-6xl mx-auto">
        <!-- Top Title & Overall Banner -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/90 border border-gray-800 rounded-xl p-6 backdrop-blur-md shadow-2xl">
          <div>
            <div class="flex items-center space-x-3 mb-1">
              <span class="px-2.5 py-1 text-xs font-bold rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                HARDENING PASS DIAGNOSTICS
              </span>
              <span class="text-xs text-gray-400">DATA_MODE = <strong class="text-white">${data ? data.data_mode : 'HYBRID'}</strong></span>
            </div>
            <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Demo System Health Dashboard
            </h1>
            <p class="text-xs text-gray-400 mt-1">
              Live status verification for Pretrained Models, Phone Tracker GPS, OSRM Routing, Spatial Stops DB, and WebSockets.
            </p>
          </div>

          <div class="flex items-center space-x-4">
            <button 
              onclick="DemoHealthPanel.fetchHealth()" 
              class="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <svg class="w-4 h-4 ${this.isLoading ? 'animate-spin text-cyan-400' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>Refresh Health</span>
            </button>

            <div class="px-5 py-3 rounded-xl border flex items-center space-x-3 ${overallGreen ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/40 border-rose-500/50 text-rose-300'}">
              <div class="w-4 h-4 rounded-full flex items-center justify-center ${overallGreen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}">
                <div class="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div class="text-[10px] uppercase font-bold tracking-wider opacity-80">Overall System</div>
                <div class="text-sm font-black">${overallGreen ? 'DEMO READY (GREEN)' : 'ATTENTION (DEGRADED)'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Health Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- 1. AI Models Check -->
          ${this.renderCard({
            key: 'models',
            check: checks.models,
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>`
          })}

          <!-- 2. Phone Tracker GPS Feed Check -->
          ${this.renderCard({
            key: 'gps_feed',
            check: checks.gps_feed,
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>`
          })}

          <!-- 3. OSRM Routing Check -->
          ${this.renderCard({
            key: 'osrm',
            check: checks.osrm,
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>`
          })}

          <!-- 4. Bus Stops Loaded Check -->
          ${this.renderCard({
            key: 'stops_loaded',
            check: checks.stops_loaded,
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5"/>`
          })}

          <!-- 5. WebSocket Connection Check -->
          ${this.renderCard({
            key: 'websocket',
            check: checks.websocket,
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`
          })}

          <!-- 6. Pre-Demo Script Validation Card -->
          <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Demo Command</span>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">READY</span>
              </div>
              <h3 class="text-sm font-bold text-white mb-1">Pre-Demo Preparer</h3>
              <p class="text-xs text-gray-400 mb-3">Run python scripts/prepare_demo.py before evaluations to pre-download weights & pre-cache OSRM routes.</p>
            </div>
            <div class="bg-gray-950 p-2.5 rounded-lg border border-gray-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
              python scripts/prepare_demo.py
            </div>
          </div>
        </div>

        <!-- Detailed Model Breakdown Panel -->
        ${data && checks.models && checks.models.details ? `
          <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-6 backdrop-blur-md">
            <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
              Registered Pretrained AI Models (Load & Performance Audit)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${checks.models.details.map(m => `
                <div class="p-4 rounded-lg bg-gray-950/70 border border-gray-800 flex flex-col justify-between space-y-2">
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-bold text-white">${m.name}</span>
                      <span class="px-2 py-0.5 text-[10px] font-bold rounded ${m.load_state === 'loaded' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}">
                        ${m.load_state.toUpperCase()}
                      </span>
                    </div>
                    <div class="text-[11px] text-gray-400">Target: <span class="text-gray-200 font-medium">${m.target_use}</span></div>
                    <div class="text-[11px] text-gray-400">Device: <span class="text-cyan-300 font-mono">${m.device}</span></div>
                  </div>
                  <div class="pt-2 border-t border-gray-800 text-[10px] space-y-1">
                    <div class="flex justify-between text-gray-400">
                      <span>Weights Source:</span>
                      <span class="text-gray-300 truncate max-w-[150px]">${m.weights_source}</span>
                    </div>
                    <div class="flex justify-between text-gray-400">
                      <span>Licence:</span>
                      <span class="text-gray-300">${m.licence}</span>
                    </div>
                    <div class="flex justify-between text-gray-400">
                      <span>Measured Performance:</span>
                      <span class="text-emerald-400 font-mono font-bold">${m.measured_fps ? m.measured_fps + ' FPS' : m.measured_latency_ms ? m.measured_latency_ms + ' ms' : 'SIMULATED'}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderCard({ key, check, icon }) {
    if (!check) {
      return `
        <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-5 backdrop-blur-md animate-pulse">
          <div class="h-4 bg-gray-800 rounded w-1/2 mb-3"></div>
          <div class="h-3 bg-gray-800/60 rounded w-3/4"></div>
        </div>
      `;
    }

    const isGreen = check.status === 'GREEN';
    const isAmber = check.status === 'AMBER';

    const statusBadgeClass = isGreen ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                             isAmber ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                             'bg-rose-500/20 text-rose-300 border-rose-500/40';

    const statusDotClass = isGreen ? 'bg-emerald-400' : isAmber ? 'bg-amber-400' : 'bg-rose-500';

    return `
      <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-gray-700 transition-all">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 ${isGreen ? 'text-emerald-400' : isAmber ? 'text-amber-400' : 'text-rose-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${icon}
              </svg>
              <span class="text-xs font-bold text-white uppercase tracking-wider">${check.label || key}</span>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-bold rounded border ${statusBadgeClass} flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full ${statusDotClass}"></span>
              <span>${check.status}</span>
            </span>
          </div>
          <p class="text-xs text-gray-300 font-medium">${check.summary || 'Verified OK'}</p>
        </div>

        ${check.details ? `
          <div class="bg-gray-950 p-2.5 rounded-lg border border-gray-800 text-[11px] text-gray-400 font-mono space-y-1">
            ${Object.entries(check.details).map(([k, v]) => {
              if (typeof v === 'object' && v !== null) return '';
              return `<div class="flex justify-between"><span>${k}:</span><span class="text-cyan-300">${v}</span></div>`;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
};

window.DemoHealthPanel = DemoHealthPanel;
