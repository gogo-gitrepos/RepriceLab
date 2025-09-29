# backend/app/services/encryption.py
"""
Encryption service for sensitive data like LWA refresh tokens
Demo implementation with base64 + XOR cipher
"""
import os
import base64
import logging

logger = logging.getLogger(__name__)

class EncryptionService:
    def __init__(self):
        # Get encryption key from environment or use default for development
        self._key = self._get_encryption_key()
        logger.info("Encryption service initialized (demo mode)")
    
    def _get_encryption_key(self) -> str:
        """Get encryption key from environment or create for development"""
        
        # In production, this should come from environment variables or KMS
        encryption_key = os.getenv("ENCRYPTION_KEY", "repricelabkey2024secretdemo")
        
        if not os.getenv("ENCRYPTION_KEY"):
            logger.warning("Using development encryption key. Set ENCRYPTION_KEY env var for production!")
        
        return encryption_key[:32].ljust(32, '0')  # Ensure 32 chars
    
    def _xor_encrypt_decrypt(self, data: str, key: str) -> str:
        """Simple XOR cipher for demo purposes"""
        result = ""
        key_len = len(key)
        for i, char in enumerate(data):
            key_char = key[i % key_len]
            result += chr(ord(char) ^ ord(key_char))
        return result
    
    def encrypt(self, plaintext: str) -> str:
        """Encrypt a string and return base64 encoded result"""
        if not plaintext:
            return plaintext
            
        try:
            # Add a prefix to identify encrypted tokens
            prefixed_data = f"ENC:{plaintext}"
            encrypted_data = self._xor_encrypt_decrypt(prefixed_data, self._key)
            return base64.b64encode(encrypted_data.encode('utf-8')).decode('utf-8')
        except Exception as e:
            logger.error(f"Encryption failed: {e}")
            raise
    
    def decrypt(self, encrypted_b64: str) -> str:
        """Decrypt a base64 encoded encrypted string"""
        if not encrypted_b64:
            return encrypted_b64
            
        try:
            encrypted_data = base64.b64decode(encrypted_b64.encode('utf-8')).decode('utf-8')
            decrypted_data = self._xor_encrypt_decrypt(encrypted_data, self._key)
            
            # Check if it has our encryption prefix
            if decrypted_data.startswith("ENC:"):
                return decrypted_data[4:]  # Remove prefix
            else:
                # Not our encrypted format, return as-is (migration case)
                return encrypted_b64
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            # If decryption fails, assume it's plaintext (for migration)
            return encrypted_b64

# Global encryption service instance
encryption_service = EncryptionService()