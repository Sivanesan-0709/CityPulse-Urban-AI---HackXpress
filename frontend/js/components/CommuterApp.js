// CityPulse Urban AI - Phone-Frame Commuter App View Component
const CommuterApp = {
  pollInterval: null,
  accessibilityMode: false,
  isMuted: false,
  announcedKeySet: new Set(),
  sessionCo2SavedG: 0.0,
  lastAdviceStopKey: null,

  // Modal states
  ticketModalOpen: false,
  ticketData: null,
  reportModalOpen: false,
  reportBusId: '',

  render(state) {
    const stops = state.stops || [];
    const selectedStopId = state.selectedStopId || (stops[0] ? stops[0].id : 'STOP-21G-UP-01');
    const selectedDestId = state.selectedDestinationId || '';
    const arrivals = state.arrivals || [];
    const advice = state.commuteAdvice;
    const assistantMsgs = state.assistantMessages || [];
    const disasterStatus = state.disasterStatus || { disaster_mode: false, affected_routes: [] };
    const congestionAlerts = state.congestionAlerts || [];

    // Find current stop name
    const currentStop = stops.find(s => s.id === selectedStopId);
    const stopName = currentStop ? currentStop.name : 'Broadway Bus Terminus';

    // Apply Accessibility Mode boost & ordering if active
    let displayArrivals = [...arrivals];
    if (this.accessibilityMode) {
      displayArrivals.sort((a, b) => {
        const scoreA = a.eta_min - (a.is_low_floor ? 2 : 0);
        const scoreB = b.eta_min - (b.is_low_floor ? 2 : 0);
        return scoreA - scoreB;
      });
    }

    return `
      <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Header Controls -->
        <div class="glass-panel p-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center space-x-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">
              📱
            </span>
            <div>
              <h2 class="text-lg font-bold text-white flex items-center gap-2">
                Commuter Mobility Hub
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Mobile Phone Frame
                </span>
              </h2>
              <p class="text-xs text-gray-400">Stop-centric approaching bus ETAs, Wait vs Auto advisor, & AI Travel Assistant</p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Accessibility Toggle -->
            <button 
              onclick="CommuterApp.toggleAccessibility()" 
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer border ${this.accessibilityMode ? 'bg-purple-600 text-white border-purple-400 shadow-lg' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}"
              title="Toggle Accessibility Mode (low-floor bus priority & audio announcements)"
            >
              <span>♿ Accessibility ${this.accessibilityMode ? 'ON' : 'OFF'}</span>
            </button>

            <!-- Mute Toggle -->
            <button 
              onclick="CommuterApp.toggleMute()" 
              class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${this.isMuted ? 'bg-rose-950/60 text-rose-300 border-rose-800' : 'bg-gray-800 text-gray-300 border-gray-700'}"
              title="Mute / Unmute Audio Announcements"
            >
              <span>${this.isMuted ? '🔇 Muted' : '🔊 Sound'}</span>
            </button>

            <!-- Digital QR Pass (Feature D) -->
            <button 
              onclick="CommuterApp.openTicketModal('21G', '${selectedStopId}', '${displayArrivals[0] ? displayArrivals[0].bus_id : 'BUS-01'}')" 
              class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer shadow-md"
              title="Generate Instant Offline Digital QR Transit Pass (Mock)"
            >
              <span>🎟️ Digital Pass</span>
            </button>

            <!-- Anonymous Unsafe Report (Feature B) -->
            <button 
              onclick="CommuterApp.openReportModal('')" 
              class="px-3 py-1.5 rounded-lg bg-rose-700/70 hover:bg-rose-600 text-rose-100 text-xs font-semibold transition flex items-center gap-1 cursor-pointer border border-rose-600/50"
              title="Submit Anonymous Safety / Reckless Driving Report (Zero PII)"
            >
              <span>🚨 Report Safety</span>
            </button>

            <!-- SOS Trip Share -->
            <button 
              onclick="CommuterApp.shareTrip()" 
              class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer shadow-md"
              title="Share live trip location link with family/friends"
            >
              <span>🛡️ Share Trip</span>
            </button>

            <button 
              onclick="CommuterApp.detectLocation()" 
              class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              title="Detect nearest bus stop via GPS"
            >
              <span>📍 Location</span>
            </button>

            <a 
              href="/tracker" 
              target="_blank" 
              class="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              title="Open Mobile Driver GPS Telemetry Streamer"
            >
              <span>📲 Tracker</span>
            </a>
          </div>
        </div>

        <!-- Main Phone UI Container -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- PHONE FRAME CONTAINER (Left / Center) -->
          <div class="lg:col-span-7 flex justify-center">
            <div class="w-full max-w-[400px] bg-[#0f172a] border-[6px] border-gray-800 rounded-[40px] p-4 shadow-2xl space-y-3.5 relative overflow-hidden text-xs">
              
              <!-- Phone Status Bar Notch -->
              <div class="flex items-center justify-between text-[10px] text-gray-400 px-2 pt-1 border-b border-gray-800 pb-2">
                <span class="font-bold text-white">9:41 AM</span>
                <div class="w-16 h-3 bg-gray-800 rounded-full mx-auto"></div>
                <div class="flex items-center space-x-1 font-mono text-[9px] text-cyan-400">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              <!-- PRIORITY STACKED BANNERS (Amendments 3 & Feature A / C) -->
              <div class="space-y-2">
                <!-- 1. Top Priority: Disaster Mode Banner (Red) -->
                ${disasterStatus.disaster_mode ? `
                  <div class="p-3 rounded-2xl bg-rose-950/90 border-2 border-rose-600 text-white space-y-1.5 shadow-xl animate-pulse">
                    <div class="flex items-center justify-between text-xs font-bold text-rose-300">
                      <div class="flex items-center gap-1.5">
                        <span class="text-base">🚨</span>
                        <span class="uppercase tracking-wider">Disaster Mode Active</span>
                      </div>
                      <span class="px-2 py-0.5 rounded bg-rose-600/40 text-rose-200 border border-rose-400/50 text-[10px] font-mono">CRITICAL</span>
                    </div>
                    <div class="text-[11px] text-rose-100 font-medium leading-snug">
                      ${disasterStatus.affected_routes.map(r => `
                        <div class="pt-0.5">
                          • <strong class="text-white">${r.route_code}</strong>: ${r.reason}
                          <div class="text-[10px] text-rose-300 font-semibold pl-2">↪ Recommended Detour: ${r.suggested_detour}</div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                <!-- 2. Second Priority: System-Wide Congestion Alert Banner (Amber) -->
                ${congestionAlerts.length > 0 ? `
                  <div class="p-2.5 rounded-2xl bg-amber-950/80 border border-amber-600/70 text-amber-200 space-y-1 shadow-md">
                    <div class="flex items-center justify-between text-[11px] font-bold text-amber-300">
                      <div class="flex items-center gap-1">
                        <span>⚠️</span>
                        <span>Corridor Congestion Warning</span>
                      </div>
                      <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">PEAK LOAD</span>
                    </div>
                    <div class="text-[10px] text-amber-200 leading-snug space-y-0.5">
                      ${congestionAlerts.map(a => `
                        <div>• <strong>Route ${a.route_code}</strong> operating at <span class="font-bold text-amber-100">${a.avg_occupancy_pct}% capacity</span> (${a.high_occupancy_buses} full buses). Expect boarding delays.</div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Stop Selector Header -->
              <div class="bg-gray-900/90 p-3 rounded-2xl border border-gray-800 space-y-2">
                <div class="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Your Boarding Stop</span>
                  <span class="text-emerald-400">● Live Sensing</span>
                </div>

                <select 
                  id="app-stop-select"
                  onchange="CommuterApp.onStopChange(this.value)"
                  class="w-full bg-gray-950 border border-gray-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  ${stops.length === 0 ? `
                    <option value="STOP-21G-UP-01">Broadway Bus Terminus (Route 21G)</option>
                    <option value="STOP-21G-UP-02">Central Railway Station (Route 21G)</option>
                    <option value="STOP-21G-UP-05">Guindy Kathipara (Route 21G)</option>
                  ` : stops.map(s => `
                    <option value="${s.id}" ${s.id === selectedStopId ? 'selected' : ''}>
                      ${s.name} (${s.route_code} ${s.direction})
                    </option>
                  `).join('')}
                </select>

                <!-- Destination Selector (Optional) -->
                <div>
                  <label class="block text-[10px] text-gray-400 mb-1">Destination Stop (Optional Filter):</label>
                  <select 
                    id="app-dest-select"
                    onchange="CommuterApp.onDestChange(this.value)"
                    class="w-full bg-gray-950/80 border border-gray-800 text-gray-300 rounded-xl px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Any Destination / Direct Route</option>
                    ${stops.map(s => `
                      <option value="${s.id}" ${s.id === selectedDestId ? 'selected' : ''}>
                        ${s.name} (${s.route_code})
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <!-- Approaching Buses List -->
              <div class="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                <div class="flex items-center justify-between text-[11px] px-1 font-bold text-gray-300">
                  <span>Approaching Buses (${displayArrivals.length})</span>
                  <span class="text-[10px] text-gray-400 font-normal">Auto-updated 3s</span>
                </div>

                ${displayArrivals.length === 0 ? `
                  <div class="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 text-center space-y-2">
                    <span class="text-2xl">🚌</span>
                    <div class="text-xs text-gray-300 font-semibold">No buses approaching this stop</div>
                    <div class="text-[10px] text-gray-500">Buses in opposite direction or past this stop are excluded. See "Why Hidden?" tab.</div>
                  </div>
                ` : displayArrivals.map(bus => {
                  const isLive = bus.data_source === 'LIVE_GPS';
                  const badgeColor = isLive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                  const seatColor = bus.seat_status === 'FULL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : (bus.seat_status === 'STANDING_ONLY' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40');
                  
                  return `
                    <div class="p-3 rounded-2xl bg-gray-900 border ${bus.is_low_floor && this.accessibilityMode ? 'border-purple-500/60 shadow-md' : 'border-gray-800'} hover:border-cyan-500/50 transition space-y-2 relative overflow-hidden">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                          <span class="px-2 py-0.5 rounded-lg bg-cyan-600 text-white font-mono-code font-bold text-xs">
                            ${bus.route_code}
                          </span>
                          <span class="font-bold text-white truncate max-w-[120px]">${bus.bus_id}</span>
                        </div>
                        <div class="text-right">
                          <div class="text-base font-extrabold text-cyan-400 font-mono-code">${bus.eta_min} <span class="text-xs font-normal text-gray-400">min</span></div>
                          <div class="text-[9px] text-gray-400">(${bus.confidence_range})</div>
                        </div>
                      </div>

                      <!-- Compact Badges Row (Amendment 2) -->
                      <div class="flex flex-wrap items-center justify-between gap-1 text-[10px] pt-1 border-t border-gray-800/80">
                        <span class="px-2 py-0.5 rounded border ${seatColor} font-semibold" title="Occupancy Level: ${bus.occupancy_pct}%">
                          💺 ${bus.seat_status.replace('_', ' ')} (${bus.occupancy_pct}%)
                        </span>
                        
                        <div class="flex items-center space-x-1">
                          <!-- Driver Verified Badge (Feature B) -->
                          ${bus.driver_verified ? `
                            <span class="px-1.5 py-0.5 rounded border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold cursor-help" title="Driver Verified & Background Checked">
                              ✅ Verified
                            </span>
                          ` : `
                            <span class="px-1.5 py-0.5 rounded border bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold cursor-help" title="Unverified Driver Badge">
                              ⚠️ Unverified
                            </span>
                          `}

                          <!-- Low Floor Badge -->
                          ${bus.is_low_floor ? `
                            <span class="px-1.5 py-0.5 rounded border bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold cursor-help" title="Wheelchair Ramp & Low Floor Accessibility">
                              ♿ Ramp
                            </span>
                          ` : ''}

                          <!-- Dwell Badge -->
                          ${bus.extended_dwell_time ? `
                            <span class="px-1.5 py-0.5 rounded border bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold cursor-help" title="High Crowd / Extended Boarding Dwell Time (+60s)">
                              ⏱️ Dwell
                            </span>
                          ` : ''}

                          <!-- Live / Sim Badge -->
                          <span class="px-1.5 py-0.5 rounded border font-mono-code ${badgeColor} cursor-help" title="Telemetry Feed: ${bus.data_source}">
                            ${isLive ? '● LIVE' : 'SIM'}
                          </span>
                        </div>
                      </div>

                      <!-- Action Buttons on Bus Card -->
                      <div class="flex items-center justify-between pt-1 border-t border-gray-800/50 text-[10px]">
                        <button 
                          onclick="CommuterApp.openTicketModal('${bus.route_code}', '${selectedStopId}', '${bus.bus_id}')" 
                          class="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                          title="Instant Digital QR Transit Pass"
                        >
                          <span>🎟️ Quick Pass</span>
                        </button>

                        <button 
                          onclick="CommuterApp.openReportModal('${bus.bus_id}')" 
                          class="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                          title="Report reckless driving or safety issue anonymously"
                        >
                          <span>🚨 Report Bus</span>
                        </button>
                      </div>

                      ${bus.delay_reason ? `
                        <div class="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-200 text-[10px] flex items-center gap-1">
                          <span>⚠️</span>
                          <span>${bus.delay_reason}</span>
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Wait vs Auto Recommendation & Carbon Savings Card -->
              ${advice ? `
                <div class="p-3.5 rounded-2xl bg-gradient-to-br ${advice.recommendation === 'TAKE_AUTO' ? 'from-amber-950/90 to-gray-900 border-amber-600/50' : 'from-cyan-950/90 to-gray-900 border-cyan-600/50'} border shadow-lg space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                      Smart Advisor
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${advice.recommendation === 'TAKE_AUTO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}">
                      ${advice.recommendation === 'TAKE_AUTO' ? '🛺 TAKE AUTO' : '🚌 WAIT FOR BUS'}
                    </span>
                  </div>

                  <p class="text-[11px] text-gray-200 font-medium leading-relaxed">
                    ${advice.rationale}
                  </p>

                  <!-- Carbon Savings Display (Feature 1) -->
                  ${advice.co2_saved_g > 0 ? `
                    <div class="p-2 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-[10px] text-emerald-200 flex items-center justify-between">
                      <span>🌱 You save ~${advice.co2_saved_g}g CO₂ choosing the bus</span>
                      <span class="text-emerald-300 font-bold font-mono">Session: ~${this.sessionCo2SavedG.toFixed(1)}g</span>
                    </div>
                  ` : `
                    <div class="p-1.5 rounded-xl bg-gray-900/60 border border-gray-800 text-[10px] text-gray-400 flex items-center justify-between">
                      <span>🌱 Bus transit reduces urban carbon emissions</span>
                      <span class="text-gray-400 font-mono">Session: ~${this.sessionCo2SavedG.toFixed(1)}g saved</span>
                    </div>
                  `}

                  <div class="grid grid-cols-2 gap-2 text-[10px] font-mono-code pt-1 border-t border-gray-800">
                    <div class="text-gray-300">Bus Fare: <span class="text-emerald-400 font-bold">₹${advice.bus_fare_inr}</span></div>
                    <div class="text-gray-300">Auto Fare: <span class="text-amber-400 font-bold">₹${advice.auto_fare_inr}</span></div>
                  </div>
                </div>
              ` : ''}

            </div>
          </div>

          <!-- AI TRAVEL ASSISTANT CHAT PANEL (Right) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="glass-panel p-4 rounded-2xl space-y-3 flex flex-col h-[560px]">
              
              <!-- Chat Header -->
              <div class="flex items-center justify-between border-b border-gray-800 pb-3">
                <div class="flex items-center space-x-2">
                  <span class="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    🤖
                  </span>
                  <div>
                    <h3 class="text-sm font-bold text-white">AI Travel Assistant</h3>
                    <p class="text-[10px] text-gray-400">Grounded Tool Calls • English & Tanglish</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono-code">
                  ACTIVE
                </span>
              </div>

              <!-- Message Stream -->
              <div id="chat-stream" class="flex-1 overflow-y-auto space-y-3 p-1 text-xs">
                ${assistantMsgs.map(m => `
                  <div class="flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[85%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none'} space-y-1">
                      <div class="whitespace-pre-line leading-relaxed text-[11px]">${m.text}</div>
                      <div class="text-[9px] ${m.sender === 'user' ? 'text-cyan-200' : 'text-gray-500'} text-right">${m.timestamp}</div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Chat Input Box -->
              <div class="pt-2 border-t border-gray-800 flex items-center gap-2">
                <input 
                  id="chat-input"
                  type="text" 
                  placeholder="Ask e.g. 'Next bus to Guindy eppo varum?'..."
                  onkeydown="if(event.key === 'Enter') CommuterApp.sendChat()"
                  class="flex-1 bg-gray-950 border border-gray-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
                <button 
                  onclick="CommuterApp.sendChat()"
                  class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
                >
                  Send
                </button>
              </div>

            </div>
          </div>

        </div>

        <!-- FEATURE D: DIGITAL TICKETING / QR PASS MODAL (Offline Canvas Rendered) -->
        ${this.ticketModalOpen ? this.renderTicketModal(stopName) : ''}

        <!-- FEATURE B: ANONYMOUS UNSAFE REPORT MODAL (Zero PII) -->
        ${this.reportModalOpen ? this.renderReportModal() : ''}

      </div>
    `;
  },

  renderTicketModal(stopName) {
    const data = this.ticketData || {
      routeCode: '21G',
      stopName: stopName,
      busId: 'BUS-01',
      passId: 'CP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      fare: '₹15.00',
      validUntil: '2 Hours from issue'
    };

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bg-gray-900 border border-gray-700 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-xs">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-gray-800 pb-3">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">
                🎟️
              </span>
              <div>
                <h3 class="text-sm font-bold text-white">Digital Transit QR Pass</h3>
                <p class="text-[10px] text-gray-400">Offline Verified Token • MTC Chennai</p>
              </div>
            </div>
            <button onclick="CommuterApp.closeTicketModal()" class="text-gray-400 hover:text-white p-1 cursor-pointer">✕</button>
          </div>

          <!-- Ticket Card Content -->
          <div class="bg-gradient-to-br from-gray-950 to-gray-900 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-inner">
            
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs">
                ROUTE ${data.routeCode}
              </span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                ACTIVE PASS
              </span>
            </div>

            <!-- Canvas QR Container -->
            <div class="flex flex-col items-center justify-center py-2 space-y-2">
              <div class="p-2 bg-white rounded-2xl shadow-xl border-2 border-emerald-500">
                <canvas id="ticket-qr-canvas" width="180" height="180" class="w-44 h-44 block rounded-lg"></canvas>
              </div>
              <div class="text-center font-mono text-[10px] text-gray-400">
                Token: <strong class="text-white">${data.passId}</strong>
              </div>
            </div>

            <!-- Ticket Meta Table -->
            <div class="space-y-1.5 pt-2 border-t border-gray-800 text-[11px]">
              <div class="flex justify-between text-gray-400">
                <span>Boarding Stop:</span>
                <span class="text-white font-semibold truncate max-w-[170px]">${data.stopName}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Assigned Bus:</span>
                <span class="text-cyan-300 font-mono font-bold">${data.busId}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Transit Fare:</span>
                <span class="text-emerald-400 font-bold">${data.fare}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Validity:</span>
                <span class="text-amber-300 font-semibold">${data.validUntil}</span>
              </div>
            </div>

            <!-- Disclaimer Badge (Amendment 5) -->
            <div class="p-2 rounded-xl bg-amber-950/60 border border-amber-800/60 text-[9px] text-amber-200 text-center leading-tight">
              ⚠️ <strong>DEMO / MOCK TRANSIT PASS</strong> — Simulated digital ticket for SIH 2026 evaluation.
            </div>
          </div>

          <!-- Close Action -->
          <button 
            onclick="CommuterApp.closeTicketModal()" 
            class="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition cursor-pointer border border-gray-700"
          >
            Done / Close Pass
          </button>
        </div>
      </div>
    `;
  },

  renderReportModal() {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bg-gray-900 border border-gray-700 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative text-xs">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-gray-800 pb-3">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-base">
                🚨
              </span>
              <div>
                <h3 class="text-sm font-bold text-white">Report Safety Issue</h3>
                <p class="text-[10px] text-gray-400">Zero PII • 100% Anonymous Dispatch</p>
              </div>
            </div>
            <button onclick="CommuterApp.closeReportModal()" class="text-gray-400 hover:text-white p-1 cursor-pointer">✕</button>
          </div>

          <!-- Report Form -->
          <form onsubmit="event.preventDefault(); CommuterApp.submitReport();" class="space-y-3">
            <div>
              <label class="block text-[10px] text-gray-400 mb-1 font-semibold">Bus Identifier (Vehicle ID):</label>
              <input 
                id="report-bus-id"
                type="text" 
                value="${this.reportBusId || 'BUS-01'}"
                required
                class="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                placeholder="e.g. BUS-01, BUS-04..."
              />
            </div>

            <div>
              <label class="block text-[10px] text-gray-400 mb-1 font-semibold">Incident / Hazard Type:</label>
              <select 
                id="report-incident-type"
                class="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Reckless Driving / Overspeeding">Reckless Driving / Overspeeding</option>
                <option value="Severe Overcrowding / Door Hazard">Severe Overcrowding / Door Hazard</option>
                <option value="Harassment / Unsafe Environment">Harassment / Passenger Safety</option>
                <option value="Route Deviation / Skipped Bus Stop">Route Deviation / Skipped Bus Stop</option>
                <option value="Mechanical Failure / Smoke">Mechanical Defect / Breakdown</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] text-gray-400 mb-1 font-semibold">Additional Details (Optional):</label>
              <textarea 
                id="report-description"
                rows="3"
                class="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 resize-none"
                placeholder="Describe location, direction, or specific concern..."
              ></textarea>
            </div>

            <!-- Zero PII Guarantee Note (Feature B) -->
            <div class="p-2 rounded-xl bg-gray-950 border border-gray-800 text-[10px] text-gray-400 space-y-1">
              <div class="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span>🛡️ Zero PII Stored</span>
              </div>
              <p class="text-[9px] leading-relaxed">
                No phone number, email, or device fingerprints are recorded. This report is directly queued to the MTC Safety Command Center.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-1">
              <button 
                type="button"
                onclick="CommuterApp.closeReportModal()" 
                class="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition cursor-pointer shadow-lg shadow-rose-900/40"
              >
                Submit Report
              </button>
            </div>
          </form>

        </div>
      </div>
    `;
  },

  openTicketModal(routeCode, stopId, busId) {
    const state = window.store.getState();
    const stops = state.stops || [];
    const stop = stops.find(s => s.id === stopId);
    const stopName = stop ? stop.name : 'Broadway Bus Terminus';

    this.ticketData = {
      routeCode: routeCode || '21G',
      stopName: stopName,
      busId: busId || 'BUS-01',
      passId: 'CP-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      fare: '₹15.00',
      validUntil: '2 Hours from issue'
    };
    this.ticketModalOpen = true;

    if (window.App) window.App.render(window.store.getState());

    // Render Canvas QR Code (Amendment 5: 100% Offline Canvas Generator)
    setTimeout(() => {
      const canvas = document.getElementById('ticket-qr-canvas');
      if (canvas) {
        this.drawOfflineQr(canvas, `${this.ticketData.passId}-${this.ticketData.routeCode}-${Date.now()}`);
      }
    }, 50);
  },

  closeTicketModal() {
    this.ticketModalOpen = false;
    if (window.App) window.App.render(window.store.getState());
  },

  openReportModal(busId) {
    this.reportBusId = busId || 'BUS-01';
    this.reportModalOpen = true;
    if (window.App) window.App.render(window.store.getState());
  },

  closeReportModal() {
    this.reportModalOpen = false;
    if (window.App) window.App.render(window.store.getState());
  },

  async submitReport() {
    const busIdInput = document.getElementById('report-bus-id');
    const incidentSelect = document.getElementById('report-incident-type');
    const descInput = document.getElementById('report-description');

    const busId = busIdInput ? busIdInput.value.trim() : this.reportBusId;
    const incidentType = incidentSelect ? incidentSelect.value : 'Reckless Driving';
    const description = descInput ? descInput.value.trim() : '';

    try {
      const res = await API.sendUnsafeReport({
        bus_id: busId,
        incident_type: incidentType,
        description: description
      });

      this.closeReportModal();
      window.store.addNotification(
        `🛡️ Anonymous safety report submitted for ${busId}. Queued for authority audit.`,
        'success'
      );
    } catch (err) {
      window.store.addNotification(`Report submission error: ${err.message}`, 'error');
    }
  },

  // 100% Offline Canvas QR Generator (No External CDN required)
  drawOfflineQr(canvasEl, payload) {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const size = 180;
    canvasEl.width = size;
    canvasEl.height = size;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Hash payload into deterministic 21x21 grid
    const grid = 21;
    const cellSize = Math.floor((size - 20) / grid);
    const offset = 10;

    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      hash = ((hash << 5) - hash) + payload.charCodeAt(i);
      hash |= 0;
    }

    // Draw QR Finder Patterns (3 corners: Top-Left, Top-Right, Bottom-Left)
    const drawFinder = (gx, gy) => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(offset + gx * cellSize, offset + gy * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(offset + (gx + 1) * cellSize, offset + (gy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(offset + (gx + 2) * cellSize, offset + (gy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(0, 0);
    drawFinder(grid - 7, 0);
    drawFinder(0, grid - 7);

    // Draw data modules deterministically based on payload characters
    ctx.fillStyle = '#000000';
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        // Skip finder pattern zones
        if ((r < 8 && c < 8) || (r < 8 && c >= grid - 8) || (r >= grid - 8 && c < 8)) {
          continue;
        }
        // Timing patterns
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 0.5, cellSize - 0.5);
          }
          continue;
        }
        // Data cells
        const seed = Math.sin(hash + r * 31 + c * 17) * 10000;
        const bit = (seed - Math.floor(seed)) > 0.45;
        if (bit) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
  },

  async initPolling() {
    this.stopPolling();
    await this.refreshData();
    this.pollInterval = setInterval(() => this.refreshData(), 3000);
  },

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },

  toggleAccessibility() {
    this.accessibilityMode = !this.accessibilityMode;
    window.store.addNotification(
      this.accessibilityMode 
        ? "♿ Accessibility Mode ON: Low-floor bus priority & audio announcements active." 
        : "Accessibility Mode OFF", 
      "info"
    );
    if (window.App) window.App.render(window.store.getState());
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    window.store.addNotification(this.isMuted ? "🔇 Audio announcements muted" : "🔊 Audio announcements unmuted", "info");
    if (window.App) window.App.render(window.store.getState());
  },

  checkAudioAnnouncements(arrivals, stopId) {
    if (!this.accessibilityMode || this.isMuted || !('speechSynthesis' in window)) return;

    arrivals.forEach(bus => {
      if (bus.eta_min <= 2) {
        const key = `${bus.bus_id}-${stopId}`;
        if (!this.announcedKeySet.has(key)) {
          this.announcedKeySet.add(key);
          const text = `Bus ${bus.route_code} arriving in ${bus.eta_min} minute${bus.eta_min === 1 ? '' : 's'}`;
          try {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.warn("SpeechSynthesis warning:", e);
          }
        }
      }
    });
  },

  async shareTrip() {
    const state = window.store.getState();
    const stopId = state.selectedStopId || 'STOP-21G-UP-01';
    const destId = state.selectedDestinationId || null;
    const arrivals = state.arrivals || [];
    const busId = arrivals[0] ? arrivals[0].bus_id : null;

    const res = await window.API.createTripShare(stopId, destId, busId);
    if (res && res.share_url) {
      const fullUrl = `${window.location.origin}${res.share_url}`;
      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(fullUrl);
          copied = true;
        } catch (e) {
          copied = false;
        }
      }
      if (copied) {
        window.store.addNotification(`🛡️ Trip share link copied to clipboard! (Valid for 60m)`, 'success');
      } else {
        prompt("Copy your trip share link (valid for 60 mins):", fullUrl);
      }
    } else {
      window.store.addNotification(`Unable to create trip share link.`, 'error');
    }
  },

  async refreshData() {
    const state = window.store.getState();
    const stopId = state.selectedStopId || 'STOP-21G-UP-01';
    const destId = state.selectedDestinationId || null;

    try {
      const [stops, arrivalsData, advice, disasterStatus, congestionAlerts] = await Promise.all([
        state.stops && state.stops.length ? state.stops : API.fetchStops(),
        API.fetchStopArrivals(stopId, destId),
        API.fetchCommuteAdvice(stopId, destId),
        API.fetchDisasterStatus(),
        API.fetchCongestionAlerts()
      ]);

      // Accumulate session CO2 savings once per stop recommendation
      if (advice && advice.recommendation === 'WAIT' && advice.co2_saved_g > 0) {
        const adviceKey = `${stopId}-${advice.co2_saved_g}`;
        if (this.lastAdviceStopKey !== adviceKey) {
          this.sessionCo2SavedG += advice.co2_saved_g;
          this.lastAdviceStopKey = adviceKey;
        }
      }

      window.store.setState({
        stops,
        arrivals: arrivalsData.approaching_buses || [],
        excludedBuses: arrivalsData.excluded_buses || [],
        commuteAdvice: advice,
        disasterStatus: disasterStatus || { disaster_mode: false, affected_routes: [] },
        congestionAlerts: congestionAlerts || []
      });

      // Check audio announcements for accessibility mode
      this.checkAudioAnnouncements(arrivalsData.approaching_buses || [], stopId);

    } catch (err) {
      console.warn("Error refreshing commuter app data:", err);
    }
  },

  async onStopChange(stopId) {
    // Amendment 1: Clear announced key set when selected stop changes
    this.announcedKeySet.clear();
    window.store.setState({ selectedStopId: stopId });
    await this.refreshData();
  },

  async onDestChange(destId) {
    window.store.setState({ selectedDestinationId: destId || null });
    await this.refreshData();
  },

  async detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const nearest = await API.fetchNearestStop(pos.coords.latitude, pos.coords.longitude);
        if (nearest) {
          this.announcedKeySet.clear();
          window.store.setState({ selectedStopId: nearest.id });
          window.store.addNotification(`Detected nearest stop: ${nearest.name} (${nearest.distance_m}m)`, 'success');
          await this.refreshData();
        }
      }, (err) => {
        window.store.addNotification(`Location error: ${err.message}`, 'error');
      });
    }
  },

  async sendChat() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();
    input.value = '';

    const state = window.store.getState();
    const currentMsgs = state.assistantMessages || [];
    
    // Add user message
    const userMsg = { sender: 'user', text: query, timestamp: new Date().toLocaleTimeString() };
    window.store.setState({ assistantMessages: [...currentMsgs, userMsg] });

    // Scroll chat stream
    setTimeout(() => {
      const stream = document.getElementById('chat-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }, 50);

    // Call API
    const res = await API.sendAssistantQuery(query, state.selectedStopId, state.selectedDestinationId);
    
    const botMsg = { sender: 'bot', text: res.response || "No response received.", timestamp: new Date().toLocaleTimeString() };
    window.store.setState({ assistantMessages: [...window.store.getState().assistantMessages, botMsg] });

    setTimeout(() => {
      const stream = document.getElementById('chat-stream');
      if (stream) stream.scrollTop = stream.scrollHeight;
    }, 50);
  }
};

window.CommuterApp = CommuterApp;
