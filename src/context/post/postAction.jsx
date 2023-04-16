import React, { useReducer } from "react";
import PostReducer from "./postReducer";
import PostContext from "./postContext";
import axios from "axios";

function PostAction(props) {
  const postInitialState = {
    posts: [],
    error: [],
    currentPost: { name: "cycling" },
    selectedPost: [],
    selectedDate: new Date().toDateString(),
    loading: false,
  };
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [postState, dispatch] = useReducer(PostReducer, postInitialState);

  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  // add post
  const addPost = async (post) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    };

    try {
      setLoading();
      const res = await axios.post(
        `http://localhost:4500/${username}/addpost`,
        post,
        config
      );
      console.log(res);
      dispatch({
        type: "ADD_POST",
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "POST_ERROR",
        payload: error.response.data,
      });
    }
  };

  //get posts
  const getPosts = async (username,token) => {
    try {
      setLoading();
      const config = {
        headers: {
          token: token,
        },
      };
      const res = await axios.get(
        `http://localhost:4500/${username}/home`,
        config
      );

      dispatch({
        type: "GET_POSTS",
        payload: [...res.data.post],
      });
    } catch (error) {
      dispatch({
        type: "POST_ERROR",
        payload: error.response.data,
      });
    }
  };

  //update post
  const updatePost = async (post) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "token":token
      },
    };

    try {
      setLoading();
      const res = await axios.put(
        `http://localhost:4500/${username}/updatepost/${post._id}`,
        post,
        config
      );
      dispatch({
        type: "UPDATE_POST",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "POST_ERROR",
        payload: error.response.data,
      });
    }
  };

  //SET current post
  const setCurrentPost = (post) => {
    dispatch({ type: "SET_CURRENT", payload: post });
  };

  // delete post
  const deletePost = async (id) => {
    const config = {
      headers: {
        token: token,
      },
    };

    try {
      setLoading();
      await axios.delete(
        `http://localhost:4500/${username}/deletepost/${id}`,
        config
      );

      dispatch({
        type: "DELETE_POST",
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: "POST_ERROR",
        payload: error.response.data,
      });
    }
  };

  // set selected
  const setSelectedPost = (post) => {
    dispatch({ type: "SET_SELECTED_POST", payload: post });
  };

  //   //clear selected
  //   const clearSelected = () => {
  //     dispatch({ type: "CLEAR_SELECTED" });
  //   };

  // set selected
  const setSelectedDate = (date) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
  };

  return (
    <PostContext.Provider
      value={{
        posts: postState.posts,
        error: postState.error,
        currentPost: postState.currentPost,
        selectedPost: postState.selectedPost,
        loading: postState.loading,
        selectedDate: postState.selectedDate,
        setLoading,
        getPosts,
        addPost,
        setCurrentPost,
        setSelectedDate,
        setSelectedPost,
        deletePost,
        updatePost,
      }}
    >
      {props.children}
    </PostContext.Provider>
  );
}

export default PostAction;