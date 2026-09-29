// CityPulse Urban AI - Reactive State Store
class Store {
  constructor() {
    this.state = {
      activeTab: 'dashboard',
      stats: {
        active_buses: 20,
        fleet_coverage_km: 348.5,
        total_events_detected: 108,
        critical_events: 14,
        active_road_defects: 38,
        active_waterlogging: 6,
        congestion_zones: 9,
        repairs_pending: 23,
        repairs_verified: 15,
        bandwidth_saved_pct: 89.6,
        total_bandwidth_saved_mb: 44.8,
        ai_detection_accuracy: 94.8,
      },
      buses: [],
      routes: [],
      stops: [],
      nearestStop: null,
      selectedStopId: 'STOP-21G-UP-01',
      selectedDestinationId: null,
      arrivals: [],
      excludedBuses: [],
      commuteAdvice: null,
      headwayData: null,
      modelsStatus: [],
      assistantMessages: [
        { sender: 'bot', text: 'Hello! I am your Chennai Urban AI Travel Assistant. Ask me about upcoming bus arrivals, Wait vs Auto advice, or crowd forecasts!', timestamp: new Date().toLocaleTimeString() }
      ],
      events: [],
      repairs: [],
      incidents: [],
      alerts: [],
      activeScenario: null,
      scenarioLog: [],
      selectedEvent: null,
      selectedBus: null,
      notifications: [],
      isSimulationRunning: false,
    };

    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setActiveTab(tabId) {
    this.setState({ activeTab: tabId });
  }

  addNotification(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random();
    const notif = { id, message, type, timestamp: new Date().toLocaleTimeString() };
    const notifications = [notif, ...this.state.notifications.slice(0, 4)];
    this.setState({ notifications });

    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }
  }

  removeNotification(id) {
    const notifications = this.state.notifications.filter(n => n.id !== id);
    this.setState({ notifications });
  }
}

window.store = new Store();
