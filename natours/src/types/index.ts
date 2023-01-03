import { Request } from 'express';

interface UserRequest extends Request {
  // Use `user?:` here instead of `user:`.
  user?: {
    id?: number;
    role?: string;
  };
}
export { UserRequest };
