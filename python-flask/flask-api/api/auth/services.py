from uuid import uuid4
from api import db
from api.user.models import UserAdvance, UserBasic
from api.user.services import get_user_with_email
from api.utils.constants import ROLE
from api.utils.tokens import generate_jwt_token


def register_user(register_data: dict) -> str:
    """
    Returns error if any during registration

    Parameters:
        register_data (dict): user data

    Returns:
        error (str): Error message
    """
    email = register_data.get("email")
    password = register_data.get("password")
    first_name = register_data.get("first_name")
    last_name = register_data.get("last_name")

    user = get_user_with_email(email)
    if user:
        return "User has already existed"

    user = UserBasic()
    advance = UserAdvance()
    # user basic
    user.id = str(uuid4())
    user.email = email
    user.set_password(password)
    user.role = ROLE["USER"]
    user.deactivate = False
    # user advance
    advance.id = str(uuid4())
    advance.first_name = first_name
    advance.last_name = last_name
    advance.user_basic_id = user.id

    db.session.add(user)
    db.session.add(advance)
    db.session.commit()

    return ""


def signin_service(signin_data: dict) -> str:
    """
    Returns jwt 

    Parameters:
         signin_data (dict): user data

    Returns:
        jwt (str): jsonwebtoken
    """
    email = signin_data.get("email")
    password = signin_data.get("password")

    user = UserBasic.query.filter_by(email=email).first()
    if not user:
        return ""

    if not user.check_password(password):
        return ""

    return generate_jwt_token(user.id)
