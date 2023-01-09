from urllib import response
from fastapi import FastAPI
from fastapi import Response
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://main.d1v91ui4o6nkl1.amplifyapp.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/consumptions", status_code=200)
async def consumptions(total: float, appliances: str, response: response):
    pass