import React, { Dispatch, SetStateAction, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../graphql/mutations/userMutations";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface IProps {
  user: User;
  //   showModal: true;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const UserModal = ({ user, setShowModal }: IProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    dob: user.dob,
    bio: user.bio,
    profilePic: user.profilePic,
  });
  //   const router = useNavigate();
  const cookie = Cookies.get("userJwt");
  const token = cookie?.substring(1, cookie.length - 1);

  const [updateUser] = useMutation(UPDATE_USER, {
    variables: {
      name: formData.name,
      email: formData.email,
      profilePic: formData.profilePic,
      dob: formData.dob,
      bio: formData.bio,
    },
    context: {
      headers: {
        Authorization: `${token}`,
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateUser();
      toast.success("Post updated successfully");
      setShowModal(false);
      //   router.reload()
    } catch (error) {
      toast.error(`${error}`);
      console.log(error);
    }
  };

  return (
    <div className="absolute top-5 left-20 z-50 w-3/4 rounded-md bg-[#191818] text-white px-5 py-3 font-Inter shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <h1 className="text-center text-xl font-bold">Update User</h1>
        <MdOutlineCancel
          size={25}
          color="#FF8080"
          onClick={() => setShowModal(false)}
        />
      </div>
      <div className="flex flex-col p-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="my-3 flex-1 rounded-md bg-[#010100] px-3 py-1"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="my-3 flex-1  rounded-md bg-[#010100] px-3 py-1"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="dob"
          placeholder="Dob"
          className="my-3 flex-1  rounded-md bg-[#010100] px-3 py-1"
          value={formData.dob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="bio"
          placeholder="Bio"
          className="my-3 flex-1  rounded-md bg-[#010100] px-3 py-1"
          value={formData.bio}
          onChange={handleChange}
        />
        <div className="mt-5 mb-1">
          {/* <FileBase
            type="file"
            multiple={false}
            onChange={handleChange}
            // ref={fileInputRef}
            className="upload-btn"
            onDone={({ base64 }) =>
              setFormData({ ...formData, profilePic: base64 })
            }
          /> */}
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <button
          onClick={handleUpdate}
          className="rounded-md bg-[#FF8080] px-2 py-1 text-base text-white hover:bg-orange-500"
        >
          Update
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="rounded-md bg-red-600 px-2 py-1 text-base text-white hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserModal;
