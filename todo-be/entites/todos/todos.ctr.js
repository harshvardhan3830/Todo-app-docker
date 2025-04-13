import { Todo } from "./todos.mod.js";
import { handleError, ErrorTypes } from "../../helpers/errorHandler.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description, status, taskGroup, startDate, dueDate } =
      req.body;
    const userId = req.params.user; // Get user from route params

    // Validate required fields first
    if (
      !title ||
      !startDate ||
      !dueDate ||
      !description ||
      !status ||
      !taskGroup
    ) {
      return handleError(
        res,
        ErrorTypes.BAD_REQUEST.code,
        "All fields are required"
      );
    }

    const task = await Todo.findOne({
      title,
      user: userId,
      isActive: true,
      isDeleted: false,
      status: { $ne: "completed" },
    });

    if (task) {
      return handleError(
        res,
        ErrorTypes.BAD_REQUEST.code,
        "Task already exists"
      );
    }
    // Validate dates
    try {
      // Check if due date is after start date
      if (new Date(dueDate) < new Date(startDate)) {
        return handleError(
          res,
          ErrorTypes.BAD_REQUEST.code,
          "Due date must be after start date"
        );
      }

      const todo = new Todo({
        title,
        description,
        status,
        taskGroup,
        startDate,
        dueDate,
        user: userId, // Use the user ID from route params
      });

      const data = await todo.save();

      res.status(201).send({
        message: "Todo created successfully",
        status: "success",
        data,
      });
    } catch (dateError) {
      console.error("Date formatting error:", dateError);
      return handleError(
        res,
        ErrorTypes.BAD_REQUEST.code,
        dateError.message || "Invalid date format. Please use YYYY-MM-DD format"
      );
    }
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
    const userId = req.params.user;
    let { status } = req.query;
    let data;
    if (!status) {
      data = await Todo.find({ user: userId });
    } else {
      data = await Todo.find({ user: userId, status });
    }

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

// get todo by id
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return handleError(res, ErrorTypes.NOT_FOUND.code, "Todo not found");
    }
    res.status(200).send({
      message: "Get todo by id",
      status: "success",
      data: todo,
    });
  } catch (error) {
    console.error("Error getting todo by id", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error fetching todo by id",
      error
    );
  }
};

// get todo by status & date
export const getTodoByStatusAndDate = async (req, res) => {
  try {
    const { user } = req.params;
    const { status, date } = req.query;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let todos;

    if (status === "all") {
      todos = await Todo.find({
        user,
        startDate: { $gte: startOfDay, $lte: endOfDay },
      });
    } else {
      todos = await Todo.find({
        user,
        status,
        startDate: { $gte: startOfDay, $lte: endOfDay },
      });
    }

    res.status(200).send({
      message: "Get todo by status and date",
      status: "success",
      data: todos,
    });
  } catch (error) {
    console.error("Error getting todo by status and date", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error fetching todo by status and date",
      error
    );
  }
};

export const getDueTodos = async (req, res) => {
  try {
    const { user } = req.params;
    const todos = await Todo.find({
      user,
      dueDate: { $lte: new Date() },
      status: { $in: ["todo", "in_progress"] },
    });
    res.status(200).send({
      message: "Get due todos",
      status: "success",
      data: todos,
    });
  } catch (error) {
    console.error("Error getting due todos", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error fetching due todos",
      error
    );
  }
};

// get upcomming todos
export const getUpcommingTodos = async (req, res) => {
  try {
    console.log("Get upcomming todos ===========>>>>>>>>>");

    const { user } = req.params;

    const todos = await Todo.find({
      user,
      startDate: { $gt: new Date() },
      status: { $in: ["todo"] },
      isDeleted: false, // optional, if you're marking soft-deleted tasks
      isActive: true, // optional, if you track active status
    });

    res.status(200).send({
      message: "Get upcomming todos",
      status: "success",
      data: todos,
    });
  } catch (error) {
    console.error("Error getting upcomming todos", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error fetching upcomming todos",
      error
    );
  }
};

// update todo
export const updateTodo = async (req, res) => {
  try {
    const data = req?.body;
    const { id } = req.params;

    const updateData = {
      ...data,
    };

    // Validate date order if both dates are provided
    if (updateData.startDate && updateData.dueDate) {
      if (new Date(updateData.startDate) > new Date(updateData.dueDate)) {
        return handleError(
          res,
          ErrorTypes.BAD_REQUEST.code,
          "Due date must be after start date"
        );
      }
    }
    const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true });

    if (!todo) {
      return handleError(res, ErrorTypes.NOT_FOUND.code, "Todo not found");
    }

    return res.status(200).send({
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

// delete todo
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

export const getTodosByTaskGroup = async (req, res) => {
  try {
    const { user } = req.params;
    const { taskGroup } = req.query;

    const todos = await Todo.find({ user, taskGroup });

    res.status(200).send({
      message: "Get todos by task group",
      status: "success",
      data: todos,
    });
  } catch (error) {
    console.error("Error getting todos by task group", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error fetching todos by task group",
      error
    );
  }
};

export const getTodoGroupCount = async (req, res) => {
  try {
    const { user } = req.params;
    const todos = await Todo.find({ user });

    const result = {};

    todos.forEach((task) => {
      const group = task.taskGroup;
      if (!result[group]) {
        result[group] = { total: 0, completed: 0 };
      }
      result[group].total += 1;
      if (task.status === "completed") {
        result[group].completed += 1;
      }
    });

    // Calculate percentages
    Object.keys(result).forEach((group) => {
      const { total, completed } = result[group];
      const percentage = ((completed / total) * 100).toFixed(2);
      result[group].percentageCompleted = `${percentage}`;
    });

    res.status(200).send({
      message: "Get todo group count",
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error getting todo group count", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error fetching todo group count",
      error
    );
  }
};
