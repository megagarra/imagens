
export interface CivitaiModel {
  id: number;
  name: string;
  description: string;
  type: string;
  nsfw: boolean;
  modelVersions: ModelVersion[];
  creator?: {
    username: string;
    image?: string;
  };
}

export interface ModelVersion {
  id: number;
  name: string;
  images: Array<{ url: string }>;
  baseModel: string;
  trainedWords?: string[];
}

export interface CivitaiImage {
  id: number;
  url: string;
  hash: string;
  width: number;
  height: number;
  nsfw: boolean;
  nsfwLevel: string;
  createdAt: string;
  postId: number;
  meta?: {
    prompt?: string;
    negativePrompt?: string;
    cfgScale?: number;
    steps?: number;
    sampler?: string;
    seed?: number;
    [key: string]: any;
  };
  username: string;
}

export interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  model: string;
  modelVersionId: number;
  width: number;
  height: number;
  steps: number;
  cfgScale: number;
  sampler: string;
  seed: number;
}

export interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl?: string;
  createdAt: number;
}
