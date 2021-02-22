import faker from "faker";
import { Owner, User } from "..";

export const getUser = (user: Partial<User> = {}): User => ({
  id: faker.random.uuid(),
  email: faker.internet.email(),
  name: faker.name.firstName(),
  ...user,
});

export const getOwner = (owner: Partial<Owner> = {}): Owner => ({
  id: faker.random.uuid(),
  user: getUser(),
  ...owner,
});
