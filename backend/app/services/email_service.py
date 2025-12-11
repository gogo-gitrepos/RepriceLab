import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@repricelab.com")
FROM_NAME = os.getenv("FROM_NAME", "RepriceLab")

def send_password_reset_email(to_email: str, reset_link: str, user_name: str = None) -> bool:
    """Send password reset email"""
    
    subject = "Reset Your RepriceLab Password"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
                <td style="padding: 40px 30px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">RepriceLab</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Hi{' ' + user_name if user_name else ''},
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        We received a request to reset your password for your RepriceLab account. Click the button below to create a new password:
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="padding: 20px 0; text-align: center;">
                                <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                                    Reset Password
                                </a>
                            </td>
                        </tr>
                    </table>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                        This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                    </p>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="color: #7c3aed; font-size: 12px; word-break: break-all; margin: 10px 0 0 0;">
                        {reset_link}
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        &copy; 2025 RepriceLab. All rights reserved.
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                        Questions? Contact us at support@repricelab.com
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    text_content = f"""
    Password Reset Request
    
    Hi{' ' + user_name if user_name else ''},
    
    We received a request to reset your password for your RepriceLab account.
    
    Click the link below to reset your password:
    {reset_link}
    
    This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    
    - The RepriceLab Team
    """
    
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured. Email not sent.")
        logger.info(f"Password reset link for {to_email}: {reset_link}")
        return True
    
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = to_email
        
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        
        msg.attach(part1)
        msg.attach(part2)
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        
        logger.info(f"Password reset email sent to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send password reset email: {e}")
        return False
