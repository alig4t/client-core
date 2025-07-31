// services/FakeTagService.ts
interface Tag {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  }
  
  let tags: Tag[] = [
    {
      id: 1,
      name: 'برچسب تست ۱',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'برچسب تست ۲',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString(),
    },
  ];
  
  const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));
  
  class FakeTagService {
    async getAll() {
      await delay();
      return {
        data: {
          type: 'success',
          status: 200,
          data: tags,
          meta: {},
          timestamp: new Date().toISOString(),
        },
      };
    }
  
    async getById(id: number) {
      await delay();
      const tag = tags.find((t) => t.id === id);
      if (!tag) throw new Error('Tag not found');
      return {
        data: {
          type: 'success',
          status: 200,
          data: tag,
          meta: {},
          timestamp: new Date().toISOString(),
        },
      };
    }
  
    async create(data: Partial<Tag>) {
      await delay();
      const newTag: Tag = {
        id: Date.now(),
        name: data.name ?? 'بدون نام',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
      };
      tags.push(newTag);
      return {
        data: {
          type: 'success',
          status: 201,
          data: newTag,
          meta: {},
          timestamp: new Date().toISOString(),
        },
      };
    }
  
    async update(id: number, data: Partial<Tag>) {
      await delay();
      const index = tags.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Tag not found');
  
      tags[index] = {
        ...tags[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
  
      return {
        data: {
          type: 'success',
          status: 200,
          data: tags[index],
          meta: {},
          timestamp: new Date().toISOString(),
        },
      };
    }
  
    async delete(id: number) {
      await delay();
      tags = tags.filter((t) => t.id !== id);
      return {
        data: {
          type: 'success',
          status: 200,
          data: null,
          meta: {},
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
  
  export default new FakeTagService();
  