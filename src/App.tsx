import { useState, useEffect } from "react";
import "./App.css";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

interface FavoritePokemon extends Pokemon {
  dateAdded: string;
  notes: string;
  tag: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingPokemon, setEditingPokemon] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("pokemonFavorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error parsing saved favorites:", error);
        localStorage.removeItem("pokemonFavorites");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever favorites change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const searchPokemon = async () => {
    if (!searchTerm.trim()) return;

    if (!isOnline) {
      setError("You're offline! Reconnect to start searching..");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );
      
      if (!response.ok) {
        throw new Error("Pokemon not found!");
      }

      const data = await response.json();
      setSearchResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred...");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (pokemon: Pokemon) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === pokemon.id);
    
    if (!isAlreadyFavorite) {
      const favoritePokemon: FavoritePokemon = {
        ...pokemon,
        dateAdded: new Date().toISOString(),
        notes: "",
        tag: ""
      };
      setFavorites(prev => [...prev, favoritePokemon]);
    }
  };

  const removeFromFavorites = (pokemonId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== pokemonId));
  };

  const isFavorite = (pokemonId: number) => {
    return favorites.some(fav => fav.id === pokemonId);
  };

  const startEditing = (pokemon: FavoritePokemon) => {
    setEditingPokemon(pokemon.id);
    setEditNotes(pokemon.notes);
  };

  const saveEdit = () => {
    if (editingPokemon) {
      setFavorites(prev => prev.map(fav => 
        fav.id === editingPokemon 
          ? { ...fav, notes: editNotes }
          : fav
      ));
      setEditingPokemon(null);
      setEditNotes("");
    }
  };

  const cancelEdit = () => {
    setEditingPokemon(null);
    setEditNotes("");
  };

  const updateTag = (pokemonId: number, newTag: string) => {
    setFavorites(prev => prev.map(fav => 
      fav.id === pokemonId 
        ? { ...fav, tag: newTag }
        : fav
    ));
  };

  const toggleCompareSelection = (pokemonId: number) => {
    setSelectedForCompare(prev => {
      if (prev.includes(pokemonId)) {
        return prev.filter(id => id !== pokemonId);
      } else if (prev.length < 2) {
        return [...prev, pokemonId];
      }
      return prev;
    });
  };

  const getGeneration = (id: number) => {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9;
  };

  const getSelectedPokemon = () => {
    return selectedForCompare.map(id => 
      favorites.find(fav => fav.id === id)
    ).filter(Boolean) as FavoritePokemon[];
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokédex Challenge!</h1>
        <p>Which Pokémon would you like to learn about?</p>
        {!isOnline && (
          <div className="offline-indicator">
            📱 You're offline - Favourites are still available!
          </div>
        )}
      </header>

      <main className="app-main">
        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Pokémon name..."
              className="search-input"
              onKeyPress={(e) => e.key === "Enter" && searchPokemon()}
            />
            <button 
              onClick={searchPokemon} 
              disabled={loading || !searchTerm.trim()}
              className="search-button"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {searchResult && (
            <div className="pokemon-card">
              <div className="pokemon-info">
                <img 
                  src={searchResult.sprites.front_default} 
                  alt={searchResult.name}
                  className="pokemon-image"
                />
                <div className="pokemon-details">
                  <h2 className="pokemon-name">
                    {searchResult.name.charAt(0).toUpperCase() + searchResult.name.slice(1)}
                  </h2>
                  <div className="pokemon-types">
                    {searchResult.types.map((type, index) => (
                      <span 
                        key={index} 
                        className={`type-badge type-${type.type.name}`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => addToFavorites(searchResult)}
                disabled={isFavorite(searchResult.id)}
                className={`favorite-button ${isFavorite(searchResult.id) ? 'favorited' : ''}`}
              >
                {isFavorite(searchResult.id) ? "★ Saved" : "☆ Save to Favorites"}
              </button>
            </div>
          )}
        </section>

        {/* Favorites Section */}
        <section className="favorites-section">
          <div className="favorites-header">
            <h2>Fav Pokémon! ({favorites.length})</h2>
            {favorites.length >= 2 && (
              <div className="compare-controls">
                <button
                  onClick={() => setShowCompare(!showCompare)}
                  className={`compare-toggle ${showCompare ? 'active' : ''}`}
                >
                  {showCompare ? 'Exit Compare' : 'Compare Pokémon'}
                </button>
                {showCompare && (
                  <div className="compare-info">
                    Select 2 Pokémon to compare their stats
                  </div>
                )}
              </div>
            )}
          </div>
          {favorites.length === 0 ? (
            <p className="no-favorites">No favorites yet. Search for Pokémon to add them!</p>
          ) : (
            <div className="favorites-grid">
              {favorites.map((pokemon) => (
                <div 
                  key={pokemon.id} 
                  className={`favorite-card ${showCompare ? 'compare-mode' : ''} ${selectedForCompare.includes(pokemon.id) ? 'selected' : ''}`}
                  onClick={showCompare ? () => toggleCompareSelection(pokemon.id) : undefined}
                  style={{ cursor: showCompare ? 'pointer' : 'default' }}
                >
                  {showCompare && (
                    <div className="compare-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedForCompare.includes(pokemon.id)}
                        onChange={() => toggleCompareSelection(pokemon.id)}
                        className="compare-check"
                      />
                      <span className="checkmark"></span>
                    </div>
                  )}
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={pokemon.name}
                    className="favorite-image"
                  />
                    <div className="favorite-details">
                      <h3 className="favorite-name">
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                      </h3>
                      <div className="favorite-types">
                        {pokemon.types.map((type, index) => (
                          <span 
                            key={index} 
                            className={`type-badge type-${type.type.name}`}
                          >
                            {type.type.name}
                          </span>
                        ))}
                      </div>
                      
                      {editingPokemon === pokemon.id ? (
                        <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                          <div className="form-group">
                            <label htmlFor={`notes-${pokemon.id}`}>Notes:</label>
                            <textarea
                              id={`notes-${pokemon.id}`}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Add your notes here..."
                              className="notes-input"
                              rows={3}
                            />
                          </div>
                          <div className="edit-buttons">
                            <button onClick={saveEdit} className="save-button">Save</button>
                            <button onClick={cancelEdit} className="cancel-button">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="pokemon-info" onClick={(e) => e.stopPropagation()}>
                          {pokemon.notes && (
                            <div className="pokemon-notes">
                              <strong>Notes:</strong> {pokemon.notes}
                            </div>
                          )}
                          <div className="pokemon-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => startEditing(pokemon)}
                              className="edit-button"
                            >
                              {pokemon.notes ? "Edit Notes" : "Add Notes"}
                            </button>
                            <div className="action-row">
                              <button
                                onClick={() => removeFromFavorites(pokemon.id)}
                                className="remove-button"
                              >
                                Remove
                              </button>
                              <select
                                value={pokemon.tag}
                                onChange={(e) => updateTag(pokemon.id, e.target.value)}
                                className="tag-select"
                              >
                                <option value="">Select Tag</option>
                                <option value="Caught">Caught</option>
                                <option value="Not Found">Not Found</option>
                                <option value="~Shiny!~">~Shiny!~</option>
                                <option value="Battle Team">Battle Team</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Comparison Section */}
        {showCompare && selectedForCompare.length === 2 && (
          <section className="comparison-section">
            <h2>Pokémon Comparison</h2>
            <div className="comparison-container">
              {getSelectedPokemon().map((pokemon) => (
                <div key={pokemon.id} className="comparison-card">
                  <div className="comparison-header">
                    <img 
                      src={pokemon.sprites.front_default} 
                      alt={pokemon.name}
                      className="comparison-image"
                    />
                    <h3 className="comparison-name">
                      {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </h3>
                    <div className="comparison-types">
                      {pokemon.types.map((type, typeIndex) => (
                        <span 
                          key={typeIndex} 
                          className={`type-badge type-${type.type.name}`}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="comparison-stats">
                    <div className="stat-row">
                      <span className="stat-label">ID Number:</span>
                      <span className="stat-value">#{pokemon.id}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Generation:</span>
                      <span className="stat-value">Gen {getGeneration(pokemon.id)}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Height:</span>
                      <span className="stat-value">{(pokemon.height / 10).toFixed(1)}m</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Weight:</span>
                      <span className="stat-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="comparison-summary">
              <h3>Comparison Summary</h3>
              {getSelectedPokemon().length === 2 && (
                <div className="summary-stats">
                  <div className="summary-item">
                    <strong>ID Difference:</strong> {Math.abs(getSelectedPokemon()[0].id - getSelectedPokemon()[1].id)}
                  </div>
                  <div className="summary-item">
                    <strong>Generation:</strong> {getSelectedPokemon()[0].id < getSelectedPokemon()[1].id ? 
                      `${getSelectedPokemon()[0].name.charAt(0).toUpperCase() + getSelectedPokemon()[0].name.slice(1)} is older!` : 
                      `${getSelectedPokemon()[1].name.charAt(0).toUpperCase() + getSelectedPokemon()[1].name.slice(1)} is older!`}
                  </div>
                  <div className="summary-item">
                    <strong>Height:</strong> {getSelectedPokemon()[0].height > getSelectedPokemon()[1].height ? 
                      `${getSelectedPokemon()[0].name.charAt(0).toUpperCase() + getSelectedPokemon()[0].name.slice(1)} is taller!` : 
                      `${getSelectedPokemon()[1].name.charAt(0).toUpperCase() + getSelectedPokemon()[1].name.slice(1)} is taller!`}
                  </div>
                  <div className="summary-item">
                    <strong>Weight:</strong> {getSelectedPokemon()[0].weight > getSelectedPokemon()[1].weight ? 
                      `${getSelectedPokemon()[0].name.charAt(0).toUpperCase() + getSelectedPokemon()[0].name.slice(1)} is heavier!` : 
                      `${getSelectedPokemon()[1].name.charAt(0).toUpperCase() + getSelectedPokemon()[1].name.slice(1)} is heavier!`}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
