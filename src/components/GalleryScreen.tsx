import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  ExternalLink, 
  X, 
  Copy, 
  Check,
  Tag,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';

interface GalleryScreenProps {
  items: GalleryItem[];
  onAddItem: (item: Omit<GalleryItem, 'id'>) => void;
  onLikeItem: (id: string) => void;
}

export default function GalleryScreen({ items, onAddItem, onLikeItem }: GalleryScreenProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New item form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryItem['category']>('architecture');
  const [newUrl, setNewUrl] = useState('');
  const [newPhotographer, setNewPhotographer] = useState('');
  const [newTags, setNewTags] = useState('');

  // Filtering
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
                          item.photographer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    // Use placeholder Unsplash image if invalid URL
    const finalUrl = newUrl.startsWith('http') 
      ? newUrl 
      : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600';

    const tagsArray = newTags
      ? newTags.split(',').map(t => t.trim()).filter(Boolean)
      : ['Asset'];

    onAddItem({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      imageUrl: finalUrl,
      photographer: newPhotographer.trim() || 'Anonymous Creator',
      likes: 0,
      tags: tagsArray
    });

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewCategory('architecture');
    setNewUrl('');
    setNewPhotographer('');
    setNewTags('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8" id="gallery-screen">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
            Media Gallery
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Browse creative layout ideas, designs, and landscape inspirations hotlinked live.
          </p>
        </div>
        <button
          id="add-image-trigger"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 text-white font-medium hover:bg-neutral-800 transition-colors shadow-sm self-start md:self-auto text-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Hotlink New Image</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
          <input
            id="gallery-search-input"
            type="text"
            placeholder="Search items, tags, or creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50/60 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/30 text-xs font-medium">
            {['all', 'architecture', 'tech', 'nature'].map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${categoryFilter === c ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-3xs hover:shadow-2xs hover:border-neutral-300 transition-all group flex flex-col h-full"
            >
              {/* Image Frame */}
              <div className="relative overflow-hidden aspect-4/3 bg-neutral-100 cursor-zoom-in" onClick={() => setActiveItem(item)}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-neutral-900/20 transition-colors" />

                {/* Hover Quick actions overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    id={`copy-url-overlay-${item.id}`}
                    onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.imageUrl, item.id); }}
                    className="p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-neutral-700 hover:text-neutral-900 shadow-xs border border-neutral-200/50"
                    title="Copy Image Link"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Category tag */}
                <span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-widest font-mono bg-neutral-950/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Card info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setActiveItem(item)}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="border-t border-neutral-100 pt-3.5 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-medium">
                    By <span className="font-semibold text-neutral-700">{item.photographer}</span>
                  </span>

                  {/* Likes counter button */}
                  <button
                    id={`like-item-${item.id}`}
                    onClick={() => onLikeItem(item.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200/80 bg-neutral-50/50 hover:bg-neutral-100/50 text-neutral-600 hover:text-rose-600 transition-colors text-[11px] font-semibold"
                  >
                    <Heart className="w-3.5 h-3.5 text-neutral-400 fill-neutral-50 hover:fill-rose-200" />
                    <span>{item.likes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-20 border border-dashed border-neutral-200 rounded-2xl bg-white">
            <Search className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <span className="text-xs font-semibold text-neutral-500">No images match your filter</span>
          </div>
        )}
      </div>

      {/* Image Lightbox View Dialog */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setActiveItem(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full border border-neutral-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side: Large Image */}
                <div className="relative aspect-video md:aspect-square bg-neutral-950 flex items-center justify-center">
                  <img 
                    src={activeItem.imageUrl} 
                    alt={activeItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-4 left-4 text-[9px] font-bold uppercase tracking-widest font-mono bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded border border-white/10">
                    {activeItem.category}
                  </span>
                </div>

                {/* Right Side: Details Pane */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    {/* Header bar */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="text-[10px] text-blue-600 font-mono font-bold uppercase tracking-wider">Asset Details</span>
                        <h2 className="text-md font-bold text-neutral-900 mt-1 leading-tight">{activeItem.title}</h2>
                      </div>
                      <button 
                        id="close-lightbox"
                        onClick={() => setActiveItem(null)} 
                        className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                      {activeItem.description}
                    </p>

                    {/* Metadata boxes */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-xs py-2 border-b border-neutral-100">
                        <span className="text-neutral-400 font-medium">Photographer</span>
                        <span className="font-semibold text-neutral-800">{activeItem.photographer}</span>
                      </div>
                      <div className="flex justify-between text-xs py-2 border-b border-neutral-100">
                        <span className="text-neutral-400 font-medium">Hotlink Status</span>
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">Active & Online</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {activeItem.tags.map(t => (
                        <span key={t} className="text-[10px] font-semibold bg-neutral-50 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200/50">
                          #{t.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-neutral-100 pt-4 flex gap-3 text-xs font-semibold">
                    <button
                      id="lightbox-copy-link"
                      onClick={() => handleCopyUrl(activeItem.imageUrl, activeItem.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-all"
                    >
                      {copiedId === activeItem.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Image link</span>
                        </>
                      )}
                    </button>
                    <button
                      id="lightbox-like-button"
                      onClick={() => { onLikeItem(activeItem.id); activeItem.likes += 1; }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{activeItem.likes} Likes</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Hotlink Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-200 w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-display font-semibold text-sm text-neutral-900">Hotlink New Media Asset</h3>
              <button 
                id="close-gallery-modal"
                onClick={() => setShowAddModal(false)} 
                className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Asset Title</label>
                <input
                  id="gallery-title-input"
                  type="text"
                  required
                  placeholder="Nordic Cabin Interior"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Short Description</label>
                <textarea
                  id="gallery-desc-input"
                  rows={2}
                  placeholder="Cozy fireplace set in a minimalist timber cabin overlooking pine forest..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-400 resize-none"
                />
              </div>

              {/* Category & Photographer Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Category</label>
                  <select
                    id="gallery-category-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GalleryItem['category'])}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                  >
                    <option value="architecture">Architecture</option>
                    <option value="tech">Tech & Workspace</option>
                    <option value="nature">Nature & Escapes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Photographer Name</label>
                  <input
                    id="gallery-photographer"
                    type="text"
                    placeholder="Jane Doe"
                    value={newPhotographer}
                    onChange={(e) => setNewPhotographer(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Image Hotlink URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Image Hotlink URL (Unsplash or any URL)</label>
                <input
                  id="gallery-image-url"
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-400"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Tags (comma separated)</label>
                <input
                  id="gallery-tags-input"
                  type="text"
                  placeholder="Interior, Cabin, Cozy"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-400"
                />
              </div>

              {/* Actions */}
              <div className="border-t border-neutral-100 pt-4 mt-6 flex justify-end gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="add-gallery-submit"
                  type="submit"
                  className="px-4 py-2 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
                >
                  Hotlink Asset
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
