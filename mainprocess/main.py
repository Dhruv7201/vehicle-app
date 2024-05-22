from dotenv import load_dotenv

load_dotenv()

from app import compress_image

if __name__ == '__main__':
    compress_image('app/images')
    