from sqlalchemy import Column, Integer, String, JSON
from ....database import Base

class AdministrationConfig(Base):
    __tablename__ = "dept_administration_config"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(JSON)
