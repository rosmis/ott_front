import type { FetchContext, FetchResponse, ResponseType } from 'ofetch'
import httpstatus from 'http-status'

export type UseFetchEvent<Data> = FetchContext<Data, ResponseType> & {
  response: FetchResponse<Data>
}

export type UseFetchCustomOptions<Data> = {
  /**
     * Message to display as a success notification to the user when the operation succeeds.
     * @type {MaybeRefOrGetter<string> | undefined}
     */
  success?: MaybeRefOrGetter<string>

  /**
     * Callback triggered only when the fetch operation succeeds.
     * @type {(event: UseFetchEvent<Data>) => void | undefined}
     */
  onSuccess?: (event: UseFetchEvent<Data>) => void

  /**
     * Callback triggered only when the fetch operation fails.
     * @type {(event: UseFetchEvent<Data>) => void | undefined}
     */
  onError?: (event: UseFetchEvent<Data>) => void
}

export const useFetchApi = <Data = unknown>(
  url: Parameters<typeof useFetch<Data>>['0'],
  options?: Parameters<typeof useFetch<Data>>['1']
    & UseFetchCustomOptions<Data>
) => {
  const { apiUrl: baseURL } = useRuntimeConfig().public

  return useFetch<Data>(url, {
    ...options,
    baseURL,
    $fetch: useNuxtApp().api as typeof $fetch,
    onRequest: [
      ({ options: fetchOptions }) => {
        const token = useCookie<string>('XSRF-TOKEN')
        if (token.value) {
          fetchOptions.headers = new Headers(fetchOptions.headers)
          fetchOptions.headers.set('X-XSRF-TOKEN', token.value)
        }
      },
      ...(options?.onRequest
        ? Array.isArray(options.onRequest) ? options.onRequest : [options.onRequest]
        : [])
    ],
    onResponse: [
      (event) => {
        if (event.response.status < httpstatus.BAD_REQUEST) {
          options?.onSuccess?.(event)

          return event
        }

        options?.onError?.(event)
      },
      ...(options?.onResponse ? [options.onResponse] : [])
    ]
  })
}
