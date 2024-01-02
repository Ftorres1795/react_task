import { describe, expect, it, vitest, afterEach } from "vitest";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";

import { setSelectedTask } from "../src/redux/slices/tasksSlice";
import { store } from "../src/redux/store";

import TaskForm from "../src/TaskForm";
/*global global*/
/*eslint no-undef: "error"*/
let component;
global.alert = vitest.fn();
global.confirm = vitest.fn().mockReturnValue(true);

describe("Test for TaskForm component", () => {
  // clean up render after each test
  afterEach(() => component.unmount());

  it("should submit a post request for creating a new task", async () => {
    const setReloadTasksMock = vitest.fn();

    component = render(
      <Provider store={store}>
        <TaskForm setReloadTasks={setReloadTasksMock} />
      </Provider>
    );
    fireEvent.change(screen.getByLabelText("Task Name"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByLabelText("Task Description"), {
      target: { value: "Description for test task" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    vitest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: vitest.fn(),
    });
    // timeout to allow the code from component execute
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    });
    expect(screen.getByLabelText("Task Name").value).toBeFalsy();
  });

  it("should submit a post request and fail for missing name", async () => {
    const setReloadTasksMock = vitest.fn();

    component = render(
      <Provider store={store}>
        <TaskForm setReloadTasks={setReloadTasksMock} />
      </Provider>
    );
    fireEvent.change(screen.getByLabelText("Task Description"), {
      target: { value: "Description for test task" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    const tasks = component.container.getElementsByClassName("task");

    expect(tasks.length).toBe(0);
  });

  it("should submit a put request for updating a task", async () => {
    // https://stackoverflow.com/questions/55088482/jest-not-implemented-window-alert
    const setReloadTasksMock = vitest.fn();

    component = render(
      <Provider store={store}>
        <TaskForm setReloadTasks={setReloadTasksMock} />
      </Provider>
    );
    store.dispatch(
      setSelectedTask({
        id: 7,
        name: "test update",
        description: "some description",
        user: 3,
      })
    );
    /* setTimeout added to allow component to mount and 
        execute useEffect on selectedTask*/
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    vitest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: vitest.fn(),
    });
    // timeout to allow the code from component execute
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 300);
      });
    });
    expect(screen.getByLabelText("Task Name").value).toBeFalsy();
  });

  it("should submit a delete request for deleting a task", async () => {
    const setReloadTasksMock = vitest.fn();

    component = render(
      <Provider store={store}>
        <TaskForm setReloadTasks={setReloadTasksMock} />
      </Provider>
    );
    store.dispatch(
      setSelectedTask({
        id: 7,
        name: "test delete",
        description: "some description",
        user: 3,
      })
    );
    /* setTimeout added to allow component to mount and
          execute useEffect on selectedTask*/
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    });
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    vitest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
    });
    // timeout to allow the code from component execute
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 300);
      });
    });
    expect(screen.getByLabelText("Task Name").value).toBeFalsy();
  });
});
