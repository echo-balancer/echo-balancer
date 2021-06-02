import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function FriendsList({ friends, selectedUser, setSelectedUser }) {
  return (
    <RadioGroup value={selectedUser} onChange={setSelectedUser}>
      <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
      <div className="space-y-4">
        {friends && friends.map((friend) => (
          <RadioGroup.Option
            key={friend.id}
            value={friend}
            className={({ active }) =>
              classNames(
                active ? 'ring-1 ring-offset-2 ring-indigo-500' : '',
                'relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 sm:flex sm:justify-between focus:outline-none'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex">
                  <span
                    className={classNames(
                      checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                      active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                      'h-4 w-4 mt-3 cursor-pointer rounded-full border flex items-center justify-center'
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>

                  <div className="ml-3 flex">
                    <img className="h-10 w-10 rounded-full" src={friend.profile_image_url_https} alt={friend.name} />
                    <div className="ml-3 flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'block text-sm font-medium')}
                      >
                        {friend.name}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className={classNames(checked ? 'text-indigo-700' : 'text-gray-500', 'block text-sm')}
                      >
                        {friend.screen_name}
                      </RadioGroup.Description>
                    </div>
                  </div>
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
