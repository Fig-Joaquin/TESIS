import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  const users = await AppDataSource.getRepository(User).find();
  return res.json(users);
};

export const saveUser = async (req: Request, res: Response): Promise<Response> => {
  const user = await AppDataSource.getRepository(User).save(req.body);
  return res.json(user);
};
