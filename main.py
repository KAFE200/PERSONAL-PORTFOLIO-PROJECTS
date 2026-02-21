from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Calculation(BaseModel):
    num1: float
    num2: float
    operation: str

@app.post("/calculate")
async def calculate(data: Calculation):
    result = 0
    status = "success"

    
    try:
        if data.operation == "add":
            result = data.num1 + data.num2
            
        elif data.operation == "subtract":
            result = data.num1 - data.num2
            
        elif data.operation == "multiply":
            result = data.num1 * data.num2
            
        elif data.operation == "divide":
            if data.num2 == 0:
                return {"result": "Error: Div by 0", "status": "error"}
            result = data.num1 / data.num2
            
        elif data.operation == "percent":
            
            result = data.num1 / 100
            
        else:
            return {"result": "Invalid Operation", "status": "error"}

    
        return {"result": round(result, 4) if isinstance(result, float) else result, "status": status}

    except Exception as e:
        return {"result": f"Server Error: {str(e)}", "status": "error"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
