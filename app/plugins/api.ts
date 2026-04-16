export default defineNuxtPlugin(() => {
  const { apiUrl: baseURL } = useRuntimeConfig().public

  const api = $fetch.create({
    baseURL
  })

  return { provide: { api } }
})
