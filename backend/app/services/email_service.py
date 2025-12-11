import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASS", os.getenv("SMTP_PASSWORD", ""))
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
                        Questions? We're here to help.
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


def send_welcome_email(to_email: str, user_name: str = None, plan: str = "Free", password: str = None) -> bool:
    """Send welcome email to new users"""
    
    subject = "Welcome to RepriceLab - Your Journey to Amazon Success Begins!"
    
    password_section = ""
    password_text = ""
    if password:
        password_section = f"""
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Password:</td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; font-family: monospace; background: #fef3c7; padding: 4px 8px; border-radius: 4px;">{password}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding: 12px 0 0 0;">
                                    <p style="color: #dc2626; font-size: 12px; margin: 0;">&#128274; For security, please change your password after your first login.</p>
                                </td>
                            </tr>"""
        password_text = f"\n    - Password: {password}\n    (Please change your password after your first login for security)"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with gradient -->
            <tr>
                <td style="padding: 50px 30px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6366f1 100%); text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">RepriceLab.com</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Welcome! Your Amazon repricing journey starts now</p>
                </td>
            </tr>
            
            <!-- Welcome message -->
            <tr>
                <td style="padding: 40px 30px 20px;">
                    <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                        Hi{' ' + user_name if user_name else ' there'}! &#128075;
                    </h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.7; margin: 0;">
                        Thank you for joining <strong>RepriceLab</strong> - the world's most intelligent Amazon repricing platform. We're thrilled to have you on board!
                    </p>
                </td>
            </tr>
            
            <!-- Account details card -->
            <tr>
                <td style="padding: 0 30px 30px;">
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 25px; border: 1px solid #e2e8f0;">
                        <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                            &#128100; Your Account Details
                        </h3>
                        <table style="width: 100%;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Email:</td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500;">{to_email}</td>
                            </tr>{password_section}
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Current Plan:</td>
                                <td style="padding: 8px 0;">
                                    <span style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">{plan}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Trial Period:</td>
                                <td style="padding: 8px 0; color: #059669; font-size: 14px; font-weight: 500;">14 Days Free</td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            
            <!-- What's next section -->
            <tr>
                <td style="padding: 0 30px 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                        &#127919; Get Started in 3 Easy Steps
                    </h3>
                    <table style="width: 100%;">
                        <tr>
                            <td style="padding: 15px; background: #faf5ff; border-radius: 10px; margin-bottom: 10px;">
                                <table>
                                    <tr>
                                        <td style="width: 40px; vertical-align: top;">
                                            <span style="background: #7c3aed; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-weight: 600;">1</span>
                                        </td>
                                        <td>
                                            <strong style="color: #1f2937;">Connect Your Amazon Store</strong>
                                            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Link your Seller Central account securely via Amazon SP-API</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                        <tr>
                            <td style="padding: 15px; background: #f0fdf4; border-radius: 10px;">
                                <table>
                                    <tr>
                                        <td style="width: 40px; vertical-align: top;">
                                            <span style="background: #059669; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-weight: 600;">2</span>
                                        </td>
                                        <td>
                                            <strong style="color: #1f2937;">Import Your Products</strong>
                                            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">We'll automatically sync your inventory and pricing data</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr><td style="height: 10px;"></td></tr>
                        <tr>
                            <td style="padding: 15px; background: #eff6ff; border-radius: 10px;">
                                <table>
                                    <tr>
                                        <td style="width: 40px; vertical-align: top;">
                                            <span style="background: #2563eb; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-weight: 600;">3</span>
                                        </td>
                                        <td>
                                            <strong style="color: #1f2937;">Set Your Repricing Strategy</strong>
                                            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Choose from Win Buy Box, Maximize Profit, or Boost Sales</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- CTA Button -->
            <tr>
                <td style="padding: 0 30px 40px; text-align: center;">
                    <a href="https://repricelab.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
                        Go to Dashboard &#8594;
                    </a>
                </td>
            </tr>
            
            <!-- Stats bar -->
            <tr>
                <td style="padding: 30px; background: linear-gradient(135deg, #1f2937 0%, #111827 100%);">
                    <table style="width: 100%;">
                        <tr>
                            <td style="text-align: center; padding: 10px;">
                                <div style="color: #ffffff; font-size: 28px; font-weight: 700;">5B+</div>
                                <div style="color: #9ca3af; font-size: 12px; margin-top: 5px;">Price Changes/Week</div>
                            </td>
                            <td style="text-align: center; padding: 10px; border-left: 1px solid #374151; border-right: 1px solid #374151;">
                                <div style="color: #ffffff; font-size: 28px; font-weight: 700;">99.9%</div>
                                <div style="color: #9ca3af; font-size: 12px; margin-top: 5px;">Uptime</div>
                            </td>
                            <td style="text-align: center; padding: 10px;">
                                <div style="color: #ffffff; font-size: 28px; font-weight: 700;">24/7</div>
                                <div style="color: #9ca3af; font-size: 12px; margin-top: 5px;">Automation</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
                        Need help? Our support team is here for you.
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0;">
                        &copy; 2025 RepriceLab. All rights reserved.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to RepriceLab!
    
    Hi{' ' + user_name if user_name else ' there'},
    
    Thank you for joining RepriceLab - the world's most intelligent Amazon repricing platform.
    
    YOUR ACCOUNT DETAILS:
    - Email: {to_email}{password_text}
    - Current Plan: {plan}
    - Trial Period: 14 Days Free
    
    GET STARTED IN 3 EASY STEPS:
    1. Connect Your Amazon Store - Link your Seller Central account securely
    2. Import Your Products - We'll automatically sync your inventory
    3. Set Your Repricing Strategy - Choose Win Buy Box, Maximize Profit, or Boost Sales
    
    Go to your dashboard: https://repricelab.com/dashboard
    
    Need help? Our support team is here for you.
    
    - The RepriceLab Team
    """
    
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured. Welcome email not sent.")
        logger.info(f"Welcome email would be sent to {to_email}")
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
        
        logger.info(f"Welcome email sent to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
        return False
