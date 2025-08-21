"""
Timing Utility
- Decorators for measuring execution time
"""

import time
import functools
from .logging import logger

def timeit(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        logger.info(f"{func.__name__} executed in {end - start:.4f} sec")
        return result
    return wrapper
