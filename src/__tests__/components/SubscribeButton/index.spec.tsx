import React from 'react';
import { screen, render, fireEvent } from "@testing-library/react"
import { mocked } from "ts-jest/utils";
import { signIn, useSession } from 'next-auth/client';
import {useRouter} from 'next/router';
import { SubscribeButton } from '../../../components/SubscribeButton';

jest.mock("next-auth/client")

jest.mock("next/router")

describe('SubscribeButton', () => {
  it('should render', () => {
    const mockedUseSession = mocked(useSession)
    mockedUseSession.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton />
    );

    expect(screen.getByText("Subscribe now")).toBeInTheDocument()
  });
  
  it('should navigate the user to signin when is not authenticated', () => {
    const mockedSignIn = mocked(signIn)
    const mockedUseSession = mocked(useSession)
    mockedUseSession.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText("Subscribe now")

    fireEvent.click(subscribeButton)

    expect(mockedSignIn).toBeCalled()
  });

  it('should navigate the user to posts when the user has a subscription', () => {
    const mockedUseSession = mocked(useSession)
    mockedUseSession.mockReturnValueOnce([{userActiveSubscription: true}, false])

    const pushMock = jest.fn()
    const mockedRouter = mocked(useRouter)
    mockedRouter.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText("Subscribe now")

    fireEvent.click(subscribeButton)

    expect(pushMock).toBeCalled()
  });
});