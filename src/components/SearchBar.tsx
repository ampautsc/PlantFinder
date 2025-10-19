interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search wildflowers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
