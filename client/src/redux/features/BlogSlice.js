import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Config from "../../components/Config";

const initialState = {
  isLoading: false,
  blogs: "",
  currentBlog: "",
  updatedBlog: "",
  isError: false,
};

export const createBlog = createAsyncThunk("createBlog", async (postData) => {
  try {
    const { formData, loginToken } = postData;
    const blogs = await Config.post("/createblog", formData, {
      headers: {
        Authorization: loginToken,
        "Content-Type": "multipart/form-data",
      },
    });
    return blogs;
  } catch (error) {
    throw error.response.data.message;
  }
});

export const fetchAllBlog = createAsyncThunk(
  "fetchAllBlog",
  async (search = "") => {
    try {
      const { data } = await Config.get(`/?search=${search}`);
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

export const fetchBlogById = createAsyncThunk("fetchBlogById", async (id) => {
  try {
    const { data } = await Config.get(`${id}`);
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

export const deleteBlog = createAsyncThunk("deleteBlog", async (options) => {
  try {
    const { bearerToken, id } = options;

    const response = await Config.delete(`${id}`, {
      headers: {
        Authorization: bearerToken,
      },
    });
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
});

export const updateBlog = createAsyncThunk("updateBlog", async (postData) => {
  try {
    console.log("Post data:", postData);
    const { formDataUpdated, loginToken, id } = postData;
    const updatedblog = await Config.put(`/updateBlog/${id}`, formDataUpdated, {
      headers: {
        Authorization: loginToken,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("updated Blog:", updatedblog);
    return updatedblog;
  } catch (error) {
    throw error.response.data.message;
  }
});

const BlogSlice = createSlice({
  name: "Blog",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(createBlog.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createBlog.fulfilled, (state, action) => {
      (state.isLoading = false), (state.data = action.payload);
    });
    builder.addCase(createBlog.rejected, (state, action) => {
      state.isLoading = true;
      state.isError = action.error.message;
    });
    builder.addCase(fetchAllBlog.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllBlog.fulfilled, (state, action) => {
      (state.isLoading = false), (state.blogs = action.payload);
    });
    builder.addCase(fetchAllBlog.rejected, (state, action) => {
      state.isLoading = true;
      state.isError = action.error.message;
    });
    builder.addCase(fetchBlogById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBlogById.fulfilled, (state, action) => {
      (state.isLoading = false), (state.currentBlog = action.payload);
    });
    builder.addCase(fetchBlogById.rejected, (state, action) => {
      state.isLoading = true;
      state.isError = action.error.message;
    });
    builder.addCase(deleteBlog.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteBlog.fulfilled, (state, action) => {
      (state.isLoading = false), (state.currentBlog = action.payload);
    });
    builder.addCase(deleteBlog.rejected, (state, action) => {
      state.isLoading = true;
      state.isError = action.error.message;
    });
    builder.addCase(updateBlog.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateBlog.fulfilled, (state, action) => {
      (state.isLoading = false), (state.blogs = action.payload);
      console.log("action update payload", action.payload);
    });
    builder.addCase(updateBlog.rejected, (state, action) => {
      state.isLoading = true;
      state.isError = action.error.message;
    });
  },
});

export default BlogSlice.reducer;
