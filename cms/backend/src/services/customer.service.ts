import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { customers, type Customer, type NewCustomer } from '../models/index.js';
import { eq, and } from 'drizzle-orm';
import type { CreateCustomerRequest, UpdateCustomerRequest, ListCustomersQuery } from '../schemas/customer.schema.js';
import type { PaginationResult } from '../types/index.js';

export const createCustomer = async (data: CreateCustomerRequest): Promise<Customer> => {
  const newCustomer: NewCustomer = {
    id: uuidv4(),
    companyName: data.companyName,
    logo: data.logo,
    industry: data.industry || null,
    website: data.website || null,
    caseStudy: data.caseStudy ? JSON.stringify(data.caseStudy) : null,
    testimonial: data.testimonial ? JSON.stringify(data.testimonial) : null,
    showHomepage: data.showHomepage ?? false,
    displayOrder: data.displayOrder || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(customers).values(newCustomer).returning();
  return parseCustomer(result[0]);
};

export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  const customer = await db.select().from(customers).where(eq(customers.id, id)).get();
  return customer ? parseCustomer(customer) : undefined;
};

export const listCustomers = async (query: ListCustomersQuery): Promise<PaginationResult<Customer>> => {
  const { page, limit, industry, showHomepage } = query;

  const conditions = [];
  if (industry) conditions.push(eq(customers.industry, industry));
  if (showHomepage !== undefined) conditions.push(eq(customers.showHomepage, showHomepage));

  const allCustomers = await db
    .select()
    .from(customers)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = allCustomers.length;
  const offset = (page - 1) * limit;

  const results = await db
    .select()
    .from(customers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(customers.displayOrder)
    .limit(limit)
    .offset(offset);

  return {
    data: results.map(parseCustomer),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateCustomer = async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
  const existing = await getCustomerById(id);
  if (!existing) throw new Error('Customer not found');

  const updateData: Partial<NewCustomer> = {
    ...data,
    caseStudy: data.caseStudy ? JSON.stringify(data.caseStudy) : undefined,
    testimonial: data.testimonial ? JSON.stringify(data.testimonial) : undefined,
    updatedAt: new Date().toISOString(),
  };

  const result = await db.update(customers).set(updateData).where(eq(customers.id, id)).returning();
  return parseCustomer(result[0]);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const existing = await getCustomerById(id);
  if (!existing) throw new Error('Customer not found');
  await db.delete(customers).where(eq(customers.id, id));
};

const parseCustomer = (customer: Customer): Customer => ({
  ...customer,
  caseStudy: customer.caseStudy ? JSON.parse(customer.caseStudy) : null,
  testimonial: customer.testimonial ? JSON.parse(customer.testimonial) : null,
});
