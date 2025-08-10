
function UserCard({ user }) {
    console.log("user Data",user)
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={user.profilePicture} alt={`${user.name}'s profile`} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{user.name}</h2>
        <p>{user.bio}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">View Profile</button>
        </div>
      </div>
    </div>
  );
}

export default UserCard;