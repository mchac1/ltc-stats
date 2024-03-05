<template>
    <div class="autocomplete">
        <div class="input-group mb-4 mt-2">
            <input
                type="text"
                class="form-control"
                placeholder="Enter a member name"
                @input="onChange"
                v-model="search"
                @keydown.down="onArrowDown"
                @keydown.up="onArrowUp"
                @keydown.enter="onEnter"
            />
            <button type="button" class="btn btn-info" @click="onButtonClick">Go</button>
        </div>
      <ul
        id="autocomplete-results"
        v-show="isOpen"
        class="autocomplete-results"
      >
        <li
          class="loading"
          v-if="isLoading"
        >
          Loading results...
        </li>
        <li
          v-else
          v-for="(result, i) in results"
          :key="i"
          @click="setResult(result)"
          class="autocomplete-result"
          :class="{ 'is-active': i === arrowCounter }"
        >
          {{ result }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
    export default {
      name: 'SearchAutocomplete',
      props: {
        items: {
          type: Array,
          required: false,
          default: () => [],
        },
        isAsync: {
          type: Boolean,
          required: false,
          default: false,
        },
      },
      data() {
        return {
          isOpen: false,
          results: [],
          search: '',
          isLoading: false,
          arrowCounter: -1,
        };
      },
      watch: {
        items: function (value, oldValue) {
          if (value.length !== oldValue.length) {
            this.results = value;
            this.isLoading = false;
          }
        },
      },
      mounted() {
        document.addEventListener('click', this.handleClickOutside)
      },
      destroyed() {
        document.removeEventListener('click', this.handleClickOutside)
      },
      methods: {
        setResult(result) {
          this.search = result;
          this.isOpen = false;
          this.$emit('selectedMember', this.search);
        },
        filterResults() {
          this.results = this.items.filter((item) => {
            return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
          });
        },
        onChange() {
          this.$emit('input', this.search);
  
          if (this.isAsync) {
            this.isLoading = true;
          } else {
            this.filterResults();
            this.isOpen = true;
          }
        },
        handleClickOutside(event) {
          if (!this.$el.contains(event.target)) {
            this.isOpen = false;
            this.arrowCounter = -1;
          }
        },
        onArrowDown() {
          if (this.arrowCounter < this.results.length) {
            this.arrowCounter = this.arrowCounter + 1;
          }
        },
        onArrowUp() {
          if (this.arrowCounter > 0) {
            this.arrowCounter = this.arrowCounter - 1;
          }
        },
        onEnter() {
          this.search = this.results[this.arrowCounter];
          this.isOpen = false;
          this.arrowCounter = -1;
          this.$emit('selectedMember', this.search);
        },
        onButtonClick() {
            this.isOpen = false;
            this.$emit('selectedMember', this.search);
        },
      },
    };
  </script>
  
  <style>
    .autocomplete {
      position: relative;
    }
  
    .autocomplete-results {
      padding: 0;
      margin: 0;
      border: 1px solid #eeeeee;
      height: 120px;
      overflow: auto;
    }
  
    .autocomplete-result {
      list-style: none;
      text-align: left;
      padding: 4px 2px;
      cursor: pointer;
    }
  
    .autocomplete-result.is-active,
    .autocomplete-result:hover {
      background-color: #4AAE9B;
      color: white;
    }
  </style>