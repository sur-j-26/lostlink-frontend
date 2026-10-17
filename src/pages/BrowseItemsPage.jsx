import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlusCircle, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ItemCard from '../components/items/ItemCard';
import SearchBar from '../components/items/SearchBar';
import FilterPanel from '../components/items/FilterPanel';
import ItemDetailModal from '../components/items/ItemDetailModal';
import ReportItemModal from '../components/items/ReportItemModal';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import { getItems } from '../services/itemService';
import './BrowseItemsPage.css';

export default function BrowseItemsPage() {
  const [searchParams] = useSearchParams();

  // Data states
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiveDatabase, setIsLiveDatabase] = useState(false);

  // Filter states initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(() => {
    const type = searchParams.get('type');
    return type === 'lost' || type === 'found' ? type : 'all';
  });
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showOnlyAiMatches, setShowOnlyAiMatches] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'

  // Modals
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(
    () => searchParams.get('action') === 'report'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch initial items
  const loadItems = async () => {
    setError(null);
    try {
      const response = await getItems();
      setItems(response.data);
      setIsLiveDatabase(response.isLive);
    } catch {
      setError('Unable to load directory items. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
          return false;
        }

        // AI match filter
        if (showOnlyAiMatches && !item.aiConfidence) {
          return false;
        }

        // Search text query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          const matchLoc = item.location?.toLowerCase().includes(query);
          const matchCat = item.category?.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchLoc && !matchCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.formattedDate).getTime();
        const dateB = new Date(b.date || b.formattedDate).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [items, selectedType, selectedCategory, showOnlyAiMatches, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('All Categories');
    setShowOnlyAiMatches(false);
  };

  const handleReportCreated = (newItem) => {
    if (!newItem) return;
    setItems((prev) => {
      if (prev.some((it) => it.id === newItem.id)) {
        return prev;
      }
      return [newItem, ...prev];
    });
  };

  return (
    <div className="browse-page-root">
      {/* Header Banner */}
      <section className="browse-header-banner">
        <div className="container browse-header-container">
          <div className="browse-header-content">
            <div className="directory-status-pill">
              <span className={`status-pill-dot ${isLiveDatabase ? 'dot-live' : 'dot-preview'}`} />
              <span>{isLiveDatabase ? 'Anurag University Live Database' : 'Campus Directory Live Portal'}</span>
            </div>
            <h1 className="browse-title">Anurag University Campus Lost & Found Directory</h1>
            <p className="browse-subtitle">
              Search, filter, and discover lost and found belongings across the Anurag University campus.
            </p>
          </div>

          <div className="browse-header-action">
            <Button
              variant="teal"
              size="lg"
              icon={PlusCircle}
              onClick={() => setReportModalOpen(true)}
            >
              Report an Item
            </Button>
          </div>
        </div>
      </section>

      {/* Main Directory Area */}
      <div className="container browse-layout-container">
        {/* Search & Mobile Filter Bar */}
        <div className="browse-toolbar">
          <div className="browse-search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by title, location (e.g. Library, Science), or keywords..."
            />
          </div>

          <div className="browse-toolbar-controls">
            <button
              type="button"
              className="mobile-filter-trigger"
              onClick={() => setMobileFilterOpen((prev) => !prev)}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>

            <div className="sort-dropdown-container">
              <ArrowUpDown size={15} className="sort-icon" />
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort items"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Grid Layout: Sidebar & Cards */}
        <div className="browse-grid-layout">
          {/* Filter Sidebar */}
          <aside className={`browse-sidebar ${mobileFilterOpen ? 'mobile-sidebar-open' : ''}`}>
            <FilterPanel
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onResetFilters={handleResetFilters}
              totalResultsCount={filteredItems.length}
              showOnlyAiMatches={showOnlyAiMatches}
              onToggleAiMatches={() => setShowOnlyAiMatches((prev) => !prev)}
            />
          </aside>

          {/* Items Content Stream */}
          <main className="browse-main-stream" aria-live="polite">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorMessage message={error} onRetry={loadItems} />
            ) : filteredItems.length === 0 ? (
              <EmptyState
                title="No matching campus items"
                description={
                  searchQuery || selectedType !== 'all' || selectedCategory !== 'All Categories'
                    ? "We couldn't find items matching your active search and filter combinations."
                    : 'There are currently no items recorded in this category.'
                }
                actionLabel="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="items-card-grid">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onViewDetails={(it) => setSelectedItemForModal(it)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItemForModal && (
        <ItemDetailModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onClaimSubmit={() => {
            loadItems();
          }}
        />
      )}

      {/* Report Item Modal */}
      <ReportItemModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReportSuccess={handleReportCreated}
      />
    </div>
  );
}
