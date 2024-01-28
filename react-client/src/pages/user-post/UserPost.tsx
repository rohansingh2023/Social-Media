import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { ADD_COMMENT } from "../../graphql/mutations/postMutations";
import { GET_POST_BY_ID } from "../../graphql/queries/postQueries";
import { useCurrentState } from "../../state-management/current-user";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import PostModal from "../../components/modals/PostModal";

// type Props = {
//   postData: {
//     user: User;
//     posts: Post;
//   };
// };

function UserPost() {
  const [body, setBody] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //   const [post, setPost] = useState();
  const currentUser = useCurrentState((state) => state.currentUser);
  const cookie = Cookies.get("userJwt");
  const token = cookie?.substring(1, cookie.length - 1);

  const location = useLocation();
  const url = location.pathname.split("/")[2];

  const { data } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: url,
    },
  });

  const post: Post = data?.postById?.posts;
  const user: User = data?.postById?.user;
  //   const { user, posts } = postData

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: {
      postId: url,
      body: body,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: {
          id: url,
        },
      },
    ],
  });

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");
    // const post = await getPostById(posts._id)
    // setPost(post);
    toast.success("Post Updated", {
      id: refreshToast,
    });
  };

  const handleComment = async () => {
    try {
      await addComment();
      setBody("");
      toast.success("Comment added successfully");
      await handleRefresh();
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };
  return (
    <div className="grid-row-10 grid font-DMSerif">
      <div className="row-span-10 relative flex-col">
        {isOpen && (
          <PostModal
            // isOpen={isOpen}
            setIsOpen={setIsOpen}
            postId={post?._id}
            post={post}
          />
        )}

        <div className="flex h-screen w-screen items-center justify-center scroll-smooth lg:h-[91vh]">
          <div className=" lg:h-11/12  flex-col lg:-mt-3 lg:flex lg:w-4/5 lg:flex-row lg:rounded-xl lg:bg-[#191818] text-white lg:shadow-lg">
            {/* left */}
            <div
              className={
                post?.image
                  ? "flex flex-[0.6] flex-col  font-Inter"
                  : "flex flex-1 flex-col  font-Inter"
              }
            >
              <div className="flex-[0.45]  p-6">
                <h1 className="p-1 text-5xl">Title</h1>
                <p className="p-2 text-left">{post?.content}</p>
                <p className="p-2 text-xl">
                  {post?.likes.length > 1
                    ? `${post?.likes.length} likes`
                    : `${post?.likes.length} like`}
                </p>
                <p className="p-2 text-2xl">Created By: {user?.name}</p>
                <hr className="border border-gray-400 px-5" />
              </div>
              <div className="-mt-8 flex flex-[0.55] flex-col p-4">
                <h1 className="text-md ml-2 p-2">Comments</h1>
                <div className="flex flex-row shadow-lg">
                  <div className="flex h-56 flex-[0.5] flex-col overflow-y-scroll rounded-md bg-[#010100] text-white p-3 shadow-xl">
                    {post?.comments?.map((comment, i) => (
                      <div className="flex flex-row items-center " key={i}>
                        <p className="p-2 text-left">
                          <span className="mr-1 text-lg font-semibold">
                            {comment?.name}:
                          </span>
                          {comment?.body}
                        </p>
                        <span className="ml-2 text-xs text-gray-500">
                          {moment(comment?.createdAt).fromNow()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-[0.5] flex-col  p-3">
                    <h1 className="-mt-2 text-lg font-semibold">
                      Write a comment
                    </h1>
                    <textarea
                      className="mt-2 h-32 rounded-md outline-none text-black"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                    <button
                      className="mt-3 w-full rounded-md bg-[#010100] p-1 outline-none hover:bg-slate-300"
                      onClick={handleComment}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* right */}
            <div
              className={
                post?.image
                  ? "flex flex-[0.4] flex-col items-center justify-center"
                  : "flex flex-col items-center justify-center"
              }
            >
              {post?.image && (
                <img
                  src={post?.image}
                  alt=""
                  className=" mt-20 h-60 rounded-lg object-cover lg:-mt-20 lg:mr-4 lg:h-2/3 lg:w-11/12 lg:rounded-lg lg:object-cover"
                />
              )}
              {user?._id === currentUser?.user?._id && (
                <div className="-mb-28 mt-10 flex items-center p-3">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-32 rounded-md bg-green-400 p-2 hover:bg-green-600 hover:text-white"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost;
