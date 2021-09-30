import React from 'react';
import { screen, render } from "@testing-library/react"
import Posts, { getServerSideProps } from '../../pages/posts';
import { getPrismicClient } from "../../services/prismic";
import { mocked } from 'ts-jest/utils';

const posts = [
  {
    slug: "my-new-post",
    title: "Title",
    excerpt: "My new post",
    updateAt: "2021-12-31",
  }
]

jest.mock("../../services/prismic")

describe('Posts page', () => {
  it('should render', () => {
    render(
      <Posts posts={posts}/>
    );

    expect(screen.getByText(posts[0].title)).toBeInTheDocument()
  });
  
  it('should loads initial data', async () => {
    const mockedPrismicClient = mocked(getPrismicClient)
    mockedPrismicClient.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: posts[0].slug,
            data: {
              title: [
                {
                  type: "heading",
                  text: posts[0].title
                }
              ],
              content: [
                {
                  type: "paragraph",
                  text: posts[0].excerpt
                }
              ],
            },
            last_publication_date: "2021-12-31T14:58:36.996809+00:00"
          }
        ]
      })
    } as any)

    const response = await getServerSideProps({} as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts
        } 
    }));
  });
});