import { createUIMessageStreamResponse } from "ai";
import { getRun } from "workflow/api";
import { createChatUIChunkTransform } from "@/lib/workflows/ui-stream";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const startIndexParam = searchParams.get("startIndex");
  const uiStartIndex = startIndexParam ? parseInt(startIndexParam, 10) : 0;

  const run = await getRun(id);
  const readable = run
    .getReadable({ startIndex: 0 })
    .pipeThrough(createChatUIChunkTransform({ uiStartIndex }));

  return createUIMessageStreamResponse({ stream: readable });
}