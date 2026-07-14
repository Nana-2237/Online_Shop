from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_active_user
from app.database import get_db
from app.models import Cart, CartItem, Order, OrderItem, Product, User
from app.schemas import OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


def get_cart(db: Session, user: User):
    return db.query(Cart).filter(Cart.user_id == user.id).first()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    cart = get_cart(db, current_user)
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = 0
    order_items = []

    for item in cart.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found",
            )

        unit_price = product.price
        total += unit_price * item.quantity
        order_items.append(
            OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=unit_price,
            )
        )

    order = Order(
        user_id=current_user.id,
        total=total,
        status="pending",
        items=order_items,
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    if cart:
        for item in cart.items:
            db.delete(item)
        db.commit()

    return order


@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order
