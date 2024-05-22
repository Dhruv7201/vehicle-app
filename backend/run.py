from dotenv import load_dotenv


load_dotenv()
from main import fastApp


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run("run:fastApp", host="0.0.0.0", port=8000, reload=True)