from sqlalchemy import Column, Integer, String, JSON
from ....database import Base

class ITConfig(Base):
    __tablename__ = "dept_it_config"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(JSON)
