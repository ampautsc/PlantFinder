interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

function SearchBar({ searchQuery, onSearchChange, onToggleFilters, activeFilterCount }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search wildflowers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button className="filter-toggle-btn" onClick={onToggleFilters}>
        🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>
    </div>
  );
}

export default SearchBar;
