import { chatFlow } from "@/lib/workflows/chat-flow";
import { createChatUIChunkTransform } from "@/lib/workflows/ui-stream";
import type { UIMessage } from "ai";
import { createUIMessageStreamResponse } from "ai";
import { start } from "workflow/api";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const run = await start(chatFlow, [messages]);
  return createUIMessageStreamResponse({
    stream: run.readable.pipeThrough(createChatUIChunkTransform()),
    headers: {
      "x-workflow-run-id": run.runId,
    },
  });
}