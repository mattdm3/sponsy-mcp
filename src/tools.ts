import { z } from "zod";
import {
  ListSlotsInput,
  GetSlotMetricsInput,
  SearchCustomersInput,
  ListPublicationsInput,
  ListSlotsByCustomerInput,
} from "./schemas.js";
import { SponsyClient } from "./sponsyClient.js";

export function buildTools() {
  return {
    listPublications: {
      name: "listPublications",
      description: "List publications/newsletters.",
      inputSchema: ListPublicationsInput,
      handler: async (input: z.infer<typeof ListPublicationsInput>) => {
        const apiKey = process.env.SPONSY_API_KEY || input.apiKey;

        if (!apiKey) {
          throw new Error("SPONSY_API_KEY is not set");
        }

        const client = new SponsyClient({ apiKey });
        const publications = await client.listPublications();
        return publications;
      },
    },
    listSlots: {
      name: "listSlots",
      description:
        "List ad inventory slots for a publication and optional date/status filters.",
      inputSchema: ListSlotsInput,
      handler: async (input: z.infer<typeof ListSlotsInput>) => {
        const apiKey = process.env.SPONSY_API_KEY || input.apiKey;

        if (!apiKey) {
          throw new Error("SPONSY_API_KEY is not set");
        }

        const client = new SponsyClient({ apiKey });

        if (!input.publicationId && !input.publicationName) {
          throw new Error(
            "Either publicationId or publicationName is required"
          );
        }

        if (input.publicationId) {
          const data = await client.listSlots({
            publicationId: input.publicationId,
            from: input.from,
            to: input.to,
            status: input.status,
          });
          return data;
        }

        if (!input.publicationId && input.publicationName) {
          const { data: publications } = await client.listPublications();
          const publication = publications?.data.find(
            (p) => p.name === input.publicationName
          );
          if (!publication) {
            throw new Error(`Publication ${input.publicationName} not found`);
          }
          const data = await client.listSlots({
            publicationId: publication.id,
            from: input.from,
            to: input.to,
            status: input.status,
          });
          return data;
        }

        throw new Error("Either publicationId or publicationName is required");
      },
    },
    getSlotMetrics: {
      name: "getSlot",
      description: "Get slot details or metrics for a single slot.",
      inputSchema: GetSlotMetricsInput,
      handler: async (input: z.infer<typeof GetSlotMetricsInput>) => {
        const apiKey = process.env.SPONSY_API_KEY || input.apiKey;

        if (!apiKey) {
          throw new Error("SPONSY_API_KEY is not set");
        }

        const client = new SponsyClient({ apiKey });
        const data = await client.getSlot({
          publicationId: input.publicationId,
          slotId: input.slotId,
          from: input.from,
          to: input.to,
        });

        return data;
      },
    },
    searchCustomers: {
      name: "searchCustomers",
      description: "Search advertisers/customers by name or domain.",
      inputSchema: SearchCustomersInput,
      handler: async (input: z.infer<typeof SearchCustomersInput>) => {
        const apiKey = process.env.SPONSY_API_KEY || input.apiKey;

        if (!apiKey) {
          throw new Error("SPONSY_API_KEY is not set");
        }

        const client = new SponsyClient({ apiKey });
        return await client.searchCustomers({
          name: input.name,
          limit: input.limit,
          orderBy: input.orderBy,
        });
      },
    },

    listSlotsByCustomer: {
      name: "listSlotsByCustomer",
      description: "List slots by customer for a publication.",
      inputSchema: ListSlotsByCustomerInput,
      handler: async (input: z.infer<typeof ListSlotsByCustomerInput>) => {
        const apiKey = process.env.SPONSY_API_KEY || input.apiKey;

        if (!apiKey) {
          throw new Error("SPONSY_API_KEY is not set");
        }

        if (!input.customerId && !input?.customerName) {
          throw new Error("Either customerId or customerName is required");
        }

        const client = new SponsyClient({ apiKey });

        if (!input.customerId && !!input?.customerName) {
          const { data: customers, error: customersError } =
            await client.searchCustomers({
              name: input.customerName,
            });

          if (customersError) {
            throw new Error(
              `Error searching customers: ${customersError.message}`
            );
          }

          const customer = customers?.data?.find(
            (customer) =>
              customer.name?.toLowerCase() === input.customerName?.toLowerCase()
          );
          if (!customer) {
            throw new Error(`Customer ${input.customerName} not found`);
          }
          input.customerId = customer.id;
        }

        const { data: slots, error: slotsError } = await client.listSlots({
          from: input.from,
          publicationId: input.publicationId,
          to: input.to,
          status: input.status,
          limit: input.limit,
        });
        if (slotsError) {
          throw new Error(`Error listing slots: ${slotsError.message}`);
        }
        const slotsByCustomer = slots?.data.filter(
          (slot) => slot?.customer?.id === input.customerId
        );
        return slotsByCustomer;
      },
    },
  };
}

export type ToolDef = ReturnType<typeof buildTools>;
