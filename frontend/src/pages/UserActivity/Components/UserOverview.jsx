import { useSelector } from "react-redux"

export default function UserOverview() {
    const {isCurrentUser, userDetails, userForums, userPosts, userComments, likedPosts} = useSelector((state) => state.userActivity)
    return (
        <>
        <div>
            FORUMS
            <ul>
                {userForums?.publicForums?.map((forum) => {
                    <li>
                        {forum.name}
                    </li>
                })}
            </ul>
        </div>
        <div>
            POSTS
            <ul>
                {userPosts?.map((post) => {
                    <li>
                        {post.title}
                    </li>
                })}
            </ul>
        </div>
        </>
    )
}