import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().notNullable()
    table.uuid('user_id').notNullable()
    table.text('name').notNullable()
    table.text('description')
    table.timestamp('complete_to').notNullable()
    table.boolean('on_diet').defaultTo(false).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
