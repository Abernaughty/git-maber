<script>
  import { onMount } from 'svelte';
  import { setList } from './data/setList';
  import { API_CONFIG } from './data/apiConfig';
  import { pokeDataService } from './services/pokeDataService';
  import { dbService } from './services/storage/db';
  import SearchableSelect from './components/SearchableSelect.svelte';
  import CardVariantSelector from './components/CardVariantSelector.svelte';
  
  // Function to clear the cache (for testing)
  async function clearCache() {
    try {
      await dbService.clearAllData();
      alert('Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Error clearing cache: ' + error.message);
    }
  }

  let selectedSet = null;
  let cardName = '';
  let priceData = null;
  let isLoading = false;
  let error = null;
  let availableSets = [];
  
  // Variables for handling card variants
  let cardVariants = [];
  let showVariantSelector = false;
  let selectedVariant = null;

  // Handle set selection
  function handleSetSelect(event) {
    selectedSet = event.detail;
  }
  
  // Functions for handling variant selection
  function handleVariantSelect(event) {
    selectedVariant = event.detail;
  }
  
  function handleVariantConfirm(event) {
    selectedVariant = event.detail;
    loadPricingForVariant(selectedVariant);
  }
  
  function closeVariantSelector() {
    showVariantSelector = false;
  }
  
  // Load pricing data for a specific variant
  async function loadPricingForVariant(variant) {
    try {
      if (!variant || !variant.id) {
        throw new Error('Invalid card variant');
      }
      
      isLoading = true;
      error = null;
      
      // Get pricing data for the selected variant
      priceData = await pokeDataService.getCardPricing(variant.id);
      isLoading = false;
    } catch (err) {
      console.error('Error loading pricing for variant:', err);
      error = err.message;
      isLoading = false;
      
      // For development: Use mock data if API fails
      try {
        console.log('Attempting to load mock data for variant...');
        priceData = await pokeDataService.loadMockData(selectedSet.name, cardName);
        if (variant) {
          // Update mock data to match the selected variant
          priceData.name = variant.name;
          priceData.num = variant.num;
          if (variant.rarity) {
            priceData.rarity = variant.rarity;
          }
        }
        error = "Using mock data (API unavailable). This is for demonstration purposes only.";
      } catch (mockErr) {
        console.error('Failed to load mock data:', mockErr);
      }
    }
  }

  async function fetchCardPrice() {
    if (!selectedSet) {
      error = "Please select a set";
      return;
    }
    if (!cardName) {
      error = "Please enter a card name";
      return;
    }
    
    isLoading = true;
    error = null;
    cardVariants = [];
    showVariantSelector = false;
    selectedVariant = null;
    
    try {
      // Search for cards by name, using caching for the selected set
      const searchData = await pokeDataService.searchCards(cardName, selectedSet.code);
      
      // Find all cards in the specified set that match the name
      const matchingCards = pokeDataService.findCardsInSet(searchData, selectedSet.name);
      
      if (matchingCards.length === 0) {
        throw new Error('Card not found in the specified set');
      }
      
      if (matchingCards.length === 1) {
        // If only one card is found, load its pricing directly
        selectedVariant = matchingCards[0];
        priceData = await pokeDataService.getCardPricing(selectedVariant.id);
      } else {
        // If multiple cards are found, show the variant selector
        cardVariants = matchingCards;
        showVariantSelector = true;
        priceData = null; // Clear any existing pricing data
      }
    } catch (err) {
      console.error('API Error:', err);
      error = err.message;
      
      // For development: Use mock data if API fails
      try {
        console.log('Attempting to load mock data...');
        priceData = await pokeDataService.loadMockData(selectedSet.name, cardName);
        error = "Using mock data (API unavailable). This is for demonstration purposes only.";
      } catch (mockErr) {
        console.error('Failed to load mock data:', mockErr);
      }
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    try {
      // Get the set list with caching
      const sets = await pokeDataService.getSetList();
      availableSets = sets;
    } catch (error) {
      console.error('Error loading set list:', error);
      // Fallback to imported data
      availableSets = setList;
    }
  });
</script>

<main>
  <header>
    <h1>Pokémon Card Price Checker</h1>
  </header>
  <div class="form-container">
    <div class="form-group">
      <label for="setSelect">Select Set:</label>
      <SearchableSelect
        items={availableSets}
        labelField="name"
        secondaryField="code"
        placeholder="Search for a set..."
        bind:value={selectedSet}
        on:select={handleSetSelect}
      />
    </div>

    <div class="form-group">
      <label for="cardName">Card Name:</label>
      <input id="cardName" bind:value={cardName} placeholder="e.g., Charizard">
    </div>

    <button on:click={fetchCardPrice} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Get Price'}
    </button>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    {#if priceData}
      <div class="results">
        <h2>{priceData.name}</h2>
        <p><strong>Set:</strong> {priceData.set_name}</p>
        <p><strong>Number:</strong> {priceData.num}</p>
        {#if priceData.rarity}
          <p><strong>Rarity:</strong> {priceData.rarity}</p>
        {/if}
        <h3>Prices:</h3>
        <ul>
          {#each Object.entries(priceData.pricing) as [market, price]}
            <li><span class="market">{market}:</span> <span class="price">${price.value}</span> <span class="currency">{price.currency}</span></li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
  
  <div class="admin-tools">
    <button class="secondary-button" on:click={clearCache}>Clear Cache</button>
  </div>
  
  <!-- Card Variant Selector Modal -->
  <CardVariantSelector
    variants={cardVariants}
    isVisible={showVariantSelector}
    on:select={handleVariantSelect}
    on:confirm={handleVariantConfirm}
    on:close={closeVariantSelector}
  />
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }
  
  header {
    background-color: #3c5aa6; /* Pokemon blue */
    padding: 1rem;
    border-radius: 8px 8px 0 0;
    margin-bottom: 1.5rem;
  }
  
  h1 {
    color: white;
    font-size: 1.8rem;
    margin: 0;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .form-container {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(5px);
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group:last-of-type {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 0.6rem 0.75rem;
    margin-bottom: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #3c5aa6;
    box-shadow: 0 0 0 2px rgba(60, 90, 166, 0.2);
  }
  
  button {
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: #ee1515; /* Pokemon red */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #cc0000;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .admin-tools {
    margin-top: 1rem;
    text-align: center;
  }
  
  .secondary-button {
    width: auto;
    background-color: #6c757d;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
  
  .secondary-button:hover {
    background-color: #5a6268;
  }
  
  .error {
    color: #ee1515;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(238, 21, 21, 0.1);
    border-radius: 4px;
    text-align: center;
  }
  
  .results {
    margin-top: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background-color: rgba(249, 249, 249, 0.9);
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .results h2 {
    color: #3c5aa6;
    margin-top: 0;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
  }
  
  .results h3 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #ee1515;
  }
  
  .results ul {
    list-style-type: none;
    padding: 0;
  }
  
  .results li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .results li:last-child {
    border-bottom: none;
  }
  
  .market {
    font-weight: 600;
    text-transform: capitalize;
  }
  
  .price {
    font-weight: 700;
    color: #ee1515;
  }
  
  .currency {
    color: #666;
    font-size: 0.9rem;
  }
  
  /* Responsive adjustments */
  @media (max-width: 600px) {
    main {
      padding: 0.5rem;
    }
    
    .form-container {
      padding: 1rem;
    }
    
    h1 {
      font-size: 1.5rem;
    }
  }
</style>