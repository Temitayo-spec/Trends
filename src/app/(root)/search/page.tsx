import { UserCard } from '@/components';
import { fetchUsers, fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const SearchPage = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) redirect('/onboarding');

  //fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text">Search</h1>
      {/*search bar*/}

      <div className="mt-14 flex flex-col gap-9">
        {result?.users?.length === 0 ? (
          <p className="no-result">No users found</p>
        ) : (
          <>
            {result?.users?.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imageUrl={user.image}
                userType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
