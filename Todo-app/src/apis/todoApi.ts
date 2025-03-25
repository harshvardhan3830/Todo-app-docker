import axios from "axios";

export const getTodos = async () => {
  const response = await axios.get("http://localhost:3000/api/v1/todo");
  return response.data;
};

export const addTodo = async (todo: any) => {
  console.log("Data in api is", todo);
  const response = await axios.post("http://localhost:3000/api/v1/todo", {
    ...todo,
  });
  return response.data;
};

export const deleteTodo = async (id: string) => {
  const response = await axios.delete(
    `http://localhost:3000/api/v1/todo/${id}`
  );
  return response.data;
};

export const updateTodo = async (id: string, todo: any) => {
  const response = await axios.put(`http://localhost:3000/api/v1/todo/${id}`, {
    ...todo,
  });
  return response.data;
};
