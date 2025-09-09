from __future__ import annotations
import json
import smtplib
from email.message import EmailMessage
from pywebpush import webpush, WebPushException
from ..config import settings


def send_email(to: str, subject: str, body: str) -> bool:
    if not settings.smtp_host:
        return False
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.from_email
    msg["To"] = to
    msg.set_content(body)
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as s:
        if settings.smtp_user:
            s.starttls()
            s.login(settings.smtp_user, settings.smtp_pass or "")
        s.send_message(msg)
    return True


def send_push(subscription: dict, payload: dict) -> bool:
    if not settings.vapid_private_key or not settings.vapid_public_key:
        return False
    try:
        webpush(
            subscription_info=subscription,
            data=json.dumps(payload),
            vapid_private_key=settings.vapid_private_key,
            vapid_claims={"sub": f"mailto:{settings.from_email}"},
        )
        return True
    except WebPushException:
        return False
