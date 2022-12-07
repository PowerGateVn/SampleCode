from api.user import user_route
from api.user.services import get_user_service, update_user_advance_service
from api.user.schemas import update_user_schema
from api.utils.constants import ROLE
from api.utils.middlewares import token_require, valid_roles, valid_scheme
from api.utils.response import error_not_found, success

@user_route.route('/', methods=['GET'])
@token_require
@valid_roles([ROLE["ADMIN"], ROLE["USER"]])
def get_user(user):
    data = get_user_service(user.id)
    if data:
        return {"user": data}

    return error_not_found()


@user_route.route('/', methods=['POST'])
@token_require
@valid_roles([ROLE["ADMIN"], ROLE["USER"]])
@valid_scheme(update_user_schema)
def update_user(user, data):
    user_advance = update_user_advance_service(user.advance, data)

    return success({"user": user_advance.dict})
