export const SAMPLE_LOGS = {
  python: `2024-01-15 10:23:01 ERROR uvicorn.error - Exception in ASGI application
Traceback (most recent call last):
  File "/app/main.py", line 45, in get_user
    result = db.execute(query)
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL: remaining connection slots are reserved
2024-01-15 10:23:02 ERROR uvicorn.error - Exception in ASGI application
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL: remaining connection slots are reserved
2024-01-15 10:23:03 WARNING uvicorn.access - 500 Internal Server Error /api/users
2024-01-15 10:23:10 ERROR uvicorn.error - Exception in ASGI application
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) FATAL: remaining connection slots are reserved`,

  nginx: `192.168.1.10 - - [15/Jan/2024:10:00:01 +0000] "GET /api/health HTTP/1.1" 200 18
192.168.1.22 - - [15/Jan/2024:10:00:45 +0000] "POST /api/upload HTTP/1.1" 413 0
192.168.1.33 - - [15/Jan/2024:10:01:02 +0000] "GET /api/users HTTP/1.1" 502 0
192.168.1.33 - - [15/Jan/2024:10:01:05 +0000] "GET /api/users HTTP/1.1" 502 0
192.168.1.11 - - [15/Jan/2024:10:03:00 +0000] "POST /api/login HTTP/1.1" 429 0
192.168.1.11 - - [15/Jan/2024:10:03:01 +0000] "POST /api/login HTTP/1.1" 429 0`,

  docker: `2024-01-15T10:00:01.123Z container=api-server msg="Server started on port 8000"
2024-01-15T10:15:22.789Z container=worker-1 level=error msg="Task failed: timeout after 30s" task_id=abc123
2024-01-15T10:20:00.000Z container=api-server level=warn msg="Memory usage at 87%" mem_mb=870
2024-01-15T10:25:10.111Z container=api-server level=error msg="OOM killer invoked" pid=1234
2024-01-15T10:25:11.222Z container=api-server msg="Container restarting..."`,
};

export const SEVERITY_COLOR = {
  critical: "#dc2626",
  high: "#ea580c",
  medium: "#ca8a04",
  low: "#16a34a",
};