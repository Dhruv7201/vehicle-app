# app/views/home.py
import os
import json
from ftplib import FTP
from datetime import datetime
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, Query, Depends
from fastapi.responses import FileResponse

from main import db
from main.models import AnprVehicleCameraResponse, Device, RegisteredPlates
from main.db import get_db


from sqlalchemy.orm import Session, aliased
from sqlalchemy.sql import func, case, distinct
from sqlalchemy import Date


router = APIRouter()


from datetime import datetime

class DateParser:
    def __init__(self, date):
        self.date = date
        self.date_obj = self.parse_date()
    
    def parse_date(self):
        if isinstance(self.date, str):
            # If date is a string, parse it
            date, time = self.date.split(' ')
            year, month, day = date.split('-')
            hour, minute, second = time.split(':')
            return datetime(int(year), int(month), int(day), int(hour), int(minute), int(second))
        elif isinstance(self.date, datetime):
            # If date is already a datetime object, return it directly
            return self.date
        else:
            # Handle unsupported types or raise an error
            raise TypeError("Unsupported type for date")

    def __str__(self):
        return self.date_obj.strftime('%Y-%m-%d %H:%M:%S')

    def __repr__(self):
        return self.date_obj.strftime('%Y-%m-%d %H:%M:%S')




@router.post("/search")
def search(data: dict, db: Session = Depends(get_db)):
    
    start = datetime.now()
    
    search_data = data.get("search")
    
    try:
        # take plate number from the search data using LIKE
        query_results = db.query(
            AnprVehicleCameraResponse.id,
            AnprVehicleCameraResponse.plate_number,
            AnprVehicleCameraResponse.snap_time,
            AnprVehicleCameraResponse.deviceId,
            Device.location,
            AnprVehicleCameraResponse.created_at
        ).join(
            Device,
            AnprVehicleCameraResponse.deviceId == Device.anpr
        ).filter(
            AnprVehicleCameraResponse.plate_number.like(f"{search_data}%"),
            AnprVehicleCameraResponse.deviceId == Device.anpr
        ).all()


    except Exception as e:
        return {"success": False, "error": str(e)}
    

    processed_results = []
    for result in query_results:
            if not result.snap_time:
                continue
            date_time = str(result.snap_time)
            date_time = DateParser(result.snap_time)
            month = date_time.date_obj.strftime('%m')
            day = date_time.date_obj.strftime('%d')
            hour = date_time.date_obj.strftime('%H')

            path = f"{result.deviceId}/{month}/{day}/{hour}/{result.plate_number}.jpg"

            processed_results.append({
                "id": result.id,
                "plate_number": result.plate_number,
                "snap_time": result.snap_time,
                "deviceId": result.deviceId,
                "location": result.location,
                "path": path,
                "created_at": str(DateParser(str(result.created_at))),
            })
    
    
    return {"success": True, "data": processed_results}


@router.get("/get_image")
def get_image(path: str = Query(description="Path to the image", default=None, alias="path")):
    
    try:
        ftp_host = os.getenv('FTP_HOST')
        ftp_user = os.getenv('FTP_USER')
        ftp_pass = os.getenv('FTP_PASS')
        ftp = FTP(ftp_host)
        ftp.login(user=ftp_user, passwd=ftp_pass)
    
        with NamedTemporaryFile(delete=False) as tmp_file:
            tmp_filename = tmp_file.name
            ftp.retrbinary(f"RETR {path}", tmp_file.write)
        return FileResponse(tmp_filename)
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        ftp.quit()
    
    

@router.get("/summary")
def summary(
    db: Session = Depends(get_db),
    device: str = Query(description="Device id", default=None, alias="device"),
    from_date: str = Query(description="From date", default=None, alias="from"),
    to_date: str = Query(description="To date", default=None, alias="to")
):
    start = datetime.now()
    try:
        from_date = from_date.replace("T", " ")
        to_date = to_date.replace("T", " ")
        
        device_name = db.query(Device.location).filter(Device.anpr == device).first()
        query = db.query(
            func.count(AnprVehicleCameraResponse.id).label('total_plate_count'),
            func.sum(case([(RegisteredPlates.id != None, 1)], else_=0)).label('registered_plate_count'),
            func.sum(case([(RegisteredPlates.id == None, 1)], else_=0)).label('non_registered_plate_count')
        ).outerjoin(
            RegisteredPlates,
            AnprVehicleCameraResponse.plate_number == RegisteredPlates.plate_number
        ).filter(
            AnprVehicleCameraResponse.deviceId == device,
            AnprVehicleCameraResponse.snap_time.between(from_date, to_date)
        )


        result = query.first()

        return {
            "success": True,
            "device": device_name[0],
            "registered_plate_count": result.registered_plate_count or 0,
            "non_registered_plate_count": result.non_registered_plate_count or 0,
            "total_plate_count": result.total_plate_count or 0
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


