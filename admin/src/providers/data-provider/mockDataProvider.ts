// Mock data provider cho các trang chỉ cần hiển thị mock data
export const mockDataProvider: any = {
  getList: async (params: any) => {
    console.log(`Mock getList called for resource: ${params.resource}`);
    return { data: [], total: 0 };
  },
  getOne: async (params: any) => {
    console.log(`Mock getOne called for resource: ${params.resource}`);
    return { data: { id: params.id } };
  },
  create: async (params: any) => {
    console.log(`Mock create called for resource: ${params.resource}`);
    return { data: { id: Date.now(), ...params.variables } };
  },
  update: async (params: any) => {
    console.log(`Mock update called for resource: ${params.resource}`);
    return { data: { id: params.id, ...params.variables } };
  },
  deleteOne: async (params: any) => {
    console.log(`Mock deleteOne called for resource: ${params.resource}`);
    return { data: { id: params.id } };
  },
  getApiUrl: () => 'http://localhost:3000/mock-api',
  getMany: async (params: any) => ({ data: [] }),
  createMany: async (params: any) => ({ data: [] }),
  deleteMany: async (params: any) => ({ data: [] }),
  updateMany: async (params: any) => ({ data: [] }),
  custom: async (params: any) => ({ data: {} })
};
