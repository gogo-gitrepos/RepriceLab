from __future__ import annotations
from typing import List, Dict


def determine_buybox(offers: List[Dict]) -> Dict:
    if not offers:
        return {}
    bb = next((o for o in offers if o.get("is_buybox")), None)
    if bb:
        return bb
    return min(offers, key=lambda o: (o.get("price", 0.0) + o.get("shipping", 0.0)))
