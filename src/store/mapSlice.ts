
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import fallbackData from '@/data/dhaka_heat_data.json';

export interface Thana {
  name_en: string;
  name_bn: string;
  lat: number;
  lon: number;
  nasa_data: {
    lst_celsius: number;
    ndvi: number;
    data_source: string;
  };
  heat_analysis: {
    level: string;
    label_bn: string;
    color?: string;
    weather_message?: string;
  };
  green_analysis: {
    level: string;
    label_bn: string;
    percentage: number;
    trend?: {
      years: (string | number)[];
      values: number[];
    };
  };
  opportunity: {
    score: number;
    label_bn: string;
    is_zone: boolean;
    recommendations?: Array<{
      title: string;
      desc: string;
      icon: string;
    }>;
  };
  rooftop_impact?: {
    temp_reduction_celsius: number;
    carbon_offset_kg_year: number;
    neighborhood_impact_bn?: string;
  };
  trend?: {
    years: (string | number)[];
    lst_values: number[];
  };
  heat_rank?: number;
}

export interface MapState {
  selectedThana: Thana | null;
  mode: 'heat' | 'green';
  viewMode: 'whole' | 'area';
  thanas: Thana[];
  summary: {
    avgTemp: number;
    avgGreen: number;
    last_updated?: string;
    observation_date?: string;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  summaryData: {
    avgTemp: number;
    avgGreen: number;
    totalArea: string;
    last_updated?: string;
    observation_date?: string;
  };
}

export const fetchMapData = createAsyncThunk('map/fetchData', async (refresh: boolean | void) => {
  const isRefresh = typeof refresh === 'boolean' ? refresh : false;
  const res = await fetch(`/api/nasa-data${isRefresh ? '?refresh=true' : ''}`);
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();
  return data.data || data; 
});

const initialState: MapState = {
  selectedThana: null,
  mode: 'heat', // 'heat' or 'green'
  viewMode: 'whole', // 'whole' or 'area'
  thanas: Object.values(fallbackData.thanas),
  summary: { avgTemp: 33.4, avgGreen: 18.2, last_updated: "", observation_date: "" },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  summaryData: {
    avgTemp: 33.5,
    avgGreen: 18.2,
    totalArea: '306.4 sq km',
    last_updated: "",
    observation_date: ""
  }
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectedThana: (state, action: PayloadAction<Thana | null>) => {
      state.selectedThana = action.payload;
      state.viewMode = action.payload ? 'area' : 'whole';
    },
    setMode: (state, action: PayloadAction<'heat' | 'green'>) => {
      state.mode = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'whole' | 'area'>) => {
      state.viewMode = action.payload;
      if (action.payload === 'whole') {
        state.selectedThana = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMapData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.thanas) {
          state.thanas = Object.values(action.payload.thanas);
        }
        if (action.payload && action.payload.summary) {
          state.summary = action.payload.summary;
          state.summaryData = action.payload.summary;
        }
      })
      .addCase(fetchMapData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSelectedThana, setMode, setViewMode } = mapSlice.actions;
export default mapSlice.reducer;
