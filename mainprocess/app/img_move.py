import os
import datetime
from app import db, mq
from app.models import AnprVehicleCameraResponse, ErrorLog


def mover():
    # mover will move the images from the source folder to the destination folder
    source_folder = "./uploads"
    destination_folder_root = "./number_plates"
    date = datetime.datetime.now().strftime("%Y-%m-%d")
    destination_folder = f"{destination_folder_root}/{date}"
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
    for filename in os.listdir(source_folder):
        if filename.endswith(".jpg"):
            try:
                os.rename(f"{source_folder}/{filename}", f"{destination_folder}/{filename}")
                # update db with the new path
                update_db(destination_folder, filename)
            except Exception as e:
                print(f"Error moving file {filename}: {e}")
                # insert error in db
                insert_error_db(filename, str(e))



def update_db(destination_folder, filename):
    # get the mq message
    msg = get_msg()
    # update row with id from message
    row = db.query(AnprVehicleCameraResponse).filter(AnprVehicleCameraResponse.id == msg).first()
    row.image_path = f"{destination_folder}/{filename}"
    db.commit()
    


def insert_error_db(filename, error):
    # insert error in db
    error_log = ErrorLog(filename=filename, error_message=error)
    db.add(error_log)
    db.commit()
    



def get_msg():
    # get message from the queue
    message = mq.consume()
    print(f"Message: {message}")