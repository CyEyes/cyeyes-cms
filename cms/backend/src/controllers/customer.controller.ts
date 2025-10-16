import { Request, Response } from 'express';
import { createCustomer, getCustomerById, listCustomers, updateCustomer, deleteCustomer } from '../services/customer.service.js';
import type { CreateCustomerRequest, UpdateCustomerRequest, ListCustomersQuery } from '../schemas/customer.schema.js';
import type { UuidParam } from '../schemas/blog.schema.js';

export const create = async (req: Request<object, object, CreateCustomerRequest>, res: Response): Promise<void> => {
  try {
    const customer = await createCustomer(req.body);
    res.status(201).json({ message: 'Customer created successfully', data: customer });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create customer' });
  }
};

export const getById = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    const customer = await getCustomerById(req.params.id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ data: customer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get customer' });
  }
};

export const list = async (req: Request<object, object, object, ListCustomersQuery>, res: Response): Promise<void> => {
  try {
    const result = await listCustomers(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list customers' });
  }
};

export const update = async (req: Request<UuidParam, object, UpdateCustomerRequest>, res: Response): Promise<void> => {
  try {
    const customer = await updateCustomer(req.params.id, req.body);
    res.json({ message: 'Customer updated successfully', data: customer });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update customer' });
  }
};

export const remove = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    await deleteCustomer(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to delete customer' });
  }
};
