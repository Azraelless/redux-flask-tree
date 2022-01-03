from flask import Flask, jsonify, request
from db import db
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
import os.path
from models import Node, Edge, NodeSchema
from flask_caching import Cache


def create_app():
    app = Flask(__name__)
    app.config['PROPAGATE_EXCEPTIONS'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nodes.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    app.config['CORS_HEADERS'] = 'Content-Type'
    db.init_app(app)
    cors = CORS(app)
    return app


def setup_database(app):
    with app.app_context():
        db.create_all()


app = create_app()
if not os.path.isfile('/nodes.db'):
    setup_database(app)

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})
cache.init_app(app)
ma = Marshmallow(app)


@app.route('/')
@cache.cached(timeout=50)
@cross_origin()
def tree():
    id = request.args.get('id')
    if not id:
        nodes = Node.query.filter(Node.id == 1).all()
    else:
        edges = Edge.query.filter(Edge.parent_id == id).all()
        child_ids = [e.child_id for e in edges]
        nodes = Node.query.filter(Node.id.in_(child_ids)).all()
    node_schema = NodeSchema(many=True)
    return jsonify(node_schema.dump(nodes))
