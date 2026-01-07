
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ModelCard from './components/ModelCard';
import { fetchModels, fetchCommunityImages, fetchModelVersion } from './services/civitaiService';
import { enhancePrompt } from './services/geminiService';
import { CivitaiModel, CivitaiImage, GenerationParams, GenerationJob } from './types';
import { 
  Search, 
  Sparkles, 
  Settings, 
  Layers, 
  Maximize2, 
  RefreshCw, 
  Download, 
  Image as ImageIcon,
  Loader2,
  Trash2,
  Zap,
  LayoutGrid,
  History as HistoryIcon,
  Copy,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studio' | 'discovery' | 'history'>('studio');
  const [models, setModels] = useState<CivitaiModel[]>([]);
  const [feed, setFeed] = useState<CivitaiImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<CivitaiModel | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GenerationJob[]>([]);
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);

  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    negativePrompt: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry',
    model: '',
    modelVersionId: 0,
    width: 512,
    height: 768,
    steps: 25,
    cfgScale: 7,
    sampler: 'Euler a',
    seed: -1
  });

  useEffect(() => {
    loadModels();
    loadFeed();
  }, []);

  const loadModels = async (query = '') => {
    setLoading(true);
    try {
      const results = await fetchModels(query);
      setModels(results);
      if (results.length > 0 && !selectedModel) setSelectedModel(results[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadFeed = async () => {
    try {
      const images = await fetchCommunityImages();
      setFeed(images);
    } catch (err) { console.error(err); }
  };

  const useImageMeta = (image: CivitaiImage) => {
    if (image.meta) {
      setParams(prev => ({
        ...prev,
        prompt: image.meta?.prompt || prev.prompt,
        negativePrompt: image.meta?.negativePrompt || prev.negativePrompt,
        cfgScale: image.meta?.cfgScale || prev.cfgScale,
        steps: image.meta?.steps || prev.steps,
        sampler: image.meta?.sampler || prev.sampler,
        seed: image.meta?.seed || prev.seed,
      }));
      setActiveTab('studio');
    }
  };

  const handleEnhance = async () => {
    if (!params.prompt.trim()) return;
    setIsEnhancing(true);
    const enhanced = await enhancePrompt(params.prompt);
    setParams(prev => ({ ...prev, prompt: enhanced }));
    setIsEnhancing(false);
  };

  const handleGenerate = async () => {
    if (!params.prompt.trim()) return;
    setIsGenerating(true);
    const tempJob: GenerationJob = { id: Date.now().toString(), status: 'processing', createdAt: Date.now() };
    setActiveJob(tempJob);
    setActiveTab('studio');

    setTimeout(() => {
      const finalJob: GenerationJob = {
        ...tempJob,
        status: 'completed',
        imageUrl: `https://picsum.photos/seed/${Math.floor(Math.random() * 100000)}/1024/1024`
      };
      setHistory(prev => [finalJob, ...prev]);
      setActiveJob(finalJob);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050608]">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Navigation Rail */}
        <aside className="w-20 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-[#0b0e14]">
          <button 
            onClick={() => setActiveTab('studio')}
            className={`p-3 rounded-2xl transition-all ${activeTab === 'studio' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <Zap className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('discovery')}
            className={`p-3 rounded-2xl transition-all ${activeTab === 'discovery' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutGrid className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`p-3 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <HistoryIcon className="w-6 h-6" />
          </button>
        </aside>

        {/* Dynamic Sidebar Content */}
        <div className="w-80 lg:w-96 border-r border-white/5 flex flex-col bg-[#0b0e14]/50">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-200 uppercase tracking-widest">
              {activeTab === 'studio' ? 'Modelos Civitai' : activeTab === 'discovery' ? 'Inspiração' : 'Histórico'}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {activeTab === 'studio' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar Checkpoints..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && loadModels(e.currentTarget.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {models.map(m => (
                    <ModelCard key={m.id} model={m} isSelected={selectedModel?.id === m.id} onSelect={setSelectedModel} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discovery' && (
              <div className="grid grid-cols-2 gap-2">
                {feed.map(img => (
                  <div key={img.id} className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer" onClick={() => useImageMeta(img)}>
                    <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <p className="text-[10px] text-white text-center line-clamp-3 italic">{img.meta?.prompt || 'Sem prompt'}</p>
                      <div className="absolute top-2 right-2 p-1 bg-white/20 rounded-md backdrop-blur-md">
                        <Copy className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {history.map(job => (
                  <div key={job.id} className="p-3 bg-gray-900/50 rounded-xl border border-white/5 flex gap-3 cursor-pointer hover:bg-gray-800 transition-all" onClick={() => setActiveJob(job)}>
                    <img src={job.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-400 line-clamp-2">Prompt gerado em {new Date(job.createdAt).toLocaleTimeString()}</p>
                      <span className="text-[10px] text-blue-500 font-bold uppercase mt-1 block">Concluído</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col relative bg-[#050608]">
          <div className="flex-1 flex items-center justify-center p-8">
            {activeJob ? (
              <div className="max-w-2xl w-full relative group">
                <div className="aspect-[2/3] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
                  {activeJob.status === 'processing' && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                      <p className="text-lg font-bold">Gerando sua arte...</p>
                      <p className="text-xs text-gray-500">Isto pode levar alguns segundos</p>
                    </div>
                  )}
                  <img src={activeJob.imageUrl} className="w-full h-full object-contain" />
                </div>
                
                {activeJob.status === 'completed' && (
                  <div className="mt-6 flex justify-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 border border-white/10 rounded-full text-sm font-medium transition-all">
                      <Download className="w-4 h-4" /> Baixar
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20">
                      <ExternalLink className="w-4 h-4" /> Publicar no Civitai
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Civitai Orchestrator</h2>
                <p className="text-gray-500 text-sm leading-relaxed">Selecione um modelo no menu lateral ou inspire-se no feed da comunidade para começar.</p>
              </div>
            )}
          </div>

          {/* Prompt Editor */}
          <div className="p-8 bg-gradient-to-t from-[#0b0e14] to-transparent">
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center gap-4 bg-gray-900/80 backdrop-blur-xl border border-white/10 p-2 pl-4 rounded-2xl shadow-2xl">
                <textarea 
                  value={params.prompt}
                  onChange={(e) => setParams(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Descreva o que você quer criar..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 resize-none py-2 h-12"
                />
                <button 
                  onClick={handleEnhance}
                  disabled={isEnhancing || !params.prompt.trim()}
                  className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all disabled:opacity-30"
                  title="Melhorar com Gemini"
                >
                  {isEnhancing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                </button>
                <div className="h-10 w-px bg-white/5 mx-2" />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !params.prompt.trim()}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  Gerar
                </button>
              </div>

              {/* Quick Settings Bar */}
              <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Proporção:</span>
                  <div className="flex bg-gray-900 rounded-lg p-1 border border-white/5">
                    {['1:1', '2:3', '16:9'].map(ratio => (
                      <button 
                        key={ratio}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${params.width + ':' + params.height === (ratio === '1:1' ? '512:512' : ratio === '2:3' ? '512:768' : '1024:576') ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        onClick={() => {
                          if (ratio === '1:1') setParams(p => ({ ...p, width: 512, height: 512 }));
                          if (ratio === '2:3') setParams(p => ({ ...p, width: 512, height: 768 }));
                          if (ratio === '16:9') setParams(p => ({ ...p, width: 1024, height: 576 }));
                        }}
                      >{ratio}</button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Modelo Ativo:</span>
                  <div className="px-3 py-1.5 bg-gray-900 rounded-lg border border-white/5 text-[11px] text-blue-400 font-medium">
                    {selectedModel?.name || 'Padrão SDXL'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Sampler:</span>
                  <select 
                    value={params.sampler}
                    onChange={(e) => setParams(p => ({ ...p, sampler: e.target.value }))}
                    className="bg-gray-900 border border-white/5 rounded-lg text-[10px] py-1 pl-2 pr-6 text-gray-300 focus:ring-0"
                  >
                    <option>Euler a</option>
                    <option>DPM++ 2M Karras</option>
                    <option>DPM++ SDE Karras</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
