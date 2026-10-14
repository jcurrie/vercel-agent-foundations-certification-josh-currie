import { toUIMessageChunk, type ModelCallStreamPart } from "@ai-sdk/workflow";
import type { UIMessageChunk } from "ai";

type DataChunk = Extract<UIMessageChunk, { type: `data-${string}` }>;
type ChatStreamPart = ModelCallStreamPart | DataChunk;

function isDataChunk(part: ChatStreamPart): part is DataChunk {
  return part.type.startsWith("data-");
}

// Same as `createModelCallToUIChunkTransform` from @ai-sdk/workflow, except
// `data-*` chunks written by tool steps are forwarded instead of dropped.
// Chunk counting must stay identical so `uiStartIndex` resumes line up.
export function createChatUIChunkTransform({
  uiStartIndex = 0,
}: { uiStartIndex?: number } = {}) {
  let uiChunkIndex = 0;
  const enqueue = (
    controller: TransformStreamDefaultController<UIMessageChunk>,
    chunk: UIMessageChunk,
  ) => {
    if (uiChunkIndex++ >= uiStartIndex) controller.enqueue(chunk);
  };

  return new TransformStream<ChatStreamPart, UIMessageChunk>({
    start: (controller) => {
      enqueue(controller, { type: "start" });
      enqueue(controller, { type: "start-step" });
    },
    flush: (controller) => {
      enqueue(controller, { type: "finish-step" });
      enqueue(controller, { type: "finish" });
    },
    transform: (part, controller) => {
      const chunk = isDataChunk(part) ? part : toUIMessageChunk(part);
      if (chunk) enqueue(controller, chunk);
    },
  });
}
