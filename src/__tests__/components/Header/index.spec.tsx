import React from 'react';
import { screen, render } from "@testing-library/react"
import { Header } from '../../../components/Header';

jest.mock("next/router", () => {
  return {
    useRouter: () => ({ asPath: "/" })
  }
})

jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false]
  }
})

describe('Header', () => {
  it('should render', () => {
    render(
      <Header />
    );

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Posts")).toBeInTheDocument()
  });
});