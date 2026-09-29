// CityPulse Urban AI - Main Application Controller
const App = {
  isShellMounted: false,
  currentTab: null,

  init() {
    console.log("CityPulse Urban AI Platform Initializing (SIH 2026)...");

    // Initialize the fixed shell structure (Header, Sidebar, Main Content Viewport, Toasts)
    this.initShell();

    // Start header clock
    if (window.Header && window.Header.startClock) {
      window.Header.startClock();
    }

    // Subscribe to state updates
    window.store.subscribe((state) => {
      this.render(state);
    });

    // Window resize handler for GIS map invalidation
    window.addEventListener('resize', () => {
      if (this.currentTab === 'gis-map' && window.GisMap) {
        window.GisMap.onWindowResize();
      }
    });

    // Initial render of current active tab
    this.render(window.store.getState());

    // Fetch initial stats & data from API
    this.syncInitialData();
    setInterval(() => this.syncStats(), 8000);
  },

  initShell() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    const state = window.store.getState();
    const activeTab = state.activeTab || 'dashboard';
    this.currentTab = activeTab;

    appEl.innerHTML = `
      <div class="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-cyan-500 selection:text-white">
        <!-- Top Sticky Header -->
        <div id="header-container" class="sticky top-0 z-40">
          ${Header.render(state)}
        </div>

        <!-- Main Layout: Sidebar + Main Content Area -->
        <div class="flex-1 flex overflow-hidden relative">
          <!-- Navigation Sidebar -->
          <aside id="sidebar-container" class="relative z-30 flex-shrink-0">
            ${Sidebar.render(state)}
          </aside>

          <!-- Dynamic Tab Content Viewport -->
          <main id="main-viewport" class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full relative z-10">
            <div id="tab-content">
              ${this.renderActiveTab(activeTab, state)}
            </div>
          </main>
        </div>

        <!-- Notification / Toast Stack -->
        <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
          ${this.renderToasts(state.notifications)}
        </div>
      </div>
    `;

    this.isShellMounted = true;

    // Post-mount hook for initial GIS map if opened directly
    if (activeTab === 'gis-map' && window.GisMap) {
      setTimeout(() => {
        window.GisMap.initMap();
      }, 50);
    }
  },

  async syncInitialData() {
    try {
      const [stats, buses, routes, stops, events, repairs, headwayData, modelsRes] = await Promise.all([
        API.fetchDashboardStats(),
        API.fetchBuses(),
        API.fetchRoutes(),
        API.fetchStops(),
        API.fetchEvents(),
        API.fetchRepairs ? API.fetchRepairs() : [],
        API.fetchHeadway(),
        API.fetchModelsStatus()
      ]);
      window.store.setState({ 
        stats, buses, routes, stops, events, repairs, headwayData, 
        modelsStatus: modelsRes.models || [] 
      });
    } catch (err) {
      console.warn("Initial data sync fallback:", err);
    }
  },

  async syncStats() {
    try {
      const [stats, buses] = await Promise.all([
        API.fetchDashboardStats(),
        API.fetchBuses()
      ]);
      if (stats) {
        window.store.setState({ stats, buses });
      }
    } catch (err) {
      console.warn("Periodic stats sync error:", err);
    }
  },

  render(state) {
    if (!this.isShellMounted) {
      this.initShell();
      return;
    }

    const prevTab = this.currentTab;
    const newTab = state.activeTab || 'dashboard';

    // Manage CommuterApp polling
    if (newTab === 'commuter-app' && window.CommuterApp) {
      if (prevTab !== 'commuter-app') {
        window.CommuterApp.initPolling();
      }
    } else if (prevTab === 'commuter-app' && window.CommuterApp) {
      window.CommuterApp.stopPolling();
    }

    // Refresh Mobility Dashboard if entered
    if (newTab === 'mobility-dashboard' && window.MobilityDashboard && prevTab !== 'mobility-dashboard') {
      window.MobilityDashboard.refresh();
    }

    // 1. Tab Navigation Change
    if (prevTab !== newTab) {
      // Clean up previous tab if it was gis-map
      if (prevTab === 'gis-map' && window.GisMap) {
        window.GisMap.destroy();
      }

      this.currentTab = newTab;

      // Update active tab content
      const tabContentEl = document.getElementById('tab-content');
      if (tabContentEl) {
        tabContentEl.innerHTML = this.renderActiveTab(newTab, state);
      }

      // Update sidebar active highlights
      const sidebarContainer = document.getElementById('sidebar-container');
      if (sidebarContainer) {
        sidebarContainer.innerHTML = Sidebar.render(state);
      }

      // Reset scroll position on tab change
      const mainViewport = document.getElementById('main-viewport');
      if (mainViewport) {
        mainViewport.scrollTop = 0;
      }

      // If new tab is gis-map, initialize map cleanly
      if (newTab === 'gis-map' && window.GisMap) {
        setTimeout(() => {
          window.GisMap.initMap();
        }, 50);
      }
    } else {
      // 2. Same tab active: Handle reactive state updates
      if (newTab === 'gis-map' && window.GisMap && window.GisMap.isInitialized) {
        // Update map layers in place with ZERO flicker and NO DOM destruction
        window.GisMap.updateLayers(state.events, state.buses, state.routes);
      } else if (newTab !== 'gis-map') {
        // For other tabs, update tab viewport content
        const tabContentEl = document.getElementById('tab-content');
        if (tabContentEl) {
          tabContentEl.innerHTML = this.renderActiveTab(newTab, state);
        }
      }
    }

    // 3. Update Header (Scenario Badge, Active Mode, etc.)
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      headerContainer.innerHTML = Header.render(state);
    }

    // 4. Update Toasts Container
    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
      toastContainer.innerHTML = this.renderToasts(state.notifications);
    }
  },

  renderActiveTab(activeTab, state) {
    switch (activeTab) {
      case 'dashboard':
        return DashboardOverview.render(state);

      case 'commuter-app':
        return CommuterApp.render(state);

      case 'mobility-dashboard':
        return MobilityDashboard.render(state);

      case 'why-hidden':
        return WhyHiddenPanel.render(state);

      case 'headway-dash':
        return HeadwayDashboard.render(state);

      case 'dashcam-upload':
        return DashcamUpload.render(state);

      case 'models-panel':
        return ModelStatusPanel.render(state);

      case 'demo-health':
        return DemoHealthPanel.render(state);

      case 'demo-panel':
        return DemoControls.render(state);

      case 'gis-map':
        return GisMap.render(state);

      case 'fleet':
        return FleetMonitoring.render(state);

      case 'edge-ai':
        return EdgeAiSimulator.render(state);

      case 'diff-repair':
        return DifferentiatorPostRepair.render(state);

      case 'diff-bandwidth':
        return DifferentiatorBandwidth.render(state);

      case 'diff-causality':
        return DifferentiatorCausality.render(state);

      case 'road-conditions':
        return RoadConditions.render(state);

      case 'traffic':
        return TrafficIntelligence.render(state);

      case 'safety':
        return RoadSafety.render(state);

      case 'infrastructure':
        return InfrastructureDefects.render(state);

      case 'incidents':
        return IncidentManagement.render(state);

      case 'repairs':
        return DifferentiatorPostRepair.render(state);

      case 'alerts':
        return AlertCenter.render(state);

      default:
        return DashboardOverview.render(state);
    }
  },


  renderToasts(notifications) {
    if (!notifications || notifications.length === 0) return '';

    return `
      ${notifications.map(n => {
        const bg = n.type === 'error' ? 'bg-rose-950/95 border-rose-600 text-rose-200' :
                   n.type === 'success' ? 'bg-emerald-950/95 border-emerald-600 text-emerald-200' :
                   'bg-gray-900/95 border-cyan-500/50 text-cyan-200';
        return `
          <div class="pointer-events-auto p-3 rounded-lg border backdrop-blur-md shadow-2xl text-xs flex items-center justify-between gap-3 animate-fade-in ${bg}">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full ${n.type === 'error' ? 'bg-rose-400' : n.type === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'}"></span>
              <span>${n.message}</span>
            </div>
            <button onclick="window.store.removeNotification(${n.id})" class="text-gray-400 hover:text-white cursor-pointer px-1">✕</button>
          </div>
        `;
      }).join('')}
    `;
  }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

