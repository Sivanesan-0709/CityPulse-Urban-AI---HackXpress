// CityPulse Urban AI - Pretrained Model Registry Dashboard Panel Component
const ModelStatusPanel = {
  render(state) {
    const models = state.modelsStatus || [];

    return `
      <div class="space-y-6 max-w-5xl mx-auto">
        <!-- Top Banner -->
        <div class="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold">
              🧠
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                Pretrained AI Model Registry & Performance Metrics
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Zero Training / On-Demand
                </span>
              </h2>
              <p class="text-xs text-gray-400">Status, sources, licences, device allocation, and real measured benchmark metrics</p>
            </div>
          </div>

          <button 
            onclick="ModelStatusPanel.refresh()"
            class="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition cursor-pointer"
          >
            ↻ Check Registry Status
          </button>
        </div>

        <!-- Models Status Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${models.length === 0 ? `
            <div class="col-span-3 glass-panel p-8 text-center text-gray-400">Loading model registry status...</div>
          ` : models.map(m => {
            const isLoaded = m.load_state === 'LOADED';
            const statusBadge = isLoaded 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : (m.load_state === 'READY_ON_DEMAND' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40');

            return `
              <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div>
                  <div class="flex items-center justify-between border-b border-gray-800 pb-3">
                    <span class="text-xs font-bold text-white uppercase tracking-wider">${m.name}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}">
                      ${m.load_state}
                    </span>
                  </div>

                  <div class="space-y-2 text-xs pt-3">
                    <div>
                      <span class="text-gray-500 block text-[10px] uppercase font-bold">Source Repository</span>
                      <span class="text-gray-300 font-medium">${m.source}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span class="text-gray-500 block text-[10px] uppercase font-bold">Open Licence</span>
                        <span class="text-cyan-400 font-mono-code font-bold">${m.licence}</span>
                      </div>
                      <div>
                        <span class="text-gray-500 block text-[10px] uppercase font-bold">Inference Device</span>
                        <span class="text-emerald-400 font-mono-code font-bold">${m.device}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1 font-mono-code text-xs">
                  <div class="text-[10px] text-gray-500 uppercase">Measured Benchmark Metric</div>
                  <div class="text-cyan-300 font-bold text-[11px]">${m.measured_fps_latency}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  async refresh() {
    try {
      const data = await API.fetchModelsStatus();
      window.store.setState({ modelsStatus: data.models || [] });
      window.App.render(window.store.getState());
    } catch (err) {
      console.warn("Error checking models status:", err);
    }
  }
};

window.ModelStatusPanel = ModelStatusPanel;
