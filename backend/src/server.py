from fastapi import FastAPI
from fastapi import Response
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware

from src.estimator import compute_min_max_consumption, estimate
from src.types import Appliance, get_appliance

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _create_appliances(appliances: str) -> list[Appliance]:
    return [get_appliance(a) for a in appliances.split(",")]


@app.get("/min_max_consumption", status_code=200)
async def min_max_consumption(appliances: str, response: Response):
    try:
        aplcs = _create_appliances(appliances)
    except Exception as ex:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"detail": str(ex)}

    try:
        # Calculate min consumption of appliances
        result = compute_min_max_consumption(aplcs)
    except Exception as ex:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"detail": str(ex)}

    return result


@app.get("/estimate_appliances", status_code=200)
async def estimate_appliances(total: float, appliances: str, response: Response):
    try:
        aplcs = _create_appliances(appliances)
    except Exception as ex:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"detail": str(ex)}

    try:
        # Estimate consumption per appliance
        result = estimate(aplcs, total)
    except Exception as ex:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"detail": str(ex)}

    return result
