import { BeakerIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCurrentState } from "../../state-management/current-user";
import DialogBox from "../shared-modules/custom-dialog-box/DialogBox";
import ApiProxyService from "../../services/api-service";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useCurrentState((state) => state.currentUser);
  const apiService = new ApiProxyService({
    baseUrl: "http://localhost:9001",
  });

  const getNotifications = async () => {
    try {
      const res = await apiService.get<NotificationLog[]>(
        `api/notifications/${currentUser.user._id}`
      );
      setNotifications(res.data);
      console.log(res.data);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");
    await getNotifications();
    toast.success("Post Updated", {
      id: refreshToast,
    });
  };

  useEffect(() => {
    if (error) {
      setDialogOpen(true);
    }
  }, [error]);

  const handleOkClick = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {isDialogOpen && (
        <DialogBox
          title="Notifications Error"
          description={`${error}`}
          isOpen={isDialogOpen}
          onOk={handleOkClick}
          onClose={handleOkClick}
        />
      )}
      <div className="fixed right-5 top-16 z-50 w-[350px] bg-[#191818] text-white p-3 rounded-b-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold ">Notification Panel</h1>
          <BeakerIcon
            onClick={handleRefresh}
            className="mr-2 h-8 w-8 cursor-pointer text-[#FF8080] transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          />
        </div>
        <div className="mt-5 max-h-96 overflow-y-scroll">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div className="flex items-center justify-start space-x-4 mt-3">
                <img
                  src={n.photo}
                  alt=""
                  className="h-10 w-10 rounded-full bg-cover"
                />
                <p className="font-light">
                  <span className="font-semibold">
                    {n.message.split(" ")[0]}
                  </span>{" "}
                  {n.message.split(" ").slice(1).join(" ")}
                </p>
              </div>
            ))
          ) : (
            <span className="flex items-center justify-center p-5 font-thin text-xl">
              No notifications
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
