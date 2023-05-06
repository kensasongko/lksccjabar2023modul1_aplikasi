import { DdbDocClient } from "@/libs/ddbDocClient";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

type ErrorResponse = {
  error_message: any;
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const BASE_URL = process.env.BASE_URL;
  if (!BASE_URL) {
    const errResp:ErrorResponse = {
      error_message: "BASE_URL env var not found"
    }
    return NextResponse.json(errResp, {
      status: 500,
    });
  }

  const id = params.id.toString();
  if (!id) {
    const errResp:ErrorResponse = {
      error_message: "ID must be specified"
    }
    return NextResponse.json(errResp, {
      status: 500,
    });
  } else {
    const ddbDocClient = DdbDocClient(process.env);
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: id,
        }
      })
    );
    return NextResponse.json({"status":"ok"});
  }
}

