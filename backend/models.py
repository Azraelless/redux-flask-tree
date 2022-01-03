from sqlalchemy import Column, String, Integer, ForeignKey, event
from db import db
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema


class Node(db.Model):
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String)


class NodeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Node


class Edge(db.Model):
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('node.id'))
    child_id = Column(Integer, ForeignKey('node.id'))


def create_node(id, name):
    node = Node(id=id, name=name)
    db.session.add(node)


@event.listens_for(Node.__table__, 'after_create')
def create_nodes(*args, **kwargs):
    create_node(1, 'winterfell.westeros.got')
    create_node(2, 'Computers')
    create_node(3, 'Domain Controllers')
    create_node(4, 'TheWall')
    create_node(5, 'Kylo-Ou')
    db.session.commit()


def create_edge(parent_id, child_id):
    edge = Edge(parent_id=parent_id, child_id=child_id)
    db.session.add(edge)


@event.listens_for(Edge.__table__, 'after_create')
def create_nodes(*args, **kwargs):
    create_edge(1, 2)
    create_edge(1, 3)
    create_edge(1, 4)
    create_edge(4, 5)
    db.session.commit()
