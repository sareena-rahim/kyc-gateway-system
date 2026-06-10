import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from gateway.db import engine, Base
import gateway.models

Base.metadata.create_all(bind=engine)

print("All tables created successfully.")