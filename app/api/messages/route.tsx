import { DdbDocClient } from '@/libs/ddbDocClient';
import { Message } from '@/libs/types';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ScanCommand, ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
 
type ErrorResponse = {
  error_message: any;
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const title = data.title?.toString();
  const message = data.message?.toString();

  if (title && message) {
    const ddbDocClient = DdbDocClient(process.env);
    await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: uuidv4(),
          title: title,
          message: message,
        },
      })
    );
    return NextResponse.json({"status":"ok"});
  }
}
 
export async function GET() {
  const ddbDocClient = DdbDocClient(process.env);

  const input:ScanCommandInput = {
    TableName: process.env.TABLE_NAME,
    Limit: 20,
  };

  const command = new ScanCommand(input);

  let data: ScanCommandOutput;
  let response: Message[] | ErrorResponse;

  try {
    data = await ddbDocClient.send(command);
    if (data.Count && data.Count !== 0) {
      response = data.Items!.map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
      }));
    } else {
     response = [];
    }
    return NextResponse.json(response);
  } catch (error: any) {
    response = {
      error_message: error
    };
    return NextResponse.json(response);
  }
}
