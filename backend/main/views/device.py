from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from main.db import get_db
from main.models import Device, AnprVehicleCameraResponse
from sqlalchemy import distinct
import os
from ftplib import FTP
from datetime import datetime, timedelta




router = APIRouter()



@router.get("/devices")
def devices(db: Session = Depends(get_db)):
    try:
        devices = db.query(Device).all()
        response = []
        
        response.append({"id": 0, "location": "All", "anpr": "All", "next_device": 0, "latitude": 0, "longitude": 0})
        for device in devices:
            response.append({
                "id": device.d_id, 
                "location": device.location, 
                "anpr": device.anpr, 
                "next_device": device.next_device_id, 
                "latitude": device.latitude, 
                "longitude": device.longitude
            })
        return {"success": True, "data": response}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}
    


@router.get("/filterDevice")
def filterDevice(db: Session = Depends(get_db), from_device: str = None, to_device: str = None):
    try:
        if to_device == '0':
            response = db.query(Device).filter(Device.d_id >= from_device).all()
            return {"success": True, "data": response}
        if from_device == '0':
            response = db.query(Device).filter(Device.d_id <= to_device).all()
            return {"success": True, "data": response}
        response = db.query(Device).filter(Device.d_id >= from_device, Device.d_id <= to_device).all()
        return {"success": True, "data": response}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}
    


@router.get("/ftpFlag")
def ftpFlag(db: Session = Depends(get_db)):
    ftp_path = os.getenv("FTP_PATH")
    devices = db.query(Device).all()
    response = []
    for device in devices:
        date_time = datetime.now()
        month = date_time.strftime("%m")
        day = date_time.strftime("%d")
        hour = date_time.strftime("%H")

        path = ftp_path + "/" + device.anpr + "/" + month + "/" + day + "/" + hour
        
        # check if the path exists
        if os.path.exists(path):
            # check last modified time
            last_modified_time = os.path.getmtime(path)
            last_modified_date = datetime.fromtimestamp(last_modified_time)
            current_date = datetime.now()
            time_difference = current_date - last_modified_date
            # if its more than 2 mins then response is False with date and time
            if time_difference.total_seconds() > 120:
                response.append({"anpr": device.anpr, "lst_modified": last_modified_date.strftime("%Y-%m-%d %H:%M:%S"), "flag": False})
            else:
                response.append({"anpr": device.anpr, "lst_modified": last_modified_date.strftime("%Y-%m-%d %H:%M:%S"), "flag": True})
        else:
            response.append({"anpr": device.anpr, "lst_modified": "", "flag": False})

    return {"success": True, "data": response}

