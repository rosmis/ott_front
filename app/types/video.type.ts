export type Video = {
  id: number
  title: string
  duration: number | null
  status: VideoStatus
  thumbnail_url: string
  category: {
    id: number
    name: string
    is_published: boolean
  }
  user: {
    id: number
    name: string
  }
  published_at: Date | null
}

export type Category = {
  id: number
  name: string
  is_published: boolean
  videos_count: number
}

export type VideoFilters = {
  'status[value]'?: VideoStatus
  'whereCategoryId[value]'?: number
}

export enum VideoStatus {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived'
}

export const videoStatusMapping = new Map<VideoStatus, { color: 'success' | 'neutral' | 'warning', title: string }>([
  [VideoStatus.Published, {
    color: 'success',
    title: 'Published'
  }],
  [VideoStatus.Draft, {
    color: 'neutral',
    title: 'Draft'
  }],
  [VideoStatus.Archived, {
    color: 'warning',
    title: 'Archived'
  }]
])
