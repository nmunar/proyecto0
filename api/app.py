import enum
from xmlrpc.client import DateTime
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource
from datetime import datetime
from dateutil import parser
from marshmallow_enum import EnumField
from flask_cors.extension import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)

api = Api(app)
CORS(app)

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=1, nullable=0)
    # Relaciones
    eventos = db.relationship('Evento', backref='usuario', lazy=1)

class Usuario_Schema(ma.Schema):

    class Meta:

        fields = ("id", "email")

usuario_schema = Usuario_Schema()
usuarios_schema = Usuario_Schema(many=True)

# categoría (ENUM)

class Categoria(enum.Enum):
    CONFERENCIA = "conferencia"
    SEMINARIO = "seminario"
    CONGRESO = "congreso"
    CURSO = "curso"


class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120))
    categoria = db.Column(db.Enum(Categoria))
    lugar = db.Column(db.String(120))
    direccion = db.Column(db.String(120))
    f_inicio = db.Column(db.DateTime)
    f_fin = db.Column(db.DateTime)
    f_creacion = db.Column(db.DateTime)
    es_presencial = db.Column(db.Boolean)
    # Relaciones
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=0)


class Evento_Schema(ma.Schema):
    categoria = EnumField(Categoria, by_value=1)
    class Meta:

        fields = ("id", "nombre", "categoria", "lugar", "direccion",
                  "f_inicio", "f_fin", "f_creacion", "es_presencial", "usuario_id")


evento_schema = Evento_Schema()
eventos_schema = Evento_Schema(many=True)


class RecursoUsuario(Resource):

    def get(self,id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        return usuario_schema.dump(usuario)

    def delete(self,id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario  )
        db.session.delete(usuario)
        db.session.commit()
        return '', 204

class RecursoUsuarioEmail(Resource):   
    def get(self,email):
        usuario = Usuario.query.filter(Usuario.email == email)
        if usuario.first() != None:
            return {'exito':'Se encontró ususario', "id":usuario.first().id}
        else:
            return {'error':'No Existe un usuario con este email'}

class RecursoAgrergarUsuario(Resource):
    def post(self):
        if Usuario.query.filter(Usuario.email == request.json['email']).first():
            return {'error':'El email ya existe'},403
        else:
            nuevo_usuario = Usuario(email=request.json['email'])
            db.session.add(nuevo_usuario)
            db.session.commit()

            return evento_schema.dump(nuevo_usuario)


class RecursoListarEventos(Resource):
    def get(self,id_usuario):

        eventos = Evento.query.filter(Evento.usuario_id==id_usuario)
        if eventos.first() != None:
            eventos = eventos.order_by(Evento.f_creacion.desc())
            return eventos_schema.dump(eventos)
        else:
            return {'error':"No hay eventos para el usuario","id":id_usuario}

    def post(self,id_usuario):
        print(request.json)
        f_Inicio = parser.parse(request.json['f_inicio'],ignoretz=True)
        f_Fin= parser.parse(request.json['f_fin'],ignoretz=True)
        lista = ['conferencia','seminario', 'congreso', 'curso']

        if f_Inicio>=f_Fin:
            return {'error':'La fecha de inicio no puede ser mayor a la fecha de fin'}
        if f_Inicio < datetime.now():
            return {'error':'La fecha de inicio no puede ser de dias pasados a hoy'}
        if not request.json["categoria"].lower() in  lista:
            return {'error':'La categoria no es valida'}

        nuevo_evento = Evento(nombre=request.json['nombre'],
                                categoria=Categoria(
                                    request.json["categoria"].lower()),
                                lugar=request.json['lugar'],
                                direccion=request.json['direccion'],
                                f_inicio=f_Inicio,
                                f_fin=f_Fin,
                                f_creacion=datetime.now(),
                                es_presencial=request.json['es_presencial'],
                                usuario_id=id_usuario)
        db.session.add(nuevo_evento)
        db.session.commit()

        return  evento_schema.dump(nuevo_evento)


class RecursoUnEvento(Resource):
    def get(self,id_evento):
        evento = Evento.query.get_or_404(id_evento)
        return eventos_schema.dump(evento)

    def put(self,id_evento):
        evento = Evento.query.get_or_404(id_evento)
        
        lista = ['conferencia','seminario', 'congreso', 'curso']

        if 'f_fin' in request.json:
            
            f_Fin= parser.parse(request.json['f_fin'],ignoretz=True)
            if evento.f_inicio>=f_Fin:
                return {'error':'La fecha de fin no puede ser menor o igual a la de inicio'}
            evento.f_fin = f_Fin

        if 'f_inicio' in request.json:
            f_Inicio = parser.parse(request.json['f_inicio'],ignoretz=True)

            
            if f_Inicio>=evento.f_fin:
                return {'error':'La fecha de inicio no puede ser mayor a la fecha de fin'}

            evento.f_inicio = f_Inicio
        
        if 'categoria' in request.json:
            if not request.json["categoria"].lower() in  lista:
                return {'error':'La categoria no es valida'}
            evento.categoria = Categoria(request.json["categoria"].lower())
        
        if 'direccion' in request.json:
            evento.direccion = request.json['direccion']

        if 'es_presencial' in request.json:
            evento.es_presencial = request.json['es_presencial']
        
        if 'lugar' in request.json:
            evento.lugar = request.json['lugar']

        if 'nombre' in request.json:
                evento.nombre = request.json['nombre']


        db.session.commit()
        return evento_schema.dump(evento)

    def delete(self,id_evento):
        evento = Evento.query.get_or_404(id_evento)
        db.session.delete(evento)
        db.session.commit()
        return '', 204


api.add_resource(RecursoUsuario, '/api/usuarios/<int:id_usuario>')
api.add_resource(RecursoAgrergarUsuario, '/api/usuarios')
api.add_resource(RecursoListarEventos, '/api/eventos/<int:id_usuario>')
api.add_resource(RecursoUnEvento, '/api/evento/<int:id_evento>')
api.add_resource(RecursoUsuarioEmail, '/api/usuariosE/<string:email>')

if __name__ == '__main__':

    app.run(debug=True)
