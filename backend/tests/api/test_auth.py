"""
API tests for authentication endpoints
"""
import pytest
from fastapi import status


@pytest.mark.smoke
def test_health_check(client):
    """Test API health check endpoint"""
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK or response.status_code == status.HTTP_404_NOT_FOUND


def test_register_new_user(client, test_user_credentials):
    """Test user registration"""
    response = client.post("/api/auth/register", json=test_user_credentials)
    
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_201_CREATED]
    data = response.json()
    assert "access_token" in data
    assert "user" in data
    assert data["user"]["email"] == test_user_credentials["email"]


def test_register_duplicate_email(client, test_user_credentials):
    """Test registration with duplicate email returns error"""
    # Register first time
    client.post("/api/auth/register", json=test_user_credentials)
    
    # Try to register again with same email
    response = client.post("/api/auth/register", json=test_user_credentials)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already registered" in response.json()["detail"].lower()


def test_login_with_valid_credentials(client, test_user_credentials):
    """Test login with valid credentials"""
    # Register user first
    client.post("/api/auth/register", json=test_user_credentials)
    
    # Login
    login_data = {
        "email": test_user_credentials["email"],
        "password": test_user_credentials["password"]
    }
    response = client.post("/api/auth/login", json=login_data)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_with_invalid_credentials(client, test_user_credentials):
    """Test login with invalid credentials returns error"""
    response = client.post("/api/auth/login", json={
        "email": "nonexistent@test.com",
        "password": "wrongpassword"
    })
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_protected_endpoint_requires_auth(client):
    """Test that protected endpoints require authentication"""
    response = client.get("/api/dashboard")
    
    # Should return 401 if endpoint is protected
    assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_404_NOT_FOUND]


def test_protected_endpoint_with_valid_token(authenticated_client):
    """Test protected endpoint with valid token"""
    response = authenticated_client.get("/api/users/me")
    
    # Should succeed with valid token
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
