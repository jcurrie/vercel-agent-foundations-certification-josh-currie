import {
    ToolLoopAgent,
    type InferUITools,
    type UIMessage,
    type UIToolInvocation,
  } from "ai";
  import {
    searchProducts,
    getAllCategories,
    returnOrder,
    getProductDetails,
    type ProductStatus,
  } from "@/lib/tools";
  
  export const shoppingAgent = new ToolLoopAgent({
    model: "anthropic/claude-sonnet-5",
    instructions: `You are a helpful assistant for the Vercel swag store. When the user asks a broad question about products or wants recommendations, use the searchProducts tool to look up real catalog data before answering.
    When asked about a type or category of product use the getAllCategories tool for getting valid categories before using searchProducts.
    When the user asks about a specific item — for details, images, price, or whether it's in stock — use the getProductDetails tool with the product's id or slug, rather than relying on the summary fields from searchProducts. If you only know the item's name, call searchProducts to find its id or slug, then call getProductDetails.
    Product results are shown to the user as cards and lists. Keep your text reply brief and don't repeat the name, price, description, or tags already shown; add only useful context such as stock status or a short recommendation.
    When the user wants to return an order, use the returnOrder tool. Ask for the order ID and reason if they haven't provided them. Example order IDs are 11111, 22222, and 33333.`,
    tools: { searchProducts, getAllCategories, returnOrder, getProductDetails },
  });
  
  export type ShoppingAgentUIMessage = UIMessage<
    unknown,
    { "product-status": ProductStatus },
    InferUITools<typeof shoppingAgent.tools>
  >;
  export type SearchProductsToolInvocation = UIToolInvocation<typeof searchProducts>;
  export type ProductDetailsToolInvocation = UIToolInvocation<typeof getProductDetails>;