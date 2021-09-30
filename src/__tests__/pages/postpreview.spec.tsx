import React from 'react';
import { screen, render } from "@testing-library/react"
import PostPreview, { getStaticProps } from '../../pages/posts/preview//[slug]';
import { getPrismicClient } from "../../services/prismic";
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

const post = {
    slug: "my-new-post",
    title: "Title",
    content: "My new post",
    updateAt: "2021-12-31",
}

jest.mock("next-auth/client")
jest.mock("next/router")

jest.mock("../../services/prismic")

describe('PostPreview page', () => {
  it('should render', () => {
    const mockedSession = mocked(useSession);
    mockedSession.mockReturnValueOnce([null, false])

    render(
      <PostPreview post={post}/>
    );

    expect(screen.getByText("My new post")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue?")).toBeInTheDocument()
  });

  it('should redirects the user to full post when the user is subscribed', () => {
    const mockedPush = jest.fn();
    const mockedSession = mocked(useSession);
    mockedSession.mockReturnValueOnce([{userActiveSubscription: true}, false])
    const mockedRouter = mocked(useRouter);
    mockedRouter.mockReturnValueOnce({
      push: mockedPush
    } as any)

    render(
      <PostPreview post={post}/>
    );

    expect(mockedPush).toBeCalled()
  });
  
  it('should loads initial data', async () => {
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

    const response = await getStaticProps({
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