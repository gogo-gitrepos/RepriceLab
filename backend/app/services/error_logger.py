from sqlalchemy.orm import Session
from ..models import ErrorLog
import traceback
import json


def log_error(
    db: Session,
    error_type: str,
    message: str,
    user_id: int | None = None,
    error_code: str | None = None,
    endpoint: str | None = None,
    request_data: dict | None = None,
    exception: Exception | None = None
):
    try:
        error_log = ErrorLog(
            user_id=user_id,
            error_type=error_type,
            error_code=error_code,
            message=message,
            stack_trace=traceback.format_exc() if exception else None,
            endpoint=endpoint,
            request_data=json.dumps(request_data) if request_data else None,
            resolved=False
        )
        db.add(error_log)
        db.commit()
        return error_log
    except Exception as e:
        print(f"Failed to log error: {e}")
        db.rollback()
        return None
