import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const leads = sqliteTable('leads', {
 id: text('id').primaryKey(), name: text('name').notNull(), salary: text('salary').notNull(), occupation: text('occupation').notNull(), propertyType: text('property_type').notNull(), budget: text('budget').notNull(), phone: text('phone').notNull(), whatsapp: integer('whatsapp',{mode:'boolean'}).notNull(), language: text('language').notNull(), createdAt: text('created_at').notNull()
});
