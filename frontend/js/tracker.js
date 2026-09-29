// CityPulse Urban AI - Mobile Driver Tracker Client JS
let isTracking = false;
let watchId = null;
let pingCount = 0;
let timerId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check secure context
  if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    const alertEl = document.getElementById('secure-context-alert');
    if (alertEl) alertEl.classList.remove('hidden');
  }

  const busSelect = document.getElementById('select-bus');
  if (busSelect) {
    busSelect.addEventListener('change', (e) => {
      const busId = e.target.value;
      const routeMap = {
        'BUS-01': '21G', 'BUS-02': '21G',
        'BUS-03': '19B', 'BUS-04': '19B',
        'BUS-05': '5C',  'BUS-06': '5C',
        'BUS-07': '23C', 'BUS-08': '23C'
      };
      const inputRoute = document.getElementById('input-route');
      if (inputRoute) inputRoute.value = routeMap[busId] || '21G';
    });
  }
});

function toggleTracking() {
  const btn = document.getElementById('btn-toggle');
  const badge = document.getElementById('badge-status');

  if (!isTracking) {
    // Start tracking
    isTracking = true;
    if (btn) {
      btn.innerText = '⏹ Stop Streaming';
      btn.className = 'w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition shadow-lg shadow-rose-600/20 cursor-pointer';
    }
    if (badge) {
      badge.innerText = 'LIVE GPS ACTIVE';
      badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 pulse-live';
    }

    if (navigator.geolocation) {
      // Periodic ping every 2s
      timerId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(sendGpsPing, handleGpsError, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      }, 2000);
    } else {
      alert("Geolocation is not supported by this browser.");
      toggleTracking();
    }
  } else {
    // Stop tracking
    isTracking = false;
    if (timerId) clearInterval(timerId);
    if (btn) {
      btn.innerText = '▶ Start GPS Streaming';
      btn.className = 'w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition shadow-lg shadow-cyan-600/20 cursor-pointer';
    }
    if (badge) {
      badge.innerText = 'STANDBY';
      badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700';
    }
  }
}

async function sendGpsPing(pos) {
  const busId = document.getElementById('select-bus')?.value || 'BUS-01';
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const speed = pos.coords.speed ? (pos.coords.speed * 3.6) : 32.0; // m/s to km/h
  const heading = pos.coords.heading || 180.0;

  // Update UI
  document.getElementById('val-lat').innerText = lat.toFixed(5);
  document.getElementById('val-lng').innerText = lng.toFixed(5);
  document.getElementById('val-speed').innerText = `${speed.toFixed(1)} km/h`;
  document.getElementById('val-heading').innerText = `${heading.toFixed(0)}°`;

  try {
    const res = await fetch('/api/feed/gps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bus_id: busId,
        lat: lat,
        lng: lng,
        speed: speed,
        heading: heading,
        ts: new Date().toISOString()
      })
    });
    if (res.ok) {
      pingCount++;
      document.getElementById('val-pings').innerText = pingCount;
    }
  } catch (err) {
    console.warn("GPS telemetry upload error:", err);
  }
}

function handleGpsError(err) {
  console.warn("GPS error:", err.message);
  if (err.code === 1) { // PERMISSION_DENIED
    alert("Location permission denied. Please allow location access in your browser settings.");
  }
}
