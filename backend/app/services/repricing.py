from __future__ import annotations
from typing import Optional


ALLOWED = {"*", "+", "-", "/", "(", ")"}


def _is_number(s: str) -> bool:
    try:
        float(s)
        return True
    except ValueError:
        return False


def eval_max_price(expr: str, current_price: float) -> float:
    tokens = (
        expr.replace("(", " ( ").replace(")", " ) ")
        .replace("*", " * ").replace("+", " + ")
        .replace("-", " - ").replace("/", " / ")
        .split()
    )
    for t in tokens:
        if t in ALLOWED or t == "current_price" or _is_number(t):
            continue
        raise ValueError(f"Unsupported token: {t}")
    return float(eval(expr, {"__builtins__": {}}, {"current_price": current_price}))


def suggest_price(
    current_price: float,
    competitor_min: Optional[float],
    min_price: float,
    max_price: float,
    strategy: str
) -> float:
    target = current_price
    if competitor_min is not None:
        target = competitor_min - 0.01 if strategy == "aggressive" else competitor_min + 0.02
    target = max(min_price, min(target, max_price))
    if target < current_price * 0.5:
        target = current_price * 0.5
    if target > current_price * 2.5:
        target = current_price * 2.5
    return round(target, 2)
