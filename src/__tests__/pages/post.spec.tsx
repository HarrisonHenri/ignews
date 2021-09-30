import React from 'react';
import { screen, render } from "@testing-library/react"
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from "../../services/prismic";
import { mocked } from 'ts-jest/utils';
import { getSession } from 'next-auth/client';

const post = {
    slug: "my-new-post",
    title: "Title",
    content: "My new post",
    updateAt: "2021-12-31",
}

jest.mock("next-auth/client")

jest.mock("../../services/prismic")

describe('Post page', () => {
  it('should render', () => {
    render(
      <Post post={post}/>
    );

    expect(screen.getByText("My new post")).toBeInTheDocument()
  });

  it('should redirects the user if no subscription is found', async () => {
    const mockedSession = mocked(getSession);
    mockedSession.mockResolvedValueOnce({
      userActiveSubscription: null
    } as any)

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug: post.slug
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/"
        })
      })
    );
  });
  
  it('should loads initial data', async () => {
    const mockedSession = mocked(getSession);
    mockedSession.mockResolvedValueOnce({
      userActiveSubscription: "any-subscription"
    } as any)
    const mockedPrismicClient = mocked(getPrismicClient)
    mockedPrismicClient.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: "heading",
              text: post.title
            }
          ],
          content: [
            {
              type: "paragraph",
              text: post.content
            }
          ],
        },
        last_publication_date: "2021-12-31T14:58:36.996809+00:00"
      })
    } as any)

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug: post.slug
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            ...post,
            content: `<p>${post.content}</p>`
          }
        } 
    }));
  });
});