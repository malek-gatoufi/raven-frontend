'use client';

import { useState } from 'react';
import { FileText, List, Download, Info } from 'lucide-react';

interface ProductTabsProps {
  product: {
    description?: string;
    features?: Array<{
      name: string;
      value: string;
    }>;
    attachments?: Array<{
      id: number;
      name: string;
      description?: string;
      file_name: string;
      file_size: number;
      mime: string;
    }>;
  };
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText, show: !!product.description },
    { id: 'features', label: 'Caractéristiques', icon: List, show: product.features && product.features.length > 0 },
    { id: 'attachments', label: 'Documents', icon: Download, show: product.attachments && product.attachments.length > 0 },
  ].filter(tab => tab.show);

  if (tabs.length === 0) {
    return null;
  }

  // Set first available tab as active if current isn't available
  if (!tabs.find(t => t.id === activeTab)) {
    setActiveTab(tabs[0].id);
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-[#1a1a1a]/50 rounded-2xl border border-white/10 overflow-hidden">
      {/* Tab navigation */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-[#44D92C] border-[#44D92C] bg-[#44D92C]/5'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-6 md:p-8">
        {activeTab === 'description' && product.description && (
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-a:text-[#44D92C]"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        {activeTab === 'features' && product.features && (
          <div className="space-y-1">
            {product.features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center py-3 px-4 rounded-lg ${index % 2 === 0 ? 'bg-white/5' : ''}`}
              >
                <span className="font-medium text-gray-300 w-1/3">{feature.name}</span>
                <span className="text-white">{feature.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attachments' && product.attachments && (
          <div className="grid gap-4">
            {product.attachments.map(attachment => (
              <a
                key={attachment.id}
                href={`/attachment/${attachment.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-[#44D92C]/30 transition-all group"
              >
                <div className="w-12 h-12 bg-[#44D92C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-[#44D92C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium group-hover:text-[#44D92C] transition-colors truncate">{attachment.name}</p>
                  {attachment.description && (
                    <p className="text-sm text-gray-500 truncate">{attachment.description}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    {attachment.mime} • {formatFileSize(attachment.file_size)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
