
function UserCard({ user }) {
    console.log("user Data",user)
  return (
    <div className="flex flex-wrap gap-4">
      {Array.isArray(user?.feedData) && user?.feedData.map((user, index) => (
        <div key={user._id || index} className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <img
              src={user.photoUrl || "https://placeimg.com/400/225/arch"}
              alt={`${user.firstName} ${user.lastName}`}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {user.firstName} {user.lastName}
            </h2>
            <p>
              A card component has a figure, a body part, and inside body there are title and actions parts
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">View Profile</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserCard;

