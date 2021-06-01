export function FriendsList({ friends, setSelectedUser }) {
  return (
    <ul className="divide-y divide-gray-200">
      {friends && friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} setSelectedUser={setSelectedUser} />
      ))}
    </ul>
  );
}

function FriendCard({ friend, setSelectedUser }) {
  return (
    <li className="py-4 flex">
      <div className="flex items-center justify-between px-4">
        <input
          id="push_everything"
          name="push_notifications"
          type="radio"
          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          onClick={() => { setSelectedUser(friend)} }
        />
      </div>
      <img className="h-10 w-10 rounded-full" src={friend.profile_image_url_https} alt={friend.name} />
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">{friend.name}</p>
        <p className="text-sm text-gray-500">{friend.screen_name}</p>
      </div>
    </li>
  );
}
