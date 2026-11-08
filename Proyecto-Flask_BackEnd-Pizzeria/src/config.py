class DevelopmentConfig():
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'jesus'
    MYSQL_PASSWORD = 'jesus12345678'
    MYSQL_DB = 'pizzeria'
    MYSQL_CURSORCLASS = 'Cursor'

config = {
    'development': DevelopmentConfig
}