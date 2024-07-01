import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Usuario } from '../entities/usuarioEntity';

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  const users = await AppDataSource.getRepository(Usuario).find();
  return res.json(users);
};

export const saveUser = async (req: Request, res: Response): Promise<Response> => {
  const user = await AppDataSource.getRepository(Usuario).save(req.body);
  return res.json(user);
};
