from gateway.db import engine

try:
    conn = engine.connect()
    print("✅ Database connected successfully!")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")