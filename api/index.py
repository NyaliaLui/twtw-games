import logging

from flask import Flask, render_template

app: Flask = Flask(__name__)
log: logging.Logger = logging.getLogger(__name__)


@app.route("/")
def home():
    log.info("rendering platform template")
    return render_template("home.html")
