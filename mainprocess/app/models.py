from sqlalchemy import Column, Integer, String, Date, DateTime, Text, TIMESTAMP, CHAR, VARCHAR
from sqlalchemy.dialects.mysql import TINYINT
from .db import Base

class ActivityHeadCount(Base):
    __tablename__ = 'activity_head_count'

    id = Column(Integer, primary_key=True)
    head_count_camera_response = Column(Text)
    post_response_status = Column(Text)
    post_status = Column(TINYINT)
    api_name = Column(String(255))
    created_at = Column(DateTime)


class AnprDeviceCountResponse(Base):
    __tablename__ = 'anpr_device_count_response'

    id = Column(Integer, primary_key=True)
    device_id = Column(String(300), nullable=False)
    device_location_name = Column(String(300), nullable=False)
    device_count = Column(Integer, nullable=False)
    response_date = Column(Date, nullable=False)


class AnprVehicleCameraResponse(Base):
    __tablename__ = 'anpr_vehicle_camera_response'

    id = Column(Integer, primary_key=True)
    camera_response = Column(Text)
    post_response_status = Column(Text)
    post_status = Column(TINYINT)
    plate_number = Column(String(300))
    snap_time = Column(TIMESTAMP)
    api_name = Column(String(300))
    created_at = Column(DateTime, index=True)
    deviceId = Column(CHAR(25), index=True)


class Device(Base):
    __tablename__ = 'device'

    d_id = Column(Integer, primary_key=True)
    location = Column(String(300), nullable=False)
    anpr = Column(VARCHAR(300), nullable=False)


class Registered_plates(Base):
    __tablename__ = 'registered_plates'

    id = Column(Integer, primary_key=True)
    plate_number = Column(String(300), nullable=False)
    created_at = Column(DateTime, nullable=False)
    is_active = Column(TINYINT, nullable=False)