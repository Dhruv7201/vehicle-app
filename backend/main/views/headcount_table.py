from fastapi import APIRouter, Depends
from main.db import get_db
from main.models import ActivityHeadCount, HeadDevice
from datetime import datetime, timedelta


router = APIRouter()



@router.get("/headcount_table")
def headcount_table(db = Depends(get_db)):
    try:
        data = []
        two_minutes_ago = datetime.now() - timedelta(hours=6)
        subquery = (
                db.query(ActivityHeadCount.device_id)
                .filter(ActivityHeadCount.created_at >= two_minutes_ago)
                .distinct()
                .order_by(ActivityHeadCount.id.desc())
                .subquery()
            )
        
        query = (
            db.query(HeadDevice, subquery.c.device_id)
            .outerjoin(subquery, HeadDevice.anpr == subquery.c.device_id)
        )

        results = query.all()
        

        for row in results:
            last_date = None
            last_date = db.query(ActivityHeadCount.created_at).filter(ActivityHeadCount.device_id == row[0].anpr).order_by(ActivityHeadCount.id.desc()).first()
            last_date = last_date[0] if last_date else None
            last_date = last_date.strftime("%Y-%m-%d %H:%M:%S") if last_date else None
            if row[1] is None:
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
    