from flask import Blueprint

auth_route = Blueprint("auth", __name__, url_prefix="/auth")

from api.auth import routes

