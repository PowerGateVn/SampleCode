from flask import request
from functools import wraps
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from api.user.services import get_activate_user_data
from api.utils.response import error_bad_request, unauthorized
from api.utils.tokens import get_payload_from_jwt


def valid_scheme(schema):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            json_data = request.get_json()
            try:
                validate(json_data, schema)
                print(json_data, schema)
            except ValidationError as error:
                return error_bad_request(error.message)
            except Exception as error:
                return error_bad_request()
            
            return func(data=json_data, *args, **kwargs)

        return wrapper
    return decorator


def token_require(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            if "Authorization" in request.headers:
                author = request.headers.get("Authorization", "")
                type = author.split(" ")[0]
                token = author.split(" ")[1]

                if not type or not token or type != "Bearer":
                    raise Exception("Invalid Type")

                payload, is_invalid = get_payload_from_jwt(token)
                if is_invalid:
                    raise Exception("Invalid Token")

                user = get_activate_user_data(payload.get("user_id"))
                if not user:
                    raise Exception("Invalid User")

                return func(user=user, *args, **kwargs)
        except Exception as error:
            print(error)
        return unauthorized()
    return wrapper


def valid_roles(list_role: list):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = kwargs.get("user")

            if not user or not user.role in list_role:
                return unauthorized()

            return func(*args, **kwargs)
        return wrapper
    return decorator
