import faker from "faker";

faker.seed(1238);

export const USERS: {name: string; email: string}[] =
  new Array(61)
    .fill(0)
    .map((u, index) => ({
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: `enlil.testmail+cy${index}@gmail.com`,
    }));

console.log({ USERS });
