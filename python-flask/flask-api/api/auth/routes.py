from api.auth import auth_route
from api.utils.middlewares import valid_scheme
from api.auth.schemas import signup_schema, signin_schema
from api.auth.services import register_user, signin_service
from api.utils.response import error_bad_request, success_created, unauthorized

@auth_route.route('/signup', methods=["POST"])
@valid_scheme(signup_schema)
def signup(data):
    error = register_user(data)
    if error:
        return error_bad_request(error)

    return success_created()


@auth_route.route('/signin', methods=["POST"])
@valid_scheme(signin_schema)
def signin(data):
    jwt = signin_service(data)
    if not jwt:
        return unauthorized()

    return {"token": jwt}

