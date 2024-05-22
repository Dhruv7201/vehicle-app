from fastapi import APIRouter, Depends
import os
from PIL import Image
from datetime import datetime, timedelta
from main.models import Device
from main.db import get_db


router = APIRouter()



@router.get("/compress_img")
def compress(db = Depends(get_db)):
    
    ftp_path = os.getenv("FTP_PATH")
    quality = os.getenv("IMG_QUALITY")

    date_time = datetime.now()
    month = date_time.strftime('%m')
    day = date_time.strftime('%d')

    device_list = db.query(Device).all()

    for device in device_list:
        device_id = device.anpr
        device_path = os.path.join(ftp_path, device_id, month, day)

        if not os.path.exists(device_path):
            continue

        for hour in os.listdir(device_path):
            hour_path = os.path.join(device_path, hour)
            for img in os.listdir(hour_path):
                img_path = os.path.join(hour_path, img)
                img = Image.open(img_path)
                # delete old image
                os.remove(img_path)
                # save compressed image
                img.save(img_path, quality=quality)

    
    return { "success": True, "message": "Compressing image" }



@router.get("/delete_old_img")
def delete_old_img(db = Depends(get_db)):
    
    ftp_path = os.getenv("FTP_PATH")

    date_time = datetime.now()
    twp_months_ago = date_time - timedelta(days=60)
    month = twp_months_ago.strftime('%m')
    day = twp_months_ago.strftime('%d')
    try:
        devices= db.query(Device).all()
    except:
        return { "success": False, "error": "Failed to get devices from db" }

    for device in devices:
        device_id = device.anpr
        device_path = os.path.join(ftp_path, device_id, month, day)

        if not os.path.exists(device_path):
            continue

        for hour in os.listdir(device_path):
            hour_path = os.path.join(device_path, hour)
            for img in os.listdir(hour_path):
                img_path = os.path.join(hour_path, img)
                try:
                    os.remove(img_path)
                except:
                    return { "success": False, "error": "Failed to delete old image" }

    
    for device in devices:
        device_id = device.anpr
        
        month_path = os.path.join(ftp_path, device_id, month)
        day_path = os.path.join(ftp_path, device_id, month, day)
        hour_path = os.path.join(ftp_path, device_id, month, day, hour)

        if os.path.exists(hour_path) and not os.listdir(hour_path):
            try:
                os.rmdir(hour_path)
            except:
                return { "success": False, "error": "Failed to delete old hour folder", "path": hour_path }
        if os.path.exists(day_path) and not os.listdir(day_path):
            try:
                os.rmdir(day_path)
            except:
                return { "success": False, "error": "Failed to delete old image day folder", "path": day_path }
        if os.path.exists(month_path) and not os.listdir(month_path):
            try:
                os.rmdir(month_path)
            except:
                return { "success": False, "error": "Failed to delete old image month folder", "path": month_path }
        
        
        
    return { "success": True, "message": "Deleting old image" }