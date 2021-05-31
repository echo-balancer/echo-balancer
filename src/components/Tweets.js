export function Tweets({ data }) {
  return (
    <ul className="overflow-auto divide-y divide-gray-200">
      {data.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </ul>
  );
}

function TweetCard({ tweet: { user, text, created_at } }) {
  return (
    <li
      className="relative px-4 py-5 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
    >
      <div className="flex justify-between space-x-3">
        <img
          className="w-10 h-10 rounded-full"
          src={user.profile_image_url_https}
          alt={user.name}
        />
        <div className="flex-1 min-w-0">
          <a href="/#" className="block focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 truncate">{user.description}</p>
          </a>
        </div>
        <time
          dateTime={created_at}
          className="flex-shrink-0 text-sm text-gray-500 whitespace-nowrap"
        >
          {new Date(created_at).toDateString()}
        </time>
      </div>
      <div className="mt-1">
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </li>
  );
}
