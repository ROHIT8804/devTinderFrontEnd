
function UserCard({ user }) {
    console.log("user Data",user)
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
            <img
            src={user && user.feedData && user.feedData[8].photoUrl ? user.feedData[8].photoUrl : "https://placeimg.com/400/225/arch"}
            alt="Shoes" />
        </figure>
        <div className="card-body">
            {user && user.feedData && <h2 className="card-title">{user.feedData[8].firstName}{" "}{user.feedData[8].lastName}</h2>}
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
            </div>
        </div>
    </div>
  );
}

export default UserCard;