command = '/home/nfterritoria/django-site/VENV/bin/gunicorn'
pythonpath = '/home/nfterritoria/django-site/nfterritoria'
bind = '127.0.0.1:8001'
workers = 9
user = 'nfterritoria'
limit_request_fields = 32000
limit_request_field_size = 0
raw_env = 'DJANGO_SETTINGS_MODULE=nfterritoria.settings'
