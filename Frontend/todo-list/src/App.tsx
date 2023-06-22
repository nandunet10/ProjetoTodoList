import React, { useEffect, useState } from "react";
import api from "./services/Api";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import {
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

type TodoItems = {
  id: number;
  title: string;
  isCompleted: boolean;
};

function App() {
  const [data, setData] = useState<TodoItems[]>([]);
  const [search, setSearch] = useState("");
  const [searchSelect, setSearchSelect] = useState("");
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [todoItem, setTodoItem] = useState<TodoItems>({
    id: 0,
    title: "",
    isCompleted: false,
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setTodoItem({
      ...todoItem,
      [name]: value,
    });
  };

  const openModelDelete = () => {
    setModalDelete(!modalDelete);
  };

  const openModalEdit = () => {
    setModalEdit(!modalEdit);
  };

  const openModalAdd = () => {
    setModalAdd(!modalAdd);
  };

  const getTodoItemId = (
    todo: React.SetStateAction<TodoItems>,
    caso: string
  ) => {
    setTodoItem(todo);
    caso === "Edit" ? openModalEdit() : openModelDelete();
  };

  useEffect(() => {
    getTodoItems();
  }, [todoItem]);

  const getTodoItems = async () => {
    await api
      .get("")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
        api.interceptors.response.use((error: any): any => {
          if (axios.isCancel(error)) {
            return console.log(error);
          }
        });
      });
  };

  const postTodoItem = async () => {
    await api
      .post("", todoItem)
      .then((response) => {
        setData(data.filter((todo) => todo.id !== response.data));
        openModalAdd();
        getTodoItems();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const putTodoItem = async () => {
    todoItem.isCompleted = true;
    await api
      .put("/" + todoItem.id, todoItem)
      .then((response) => {
        setData(data.filter((todo) => todo.id !== response.data));
        openModalEdit();
        getTodoItems();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const deleteTodoItem = async () => {
    await api
      .delete("/" + todoItem.id)
      .then((response) => {
        setData(data.filter((todo) => todo.id !== response.data));
        openModelDelete();
        getTodoItems();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <div className="App mt-2">
        <br />
        <h3>Lista de tarefas</h3>
        <header className="App header">
          <button
            onClick={() => openModalAdd()}
            className="btn btn-secondary m-5"
          >
            Adicionar tarefa
          </button>
        </header>
        <table className="App table table-bordered">
          <thead>
            <th>Tarefa</th>
            <th>Status</th>
            <th className="th-btn"></th>
          </thead>
          <tbody className="App body m-2">
            {data
              .filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
              )
              .filter((item) =>
                (item.isCompleted
                  ? "Finalizada".toLowerCase()
                  : "Pendente".toLowerCase()
                ).includes(searchSelect.toLowerCase())
              )
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.isCompleted ? "Finalizada" : "Pendente"}</td>
                  <td>
                    {!item.isCompleted ? (
                      <button
                        className="btn btn-outline-success m-2"
                        disabled={item.isCompleted}
                        onClick={() => getTodoItemId(item, "Edit")}
                      >
                        Finalizar
                      </button>
                    ) : (
                      ""
                    )}
                    <button
                      className="btn btn-outline-danger m-2"
                      onClick={() => getTodoItemId(item, "Delete")}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <footer className="App-footer">
          <div className="search">
            <label>Pesquisar por titulo:&nbsp;&nbsp;</label>
            <input
              type="text"
              className="form-control-sm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Procurar..."
            />
            &nbsp;&nbsp;
            <label>Pesquisar por status:&nbsp;&nbsp;</label>
            <select
              className="form-control-sm"
              value={searchSelect}
              onChange={(event) => setSearchSelect(event.target.value)}
            >
              <option value="">Selectione o status</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </footer>
      </div>

      <Modal isOpen={modalAdd} size="md">
        <ModalHeader>Adicionar tarefa</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Tarefa: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="title"
              onChange={handleChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => postTodoItem()}
            className="btn btn-outline-primary"
          >
            Adicionar
          </button>
          <button
            onClick={() => openModalAdd()}
            className="btn btn-outline-danger"
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete} size="md">
        <ModalBody>
          Confirma a exclusão da tarefa? : {todoItem && todoItem.title}
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => deleteTodoItem()}
            className="btn btn-outline-danger"
          >
            {" "}
            Sim
          </button>
          <button
            onClick={() => getTodoItemId(todoItem, "Delete")}
            className="btn btn-outline-secondary"
          >
            Não
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit} size="md">
        <ModalBody>
          Deseja finalizar a tarefa? : {todoItem && todoItem.title}
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => putTodoItem()}
            className="btn btn-outline-info"
          >
            {" "}
            Sim
          </button>
          <button
            onClick={() => getTodoItemId(todoItem, "Edit")}
            className="btn btn-outline-secondary"
          >
            Não
          </button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default App;
