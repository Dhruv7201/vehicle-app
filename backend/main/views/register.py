from fastapi import APIRouter, Depends
import requests
from main.models import RegisteredPlates
from datetime import datetime
from main.db import get_db
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

router = APIRouter()



@router.get("/hook")
def hook(db: Session = Depends(get_db)):
    # call api to get registered plates data
    from_date_time = (datetime.now() + timedelta(days=-20)).strftime("%Y-%m-%d")
    to_date_time = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")
    try:
        apiUrl = f"https://registrationandtouristcare.uk.gov.in:9017/apiuser/vehicle/getVehicledetails?fromdateTime={from_date_time}&todateTime={to_date_time}"
        print(apiUrl)
        response = requests.get(apiUrl)
        data = response.json()
        if data.get("status") == True:
            for plats in data.get("data"):
                
                plate_number = plats.get("VehicleNo")
                is_active = 1
                
                # check if plate number exists in db
                plate = db.query(RegisteredPlates).filter(RegisteredPlates.plate_number == plate_number).first()
                if plate is None:
                    # add new plate to db
                    db.add(RegisteredPlates(plate_number=plate_number, is_active=is_active, created_at=datetime.now()))
                    db.commit()
            return { "success": True, "message": "Data fetched successfully" }
        else:
            return { "success": False, "error": "Failed to get data from api" }
    except Exception as e:
        return { "success": False, "error": "Failed to get data from api error: " + str(e) }
