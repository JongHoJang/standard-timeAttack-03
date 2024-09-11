import axios from "axios";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function App() {
  const queryClient = useQueryClient();

  const [newPost, setNewPost] = useState({
    title: "",
    views: "",
  });

  const fetchPosts = async () => {
    const response = await axios.get("http://localhost:4000/posts");
    console.log(response.data);
    return response.data;
  };

  const FetchProfile = async () => {
    const response = await axios.get("http://localhost:4000/profile");
    console.log(response.data);
    return response.data;
  };

  const FetchComments = async () => {
    const response = await axios.get("http://localhost:4000/comments");
    console.log(response.data);
    return response.data;
  };

  const addPost = async (newAddPost) => {
    await axios.post("http://localhost:4000/posts", newAddPost);
  };

  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const {
    data: profile,
    isPendingProfile,
    isErrorsProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: FetchProfile,
  });

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: FetchComments,
  });

  const { mutate } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (isPending) {
    return <div>로딩중입니다</div>;
  }
  if (isPendingProfile) {
    return <div>로딩중입니다</div>;
  }

  if (isError) {
    return <div>에러입니다</div>;
  }
  if (isErrorsProfile) {
    return <div>에러입니다</div>;
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    mutate({ title: newPost.title, views: newPost.views });
  };

  return (
    <>
      <h2>"{profile.name}" 프로필 이름</h2>
      <form onSubmit={onSubmitForm}>
        <input
          value={newPost.title}
          onChange={(e) => {
            setNewPost({ ...newPost, title: e.target.value });
          }}
        ></input>

        <input
          value={newPost.views}
          onChange={(e) => {
            setNewPost({ ...newPost, views: e.target.value });
          }}
        ></input>

        <button>추가</button>
      </form>

      <div>
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <span>{post.title}</span>
              <span>{post.views}</span>
              <button>댓글보기</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
