import os
from dotenv import load_dotenv
from api import create_app

load_dotenv()

app = create_app(os.getenv("APP_SETTINGS", "config.DevelopmentConfig"))
    

if __name__ == "__main__":
    app.run()
