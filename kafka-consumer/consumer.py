import json
import os
import time
from datetime import datetime, timezone
from uuid import uuid4

import boto3
from kafka import KafkaConsumer


KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
KAFKA_ORDERS_TOPIC = os.getenv("KAFKA_ORDERS_TOPIC", "gaming-shop-orders")
KAFKA_CLICKS_TOPIC = os.getenv("KAFKA_CLICKS_TOPIC", "gaming-shop-clicks")
KAFKA_CONSUMER_GROUP_ID = os.getenv("KAFKA_CONSUMER_GROUP_ID", "snowflake-pipeline")
EVENTS_S3_BUCKET = os.getenv("EVENTS_S3_BUCKET")
AWS_REGION = os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION", "eu-north-1")


def decode_message(value):
    if value is None:
        return None
    return json.loads(value.decode("utf-8"))


def s3_prefix_for_topic(topic):
    if topic == KAFKA_ORDERS_TOPIC:
        return "orders"
    if topic == KAFKA_CLICKS_TOPIC:
        return "clicks"
    return "events"


def s3_key(topic, event):
    prefix = s3_prefix_for_topic(topic)
    now = datetime.now(timezone.utc)
    event_id = event.get("event_id") or str(uuid4())
    return f"{prefix}/year={now:%Y}/month={now:%m}/day={now:%d}/{event_id}.json"


def create_consumer():
    return KafkaConsumer(
        KAFKA_ORDERS_TOPIC,
        KAFKA_CLICKS_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        auto_offset_reset="earliest",
        enable_auto_commit=False,
        group_id=KAFKA_CONSUMER_GROUP_ID,
        value_deserializer=decode_message,
    )


def upload_event(s3_client, topic, event):
    key = s3_key(topic, event)
    s3_client.put_object(
        Bucket=EVENTS_S3_BUCKET,
        Key=key,
        Body=json.dumps(event, default=str).encode("utf-8"),
        ContentType="application/json",
    )
    return key


def main():
    if not EVENTS_S3_BUCKET:
        raise RuntimeError("EVENTS_S3_BUCKET is not configured")

    s3_client = boto3.client("s3", region_name=AWS_REGION)

    while True:
        try:
            consumer = create_consumer()
            for message in consumer:
                event = message.value
                key = upload_event(s3_client, message.topic, event)
                consumer.commit()
                print(f"Uploaded {message.topic} event to s3://{EVENTS_S3_BUCKET}/{key}", flush=True)
        except Exception as exc:
            print(f"Consumer error: {exc}", flush=True)
            time.sleep(5)


if __name__ == "__main__":
    main()
