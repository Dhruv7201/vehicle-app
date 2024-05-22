from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import aliased
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from main.db import get_db
from main.models import AnprVehicleCameraResponse, Device

router = APIRouter()

@router.get("/anpr_table")
def anpr_table(db = Depends(get_db)):
    try:
        data = []
        tow_minutes_ago = datetime.now() - timedelta(hours=6)
        subquery = (
            db.query(AnprVehicleCameraResponse.deviceId)
            .filter(AnprVehicleCameraResponse.created_at >= tow_minutes_ago)
            .distinct()
            .order_by(AnprVehicleCameraResponse.id.desc())
            .subquery()
        )
        
        query = (
            db.query(Device, subquery.c.deviceId)
            .outerjoin(subquery, Device.anpr == subquery.c.deviceId)
        )
        
        results = query.all()
        for row in results:
            last_date = None
            last_date = db.query(AnprVehicleCameraResponse.created_at).filter(AnprVehicleCameraResponse.deviceId == row[0].anpr).order_by(AnprVehicleCameraResponse.id.desc()).first()
            last_date = last_date[0] if last_date else None
            last_date = last_date.strftime("%Y-%m-%d %H:%M:%S") if last_date else None
            if not row[1]:
                data.append({
                    "location": row[0].location,
                    "device_id": row[0].anpr,
                    "date_time": last_date if last_date else None,
                    "status": False
                })
            else:
                data.append({
                    "location": row[0].location,
                    "device_id": row[0].anpr,
                    "date_time": last_date,
                    "status": True
                })
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}