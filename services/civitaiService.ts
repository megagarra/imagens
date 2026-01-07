
import { CivitaiModel, CivitaiImage } from '../types';

const BASE_URL = 'https://civitai.com/api/v1';

export const fetchModels = async (query: string = '', limit: number = 20, type: string = 'Checkpoint'): Promise<CivitaiModel[]> => {
  const url = `${BASE_URL}/models?limit=${limit}${query ? `&query=${encodeURIComponent(query)}` : ''}&types=${type}&sort=Highest Rated`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch models');
  const data = await response.json();
  return data.items;
};

export const fetchCommunityImages = async (limit: number = 30): Promise<CivitaiImage[]> => {
  const url = `${BASE_URL}/images?limit=${limit}&sort=Newest&nsfw=false`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch images');
  const data = await response.json();
  return data.items;
};

export const fetchModelVersion = async (versionId: number) => {
  const url = `${BASE_URL}/model-versions/${versionId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch model version');
  return await response.json();
};

export const startGeneration = async (params: any) => {
  // Simulando o processo de geração conforme a experiência do Civitai Orchestrator
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(7),
        status: 'completed',
        imageUrl: `https://picsum.photos/seed/${Math.random()}/1024/1024`
      });
    }, 3000);
  });
};
