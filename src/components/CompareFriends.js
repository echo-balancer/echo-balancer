import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FriendsList } from "./FriendsList";

export function CompareFriends({
  friends,
  setFriendLabel,
  setFriendDiversityData,
}) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function handleConfirm() {
    setFriendLabel(`${selectedUser.name}'s network diversity`);
    setFriendDiversityData(null);
    loadDiversityData(selectedUser.id);
    setOpen(false);
  }

  async function loadDiversityData(user_id) {
    try {
      const resp = await fetch(`/api/diversity?user_id=${user_id}`, {
        credentials: "include",
      });
      if (resp.status === 200) {
        const data = await resp.json();
        setFriendDiversityData(data);
      } else {
        setFriendDiversityData({});
      }
    } catch (error) {
      setFriendDiversityData({});
    }
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          open={open}
          onClose={() => {}}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                    <div className="-ml-4 -mt-2 flex items-center sm:flex-nowrap">
                      <button
                        type="button"
                        className="mr-auto rounded-md shadow-sm text-ml font-medium text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>

                      <div className="px-2 justify-between">
                        <p className="mx-auto text-center text-ml font-small text-gray-900">
                          Compare Friends
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex ml-auto shadow-sm text-ml font-medium rounded-md text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleConfirm}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <FriendsList
                    friends={friends}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex py-2">
        <button
          type="button"
          className="inline-flex mx-auto w-medium py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setOpen(true)}
        >
          Select a friend to compare
        </button>
      </div>
    </>
  );
}
