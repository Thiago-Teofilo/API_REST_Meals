import { knex } from '../database'

import { randomUUID } from 'node:crypto'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const mealsRoutes = async (app: FastifyInstance) => {
  app.get('/:user_id', async (request: FastifyRequest) => {
    const getRouteParamsSchema = z.object({
      user_id: z.string().uuid(),
    })

    const routeParams = getRouteParamsSchema.parse(request.params)

    const userMeals = await knex('meals').where(routeParams).select()

    return { userMeals }
  })

  app.get('/:user_id/:meal_id', async (request: FastifyRequest) => {
    const getRouteParamsSchema = z.object({
      user_id: z.string().uuid(),
      meal_id: z.string().uuid(),
    })

    const routeParams = getRouteParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id: routeParams.meal_id,
        user_id: routeParams.user_id,
      })
      .select()

    return { meal }
  })

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const getMealsSchema = z.object({
      user_id: z.string().uuid(),
      name: z.string(),
      description: z.string().optional(),
      complete_to: z.string().datetime(),
      on_diet: z.boolean().optional(),
    })

    const mealsData = getMealsSchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      ...mealsData,
      created_at: new Date(),
    })

    return reply.status(201).send()
  })

  app.put(
    '/:user_id/:meal_id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getRouteParamsSchema = z.object({
        user_id: z.string().uuid(),
        meal_id: z.string().uuid(),
      })

      const getMealsSchema = z.object({
        name: z.string(),
        description: z.string(),
        complete_to: z.string().datetime(),
        on_diet: z.boolean(),
      })

      const routeParams = getRouteParamsSchema.parse(request.params)
      const mealsData = getMealsSchema.parse(request.body)

      await knex('meals')
        .where({
          id: routeParams.meal_id,
          user_id: routeParams.user_id,
        })
        .update(mealsData)

      return reply.status(200).send('Updated')
    },
  )

  app.delete(
    '/:user_id/:meal_id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getRouteParamsSchema = z.object({
        user_id: z.string().uuid(),
        meal_id: z.string().uuid(),
      })

      const routeParams = getRouteParamsSchema.parse(request.params)

      await knex('meals')
        .where({
          id: routeParams.meal_id,
          user_id: routeParams.user_id,
        })
        .del()

      return reply.status(200).send('Delected')
    },
  )
}
