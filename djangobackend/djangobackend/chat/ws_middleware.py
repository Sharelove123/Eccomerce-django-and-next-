from django.contrib.auth.models import AnonymousUser

from .socket_auth import extract_socket_token, get_user_for_socket_token


class QueryStringTokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        token = extract_socket_token(scope)
        scope['user'] = AnonymousUser()
        scope['socket_thread_id'] = None

        if token:
            user, thread_id = await get_user_for_socket_token(token)
            if user is not None:
                scope['user'] = user
                scope['socket_thread_id'] = thread_id

        return await self.inner(scope, receive, send)


def QueryStringTokenAuthMiddlewareStack(inner):
    return QueryStringTokenAuthMiddleware(inner)
