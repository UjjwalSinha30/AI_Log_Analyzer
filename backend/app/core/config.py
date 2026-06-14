import os
from groq import Groq
import mysql.connector

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable not set")

groq_client = Groq(api_key=GROQ_API_KEY)

MODEL = "llama3-70b-8192"
MAX_TOKENS = 2000
LOG_CHAR_LIMIT = 8000

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "log_analyzer"),
}

def get_db():
    return mysql.connector.connect(**DB_CONFIG)