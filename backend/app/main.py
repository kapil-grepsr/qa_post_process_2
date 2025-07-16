from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.merge import router as merge_router
from app.api.concat import router as concat_router
from app.api.duplicates import router as duplicates_router
from app.api.open_in_dtale import router as open_in_dtale
from app.api.get_columns import router as getColumns_router 
from app.api.compare import router as compare_router
from app.api.upload_csv import router as upload_csv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for your frontend origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(merge_router, prefix="/merge")
app.include_router(concat_router, prefix="/concat")
app.include_router(duplicates_router, prefix="/duplicates")
app.include_router(getColumns_router, prefix="/columns")
app.include_router(open_in_dtale, prefix="/dtale")
app.include_router(compare_router, prefix="/data-compare")

@app.get("/")
async def root():
    return {"message": "Backend is running 🚀"}
