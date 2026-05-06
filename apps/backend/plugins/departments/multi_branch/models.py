from sqlalchemy import Column, Integer, String, JSON
from ....database import Base

class MultiBranchConfig(Base):
    __tablename__ = "dept_multi_branch_config"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(JSON)
