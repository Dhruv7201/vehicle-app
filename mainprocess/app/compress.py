from PIL import Image
import os
from datetime import datetime

from app import log


def compress_image(root_path: str, quality: int = 50):
    # root path will have device ids
    for device_id in os.listdir(root_path):
        log.info(f"Compressing images for device: {device_id}")
        # all device have fixed path by date in numeric format month/day/hour
        date_tim = datetime.now()
        month = date_tim.strftime('%m')
        day = date_tim.strftime('%d')
        hour = date_tim.strftime('%H')
        device_path = os.path.join(root_path, device_id, month, day, hour)

        log.info(f"Today path for device: {device_path}")

        if not os.path.exists(device_path):
            log.error(f"Path does not exist: {device_path}")
            continue
        

        for image in os.listdir(device_path):
            image_path = os.path.join(device_path, image)
            log.info(f"Compressing image: {image_path}")
            try:
                img = Image.open(image_path)
                img.save(f"compressed_{image_path}", optimize=True, quality=quality)
                os.remove(image_path)
                os.rename(f"compressed_{image_path}", image_path)
            except Exception as e:
                log.error(f"Error compressing image: {image_path}, {str(e)}")
                continue
            log.info(f"Image compressed: {image_path}")

