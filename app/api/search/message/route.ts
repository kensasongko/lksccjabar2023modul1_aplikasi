import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Client } from "@opensearch-project/opensearch/.";
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Message } from '@/libs/types';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const search = data.search?.toString();

  if (!search) {
    return NextResponse.json({"error_message":"Search string required."}, {
      status: 401
    });
  }

  const client = new Client({
    ...AwsSigv4Signer({
      region: 'ap-southeast-1',
      service: 'aoss',

      getCredentials: () => {
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: 'https://8nbhvxfqx24jtu63qd6h.ap-southeast-1.aoss.amazonaws.com/',
  });

  const clientResponse = await client.search({
    index: process.env.INDEX_NAME,
    body: {
      query: {
        multi_match: {
          query: search,
          fields: ["title", "message"],
          fuzziness: 2,
        },
      },
    },
  });

  const response: Message[] = clientResponse.body.hits.hits.map((hit:any) => ({
    id: hit._source.id,
    title: hit._source.title,
    message: hit._source.message,
  }));

  
  return NextResponse.json(response);
}
