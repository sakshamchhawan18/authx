export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  session: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  }
};
