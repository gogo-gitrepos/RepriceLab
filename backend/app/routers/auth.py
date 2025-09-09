# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends


router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/login")
def login_demo():
    # Demo: gerçek OAuth akışı yerine stub döner
    return {"message": "Login with Amazon not implemented (demo)"}
