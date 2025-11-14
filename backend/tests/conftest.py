"""
Pytest configuration and fixtures for backend API tests
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
import os

# Test database URL
SQLALCHEMY_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///./test.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    yield TestingSessionLocal()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """FastAPI test client with database override"""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_credentials():
    """Test user credentials"""
    return {
        "email": "test@repricelab.com",
        "password": "TestPassword123!",
        "name": "Test User"
    }


@pytest.fixture
def authenticated_client(client, test_user_credentials):
    """Client with authenticated user token"""
    # Register user
    response = client.post("/api/auth/register", json=test_user_credentials)
    
    if response.status_code == 201 or response.status_code == 200:
        token = response.json().get("access_token")
        client.headers = {"Authorization": f"Bearer {token}"}
    
    return client
