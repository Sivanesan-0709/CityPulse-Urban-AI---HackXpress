import uvicorn
from app.config import HOST, PORT

if __name__ == "__main__":
    print(f"==================================================")
    print(f" CityPulse AI - Urban Intelligence Platform")
    print(f" SIH 2026 Problem Statement ID: 26124")
    print(f" Server starting on http://localhost:{PORT}")
    print(f"==================================================")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
