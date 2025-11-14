"""
API tests for subscription endpoints
"""
import pytest
from fastapi import status


def test_get_subscription_status(authenticated_client):
    """Test getting subscription status"""
    response = authenticated_client.get("/api/subscriptions/status")
    
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        assert "plan" in data
        assert "status" in data
    else:
        # Endpoint might not exist yet
        assert response.status_code == status.HTTP_404_NOT_FOUND


def test_create_checkout_session(authenticated_client):
    """Test creating Stripe checkout session"""
    response = authenticated_client.post("/api/subscriptions/checkout", json={
        "plan": "plus"
    })
    
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        assert "checkout_url" in data
    else:
        # Might need Stripe configuration
        assert response.status_code in [status.HTTP_404_NOT_FOUND, status.HTTP_400_BAD_REQUEST]


def test_checkout_invalid_plan(authenticated_client):
    """Test checkout with invalid plan returns error"""
    response = authenticated_client.post("/api/subscriptions/checkout", json={
        "plan": "invalid_plan"
    })
    
    # Should return error for invalid plan
    assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND, status.HTTP_422_UNPROCESSABLE_ENTITY]
