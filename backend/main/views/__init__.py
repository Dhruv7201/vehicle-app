from main.views.home import router as home_router
from main.views.device import router as device_router
from main.views.register import router as register_router
from main.views.anpr_table import router as anpr_table_router
from main.views.headcount_table import router as headcount_table_router


def include_router(app):
    app.include_router(home_router)
    app.include_router(device_router)
    app.include_router(register_router)
    app.include_router(anpr_table_router)
    app.include_router(headcount_table_router)
    return app