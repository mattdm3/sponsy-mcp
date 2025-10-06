import { z } from "zod";
import { ErrorResponse, GetOptions } from "./interfaces";
import {
  createGenericSponsyResponse,
  Customer,
  Publication,
  Slot,
} from "./schemas.js";

export interface SponsyClientOptions {
  apiKey: string;
  baseUrl?: string;
}

const applicationError = {
  data: null,
  error: {
    options: {},
    url: "",
    error: "application_error",
    statusCode: 0,
    message: ["Unable to fetch data. The request could not be resolved."],
  },
};

export class SponsyClient {
  private apiKey: string;
  private baseUrl: string;
  private readonly headers: Headers;

  constructor(opts: SponsyClientOptions) {
    this.apiKey = opts.apiKey;
    this.baseUrl = "https://api.getsponsy.com/v1";

    this.headers = new Headers({
      "x-api-key": this.apiKey,
      accept: "application/json",
      "Content-Type": "application/json",
    });
  }

  private buildUrlWithParams(
    path: string,
    params: Record<string, string> | undefined = {}
  ) {
    let url = path;
    if (!params) {
      return url;
    }
    Object.entries(params).forEach(([key, value], index) => {
      if (value) {
        url += `${index === 0 ? "?" : "&"}${key}=${value}`;
      }
    });
    return url;
  }

  private async makeRequest<T>(
    path: string,
    options: GetOptions = {}
  ): Promise<{ data: T; error: null } | { data: null; error: ErrorResponse }> {
    const { params, ...rest } = options;
    const url = `${this.baseUrl}${this.buildUrlWithParams(path, params)}`;
    try {
      const response = await fetch(url, rest);

      if (!response.ok) {
        try {
          const rawError = await response.text();
          return { data: null, error: JSON.parse(rawError) };
        } catch (err) {
          if (err instanceof SyntaxError) {
            return applicationError;
          }

          const error: ErrorResponse = {
            message: [response.statusText],
            error: "application_error",
            statusCode: 0,
          };

          if (err instanceof Error) {
            return { data: null, error };
          }

          return { data: null, error };
        }
      }

      const data = (await response.json()) as T;

      return { data, error: null };
    } catch {
      applicationError.error.url = url;
      applicationError.error.options = options;
      return applicationError;
    }
  }

  private async get<T>(path: string, options: GetOptions = {}) {
    const requestOptions = {
      method: "GET",
      headers: this.headers,
      ...options,
    };

    return this.makeRequest<T>(path, requestOptions);
  }

  // JOBS

  listSlots(props: {
    publicationId: string;
    from?: string;
    to?: string;
    status?: string;
    limit?: string;
  }) {
    const { publicationId, ...rest } = props;
    const responseType = createGenericSponsyResponse(Slot);
    return this.get<z.infer<typeof responseType>>(
      `/publications/${publicationId}/slots`,
      {
        params: rest,
      }
    );
  }

  getSlot(props: {
    publicationId: string;
    slotId: string;
    from?: string;
    to?: string;
    status?: string;
    limit?: string;
  }) {
    const { publicationId, slotId, ...rest } = props;
    // Todo: check response type
    const responseType = createGenericSponsyResponse(Slot);
    return this.get<z.infer<typeof responseType>>(
      `/slots/${publicationId}/slots/${slotId}`,
      {
        params: rest,
      }
    );
  }

  searchCustomers(props: { name: string; limit?: string; orderBy?: string }) {
    // Todo: check response type
    const responseType = createGenericSponsyResponse(Customer);
    return this.get<z.infer<typeof responseType>>("/customers", {
      params: props,
    });
  }

  listPublications() {
    const responseType = createGenericSponsyResponse(Publication);
    return this.get<z.infer<typeof responseType>>("/publications");
  }
}
