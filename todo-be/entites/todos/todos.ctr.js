import { Todo } from "./todos.mod.js";

export const createTodo = async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const todo = new Todo({
      title,
      description,
      date,
    });

    if (!title || !date || !description) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

    const data = await todo.save();
    res.status(201).send({
      message: "Todo created successfully",
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error creating todo", error);
  }
};

export const getTodos = async (req, res) => {
  try {
    const data = await Todo.find();
    res.status(200).send({
      message: "Get all todos",
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error getting todos", error);
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { title, date, description, completed } = req?.body;
    const { id } = req.params;

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        completed,
      },
      { new: true }
    );
    res.status(200).send({
      message: "Update todo",
      status: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error updating todo", error);
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);

    res.status(200).send({
      message: "Delete todo",
      status: true,
    });
  } catch (error) {
    console.error("Error deleting todo", error);
  }
};
