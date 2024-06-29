from datetime import datetime, timedelta


def convert(datetime_string: str):
    return datetime.strptime(datetime_string, '%Y-%m-%dT%H:%M') + timedelta(hours=10)