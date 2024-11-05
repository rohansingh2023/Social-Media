import { FiVideo, FiVideoOff } from "react-icons/fi";
import { useVideoCardState } from "../../state-management/show-video-card";

interface Props {
  answerVideoChatVisible: boolean;
  currentName: String | undefined;
  setAnswerVideoChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnswerVideoChat = ({
  answerVideoChatVisible,
  currentName,
  setAnswerVideoChatVisible,
}: Props) => {
  // console.log(answerVideoChatVisible);
  const { setShowVideoChatCard } = useVideoCardState();

  const startB = () => {
    setShowVideoChatCard(true);
    setAnswerVideoChatVisible(false);
  };

  const hangB = () => {
    setAnswerVideoChatVisible(false);
  };

  return (
    <div
      className={
        "fixed z-[999] top-[8%] left-[35%] h-fit w-[350px] bg-[#332e33] rounded-md"
        // : "hidden fixed z-[999] top-[20%] left-[30%] h-[500px] w-[500px] bg-[#332e33] rounded-md"
      }
    >
      <main className="relative flex flex-col gap-[5px] p-[10px]">
        <div className="flex items-center justify-start space-x-3 bg-main">
          <div>
            <img
              src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg="
              alt=""
              className="h-20 w-20 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentName}</h1>
            <p className="text-sm font-light">is calling...</p>
          </div>
        </div>

        <div className="flex flex-row justify-center mt-[10px] gap-x-[20px]">
          <button
            className="flex items-center justify-center w-full h-[40px] text-[#fff] rounded-md bg-[#0ced23] hover:bg-green-300"
            // ref={startButton}
            onClick={startB}
          >
            <FiVideo />
          </button>
          <button
            //   disabled={!stream}
            className="flex items-center justify-center w-full h-[40px] text-[#fff] rounded-md btn-end bg-[#e10505] hover:bg-red-300"
            // ref={hangupButton}
            onClick={hangB}
          >
            <FiVideoOff />
          </button>
        </div>
        {/* <button
          className="absolute right-4 top-4 bg-red-600 h-10 w-10 rounded-full hover:bg-red-300"
          // onClick={() => setshowVideoChatCard(false)}
        >
          X
        </button> */}
      </main>
    </div>
  );
};

export default AnswerVideoChat;
