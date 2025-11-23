
import { Input } from '../common/Input';
import './SearchAndFilter.css';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedTags,
  availableTags,
  onTagToggle,
  onClearFilters,
}: SearchAndFilterProps) {
  const hasFilters = searchQuery || selectedTags.length > 0;

  return (
    <div className="search-filter">
      <Input
        type="search"
        placeholder="Search tools..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {availableTags.length > 0 && (
        <div className="filter-section">
          <div className="filter-header">
            <h3 className="filter-title">Filter by Tags</h3>
            {hasFilters && (
              <button className="filter-clear" onClick={onClearFilters}>
                Clear
              </button>
            )}
          </div>
          <div className="filter-tags">
            {availableTags.map((tag) => (
              <button
                key={tag}
                className={`filter-tag ${selectedTags.includes(tag) ? 'filter-tag-active' : ''}`}
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
