"""
CityPulse Urban AI - Pretrained Model Diagnostic Script
Verifies load state, device, weights presence, and measured FPS/latency for all models.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


from app.services.model_registry import model_registry

def check_models():
    print("=" * 70)
    print("CITYPULSE URBAN AI - PRETRAINED MODEL REGISTRY STATUS")
    print("=" * 70)

    status_list = model_registry.get_status()

    for idx, m in enumerate(status_list, 1):
        print(f"\n[{idx}/{len(status_list)}] Model: {m['name']}")
        print(f"  - Source  : {m['source']}")
        print(f"  - Licence : {m['licence']}")
        print(f"  - Device  : {m['device']}")
        print(f"  - Status  : {m['load_state']}")
        print(f"  - Performance Metric: {m['measured_fps_latency']}")

    print("\n" + "=" * 70)
    print("MODEL REGISTRY CHECK COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    check_models()
