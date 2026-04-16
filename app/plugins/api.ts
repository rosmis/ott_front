export default defineNuxtPlugin(() => {
  const { apiUrl: baseURL } = useRuntimeConfig().public
  console.log('API Plugin - baseURL:', baseURL)

  const api = $fetch.create({
    credentials: 'include',
    baseURL,
    headers: {
      Accept: 'application/json'
    },
    onRequest({ options }) {
      const token = useCookie<string>('XSRF-TOKEN')
      if (token.value) {
        options.headers = new Headers(options.headers)
        options.headers.set('X-XSRF-TOKEN', token.value)
      }
    }
  })

  return { provide: { api } }
})
