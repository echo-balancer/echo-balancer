import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FriendsList } from "./FriendsList";
import { cachedFetch } from "../utils/cachedFetch";
import { SearchIcon } from "@heroicons/react/solid";

export function CompareFriends({
  friends,
  setFriendLabel,
  setFriendDiversityData,
}) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredList, setFilteredList] = useState(friends);

  function handleConfirm() {
    setFriendLabel(`${selectedUser.name}'s network diversity`);
    setFriendDiversityData(null);
    loadDiversityData(selectedUser.id_str);
    setOpen(false);
  }

  async function loadDiversityData(user_id) {
    try {
      const { status, json: data } = await cachedFetch(
        `/api/diversity?user_id=${user_id}`
      );
      if (status === 200) {
        setFriendDiversityData(data);
      } else {
        if (data.message) {
          alert(data.message);
        }
        setFriendDiversityData({});
      }
    } catch (error) {
      setFriendDiversityData({});
    }
  }

  function updateFriendsData(e) {
    if (e.target.value) {
      var l = friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          friend.screen_name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredList(l);
    } else {
      setFilteredList(friends);
    }
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 z-10 overflow-y-auto"
          open={open}
          onClose={() => {}}
        >
          <div className="flex justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
              <div
                className="inline-block px-4 pt-5 pb-4 w-full overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
                style={{ maxWidth: "640px" }}
              >
                <div>
                  <div className="px-4 py-5 bg-white border-gray-200 sm:px-6">
                    <div className="flex items-center -mt-2 -ml-4 sm:flex-nowrap">
                      <button
                        type="button"
                        className="mr-auto font-medium text-gray-600 rounded-md shadow-sm text-ml hover:text-gray-700 focus:outline-none"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>

                      <div className="justify-between px-2">
                        <p className="mx-auto text-center text-gray-900 text-ml font-small">
                          Select Friend
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex ml-auto font-medium text-indigo-600 shadow-sm text-ml rounded-md hover:text-indigo-700 focus:outline-none"
                        onClick={handleConfirm}
                      >
                        Save
                      </button>
                    </div>

                    <div className="flex items-center mt-5 border rounded-md">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="mt-1 relative w-full rounded-md shadow-sm">
                        <div
                          className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                          aria-hidden="true"
                        >
                          <SearchIcon
                            className="mr-3 h-4 w-4 text-gray-300"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="text"
                          name="search"
                          id="search"
                          className="focus:border-indigo-500 block w-full pl-9 py-2 sm:text-sm border-gray-300 rounded-md"
                          placeholder="Search"
                          onChange={updateFriendsData}
                        />
                      </div>
                    </div>
                  </div>

                  <FriendsList
                    friends={filteredList}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                  />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex mt-4">
        <button
          type="button"
          className="inline-flex px-4 py-2 mx-auto w-medium justify-center text-sm font-medium text-white bg-indigo-600 border border-transparent w-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setOpen(true)}
        >
          Select a friend to compare
        </button>
      </div>

      <p className="sm:mx-auto py-4 px-6 text-xs text-gray-500">
        * According to United States Census data up to date: White: 60%, Black:
        13.4%, Asian: 6%, Latino: 18.5%, Other: 2.1% (
        <a
          href="https://www.census.gov/quickfacts/fact/table/US/PST045219"
          style={{ textDecoration: "underline" }}
        >
          Soucre link
        </a>
        )
      </p>
    </>
  );
}
