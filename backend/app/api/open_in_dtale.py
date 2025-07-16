from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from app.api.cache import data_cache
from io import BytesIO
import pandas as pd
import dtale
import uuid

router = APIRouter()

# data_cache = {}  # Key: file_id, Value: DataFrame

@router.post("/open-in-dtale")
async def open_in_dtale(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV: {str(e)}")

    # Generate unique file_id
    file_id = str(uuid.uuid4())

    data_cache[file_id] = df
    print(f"before data_cache:  {data_cache}")

    instance = dtale.show(df, open_browser=False)
    dtale_url = instance._main_url

    return JSONResponse(content={"dtale_url": dtale_url, "file_id": file_id})

@router.get("/open-cached")
async def open_cached(file_id: str = Query(..., description="ID of cached file")):
    print(f"Requested file_id: {file_id}")
    print(f"Current cache keys before lookup: {list(data_cache.keys())}")
    df = data_cache.get(file_id)
    if df is None:
        raise HTTPException(status_code=404, detail="File not found in cache")

    instance = dtale.show(df, open_browser=False)
    dtale_url = instance._main_url

    return {"dtale_url": dtale_url}
