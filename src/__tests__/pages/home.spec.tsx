import React from 'react';
import { screen, render } from "@testing-library/react"
import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils';

jest.mock("next-auth/client")

jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false]
  }
})

jest.mock("../../services/stripe")

describe('Home page', () => {
  it('should render', () => {
    render(
      <Home product={{amount: "R$10,00", priceId: "any"}}/>
    );

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()
  });
  
  it('should loads initial data', async () => {
    const mockedStripePricesRetrieve = mocked(stripe.prices.retrieve)
    mockedStripePricesRetrieve.mockResolvedValueOnce({
      id: "any_id",
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "any_id",
            amount: "$10.00"
          }
        } 
    }));
  });
});