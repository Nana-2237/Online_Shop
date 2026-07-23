from fastapi import APIRouter, Depends

from app.auth import get_current_active_user_optional
from app.event_publisher import publish_click
from app.models import User
from app.schemas import ClickEventCreate

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/clicks", status_code=202)
def track_click(
    event: ClickEventCreate,
    current_user: User | None = Depends(get_current_active_user_optional),
):
    payload = event.model_dump()
    if current_user:
        payload["user_id"] = current_user.id
    publish_click(payload, user_id=current_user.id if current_user else None)
    return {"accepted": True}
