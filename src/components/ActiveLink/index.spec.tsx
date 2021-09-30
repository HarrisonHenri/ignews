import React from 'react';
import { render, screen} from "@testing-library/react"
import { ActiveLink } from '.';

jest.mock("next/router", () => {
  return {
    useRouter: () => ({ asPath: "/" })
  }
})

describe('ActiveLink', () => {
  it('should render without the active class', () => {
    render(
      <ActiveLink href="/any" activeClassName="any_class">
        <div>Home</div>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Home")).not.toHaveClass("any_class")
  });
  it('should render with the active class', () => {
    render(
      <ActiveLink href="/" activeClassName="any_class">
        <div>Home</div>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toHaveClass("any_class")
  });
});