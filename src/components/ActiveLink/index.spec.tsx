import React from 'react';
import {render} from "@testing-library/react"
import { ActiveLink } from '.';

jest.mock("next/router", () => {
  return {
    useRouter: () => ({ asPath: "/" })
  }
})

describe('ActiveLink', () => {
  it('should render without the active class', () => {
    const { getByText } = render(
      <ActiveLink href="/any" activeClassName="any_class">
        <div>Home</div>
      </ActiveLink>
    );

    expect(getByText("Home")).toBeInTheDocument()
    expect(getByText("Home")).not.toHaveClass("any_class")
  });
  it('should render with the active class', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="any_class">
        <div>Home</div>
      </ActiveLink>
    );

    expect(getByText("Home")).toHaveClass("any_class")
  });
});