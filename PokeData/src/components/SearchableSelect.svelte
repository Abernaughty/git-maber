<script>
  import { createEventDispatcher } from 'svelte';
  
  // Props
  export let items = [];
  export let placeholder = 'Search...';
  export let labelField = 'name';
  export let valueField = 'id';
  export let secondaryField = null;
  export let value = null;
  
  // State
  let searchText = '';
  let isFocused = false;
  let filteredItems = [];
  let highlightedIndex = -1;
  let inputElement;
  let dropdownElement;
  
  const dispatch = createEventDispatcher();
  
  // Update filtered items when search text changes
  $: {
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredItems = items.filter(item => {
        const primaryMatch = item[labelField].toLowerCase().includes(searchLower);
        const secondaryMatch = secondaryField && item[secondaryField].toLowerCase().includes(searchLower);
        return primaryMatch || secondaryMatch;
      });
    } else {
      filteredItems = [...items];
    }
    
    // Reset highlighted index when filtered items change
    highlightedIndex = -1;
  }
  
  // Functions
  function handleFocus() {
    isFocused = true;
  }
  
  function handleBlur(event) {
    // Short delay to allow click to register on dropdown items
    setTimeout(() => {
      // Don't blur if clicking inside the dropdown
      if (dropdownElement && dropdownElement.contains(event.relatedTarget)) {
        return;
      }
      isFocused = false;
    }, 100);
  }
  
  function handleKeydown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, filteredItems.length - 1);
        scrollToHighlighted();
        break;
      case 'ArrowUp':
        event.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, -1);
        scrollToHighlighted();
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          selectItem(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        inputElement.blur();
        isFocused = false;
        break;
    }
  }
  
  function scrollToHighlighted() {
    if (highlightedIndex >= 0 && dropdownElement) {
      const highlightedEl = dropdownElement.querySelector(`.item-${highlightedIndex}`);
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }
  
  function selectItem(item) {
    value = item;
    searchText = item ? getDisplayText(item) : '';
    isFocused = false;
    dispatch('select', item);
  }
  
  function getDisplayText(item) {
    if (!item) return '';
    if (secondaryField) {
      return `${item[labelField]} (${item[secondaryField]})`;
    }
    return item[labelField];
  }
  
  // Initialize search text based on value
  $: {
    if (value && !searchText) {
      searchText = getDisplayText(value);
    } else if (!value && searchText) {
      // Reset search text if value is cleared externally
      searchText = '';
    }
  }
</script>

<div class="searchable-select">
  <div class="input-container">
    <input
      bind:this={inputElement}
      type="text"
      value={searchText}
      on:input={(e) => searchText = e.target.value}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeydown}
      placeholder={placeholder}
      autocomplete="off"
    />
    <div class="icon">
      {#if isFocused}
        <span>▲</span>
      {:else}
        <span>▼</span>
      {/if}
    </div>
  </div>
  
  {#if isFocused}
    <div class="dropdown" bind:this={dropdownElement}>
      {#if filteredItems.length === 0}
        <div class="no-results">No matches found</div>
      {:else}
        {#each filteredItems as item, index}
          <div 
            class="item item-{index} {highlightedIndex === index ? 'highlighted' : ''}"
            on:mousedown={() => selectItem(item)}
            on:mouseover={() => highlightedIndex = index}
          >
            {getDisplayText(item)}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .searchable-select {
    position: relative;
    width: 100%;
  }
  
  .input-container {
    position: relative;
    width: 100%;
  }
  
  input {
    width: 100%;
    padding: 0.6rem 0.75rem;
    padding-right: 2rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  input:focus {
    outline: none;
    border-color: #3c5aa6;
    box-shadow: 0 0 0 2px rgba(60, 90, 166, 0.2);
  }
  
  .icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none;
  }
  
  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px 4px;
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: -1px;
  }
  
  .item {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .item:last-child {
    border-bottom: none;
  }
  
  .item:hover, .highlighted {
    background-color: #f0f0f0;
  }
  
  .no-results {
    padding: 0.5rem 0.75rem;
    color: #666;
    font-style: italic;
  }
</style>