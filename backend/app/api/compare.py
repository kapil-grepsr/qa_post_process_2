from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import List
import pandas as pd
import uuid
from app.api.cache import data_cache

router = APIRouter()

@router.post("/compare-csv/")
async def compare_csv(files: List[UploadFile] = File(...), base_index: int = Form(0)):
    try:
        results = []

        dfs = []
        for i, file in enumerate(files):
            if not file.filename or not file.filename.endswith(".csv"):
                raise HTTPException(status_code=400, detail=f"File at index {i} is not a valid CSV")
            df = pd.read_csv(file.file)
            dfs.append({
                "filename": file.filename,
                "df": df
            })

        # pick actual base file by base_index
        if base_index < 0 or base_index >= len(dfs):
            raise HTTPException(status_code=400, detail="Invalid base file index")
        base_rows = len(dfs[base_index]["df"])

        for i, file_info in enumerate(dfs):
            filename = file_info["filename"]
            df = file_info["df"]

            file_id = str(uuid.uuid4())
            data_cache[file_id] = df

            total_counts = {
                "rows": len(df),
                "columns": len(df.columns)
            }
            fill_rate = round((1 - df.isna().mean().mean()) * 100, 1)

            # use actual file position, not i
            if i == base_index:
                change_pct = 0
            elif base_rows > 0:
                change_pct = round(((len(df) - base_rows) / base_rows) * 100, 1)
            else:
                change_pct = None

            results.append({
                "filename": filename,
                "totalCount": total_counts,
                "fillRate": fill_rate,
                "changePct": change_pct,
                "fileId": file_id
            })

        return {
            "results": results,
            "baseFileIndex": base_index
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")
