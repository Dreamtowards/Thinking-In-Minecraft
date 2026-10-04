import type { Metadata } from 'next';
import { TagBrowser } from '@/components/tags/tag-browser';
import { getTagData } from '@/lib/tags';

export const metadata: Metadata = { title: '标签', description: '按主题探索《Minecraft 设计思想》的跨卷章节。' };

export default function TagsPage() {
  return <TagBrowser {...getTagData()} />;
}
