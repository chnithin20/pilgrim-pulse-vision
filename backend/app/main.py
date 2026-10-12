from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1 import api_router
from app.database.base import Base
from app.database.session import engine
from app.websocket.prediction_socket import websocket_predictions
from app.simulation.simulation_scheduler import simulation_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager handling automatic startup and graceful shutdown
    of the real-time Digital Twin simulation engine loop.
    """
    if settings.DATABASE_URL.startswith("sqlite"):
        Base.metadata.create_all(bind=engine)

    # Startup: Launch real-time background simulation scheduler
    simulation_scheduler.start()
    yield
    # Shutdown: Stop real-time simulation background task cleanly
    await simulation_scheduler.stop()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        *settings.CORS_ORIGINS,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.add_api_websocket_route("/ws/predictions", websocket_predictions)


@app.get("/")
def read_root():
    return {"message": "Pilgrim Pulse Backend Running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}