import jwt
import datetime
from typing import Tuple
from flask import current_app
from api.utils.constants import JWT_EXPIRE_DAYS


def generate_jwt_token(user_id: str) -> str:
    """
    Generate and returns jsonwebtoken from user_id
    
    Parameters:
        user_id (str): id of user

    Returns:
        jwt_token (str): jsonwebtoken
    """
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=JWT_EXPIRE_DAYS)    
    jwt_token = jwt.encode({"user_id": user_id, "exp": expire}, current_app.config.get("SECRET_KEY"))

    return jwt_token.decode("utf-8")


def get_payload_from_jwt(token: str) -> Tuple[dict, bool]:
    """
    Returns payload and is invalid jwt from jsonwebtoken

    Parameters:
        token (str): jsonwebtoken

    Returns:
        payload (dict): payload from jsonwebtoken
        is_invalid (bool): True if jwt is invalid, False if jwt is valid
    """
    try:
        payload = jwt.decode(token, current_app.config.get("SECRET_KEY"), algorithms=["HS256"])
        return payload, False

    except Exception as error:
        print(error)

    return {}, True
