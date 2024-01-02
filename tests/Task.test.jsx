import { describe, expect, it, vitest, afterEach } from "vitest";
import {
  render,
  fireEvent,
  screen,
  queryByAttribute,
} from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../src/redux/store";
import Tasks from "../src/Tasks";

/*global global*/
/*eslint no-undef: "error"*/

describe("Test for Tasks component", () => {
  let component;
  // clean up render after each test
  afterEach(() => component.unmount());

  it("renders tasks correctly", async () => {
    vitest.spyOn(global, "fetch").mockResolvedValue({
      json: vitest
        .fn()
        .mockResolvedValue([
          { id: 1, name: "Task 1", description: "Description 1" },
        ]),
    });

    component = render(
      <Provider store={store}>
        <Tasks />
      </Provider>
    );

    await screen.findByText("Task 1");
    expect(screen.getByText("Task 1"));
    expect(screen.getByText("Description 1"));
  });

  it("throws error when fetching tasks fails", async () => {
    component = render(
      <Provider store={store}>
        <Tasks />
      </Provider>
    );

    const tasks = component.container.getElementsByClassName("task");

    expect(tasks.length).toBe(0);
  });

  it("saves selected task on click", async () => {
    vitest.spyOn(global, "fetch").mockResolvedValue({
      json: vitest
        .fn()
        .mockResolvedValue([
          { id: 1, name: "Task 1", description: "Description 1" },
        ]),
    });
    const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <Provider store={store}>
        <Tasks />
      </Provider>
    );
    const taskName = "Task 1";
    await screen.findByText(taskName);
    const task = screen.getByText(taskName);
    fireEvent.click(task);
    expect(getById(container, "taskName").value == taskName).toBeTruthy();
  });
});
