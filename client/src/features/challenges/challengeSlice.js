import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import challengeService from "./challengeService";

const initialState = {
    challenges: [],
    streaks: [],
    achievements: [],
    stats: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

// Generate personalized challenges
export const generateChallenges = createAsyncThunk(
    "challenges/generate",
    async ({ expenses, incomes }, thunkAPI) => {
        try {
            return await challengeService.generateChallenges(expenses, incomes);
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to generate challenges";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get user challenges
export const getUserChallenges = createAsyncThunk(
    "challenges/getAll",
    async (_, thunkAPI) => {
        try {
            return await challengeService.getUserChallenges();
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to get challenges";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create challenge
export const createChallenge = createAsyncThunk(
    "challenges/create",
    async (challengeData, thunkAPI) => {
        try {
            return await challengeService.createChallenge(challengeData);
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to create challenge";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update challenge progress
export const updateChallengeProgress = createAsyncThunk(
    "challenges/updateProgress",
    async ({ challengeId, progress }, thunkAPI) => {
        try {
            return await challengeService.updateChallengeProgress(challengeId, progress);
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to update challenge progress";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get user streaks
export const getUserStreaks = createAsyncThunk(
    "challenges/getStreaks",
    async (_, thunkAPI) => {
        try {
            return await challengeService.getUserStreaks();
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to get streaks";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update streaks
export const updateStreaks = createAsyncThunk(
    "challenges/updateStreaks",
    async ({ expenses, incomes }, thunkAPI) => {
        try {
            return await challengeService.updateStreaks(expenses, incomes);
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to update streaks";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get achievements
export const getUserAchievements = createAsyncThunk(
    "challenges/getAchievements",
    async (_, thunkAPI) => {
        try {
            return await challengeService.getUserAchievements();
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to get achievements";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get challenge stats
export const getChallengeStats = createAsyncThunk(
    "challenges/getStats",
    async (_, thunkAPI) => {
        try {
            return await challengeService.getChallengeStats();
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to get challenge stats";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const challengeSlice = createSlice({
    name: "challenges",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
        clearChallenges: (state) => {
            state.challenges = [];
            state.streaks = [];
            state.achievements = [];
            state.stats = {};
        }
    },
    extraReducers: (builder) => {
        builder
            // Generate challenges
            .addCase(generateChallenges.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(generateChallenges.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.challenges = [...state.challenges, ...action.payload.data];
            })
            .addCase(generateChallenges.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get user challenges
            .addCase(getUserChallenges.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserChallenges.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.challenges = action.payload.data;
            })
            .addCase(getUserChallenges.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create challenge
            .addCase(createChallenge.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createChallenge.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.challenges.unshift(action.payload.data);
            })
            .addCase(createChallenge.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update challenge progress
            .addCase(updateChallengeProgress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateChallengeProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.challenges.findIndex(
                    (challenge) => challenge._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.challenges[index] = action.payload.data;
                }
            })
            .addCase(updateChallengeProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get user streaks
            .addCase(getUserStreaks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserStreaks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.streaks = action.payload.data;
            })
            .addCase(getUserStreaks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update streaks
            .addCase(updateStreaks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateStreaks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.streaks = action.payload.data;
            })
            .addCase(updateStreaks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get achievements
            .addCase(getUserAchievements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserAchievements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.achievements = action.payload.data;
            })
            .addCase(getUserAchievements.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get stats
            .addCase(getChallengeStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getChallengeStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = action.payload.data;
            })
            .addCase(getChallengeStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset, clearChallenges } = challengeSlice.actions;
export default challengeSlice.reducer;
