import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  selectedBloodGroup: string;
  searchLocation: string;
  searchQuery: string;
  onlyAvailable: boolean;
  isSearching: boolean;
}

const initialState: FilterState = {
  selectedBloodGroup: "সব গ্রুপ",
  searchLocation: "",
  searchQuery: "",
  onlyAvailable: false,
  isSearching: false,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSelectedBloodGroup: (state, action: PayloadAction<string>) => {
      state.selectedBloodGroup = action.payload;
    },
    setSearchLocation: (state, action: PayloadAction<string>) => {
      state.searchLocation = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setOnlyAvailable: (state, action: PayloadAction<boolean>) => {
      state.onlyAvailable = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    resetFilter: (state) => {
      state.selectedBloodGroup = "সব গ্রুপ";
      state.searchLocation = "";
      state.searchQuery = "";
      state.onlyAvailable = false;
      state.isSearching = false;
    },
  },
});

export const {
  setSelectedBloodGroup,
  setSearchLocation,
  setSearchQuery,
  setOnlyAvailable,
  setIsSearching,
  resetFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
