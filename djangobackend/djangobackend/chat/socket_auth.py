from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.core import signing


User = get_user_model()
SOCKET_TOKEN_SALT = 'chat.websocket.token'
SOCKET_TOKEN_MAX_AGE = 60 * 60


def create_socket_token(*, user_id, thread_id):
    return signing.dumps(
        {
            'user_id': str(user_id),
            'thread_id': thread_id,
        },
        salt=SOCKET_TOKEN_SALT,
    )


def decode_socket_token(token):
    return signing.loads(
        token,
        salt=SOCKET_TOKEN_SALT,
        max_age=SOCKET_TOKEN_MAX_AGE,
    )


def extract_socket_token(scope):
    query_string = scope.get('query_string', b'').decode('utf-8')
    params = parse_qs(query_string)
    return params.get('token', [None])[0]


@database_sync_to_async
def get_user_for_socket_token(token):
    try:
        payload = decode_socket_token(token)
    except signing.BadSignature:
        return None, None
    except signing.SignatureExpired:
        return None, None

    try:
        user = User.objects.get(pk=payload['user_id'])
    except User.DoesNotExist:
        return None, None

    return user, payload['thread_id']
