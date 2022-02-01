import React, { useEffect, useState } from "react";
//declarar todos los componentes que se van a usar
import { Form, Button, Table, Container, Navbar, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

//import { useAuth0 } from '@auth0/auth0-react';

const EventTable = (props) => {
    const [listaE, setLista] = useState([])
    const [show, setShow] = useState(false)
    const [hayD, setDatos] = useState(0)
    const [nombreE, setNombre] = useState("")
    const [lugarE, setLugar] = useState("")
    const [categoriaE, setCategoria] = useState("")
    const [direccionE, setDireccion] = useState("")
    const [fechaInicioE, setFechaInicio] = useState("")
    const [fechaFinE, setFechaFin] = useState("")
    const [presencialE, setPresencial] = useState(false)
    const [modalEditar, setEditar] = useState(false)
    const [modalForm, setForm] = useState([])


    var cont = 0
    if (hayD == 0) {
        axios.get(`http://${props.ip}:${props.port}/api/eventos/${props.id}`)
            .then(function (response) {
                setLista(response['data'])
                setDatos(1)
            });
    }

    function crearEvento(evt) {
        evt.preventDefault();
        var modalidad = 0;

        if (presencialE == "Presencial") {
            modalidad = 1
        } else {
            modalidad = 0
        }

        const evtDatos = {
            nombre: nombreE,
            categoria: categoriaE,
            lugar: lugarE,
            direccion: direccionE,
            f_inicio: new Date(fechaInicioE),
            f_fin: new Date(fechaFinE),
            es_presencial: modalidad
        }
        axios.post(`http://${props.ip}:${props.port}/api/eventos/${props.id}`, {
            nombre: nombreE,
            categoria: categoriaE,
            lugar: lugarE,
            direccion: direccionE,
            f_inicio: new Date(fechaInicioE),
            f_fin: new Date(fechaFinE),
            es_presencial: modalidad
        })
            .then(function (response) {
                setShow(false);
            })
            .catch(function (error) {
            })
        setDatos(0)
        setNombre("")
        setCategoria("")
        setLugar("")
        setDireccion("")
        setFechaInicio("")
        setFechaFin("")
        setPresencial(false)
    }

    function mostrarModalActualizar(evt) {
        setForm(evt);
        setEditar(true);
    }

    function editarEvento(id_E, evt) {

        var nombreM = evt.nombre
        var categoriaM = evt.categoria
        var lugarM = evt.lugar
        var direM = evt.direccion
        var f_iM = evt.f_inicio
        var f_fM = evt.f_fin
        var es_pM = evt.es_presencial

        if (nombreE != "") {
            nombreM = nombreE
        }
        if (categoriaE != "") {
            categoriaM = categoriaE
        }
        if (lugarE != "") {
            lugarM = lugarE
        }
        if (direccionE != "") {
            direM = direccionE
        }
        if (fechaInicioE != "") {
            f_iM = fechaInicioE
        }
        if (fechaFinE != "") {
            f_fM = fechaFinE
        }
        if (presencialE != "") {
            if (presencialE == "Presencial") {
                es_pM = 1
            } else {
                es_pM = 0
            }
        }

        axios.put(`http://${props.ip}:${props.port}/api/evento/${id_E}`, {
            nombre: nombreM,
            categoria: categoriaM,
            lugar: lugarM,
            direccion: direM,
            f_inicio: new Date(f_iM),
            f_fin: new Date(f_fM),
            es_presencial: es_pM
        })
            .then(function (response) {
                //console.log(response['data']);
                setEditar(false);
            })
            .catch(function (error) {
                //console.log(error)
            })
        setDatos(0)
    }

    function eliminar(evt) {
        axios.delete(`http://${props.ip}:${props.port}/api/evento/${evt.id}`)
            .then(function (response) {
                //console.log(response['data']);
                setEditar(false);

            })
            .catch(function (error) {
                //console.log(error)
            })
        setDatos(0)
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <React.Fragment>
            <Navbar id="navbar">
                <Container>
                    <Navbar.Brand> Event List</Navbar.Brand>
                </Container>
            </Navbar>
            <Container>
                <Row>
                    <Col>
                        {listaE !== undefined ? (
                            <>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th valign="middle">#</th>
                                            <th valign="middle">Fecha Creacion</th>
                                            <th valign="middle">Nombre</th>
                                            <th valign="middle">Categoria</th>
                                            <th valign="middle">Lugar</th>
                                            <th valign="middle">Direccion</th>
                                            <th valign="middle">Fecha Inicio</th>
                                            <th valign="middle">Fecha Fin</th>
                                            <th valign="middle">Es presencial ?</th>
                                            <th valign="middle">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {

                                            listaE.length > 0 ?
                                                listaE.map((obj, index) => {
                                                    obj.f_fin = obj.f_fin.split(".")[0]
                                                    obj.f_inicio = obj.f_inicio.split(".")[0]
                                                    cont = cont + 1
                                                    return (
                                                        <tr className="rows" key={index}>
                                                            <td valign="middle">{cont}</td>
                                                            <td valign="middle">{obj.f_creacion}</td>
                                                            <td valign="middle">{obj.nombre}</td>
                                                            <td valign="middle">{obj.categoria}</td>
                                                            <td valign="middle">{obj.lugar}</td>
                                                            <td valign="middle">{obj.direccion}</td>
                                                            <td valign="middle">{obj.f_inicio}</td>
                                                            <td valign="middle">{obj.f_fin}</td>
                                                            <td valign="middle">{obj.es_presencial ? "Si" : "No"}</td>
                                                            <td valign="middle">
                                                                <Button
                                                                    color="primary"
                                                                    onClick={() => mostrarModalActualizar(obj)}
                                                                >
                                                                    Editar
                                                                </Button>{" "}
                                                                <p></p>
                                                                <Button variant="danger" onClick={() => eliminar(obj)}>Eliminar</Button>
                                                            </td>

                                                        </tr>
                                                    );
                                                }) :
                                                (<tr className="rows">
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>)

                                        }
                                    </tbody>
                                </Table>
                            </>
                        ) : (
                            <>
                                <h1>No ha creado eventos</h1>
                            </>

                        )}

                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            variant="primary"
                            color="primary"
                            onClick={handleShow}
                        >
                            Crea un Evento
                        </Button>
                        <p></p>
                    </Col>
                </Row>

                <Row>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles del Evento:</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={crearEvento}>
                                <Form.Group className="mb-3" controlId="formBasicName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese el nombre del evento" value={nombreE}
                                        onChange={evt => setNombre(evt.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicCategory">
                                    <Form.Label>Categoria</Form.Label>
                                    <Form.Select enabled value={categoriaE}
                                        onChange={evt => setCategoria(evt.target.value)} required>
                                        <option>Elige una opcion</option>
                                        <option>Conferencia</option>
                                        <option>Seminario</option>
                                        <option>Congreso</option>
                                        <option>Curso</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicAddress">
                                    <Form.Label>Lugar</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese el lugar del evento" value={lugarE}
                                        onChange={evt => setLugar(evt.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicAddress">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese la dirección del evento" value={direccionE}
                                        onChange={evt => setDireccion(evt.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicFI">
                                    <Form.Label>Fecha Inicio</Form.Label>
                                    <Form.Control type="datetime-local" placeholder="Ingrese la fecha de inicio del evento" value={fechaInicioE}
                                        onChange={evt => setFechaInicio(evt.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicFF">
                                    <Form.Label>Fecha Fin</Form.Label>
                                    <Form.Control type="datetime-local" placeholder="Ingrese la fecha de fin del evento" value={fechaFinE}
                                        onChange={evt => setFechaFin(evt.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicModalidad">
                                    <Form.Label>Modalidad</Form.Label>
                                    <Form.Select enabled value={presencialE}
                                        onChange={evt => setPresencial(evt.target.value)}>
                                        <option>Elige una opcion</option>
                                        <option>Presencial</option>
                                        <option>Virtual</option>
                                    </Form.Select>
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Crear
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Row>
                <Row>
                    <Modal show={modalEditar}
                        backdrop="static"
                        keyboard={false}>
                        <Modal.Header>
                            <div><h3>Editar Evento</h3></div>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el nombre del evento" defaultValue={modalForm.nombre}
                                    onChange={evt => setNombre(evt.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Select enabled defaultValue={modalForm.categoria}
                                    onChange={evt => setCategoria(evt.target.value)}>
                                    <option>Conferencia</option>
                                    <option>Seminario</option>
                                    <option>Congreso</option>
                                    <option>Curso</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicAddress">
                                <Form.Label>Lugar</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el lugar del evento" defaultValue={modalForm.lugar}
                                    onChange={evt => setLugar(evt.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicAddress">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese la dirección del evento" defaultValue={modalForm.direccion}
                                    onChange={evt => setDireccion(evt.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicFI">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Ingrese la fecha de inicio del evento" defaultValue={modalForm.f_inicio}
                                    onChange={evt => setFechaInicio(evt.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFF">
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Ingrese la fecha de fin del evento" defaultValue={modalForm.f_fin}
                                    onChange={evt => setFechaFin(evt.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicModalidad">
                                <Form.Label>Modalidad</Form.Label>
                                <Form.Select enabled defaultValue={modalForm.es_presencial ? "Presencial" : "Virtual"}
                                    onChange={evt => setPresencial(evt.target.value)}>
                                    <option>Presencial</option>
                                    <option>Virtual</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                color="primary"
                                onClick={() => editarEvento(modalForm.id, modalForm)}
                            >
                                Confirmar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => setEditar(false)}
                            >
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default EventTable;