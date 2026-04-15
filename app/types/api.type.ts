import type { FetchContext, FetchResponse } from 'ofetch'

export interface ApiResponse<Data> {
  data: Data
}

export interface ApiPaginationLinks {
  first: string
  last: string
  next: string
  prev: string
}

export interface ApiPaginationMetaLink {
  active: boolean
  label: string
  url: string
}

export interface ApiPaginationMeta {
  current_page: number
  from: number
  last_page: number
  links: ApiPaginationMetaLink[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface ApiResponsePaginated<Data> extends ApiResponse<Data> {
  links: ApiPaginationLinks
  meta: ApiPaginationMeta
}

export type ApiError<T = Record<string, string>> = FetchContext<T> & {
  response: FetchResponse<{ data: { message: string, errors?: T } }>
}
