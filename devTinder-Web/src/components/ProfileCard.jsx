
function ProfileCard({ user }) {
    console.log("user Data", user)
    return (
        <>
            <div className="flex flex-wrap gap-4">
                {user &&
                    <div key={user.id} className="card bg-base-100 w-96 shadow-sm">
                        <figure>
    <img
        src={user.photoUrl || "https://placeimg.com/400/225/arch"}
        alt={`${user.firstName} ${user.lastName}`}
        className="h-60 w-55 object-cover" // Example with Tailwind
    />
</figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p>
                                A card component has a figure, a body part, and inside body there are title and actions parts
                            </p>
                            <div className="card-actions justify-center my-4">
                                {/* <button className="btn btn-primary">Ignore</button>
                                <button className="btn btn-primary">Interested</button> */}
                            </div>
                        </div>
                    </div>
        }
            </div>
        </>

    );
}

export default ProfileCard;

