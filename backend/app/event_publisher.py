import json
import os
import socket
from datetime import datetime, timezone
from functools import lru_cache
from uuid import uuid4

from kafka import KafkaProducer


def _json_serializer(value):
    return json.dumps(value, default=str).encode("utf-8")


@lru_cache(maxsize=1)
def get_kafka_producer():
    bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS")
    if not bootstrap_servers:
        return None

    config = {
        "bootstrap_servers": [server.strip() for server in bootstrap_servers.split(",") if server.strip()],
        "value_serializer": _json_serializer,
        "key_serializer": lambda value: str(value).encode("utf-8") if value is not None else None,
        "client_id": os.getenv("KAFKA_CLIENT_ID", "gaming-shop-backend"),
        "retries": int(os.getenv("KAFKA_RETRIES", "3")),
    }

    security_protocol = os.getenv("KAFKA_SECURITY_PROTOCOL")
    if security_protocol:
        config["security_protocol"] = security_protocol

    sasl_mechanism = os.getenv("KAFKA_SASL_MECHANISM")
    if sasl_mechanism:
        config["sasl_mechanism"] = sasl_mechanism

    sasl_username = os.getenv("KAFKA_SASL_USERNAME")
    if sasl_username:
        config["sasl_plain_username"] = sasl_username

    sasl_password = os.getenv("KAFKA_SASL_PASSWORD")
    if sasl_password:
        config["sasl_plain_password"] = sasl_password

    return KafkaProducer(**config)


def publish_event(topic, event_type, payload, key=None):
    producer = get_kafka_producer()
    if producer is None:
        return False

    event = {
        "event_id": str(uuid4()),
        "event_type": event_type,
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "source": "gaming-shop",
        "host": socket.gethostname(),
        "payload": payload,
    }
    producer.send(topic, key=key, value=event)
    producer.flush(timeout=2)
    return True


def publish_order_created(order):
    topic = os.getenv("KAFKA_ORDERS_TOPIC", "gaming-shop-orders")
    payload = {
        "order_id": order.id,
        "user_id": order.user_id,
        "total": float(order.total),
        "status": order.status,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        "items": [
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "unit_price": float(item.unit_price),
            }
            for item in order.items
        ],
    }
    return publish_event(topic, "order_created", payload, key=order.id)


def publish_click(payload, user_id=None):
    topic = os.getenv("KAFKA_CLICKS_TOPIC", "gaming-shop-clicks")
    event_type = payload.pop("event_type", None) or payload.pop("event_name", None) or "button_click"
    return publish_event(topic, event_type, payload, key=user_id or payload.get("session_id"))
