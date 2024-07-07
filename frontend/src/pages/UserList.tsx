import useUserStore from '@/stores/useUserStore';

const UserList = () => {
  const { users, setSelectedUser } = useUserStore();

  return (
    <div className="h-full overflow-y-auto">
      {users.map(user => (
        <button key={user.id} onClick={() => setSelectedUser(user)} className="block p-4 w-full text-left">
          {user.name}
        </button>
      ))}
    </div>
  );
};

export default UserList;
