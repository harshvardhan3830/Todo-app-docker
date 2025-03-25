import React from "react";
import { TodoInterface } from "../interfaces/TodoInterface";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addTodo } from "../apis/todoApi";

const AddTodo = ({
  setIsDialogOpen,
  setTodos,
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<Boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<TodoInterface[]>>;
}) => {
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.string().required("Date is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      date: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Values are", values);
      handleSubmit();
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await addTodo({
        title: formik.values.title,
        date: formik.values.date,
        description: formik.values.description,
      });
      setTodos((prevTodos) => [...prevTodos, response?.data]);
      setIsDialogOpen((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md flex flex-wrap justify-between text-black"
      >
        <div className="w-15/20 mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.title}
            </div>
          )}
        </div>

        <div className=" w-4/20 mb-4">
          <label
            htmlFor="date"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.date}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.date && formik.errors.date && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.date}
            </div>
          )}
        </div>

        <div className="mb-4 w-20/20">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            placeholder="Enter description"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.description}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-1/8 py-3 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
