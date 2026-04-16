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

export interface ApiError {
  _data: {
    message: string
    errors: {
      [key: string]: string[]
    }
  }
}
