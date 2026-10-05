import { getTagCounts } from '@/lib/tags';
import { TagFilters } from './tag-filters';

export function TagDirectory() {
  return (
    <div className="not-prose mb-8">
      <TagFilters tags={getTagCounts()} />
    </div>
  );
}
