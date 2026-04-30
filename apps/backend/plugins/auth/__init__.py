from ...core.base_plugin import BasePlugin
from fastapi import Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from ...database import get_db
from ...utils.security import verify_password, create_access_token, get_password_hash
from ...schemas.auth import Token, User
from typing import List, Optional
from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class LoginRequest(BaseModel):
    username: str
    password: str
    private_key: Optional[str] = None # Required for B2B and Internal
    otp: Optional[str] = None         # Required for B2B/Internal (Email/SMS)
    two_fa_code: Optional[str] = None # Required for B2C (TOTP)

class AuthPlugin(BasePlugin):
    name: str = "auth"
    description: str = "Multi-tier Authentication and RBAC plugin"
    
    def setup_routes(self):
        @self.router.post("/login", response_model=Token)
        async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
            """
            Multi-tier login logic:
            1. B2C: Check Username/Password + TOTP
            2. B2B: Check Username/Password + 8-char Private Key + Email OTP
            3. Internal: Check Username/Password + 8-char Private Key + Biometric/FIDO2/OTP
            """
            # Implementation details would involve querying the User model
            # and checking roles to determine which tier of auth to enforce.
            
            # Dummy logic for Phase 1
            if request.username == "admin":
                access_token = create_access_token(data={"sub": request.username, "roles": ["admin"]})
                return {"access_token": access_token, "token_type": "bearer"}
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials or missing multi-factor authentication",
            )

        @self.router.get("/me", response_model=User)
        async def me(token: str = Depends(oauth2_scheme)):
            # Token validation and user retrieval logic
            return {
                "username": "admin", 
                "email": "admin@alrayes.com", 
                "id": 1, 
                "is_active": True, 
                "roles": ["admin"]
            }

    async def on_startup(self):
        print(f"[{self.name}] Initializing Multi-tier Auth & RBAC security layers...")

    async def on_shutdown(self):
        print(f"[{self.name}] Cleaning up secure sessions...")
