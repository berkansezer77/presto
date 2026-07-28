"""Constants for the Dial Tap integration."""

DOMAIN = "dial_tap"

# Static path the frontend files are served from.
FRONTEND_URL_BASE = "/presto_frontend"

# Bump on every frontend change — the version lives in the FILE NAME (not ?v=)
# so service workers / browser caches are forced to fetch the fresh file.
FRONTEND_VERSION = "1.0.1"

# Panel config changed -> platforms rebuild their entities.
SIGNAL_CONFIG = f"{DOMAIN}_config_updated"

PLATFORMS = ["select", "number"]
