import fastify from 'fastify'
import { userRoutes } from './routes/user'
import { mealsRoutes } from './routes/meals'

const app = fastify()

app.register(userRoutes, {
  prefix: 'user',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server Running!')
  })
