from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

from ..config import settings

router = APIRouter(prefix="/api/contact", tags=["contact"])
logger = logging.getLogger(__name__)

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

async def _submit_contact_form_handler(request: ContactRequest):
    try:
        recipient_email = "repricelab@gmail.com"
        
        if not settings.smtp_host or not settings.smtp_user or not settings.smtp_pass:
            logger.error("SMTP configuration is missing")
            raise HTTPException(
                status_code=500,
                detail="Email service is not configured. Please contact support directly."
            )
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Contact Form: {request.subject}"
        msg['From'] = settings.from_email
        msg['To'] = recipient_email
        msg['Reply-To'] = request.email
        
        text_content = f"""
Contact Form Submission

From: {request.name} ({request.email})
Subject: {request.subject}

Message:
{request.message}
"""
        
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
        .content {{ background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }}
        .field {{ margin-bottom: 15px; }}
        .label {{ font-weight: bold; color: #667eea; }}
        .message {{ background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 10px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📧 New Contact Form Submission</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">From:</span> {request.name}
            </div>
            <div class="field">
                <span class="label">Email:</span> <a href="mailto:{request.email}">{request.email}</a>
            </div>
            <div class="field">
                <span class="label">Subject:</span> {request.subject}
            </div>
            <div class="message">
                <div class="label">Message:</div>
                <p>{request.message.replace(chr(10), '<br>')}</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
        
        part1 = MIMEText(text_content, 'plain')
        part2 = MIMEText(html_content, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_pass)
            server.send_message(msg)
        
        logger.info(f"Contact form submitted successfully from {request.email}")
        return {"success": True, "message": "Your message has been sent successfully!"}
        
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send email. Please try again later or contact us directly at repricelab@gmail.com"
        )
    except Exception as e:
        logger.error(f"Unexpected error in contact form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        )

@router.post("/")
async def submit_contact_form_with_slash(request: ContactRequest):
    return await _submit_contact_form_handler(request)

@router.post("")
async def submit_contact_form_without_slash(request: ContactRequest):
    return await _submit_contact_form_handler(request)
