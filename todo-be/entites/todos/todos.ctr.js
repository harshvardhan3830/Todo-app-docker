import { Todo } from "./todos.mod.js";
import { handleError, ErrorTypes } from "../../helpers/errorHandler.js";

export const createTodo = async (req, res) => {
  try {
    const { title, date, description, status, taskGroup, startDate, dueDate } =
      req.body;
    const user = req.user;
    const todo = new Todo({
      title,
      description,
      status,
      taskGroup,
      startDate,
      dueDate,
      user: user._id,
    });

    if (!title || !date || !description) {
      return handleError(
        res,
        ErrorTypes.BAD_REQUEST.code,
        "All fields are required"
      );
    }

    const data = await todo.save();
    res.status(201).send({
      message: "Todo created successfully",
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error creating todo", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error creating todo",
      error
    );
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
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error fetching todos",
      error
    );
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { title, date, description, status } = req?.body;
    const { id } = req.params;

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        status,
      },
      { new: true }
    );

    if (!todo) {
      return handleError(res, ErrorTypes.NOT_FOUND.code, "Todo not found");
    }

    res.status(200).send({
      message: "Update todo",
      status: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error updating todo", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error updating todo",
      error
    );
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return handleError(res, ErrorTypes.NOT_FOUND.code, "Todo not found");
    }

    res.status(200).send({
      message: "Delete todo",
      status: true,
    });
  } catch (error) {
    console.error("Error deleting todo", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error deleting todo",
      error
    );
  }
};
