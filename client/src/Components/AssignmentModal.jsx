import { Modal } from "antd";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { CopyOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import * as Yup from "yup";
import { Select } from "antd";
import { saveAssignments } from "../Endpoints/Assignment";

const AssignmentModal = ({
  modalKey,
  isModalOpen,
  handleFormSubmit,
  handleCancel,
  classCode = false,
  setClassroom,
  setIsModalOpen,
}) => {
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    difficulty: Yup.string()
      .oneOf(["Easy", "Medium", "Hard"], "Please select a difficulty")
      .required("Difficulty is required"),
    // tags: Yup.string().required("Tags are required"),
    description: Yup.string().required("Problem description is required"),
    // functionSignature: Yup.string().required("Function signature is required"),
    // constraints: Yup.string().required("Constraints are required"),
    testCases: Yup.array()
      .of(
        Yup.object({
          input: Yup.string().required("Input is required"),
          output: Yup.string().required("Output is required"),
        })
      )
      .min(1, "At least one test case is required"),
  });

  const initialValues = {
    title: "",
    difficulty: "",
    tags: "",
    description: "",
    functionSignature: "",
    constraints: "",
    testCases: [{ input: "", output: "" }],
  };
  const options = [
    { value: "arrays", label: "Arrays" },
    { value: "linked_lists", label: "Linked Lists" },
    { value: "stacks", label: "Stacks" },
    { value: "queues", label: "Queues" },
    { value: "hash_tables", label: "Hash Tables" },
    { value: "heaps", label: "Heaps" },
    { value: "binary_trees", label: "Binary Trees" },
    { value: "binary_search_trees", label: "Binary Search Trees" },
    { value: "avl_trees", label: "AVL Trees" },
    { value: "red_black_trees", label: "Red-Black Trees" },
    { value: "graphs", label: "Graphs" },
    { value: "tries", label: "Tries" },
    { value: "segment_trees", label: "Segment Trees" },
    { value: "fenwick_trees", label: "Fenwick Trees (Binary Indexed Trees)" },
    { value: "disjoint_set", label: "Disjoint Set (Union-Find)" },
    { value: "sorting_algorithms", label: "Sorting Algorithms" },
    { value: "searching_algorithms", label: "Searching Algorithms" },
    { value: "dynamic_programming", label: "Dynamic Programming" },
    { value: "greedy_algorithms", label: "Greedy Algorithms" },
    { value: "backtracking", label: "Backtracking" },
    { value: "divide_and_conquer", label: "Divide and Conquer" },
    { value: "graph_traversal", label: "Graph Traversal (BFS, DFS)" },
    {
      value: "shortest_path_algorithms",
      label:
        "Shortest Path Algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall)",
    },
    {
      value: "minimum_spanning_tree",
      label: "Minimum Spanning Tree (Kruskal, Prim)",
    },
    { value: "knapsack_problem", label: "Knapsack Problem" },
    {
      value: "string_matching_algorithms",
      label: "String Matching Algorithms (KMP, Rabin-Karp, Z-Algorithm)",
    },
    { value: "matrix_manipulation", label: "Matrix Manipulation Algorithms" },
    { value: "bit_manipulation", label: "Bit Manipulation" },
    { value: "sliding_window", label: "Sliding Window" },
    { value: "two_pointer_technique", label: "Two Pointer Technique" },
    { value: "topological_sort", label: "Topological Sort" },
    { value: "union_find_algorithms", label: "Union-Find Algorithms" },
    {
      value: "trie_based_string_processing",
      label: "Trie-based String Processing",
    },
    {
      value: "network_flow_algorithms",
      label: "Network Flow Algorithms (Ford-Fulkerson, Edmonds-Karp)",
    },
    { value: "randomized_algorithms", label: "Randomized Algorithms" },
    { value: "monte_carlo_algorithms", label: "Monte Carlo Algorithms" },
    { value: "branch_and_bound", label: "Branch and Bound" },
  ];

  return (
    <Modal
      title="Assignment Details"
      footer={<></>}
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      className="ass-modal"
      style={{
        height: "70vh",
        overflowY: "scroll",
      }}
    >
      <Formik
        key={modalKey}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({
          values,
          setValues,
          resetForm,
          setFieldValue,
          setTouched,
          setErrors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="title">Title</label>
              <Field
                className="classroom-fields"
                type="text"
                id="title"
                name="title"
              />
              <ErrorMessage name="title" component="div" className="error" />
            </div>

            <div className="mb-3">
              <label htmlFor="difficulty">Difficulty</label>
              <Field
                className="mb-3 classroom-fields"
                as="select"
                id="difficulty"
                name="difficulty"
              >
                <option className="diff-options" value="">
                  Select difficulty
                </option>
                <option className="diff-options" value="Easy">
                  Easy
                </option>
                <option className="diff-options" value="Medium">
                  Medium
                </option>
                <option className="diff-options" value="Hard">
                  Hard
                </option>
              </Field>
              <ErrorMessage
                name="difficulty"
                component="div"
                className="error"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tags">Tags</label>
              <Select
                mode="tags"
                style={{
                  width: "100%",
                }}
                name="tags"
                placeholder="E.g., Array, Linked List"
                onChange={(value) => {
                  setFieldValue("tags", value);
                }}
                // defaultValue={values["tags"]}
                options={options}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description">Problem Description</label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="4"
                className="classroom-fields"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="error"
              />
            </div>

            {/* <div className="mb-3">
              <label htmlFor="functionSignature">Function Signature</label>
              <Field
                type="text"
                id="functionSignature"
                className="classroom-fields"
                name="functionSignature"
                placeholder="e.g., def reverse_linked_list(head: ListNode) -> ListNode"
              />
              <ErrorMessage
                name="functionSignature"
                component="div"
                className="error"
              />
            </div> */}

            <div className="mb-3">
              <label htmlFor="constraints">Constraints</label>
              <Field
                as="textarea"
                id="constraints"
                name="constraints"
                rows="4"
                className="classroom-fields"
              />
              <ErrorMessage
                name="constraints"
                component="div"
                className="error"
              />
            </div>

            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="test-cases">Examples</div>
                <button
                  type="button"
                  onClick={() => {
                    const newTestCase = { input: "", output: "" };
                    setValues({...values, testCases : [...values.testCases, newTestCase]})
                  }}
                  className="test-case-button"
                >
                  Add Example
                </button>
              </div>
              {values.testCases.map((testCase, index) => (
                <div key={index} className="mb-2 test-case">
                  <div>
                    <label htmlFor={`testCases[${index}].input`}>Input</label>
                    <Field
                      type="text"
                      id={`testCases[${index}].input`}
                      name={`testCases[${index}].input`}
                      className="mb-1 classroom-fields"
                    />
                    <ErrorMessage
                      name={`testCases[${index}].input`}
                      component="div"
                      className="error"
                    />
                  </div>

                  <div>
                    <label htmlFor={`testCases[${index}].output`}>Output</label>
                    <Field
                      type="text"
                      id={`testCases[${index}].output`}
                      name={`testCases[${index}].output`}
                      className="mb-1 classroom-fields"
                    />
                    <ErrorMessage
                      name={`testCases[${index}].output`}
                      component="div"
                      className="error"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div
                onClick={() => {
                  resetForm(initialValues);
                }}
                className="create-class-cancel"
              >
                clear
              </div>
              <button type="submit" className="submit-assignment-button">
                Submit Question
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AssignmentModal;
