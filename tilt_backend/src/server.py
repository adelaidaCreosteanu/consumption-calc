from fastapi import FastAPI
from fastapi import Response
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware

from src.estimator import compute_min_consumption, estimate
from src.types import   get_appliance

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


@app.get("/consumptions", status_code=200)
async def consumptions(total: float, appliances: str, response: Response):
    try:
        # Instantiate appliances
        aplcs = [get_appliance(a) for a in appliances.split(",")]
    except Exception as ex:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": str(ex)}

    try:
        # Estimate consumption per appliance
        result = estimate(aplcs, total)
    except Exception as ex:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(ex)}

    return result
