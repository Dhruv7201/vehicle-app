from pymongo import MongoClient
import os

from dotenv import load_dotenv

load_dotenv()


def mongo_connect():
    uri = os.getenv('MONGO_URI')
    print(uri)
    client = MongoClient(uri)
    db = client['logs_db']
    return db

def main():
    db = mongo_connect()
    print(db)


if __name__ == '__main__':
    main()