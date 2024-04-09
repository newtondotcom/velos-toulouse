export default defineNuxtConfig({
  modules: ['@nuxt/ui'],  
  runtimeConfig: {
    public : {
      JC_DECAUX_API_KEY : process.env.JC_DECAUX_API_KEY,
    },
  },
  security: {
    corsHandler: {
      origin : '*',
      methods : ['GET','POST','PUT','DELETE'],
      allowedHeaders : '*',
      exposeHeaders : '*',
    },
  },
  ssr: false,
})
