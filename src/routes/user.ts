import { knex } from '../database'

import { randomUUID } from 'node:crypto'

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const userRoutes = async (app: FastifyInstance) => {
  app.get('/:user_id', async (request: FastifyRequest) => {
    const getRouteParamsSchemas = z.object({
      user_id: z.string().uuid(),
    })

    const { user_id: userId } = getRouteParamsSchemas.parse(request.params)

    const users = await knex('users').where('id', userId).select()
    return { users }
  })

  app.get('/:user_id/sumary', async (request: FastifyRequest) => {
    const getRouteParamsSchemas = z.object({
      user_id: z.string().uuid(),
    })

    const { user_id: userId } = getRouteParamsSchemas.parse(request.params)

    const meals = await knex('meals').where('user_id', userId).select()

    const totalMeals = meals.length
    const totalMealsOnDiet = meals.filter((m) => m.on_diet).length
    const totalMealsOfDiet = totalMeals - totalMealsOnDiet

    let maxSequence = 0
    let currentSequence = 0

    for (const meal of meals) {
      if (meal.on_diet === 1) {
        currentSequence++
        if (currentSequence > maxSequence) {
          maxSequence = currentSequence
        }
      } else {
        currentSequence = 0
      }
    }

    const sumary = {
      total_meals: totalMeals,
      total_meals_on_diet: totalMealsOnDiet,
      total_meals_of_diet: totalMealsOfDiet,
      best_sequence: maxSequence,
    }

    return { sumary }
  })

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserSchema = z.object({
      name: z.string(),
    })

    const { name } = createUserSchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })

    return reply.status(201).send()
  })
}
