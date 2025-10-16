import { Request, Response } from 'express';
import {
  createTeamMember,
  getTeamMemberById,
  listTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from '../services/team.service.js';
import type { CreateTeamMemberRequest, UpdateTeamMemberRequest, ListTeamMembersQuery } from '../schemas/team.schema.js';
import type { UuidParam } from '../schemas/blog.schema.js';

export const create = async (req: Request<object, object, CreateTeamMemberRequest>, res: Response): Promise<void> => {
  try {
    const member = await createTeamMember(req.body);
    res.status(201).json({ message: 'Team member created successfully', data: member });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create team member' });
  }
};

export const getById = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    const member = await getTeamMemberById(req.params.id);
    if (!member) {
      res.status(404).json({ error: 'Team member not found' });
      return;
    }
    res.json({ data: member });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get team member' });
  }
};

export const list = async (req: Request<object, object, object, ListTeamMembersQuery>, res: Response): Promise<void> => {
  try {
    const query = { ...req.query };

    // Force active members only for public
    if (!req.user) {
      query.isActive = true;
    }

    const result = await listTeamMembers(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list team members' });
  }
};

export const update = async (req: Request<UuidParam, object, UpdateTeamMemberRequest>, res: Response): Promise<void> => {
  try {
    const member = await updateTeamMember(req.params.id, req.body);
    res.json({ message: 'Team member updated successfully', data: member });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update team member' });
  }
};

export const remove = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    await deleteTeamMember(req.params.id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to delete team member' });
  }
};
