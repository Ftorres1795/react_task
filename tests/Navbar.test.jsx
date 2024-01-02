import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import Navbar from "../src/Navbar";

describe("Test for Navbar component", () => {
  it("should match snapshot", () => {
    const { container } = render(<Navbar />);
    expect(container).toMatchSnapshot();
  });
});
