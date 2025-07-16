from fastapi import File, UploadFile, HTTPException, APIRouter
from fastapi.responses import StreamingResponse
from typing import List
import pandas as pd
import io

router = APIRouter()

@router.post("/")
async def concat_csv(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Please upload at least two CSV files.")

    dataframes = []
    expected_columns = None

    for file in files:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail=f"Invalid file type: {file.filename}")
        try:
            content = await file.read()
            df = pd.read_csv(io.BytesIO(content))

            if expected_columns is None:
                expected_columns = list(df.columns)
            else:
                if list(df.columns) != expected_columns:
                    raise HTTPException(
                        status_code=400,
                        detail=(
                            f"Columns mismatch in file {file.filename}. "
                            f"Expected columns: {expected_columns}, "
                            f"but got: {list(df.columns)}"
                        )
                    )

            dataframes.append(df)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading {file.filename}: {str(e)}")

    try:
        concatenated_df = pd.concat(dataframes, ignore_index=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error concatenating files: {str(e)}")

    output = io.StringIO()
    concatenated_df.to_csv(output, index=False)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=concatenated.csv"}
    )
