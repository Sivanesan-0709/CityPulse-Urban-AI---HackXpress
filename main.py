import sys
from pathlib import Path

# Ensure backend directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent / 'backend'
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import app
from app.config import HOST, PORT

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('server:app', host=HOST, port=PORT, reload=False)
