from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import json
from io import BytesIO

router = APIRouter()

@router.post("/check-duplicates")
async def check_duplicates(
    file: UploadFile = File(...),
    primary_column: str = Form(...)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV: {str(e)}")

    if primary_column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{primary_column}' not found in CSV")

    duplicates = df[df.duplicated(subset=[primary_column], keep=False)]

    if duplicates.empty:
        return JSONResponse(content={"message": "No duplicates found."})

    # Use to_json + json.loads to ensure NaN -> null
    duplicate_records = json.loads(duplicates.to_json(orient="records"))

    return JSONResponse(content={
        "message": f"Found {len(duplicates)} duplicate rows.",
        "duplicates": duplicate_records,
        "count": len(duplicates)
    })
