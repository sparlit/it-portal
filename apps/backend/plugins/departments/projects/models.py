from sqlalchemy import Column, Integer, String, JSON
from ....database import Base

class ProjectsConfig(Base):
    __tablename__ = "dept_projects_config"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(JSON)
