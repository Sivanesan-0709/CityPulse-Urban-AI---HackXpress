// CityPulse Urban AI - Live GIS Map Component (Flicker-Free Leaflet Integration)
const GisMap = {
  mapInstance: null,
  markersLayer: null,
  busesLayer: null,
  routesLayer: null,
  filterType: 'ALL',
  filterRoute: 'ALL',
  isInitialized: false,

  render(state) {
    return `
      <div class="space-y-4">
        <!-- Top GIS Filter & Control Toolbar -->
        <div class="glass-panel p-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <span class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
              📍
            </span>
            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                Live GIS Urban Sensing Map
                <span class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
              </h3>
              <p class="text-xs text-gray-400">Real-time geospatial tracking of 20 mobile sensing buses & 108 road events</p>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <!-- Event Type Filter -->
            <select 
              id="map-filter-type" 
              onchange="GisMap.onFilterChange(this.value, null)"
              class="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL" ${this.filterType === 'ALL' ? 'selected' : ''}>All Event Types (108)</option>
              <option value="POTHOLE" ${this.filterType === 'POTHOLE' ? 'selected' : ''}>Potholes & Road Defects</option>
              <option value="WATERLOGGING" ${this.filterType === 'WATERLOGGING' ? 'selected' : ''}>Waterlogging & Flooding</option>
              <option value="INFRASTRUCTURE" ${this.filterType === 'INFRASTRUCTURE' ? 'selected' : ''}>Infrastructure Deficiencies</option>
              <option value="CONGESTION" ${this.filterType === 'CONGESTION' ? 'selected' : ''}>Traffic Bottlenecks</option>
              <option value="SAFETY" ${this.filterType === 'SAFETY' ? 'selected' : ''}>Road Safety & Rash Driving</option>
              <option value="REPAIRED" ${this.filterType === 'REPAIRED' ? 'selected' : ''}>AI-Verified Repairs</option>
            </select>

            <!-- Route Filter -->
            <select 
              id="map-filter-route" 
              onchange="GisMap.onFilterChange(null, this.value)"
              class="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL" ${this.filterRoute === 'ALL' ? 'selected' : ''}>All Routes (10)</option>
              <option value="21G" ${this.filterRoute === '21G' ? 'selected' : ''}>Route 21G (Broadway ↔ Tambaram)</option>
              <option value="19B" ${this.filterRoute === '19B' ? 'selected' : ''}>Route 19B (T. Nagar ↔ Kelambakkam OMR)</option>
              <option value="5C" ${this.filterRoute === '5C' ? 'selected' : ''}>Route 5C (Broadway ↔ T. Nagar)</option>
              <option value="45B" ${this.filterRoute === '45B' ? 'selected' : ''}>Route 45B (Anna Nagar ↔ Guindy)</option>
              <option value="570" ${this.filterRoute === '570' ? 'selected' : ''}>Route 570 (CMBT ↔ Siruseri SIPCOT)</option>
              <option value="102X" ${this.filterRoute === '102X' ? 'selected' : ''}>Route 102X (Broadway ↔ Kelambakkam)</option>
            </select>

            <!-- Layer Toggles -->
            <button 
              onclick="GisMap.toggleBuses()" 
              id="btn-toggle-buses"
              class="px-2.5 py-1.5 rounded-lg bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 font-medium hover:bg-cyan-600/50 transition flex items-center gap-1 cursor-pointer"
            >
              🚌 Buses (20)
            </button>
            <button 
              onclick="GisMap.toggleRoutes()" 
              id="btn-toggle-routes"
              class="px-2.5 py-1.5 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-300 font-medium hover:bg-blue-600/50 transition flex items-center gap-1 cursor-pointer"
            >
              🛣️ Routes (10)
            </button>
            <button 
              onclick="GisMap.recenterMap()" 
              class="px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition cursor-pointer"
              title="Recenter Map to Chennai"
            >
              ⛶ Recenter
            </button>
          </div>
        </div>

        <!-- Leaflet Map Viewport -->
        <div class="glass-panel p-2 relative rounded-xl overflow-hidden shadow-2xl">
          <div id="gis-map-container" class="map-container w-full rounded-lg bg-gray-950 z-0 relative"></div>

          <!-- Floating Map Legend Overlay -->
          <div class="absolute bottom-6 right-6 z-[1000] glass-panel p-3 bg-gray-900/95 backdrop-blur border border-gray-700/80 rounded-xl shadow-xl max-w-xs text-xs space-y-1.5 pointer-events-auto">
            <div class="font-bold text-gray-200 uppercase tracking-wider text-[10px] flex items-center justify-between">
              <span>Map Legend</span>
              <span class="text-cyan-400">Live Grid</span>
            </div>
            <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-gray-300">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
                <span>Critical Hazard</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
                <span>Road Defect</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500"></span>
                <span>Waterlogging</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400"></span>
                <span>Congestion</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                <span>AI-Verified (Clean)</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500"></span>
                <span>Incident / ANPR</span>
              </div>
            </div>
            <div class="pt-1 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-400">
              <span>🚌 Active Mobile Sensing Bus</span>
              <span class="text-cyan-300 font-mono-code font-bold">20 Online</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initMap() {
    const container = document.getElementById('gis-map-container');
    if (!container) return;

    // Check if map already initialized on this EXACT DOM element
    if (this.mapInstance && this.isInitialized) {
      try {
        if (this.mapInstance.getContainer() === container) {
          this.mapInstance.invalidateSize();
          const state = window.store.getState();
          this.renderLayers(state.events, state.buses, state.routes);
          return;
        }
      } catch (e) {
        console.warn("Stale map container detected, recreating:", e);
      }
      // Old instance was bound to a detached DOM node; clean it up first
      this.destroy();
    }

    // Clear any residual Leaflet identifier on container
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    try {
      // Initialize Leaflet Map centered on Chennai (13.0427°N, 80.2307°E)
      this.mapInstance = L.map('gis-map-container', {
        center: [13.0427, 80.2307],
        zoom: 12,
        zoomControl: true,
        preferCanvas: true
      });

      // Dark-themed tiles (CartoDB Voyager / DarkMatter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a> OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.mapInstance);

      this.routesLayer = L.layerGroup().addTo(this.mapInstance);
      this.markersLayer = L.layerGroup().addTo(this.mapInstance);
      this.busesLayer = L.layerGroup().addTo(this.mapInstance);
      this.isInitialized = true;

      const state = window.store.getState();
      this.renderLayers(state.events, state.buses, state.routes);

      // Trigger size invalidation immediately and after layout settles
      this.mapInstance.invalidateSize();
      setTimeout(() => {
        if (this.mapInstance) this.mapInstance.invalidateSize();
      }, 150);
      setTimeout(() => {
        if (this.mapInstance) this.mapInstance.invalidateSize();
      }, 500);
    } catch (err) {
      console.error("Error initializing Leaflet map:", err);
    }
  },

  destroy() {
    if (this.mapInstance) {
      try {
        this.mapInstance.off();
        this.mapInstance.remove();
      } catch (e) {
        console.warn("Error removing map instance:", e);
      }
      this.mapInstance = null;
      this.markersLayer = null;
      this.busesLayer = null;
      this.routesLayer = null;
      this.isInitialized = false;
    }
  },

  updateLayers(events, buses, routes) {
    if (!this.mapInstance || !this.isInitialized) return;
    this.renderLayers(events, buses, routes);
  },

  onWindowResize() {
    if (this.mapInstance && this.isInitialized) {
      this.mapInstance.invalidateSize();
    }
  },

  renderLayers(events, buses, routes) {
    if (!this.mapInstance || !this.markersLayer) return;

    this.markersLayer.clearLayers();
    this.busesLayer.clearLayers();
    this.routesLayer.clearLayers();

    // 1. Draw Route Polylines
    if (routes && routes.length > 0) {
      const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f43f5e', '#a855f7'];
      routes.forEach((r, idx) => {
        if (this.filterRoute !== 'ALL' && r.code !== this.filterRoute) return;

        if (r.waypoints && r.waypoints.length > 1) {
          const latlngs = r.waypoints.map(w => [w.lat, w.lng]);
          const polyline = L.polyline(latlngs, {
            color: colors[idx % colors.length],
            weight: 4,
            opacity: 0.75,
            dashArray: '6, 6'
          }).bindPopup(`
            <div class="p-2 text-xs space-y-1">
              <strong class="text-sm font-bold text-white font-mono-code">Route ${r.code}</strong>
              <div class="text-gray-300 font-medium">${r.name}</div>
              <div class="text-cyan-400 font-mono-code text-[11px] mt-1">Distance: ${r.total_distance_km} km • ${r.active_buses_count} Active Sensing Buses</div>
            </div>
          `);
          this.routesLayer.addLayer(polyline);
        }
      });
    }

    // 1B. Draw Bus Stops & Radar Circle Layer
    const state = window.store.getState();
    const stops = state.stops || [];
    const selectedStopId = state.selectedStopId;

    if (stops && stops.length > 0) {
      stops.forEach(stop => {
        const isSelected = stop.id === selectedStopId;
        const stopColor = isSelected ? '#38bdf8' : '#94a3b8';
        
        const stopIcon = L.divIcon({
          className: 'custom-stop-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-5 h-5 rounded-full ${isSelected ? 'bg-cyan-500 border-2 border-white shadow-lg ring-4 ring-cyan-500/40' : 'bg-gray-700 border border-gray-400'} flex items-center justify-center text-[10px] text-white font-bold">
                🚏
              </div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const stopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .bindPopup(`
            <div class="p-2 text-xs space-y-1">
              <strong class="text-sm font-bold text-white">${stop.name}</strong>
              <div class="text-cyan-300 font-mono-code">Route ${stop.route_code} (${stop.direction})</div>
              <div class="text-gray-400 text-[10px]">Distance from start: ${stop.distance_from_start_km} km</div>
            </div>
          `);
        this.markersLayer.addLayer(stopMarker);

        // Draw 500m Radar Circle around selected stop
        if (isSelected) {
          const circle = L.circle([stop.lat, stop.lng], {
            radius: 500,
            color: '#06b6d4',
            fillColor: '#06b6d4',
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '4, 4'
          });
          this.markersLayer.addLayer(circle);
        }
      });
    }

    // 2. Draw 20 Bus Mobile Sensing Units (LIVE vs SIMULATED badges)
    if (buses && buses.length > 0) {
      buses.forEach(bus => {
        if (this.filterRoute !== 'ALL' && bus.route_code !== this.filterRoute) return;
        if (!bus.lat || !bus.lng) return;

        const isLive = bus.data_source === 'LIVE_GPS';
        const bgBg = isLive ? 'bg-emerald-500 ring-4 ring-emerald-500/50' : 'bg-cyan-600';
        const badgeTag = isLive ? 'LIVE GPS' : 'SIMULATED';
        const badgeBorder = isLive ? 'border-emerald-400 text-emerald-300' : 'border-cyan-500/40 text-cyan-300';

        const busIcon = L.divIcon({
          className: 'custom-bus-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full ${bgBg} border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold font-mono-code animate-pulse">
                🚌
              </div>
              <div class="absolute -bottom-4 px-1.5 py-0.2 rounded bg-gray-900/95 ${badgeBorder} text-[9px] font-mono-code font-bold whitespace-nowrap border shadow">
                ${bus.id} (${bus.route_code})
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([bus.lat, bus.lng], { icon: busIcon })
          .bindPopup(`
            <div class="p-2 text-xs space-y-1.5 font-sans min-w-[220px]">
              <div class="flex items-center justify-between border-b border-gray-700 pb-1">
                <span class="font-bold text-white font-mono-code text-sm">${bus.id}</span>
                <span class="px-1.5 py-0.5 rounded ${isLive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'} border text-[10px] font-bold">
                  ${badgeTag}
                </span>
              </div>
              <div class="text-gray-300"><strong>Route:</strong> ${bus.route_code} (${bus.route_name})</div>
              <div class="text-gray-300"><strong>Direction:</strong> <span class="text-white font-bold">${bus.direction || 'UP'}</span> (Progress: ${bus.progress_km || 0} km)</div>
              <div class="text-gray-300"><strong>Speed:</strong> <span class="text-cyan-400 font-mono-code font-bold">${bus.speed_kmh} km/h</span></div>
              <div class="text-gray-300"><strong>Seat Status:</strong> <span class="text-emerald-400 font-bold">${bus.seat_status || 'SEATS_AVAILABLE'} (${bus.occupancy_pct || 40}%)</span></div>
              <div class="text-gray-300"><strong>Cameras:</strong> <span class="text-emerald-400 font-mono-code">${bus.cameras_online}/${bus.total_cameras} Online</span></div>
            </div>
          `);
        this.busesLayer.addLayer(marker);
      });
    }


    // 3. Draw 108 Urban Events (Color-coded)
    if (events && events.length > 0) {
      events.forEach(ev => {
        if (!ev.lat || !ev.lng) return;

        // Filter logic
        if (this.filterType !== 'ALL') {
          if (this.filterType === 'REPAIRED' && ev.repair_status !== 'REPAIR_VERIFIED') return;
          if (this.filterType === 'POTHOLE' && ev.type !== 'POTHOLE' && ev.type !== 'DAMAGED_ROAD') return;
          if (this.filterType === 'WATERLOGGING' && ev.type !== 'WATERLOGGING') return;
          if (this.filterType === 'INFRASTRUCTURE' && ev.category !== 'INFRASTRUCTURE') return;
          if (this.filterType === 'CONGESTION' && ev.type !== 'CONGESTION') return;
          if (this.filterType === 'SAFETY' && ev.category !== 'SAFETY') return;
        }

        let pinColor = '#f59e0b'; // Amber defect
        let symbol = '⚠️';
        
        if (ev.repair_status === 'REPAIR_VERIFIED') {
          pinColor = '#10b981'; // Green verified
          symbol = '✅';
        } else if (ev.is_critical || ev.severity === 'CRITICAL') {
          pinColor = '#f43f5e'; // Rose Critical
          symbol = '🚨';
        } else if (ev.type === 'WATERLOGGING') {
          pinColor = '#3b82f6'; // Blue
          symbol = '🌊';
        } else if (ev.type === 'CONGESTION') {
          pinColor = '#eab308'; // Yellow
          symbol = '🚗';
        } else if (ev.category === 'INCIDENT') {
          pinColor = '#a855f7'; // Purple
          symbol = '📹';
        }

        const eventIcon = L.divIcon({
          className: 'custom-event-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold" style="background-color: ${pinColor}">
                ${symbol}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([ev.lat, ev.lng], { icon: eventIcon })
          .bindPopup(`
            <div class="p-2 text-xs space-y-1.5 font-sans min-w-[240px]">
              <div class="flex items-center justify-between border-b border-gray-700 pb-1">
                <span class="font-bold text-white font-mono-code text-sm">${ev.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style="background-color: ${pinColor}20; color: ${pinColor}; border: 1px solid ${pinColor}60">
                  ${ev.severity || 'HIGH'}
                </span>
              </div>
              <div>
                <strong class="text-white">${ev.type}</strong>
                <div class="text-gray-400 text-[11px]">${ev.subtype || ''}</div>
              </div>
              <div class="text-gray-300"><strong>Location:</strong> ${ev.road_name}</div>
              <div class="text-gray-300"><strong>Confidence:</strong> <span class="font-bold text-emerald-400 font-mono-code">${ev.confidence}%</span></div>
              <div class="text-gray-300"><strong>Observations:</strong> <span class="font-bold text-cyan-300 font-mono-code">${ev.observation_count} Buses (${(ev.observing_buses || []).join(', ')})</span></div>
              <div class="text-gray-300"><strong>Repair Status:</strong> <span class="font-semibold text-cyan-400">${ev.repair_status}</span></div>
              <div class="text-[10px] text-gray-500 pt-1 border-t border-gray-800">First: ${new Date(ev.first_detected).toLocaleTimeString()} IST</div>
            </div>
          `);
        this.markersLayer.addLayer(marker);
      });
    }
  },

  onFilterChange(type, route) {
    if (type !== null) this.filterType = type;
    if (route !== null) this.filterRoute = route;

    const state = window.store.getState();
    this.renderLayers(state.events, state.buses, state.routes);
  },

  toggleBuses() {
    if (!this.mapInstance || !this.busesLayer) return;
    const btn = document.getElementById('btn-toggle-buses');
    if (this.mapInstance.hasLayer(this.busesLayer)) {
      this.mapInstance.removeLayer(this.busesLayer);
      if (btn) {
        btn.classList.add('opacity-50');
        btn.classList.remove('bg-cyan-600/30');
        btn.classList.add('bg-gray-800');
      }
    } else {
      this.mapInstance.addLayer(this.busesLayer);
      if (btn) {
        btn.classList.remove('opacity-50');
        btn.classList.add('bg-cyan-600/30');
        btn.classList.remove('bg-gray-800');
      }
    }
  },

  toggleRoutes() {
    if (!this.mapInstance || !this.routesLayer) return;
    const btn = document.getElementById('btn-toggle-routes');
    if (this.mapInstance.hasLayer(this.routesLayer)) {
      this.mapInstance.removeLayer(this.routesLayer);
      if (btn) {
        btn.classList.add('opacity-50');
        btn.classList.remove('bg-blue-600/30');
        btn.classList.add('bg-gray-800');
      }
    } else {
      this.mapInstance.addLayer(this.routesLayer);
      if (btn) {
        btn.classList.remove('opacity-50');
        btn.classList.add('bg-blue-600/30');
        btn.classList.remove('bg-gray-800');
      }
    }
  },

  recenterMap() {
    if (this.mapInstance) {
      this.mapInstance.setView([13.0427, 80.2307], 12);
      this.mapInstance.invalidateSize();
    }
  }
};

window.GisMap = GisMap;

