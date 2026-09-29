// CityPulse Urban AI - API Client
const API_BASE = '';

const API = {
  async fetchDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/stats`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (err) {
      console.warn('Using local store fallback for stats:', err);
      return window.store.getState().stats;
    }
  },

  async fetchHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      return await res.json();
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  },

  async fetchBuses() {
    try {
      const res = await fetch(`${API_BASE}/api/buses`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchRoutes() {
    try {
      const res = await fetch(`${API_BASE}/api/routes`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchEvents() {
    try {
      const res = await fetch(`${API_BASE}/api/events`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchRepairs() {
    try {
      const res = await fetch(`${API_BASE}/api/repairs`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchBandwidth() {
    try {
      const res = await fetch(`${API_BASE}/api/bandwidth`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchRouteCache(routeCode) {
    try {
      const res = await fetch(`${API_BASE}/api/bandwidth/route-cache/${routeCode}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchCausality() {
    try {
      const res = await fetch(`${API_BASE}/api/causality`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchWeatherSimulation(rainfallMmh = 45) {
    try {
      const res = await fetch(`${API_BASE}/api/causality/simulate-weather?rainfall_mmh=${rainfallMmh}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchIncidents() {
    try {
      const res = await fetch(`${API_BASE}/api/incidents`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchTraffic() {
    try {
      const res = await fetch(`${API_BASE}/api/traffic`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchRoadConditions() {
    try {
      const res = await fetch(`${API_BASE}/api/road-conditions`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchAlerts() {
    try {
      const res = await fetch(`${API_BASE}/api/alerts`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async triggerSimulation(action, payload = {}) {
    try {
      const res = await fetch(`${API_BASE}/api/simulation/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      console.log(`Simulation action ${action} executed locally:`, err);
      return { success: true, action, message: `Simulated: ${action}` };
    }
  },

  async fetchStops(routeCode = null) {
    try {
      const url = routeCode ? `${API_BASE}/api/stops?route_code=${routeCode}` : `${API_BASE}/api/stops`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchNearestStop(lat, lng, radiusM = 1000) {
    try {
      const res = await fetch(`${API_BASE}/api/stops/nearest?lat=${lat}&lng=${lng}&radius_m=${radiusM}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchStopArrivals(stopId, destinationId = null) {
    try {
      const url = destinationId 
        ? `${API_BASE}/api/stops/${stopId}/arrivals?destination=${destinationId}`
        : `${API_BASE}/api/stops/${stopId}/arrivals`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { approaching_buses: [], excluded_buses: [] };
    }
  },

  async fetchCommuteAdvice(stopId, destinationId = null) {
    try {
      const url = destinationId
        ? `${API_BASE}/api/commute/advice?stop_id=${stopId}&destination=${destinationId}`
        : `${API_BASE}/api/commute/advice?stop_id=${stopId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchHeadway() {
    try {
      const res = await fetch(`${API_BASE}/api/fleet/headway`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { headway_stats: [] };
    }
  },

  async fetchModelsStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/models/status`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { models: [] };
    }
  },

  async fetchDemoHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/demo/health`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchForecast(busId) {
    try {
      const res = await fetch(`${API_BASE}/api/buses/${busId}/forecast`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async sendAssistantQuery(message, stopId = null, destinationId = null) {
    try {
      const res = await fetch(`${API_BASE}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, stop_id: stopId, destination_id: destinationId })
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return { response: "I am having trouble connecting to the live transit engine. Please try again." };
    }
  },

  async uploadDashcamFrame(formData) {
    try {
      const res = await fetch(`${API_BASE}/api/road-intelligence/dashcam-upload`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return { pothole_detected: false, error: err.message };
    }
  },

  async triggerCommuteScenario(scenario) {
    try {
      const res = await fetch(`${API_BASE}/api/simulation/commute-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return { scenario, message: `Executed scenario ${scenario} locally.` };
    }
  },

  async createTripShare(stopId, destinationId = null, busId = null) {
    try {
      const res = await fetch(`${API_BASE}/api/trip-share/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stop_id: stopId, destination_id: destinationId, bus_id: busId })
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  async fetchTripShare(token) {
    try {
      const res = await fetch(`${API_BASE}/api/trip-share/${token}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  },

  async fetchDisasterStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/disaster-status`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { disaster_active: false, affected_routes: [] };
    }
  },

  async sendUnsafeReport(busId, category, note = "") {
    try {
      const res = await fetch(`${API_BASE}/api/report-unsafe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bus_id: busId, category, note })
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async fetchSafetyReports() {
    try {
      const res = await fetch(`${API_BASE}/api/reports`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [];
    }
  },

  async fetchCongestionAlerts() {
    try {
      const res = await fetch(`${API_BASE}/api/congestion-alerts`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { has_alerts: false, alerts: [] };
    }
  },

  async fetchMobilityDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/api/mobility-dashboard-stats`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return null;
    }
  }
};

window.API = API;

