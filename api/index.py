import logging

from flask import Flask, render_template

app: Flask = Flask(__name__)
log: logging.Logger = logging.getLogger(__name__)


@app.route("/")
def home():
    log.info("rendering home page")
    return render_template("home.html")


@app.route("/snake")
def snake():
    log.info("rendering snake challenge")
    return render_template("snake.html")
