<script>
  import { createEventDispatcher, onMount, tick } from 'svelte';
  
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
  let componentElement;
  let lastSelectedValue = null;
  
  const dispatch = createEventDispatcher();
  
  // Track value changes
  $: if (value !== lastSelectedValue) {
    lastSelectedValue = value;
    if (value && !inputElement?.matches(':focus')) {
      searchText = getDisplayText(value);
    } else if (!value && !inputElement?.matches(':focus')) {
      searchText = '';
    }
  }
  
  // Update filtered items when search text changes
  $: {
    if (searchText && searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      filteredItems = items.filter(item => {
        if (!item || !item[labelField]) {
          return false;
        }

        const primaryMatch = item[labelField].toLowerCase().includes(searchLower);
        const secondaryMatch = secondaryField && item[secondaryField] && 
                              item[secondaryField].toLowerCase().includes(searchLower);
        
        return primaryMatch || secondaryMatch;
      });
    } else {
      filteredItems = [...items];
    }
    
    highlightedIndex = -1;
  }
  
  // Functions
  function handleFocus() {
    isFocused = true;
  }
  
  function closeDropdown() {
    isFocused = false;
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
          handleItemSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        closeDropdown();
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
  
  function handleItemSelect(item) {
    if (!item) return;
    
    // Update the internal value
    value = item;
    searchText = getDisplayText(item);
    
    // Close dropdown but keep focus in input
    closeDropdown();
    
    // Dispatch the select event
    dispatch('select', item);
  }
  
  function getDisplayText(item) {
    if (!item) return '';
    if (secondaryField && item[secondaryField]) {
      return `${item[labelField]} (${item[secondaryField]})`;
    }
    return item[labelField];
  }
  
  function handleInput() {
    // Show dropdown when typing
    isFocused = true;
    
    // If text changed and doesn't match selected value, clear the value
    if (value && searchText !== getDisplayText(value)) {
      value = null;
      dispatch('select', null);
    }
  }
  
  // Close dropdown when clicking outside
  function handleDocumentClick(event) {
    if (isFocused && componentElement && !componentElement.contains(event.target)) {
      closeDropdown();
    }
  }
  
  onMount(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  });
</script>

<div class="searchable-select" bind:this={componentElement}>
  <div class="input-container">
    <input
      bind:this={inputElement}
      type="text"
      bind:value={searchText}
      on:focus={handleFocus}
      on:click={handleFocus}
      on:keydown={handleKeydown}
      on:input={handleInput}
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
          <button 
            type="button"
            class="item item-{index} {highlightedIndex === index ? 'highlighted' : ''}"
            on:click|preventDefault={() => handleItemSelect(item)}
            on:mouseover={() => highlightedIndex = index}
          >
            {getDisplayText(item)}
          </button>
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
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    background: none;
    border: none;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.15s ease;
    color: #333;
  }
  
  .item:last-child {
    border-bottom: none;
  }
  
  .item:hover, .highlighted {
    background-color: #f0f0f0;
    color: #3c5aa6;
  }
  
  .no-results {
    padding: 0.5rem 0.75rem;
    color: #666;
    font-style: italic;
  }
  
  .dropdown {
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
</style>