from flask import Blueprint

user_route = Blueprint('user', __name__, url_prefix='/user')

from api.user import models, routes 
