import React, { useState } from "react";
import { AiFillDelete, AiTwotoneLike } from "react-icons/ai";
import moment from "moment";
import { useMutation } from "@apollo/client";
import {
  ADD_COMMENT,
  DELETE_POST,
  LIKE_POST,
} from "../../graphql/mutations/postMutations";
import { GET_POSTS } from "../../graphql/queries/postQueries";
import toast from "react-hot-toast";
import { MdModeComment } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useCurrentState } from "../../state-management/current-user";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

type Props = {
  post: Post;
  user: User;
  refresh: () => Promise<void>;
};

const Post = ({ post, user, refresh }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [body, setBody] = useState<string>("");
  //   const token = useSelector(selectToken)
  const cuser = useCurrentState((state) => state.currentUser);
  const cookie = Cookies.get("userJwt");
  const token = cookie?.substring(1, cookie.length - 1);

  const [likePost] = useMutation(LIKE_POST, {
    variables: {
      id: post._id,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [{ query: GET_POSTS }],
  });

  const [deletePost] = useMutation(DELETE_POST, {
    variables: {
      id: post._id,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      postId: post._id,
      body: body,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
  });

  const handleLike = async () => {
    const refreshToast = toast.loading("Liking the post...");
    try {
      await likePost();
      toast.success("Liked!");
      //   const posts = await getPosts()
      //   setPostsData(posts)
      toast.success("Post Updated", {
        id: refreshToast,
      });
      // window.location.reload()
    } catch (error) {
      toast.error(`${error}`, {
        id: refreshToast,
      });
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost();
      toast.success("Post deleted successfully");
      await refresh();
      // window.location.reload()
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  const handleComment = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      try {
        await addComment();
        toast.success("Comment added successfully");
        await refresh();
        setBody("");
      } catch (error) {
        toast.error(`${error}`);
        console.log(error);
      }
    }
  };

  const isFriend = cuser?.user?.friends?.findIndex(
    (f) => f.userId === user._id
  );
  const isLiked = post.likes.findIndex((f) => f.email === cuser?.user?.email);

  return (
    <div>
      <div className="mb-5 flex h-auto flex-col rounded-md  bg-[#191818] text-white font-Inter shadow-sm lg:w-full">
        <div className="mt-2 flex items-center justify-between px-4 py-2">
          <Link
            to={
              user._id === cuser?.user?._id
                ? `/profile/${cuser?.user?._id}`
                : `/user/${user._id}`
            }
            // className="flex flex-1 p-2"
          >
            <div className="flex items-center space-x-3">
              {user?.profilePic && (
                <img
                  src={user.profilePic}
                  alt=""
                  height={48}
                  width={48}
                  className="rounded-full object-cover"
                />
              )}
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <p className=" cursor-pointer text-base font-semibold">
                    {user.name}
                  </p>

                  <p className="hidden text-xs font-normal text-gray-400 lg:inline">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs font-normal text-gray-600">
                    {moment(post.createdAt).fromNow()}
                  </p>
                  <div className="ml-3">
                    {isFriend !== -1 && <TiTick color="green" />}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          {user._id === cuser?.user?._id && (
            <div>
              <AiFillDelete size={25} className="" onClick={handleDelete} />
            </div>
          )}
        </div>
        {post?.content.length > 200 ? (
          <p className="ml-2 p-2 text-sm font-normal">
            {`${post.content}`.slice(0, 200).concat("...")}
          </p>
        ) : (
          <p className="ml-2 p-2 text-sm font-normal">{post.content}</p>
        )}
        {/* <div className="flex items-center justify-center"> */}
        <Link to={`/post/${post._id}`}>
          {post.image && (
            <img
              src={post.image}
              alt=""
              className="w-full py-3"
              width="550"
              height="500"
            />
          )}
        </Link>
        {/* </div> */}
        <div className="">
          <div className="flex items-center justify-between p-4">
            <p className="text-md font-sm font-Intertext-gray-500">
              {post.likes.length > 1
                ? `${post.likes.length} likes`
                : `${post.likes.length} like`}
            </p>
            <p className="text-md font-sm font-Intertext-gray-500">
              {post.comments.length > 1
                ? `${post.comments.length} comments`
                : `${post.comments.length} comment`}
            </p>
          </div>
          <div className="mx-3 flex cursor-pointer items-center justify-around border-y border-gray-300 p-2">
            {/* <Button onClick={handleLike}>Like</Button>
            <Link href={`/post/${post.id}`}>
              <Button>Comment</Button>
            </Link>
            <Button>Share</Button> */}
            <div
              className="flex w-full items-center justify-center space-x-2 rounded-md py-1 hover:bg-gray-200"
              onClick={handleLike}
            >
              <AiTwotoneLike
                size={22}
                color={isLiked === -1 ? "grey" : "#FF8080"}
              />
              <p
                className={`font-Inter text-sm ${
                  isLiked === -1 ? "text-gray-700" : "text-[#FF8080]"
                }`}
              >
                Like
              </p>
            </div>
            <div
              className="flex w-full items-center justify-center space-x-2 rounded-md py-1 hover:bg-gray-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <MdModeComment size={22} color="gray" />
              <p className="font-Inter text-sm text-gray-700">Comment</p>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="transition-all duration-300 ease-out">
            <div className="flex items-center space-x-2 p-3">
              {cuser?.user?.profilePic && (
                <img
                  src={cuser.user?.profilePic}
                  alt=""
                  height={40}
                  width={40}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div className="flex flex-1 flex-col">
                <input
                  type="text"
                  placeholder="Comment..."
                  className="flex-1 rounded-full bg-gray-200 px-4 py-2 outline-none "
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyPress={handleComment}
                />
                <p className="text-xs">Press enter to add comment</p>
              </div>
            </div>
            {post?.comments.length > 0 && (
              <div className="mt-3 max-h-52 overflow-y-scroll">
                {post?.comments?.map((c) => (
                  <div
                    className="flex items-start space-x-2 py-3 px-5"
                    key={c._id}
                  >
                    <img
                      src="https://cdn.dribbble.com/users/24078/screenshots/15522433/media/e92e58ec9d338a234945ae3d3ffd5be3.jpg?compress=1&resize=400x300"
                      alt=""
                      height={32}
                      width={32}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="flex-1 flex-wrap  rounded-xl bg-[#191818] p-2">
                        <h1 className="text-sm font-semibold">{c.name}</h1>
                        <p className="text-xs font-normal">{c.body}</p>
                      </div>
                      <p className="text-xs font-normal">
                        {moment(c.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
