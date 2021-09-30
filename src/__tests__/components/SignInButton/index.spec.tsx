import React from 'react';
import { screen, render } from "@testing-library/react"
import { mocked } from "ts-jest/utils";
import { useSession } from 'next-auth/client';
import { SignInButton } from '../../../components/SignInButton';

jest.mock("next-auth/client")

describe('SignInButton', () => {
  it('should render when user is not authenticated', () => {
    const mockedUseSession = mocked(useSession)

    mockedUseSession.mockReturnValueOnce([null, false])

    render(
      <SignInButton />
    );

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument()
  });
  it('should render when user is authenticated', () => {
    const mockedUseSession = mocked(useSession)

    mockedUseSession.mockReturnValueOnce([{user: { name: "John Doe"}}, false])

    render(
      <SignInButton />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument()
  });
});