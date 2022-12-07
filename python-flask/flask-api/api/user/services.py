from api import db
from typing import Optional
from api.user.models import UserAdvance, UserBasic


def get_user_service(user_id: str) -> Optional[dict]:
    """
    Return user infomation or None if user does not exist

    Parameters:
        user_id (str): id of user

    Returns:
        dict: user's information 
    """
    user = UserBasic.query.filter_by(id=user_id).first()
    if user:
        return user.dict
    return None


def get_activate_user_data(user_id: str) -> Optional[dict]:
    """
    Returns user data if user does not deactivate

    Parameters:
        user_id (str): id of user

    Returns:
        data (dict): user data 
    """
    user = UserBasic.query.filter_by(id=user_id).first()
    if user and not user.deactivate:
        return user
    return None


def get_user_with_email(email: str) -> Optional[dict]:
    """
    Return user infomation or None if user does not exist

    Parameters:
        email (str): email of user

    Returns:
        (dict): user's information 
    """
    user = UserBasic.query.filter_by(email=email).first()
    if user:
        return user.dict
    return None


def update_user_advance_service(user_advance, data: dict) -> dict:
    """
    Update user advance 

    Parameters:
        user_advance: UserAdvance
        data (dict): new user data

    Returns:
        (dict): UserAdvance
    """
    user_advance.first_name = data.get("first_name")
    user_advance.last_name = data.get("last_name")
    user_advance.date_of_birth = data.get("date_of_birth")
    user_advance.phone_number = data.get("phone_number")

    db.session.commit()

    return user_advance
