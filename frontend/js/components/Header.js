// CityPulse Urban AI - Header Component
const Header = {
  render(state) {
    const stats = state.stats || {};
    const scenario = state.activeScenario;

    return `
      <header class="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 px-4 py-2.5">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <!-- Left: Brand and SIH 2026 Badge -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h1 class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  CityPulse <span class="text-cyan-400">Urban AI</span>
                </h1>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  SIH 2026 • PS 26124
                </span>
              </div>
              <p class="text-xs text-gray-400">Mobile Urban Intelligence Platform via Public Bus Fleet</p>
            </div>
          </div>

          <!-- Middle: Live City and Active Scenario Indicator -->
          <div class="hidden lg:flex items-center space-x-4">
            <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot"></span>
              <span class="text-xs font-medium text-gray-300">Chennai Fleet Grid</span>
              <span class="text-xs text-gray-500 font-mono-code">(13.0827°N, 80.2707°E)</span>
            </div>

            ${scenario ? `
              <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-700/60 animate-pulse">
                <span class="text-xs font-semibold text-cyan-300">Active Scenario:</span>
                <span class="text-xs text-cyan-100 font-mono-code font-bold">${scenario.title}</span>
              </div>
            ` : `
              <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-800">
                <span class="text-xs text-gray-400">Mode:</span>
                <span class="text-xs text-emerald-400 font-semibold">Live Urban Autonomous Sensing</span>
              </div>
            `}
          </div>

          <!-- Right: Clock, Edge AI Node Health & Alerts -->
          <div class="flex items-center space-x-4">
            <div class="text-right hidden sm:block">
              <div id="header-clock" class="text-sm font-semibold text-gray-200 font-mono-code">--:--:--</div>
              <div class="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 20 Buses Transmitting
              </div>
            </div>

            <!-- Evaluator Help Pill -->
            <button onclick="window.store.setActiveTab('demo-panel')" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Demo Scenarios</span>
            </button>
          </div>
        </div>
      </header>
    `;
  },

  startClock() {
    if (this._clockTimer) clearInterval(this._clockTimer);
    const update = () => {
      const el = document.getElementById('header-clock');
      if (el) {
        const now = new Date();
        el.innerText = now.toLocaleTimeString() + ' IST';
      }
    };
    this._clockTimer = setInterval(update, 1000);
    update();
  }
};

window.Header = Header;
