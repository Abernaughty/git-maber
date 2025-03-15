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
  
  const dispatch = createEventDispatcher();
  
  // Update filtered items when search text changes
  $: {
    console.log(`Filtering data. Items: ${items.length}, Search text: '${searchText}'`);
    
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
    console.log('Input focused, opening dropdown');
    isFocused = true;
  }
  
  function closeDropdown() {
    console.log('Explicitly closing dropdown');
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
  
  // Handle item selection with explicit steps
  async function handleItemSelect(item) {
    if (!item) return;
    
    console.log('Item selected:', item);
    
    // Update the value and search text
    value = item;
    searchText = getDisplayText(item);
    
    // Explicitly close the dropdown
    closeDropdown();
    
    // Make sure the state is updated before dispatching the event
    await tick();
    
    // Dispatch the select event after state is updated
    dispatch('select', item);
    
    // Force focus out of the input field
    if (inputElement) {
      inputElement.blur();
    }
    
    console.log('Selection complete, dropdown state:', isFocused);
  }
  
  function getDisplayText(item) {
    if (!item) return '';
    if (secondaryField && item[secondaryField]) {
      return `${item[labelField]} (${item[secondaryField]})`;
    }
    return item[labelField];
  }
  
  // Initialize search text based on value
  $: {
    if (value && !searchText) {
      searchText = getDisplayText(value);
    } else if (!value && searchText && !isFocused) {
      searchText = '';
    }
  }
  
  // Add document click handler to close dropdown when clicking outside
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
          <!-- Use button instead of div for better accessibility and event handling -->
          <button 
            type="button"
            class="item item-{index} {highlightedIndex === index ? 'highlighted' : ''}"
            on:click|preventDefault|stopPropagation={() => handleItemSelect(item)}
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